from typing import List

import boto3

from prmcalculator.domain.gp2gp.transfer import Transfer
from prmcalculator.domain.national.calculate_national_metrics_data import (
    NationalMetricsObservabilityProbe,
    calculate_national_metrics_data,
)
from prmcalculator.domain.practice.calculate_practice_metrics import (
    PracticeMetricsObservabilityProbe,
    PracticeMetricsPresentation,
    calculate_practice_metrics,
)
from prmcalculator.domain.reporting_window import ReportingWindow, YearMonth
from prmcalculator.pipeline.io import PlatformMetricsIO
from prmcalculator.pipeline.s3_uri_resolver import PlatformMetricsS3UriResolver
from prmcalculator.utils.io.s3 import S3DataManager


class MetricsCalculator:
    def __init__(self, config):
        s3 = boto3.resource("s3", endpoint_url=config.s3_endpoint_url)
        s3_manager = S3DataManager(s3)
        ssm_manager = boto3.client("ssm")

        self._national_metrics_s3_path_param_name = config.national_metrics_s3_path_param_name
        self._practice_metrics_s3_path_param_name = config.practice_metrics_s3_path_param_name

        self._reporting_window = ReportingWindow.prior_to(
            config.date_anchor, config.number_of_months
        )

        output_metadata = {
            "metrics-calculator-version": config.build_tag,
            "date-anchor": config.date_anchor.isoformat(),
            "number-of-months": str(config.number_of_months),
        }

        self._uris = PlatformMetricsS3UriResolver(
            transfer_data_bucket=config.input_transfer_data_bucket,
            data_platform_metrics_bucket=config.output_metrics_bucket,
        )

        self._io = PlatformMetricsIO(
            s3_data_manager=s3_manager,
            ssm_manager=ssm_manager,
            output_metadata=output_metadata,
        )

    def _read_transfer_data(self, dates):
        transfers_data_s3_uris = self._uris.transfer_data(dates)
        return self._io.read_transfers_as_dataclass(transfers_data_s3_uris)

    def _calculate_national_metrics(self, transfers):
        return calculate_national_metrics_data(
            transfers=transfers,
            reporting_window=self._reporting_window,
            observability_probe=NationalMetricsObservabilityProbe(),
        )

    def _calculate_practice_metrics(
        self,
        transfers: List[Transfer],
    ):
        return calculate_practice_metrics(
            transfers=transfers,
            reporting_window=self._reporting_window,
            observability_probe=PracticeMetricsObservabilityProbe(),
        )

    def _write_practice_metrics(
        self,
        practice_metrics: PracticeMetricsPresentation,
        year_month: YearMonth,
    ):
        self._io.write_practice_metrics(
            practice_metrics_presentation_data=practice_metrics,
            s3_uri=self._uris.practice_metrics(year_month),
        )

    def _write_national_metrics(self, national_metrics, month):
        self._io.write_national_metrics(
            national_metrics_presentation_data=national_metrics,
            s3_uri=self._uris.national_metrics(month),
        )

    def _store_national_metrics_uri_ssm_param(
        self, national_metrics_s3_path_param_name: str, month: YearMonth
    ):
        self._io.store_ssm_param(
            ssm_param_name=national_metrics_s3_path_param_name,
            ssm_param_value=self._uris.national_metrics_key(month),
        )

    def _store_practice_metrics_uri_ssm_param(
        self, practice_metrics_s3_path_param_name: str, month: YearMonth
    ):
        self._io.store_ssm_param(
            ssm_param_name=practice_metrics_s3_path_param_name,
            ssm_param_value=self._uris.practice_metrics_key(month),
        )

    def run(self):
        dates = self._reporting_window.dates
        last_month = self._reporting_window.last_metric_month
        transfers = self._read_transfer_data(dates)
        national_metrics = self._calculate_national_metrics(transfers)
        practice_metrics_including_slow_transfers = self._calculate_practice_metrics(transfers)

        self._write_national_metrics(national_metrics, last_month)
        self._write_practice_metrics(practice_metrics_including_slow_transfers, last_month)

        self._store_national_metrics_uri_ssm_param(
            self._national_metrics_s3_path_param_name, last_month
        )

        self._store_practice_metrics_uri_ssm_param(
            self._practice_metrics_s3_path_param_name, last_month
        )
