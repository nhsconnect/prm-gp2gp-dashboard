import logging
from typing import Dict

import boto3
import pyarrow as pa

from prmreportsgenerator.config import PipelineConfig
from prmreportsgenerator.domain.reporting_windows.custom_reporting_window import (
    CustomReportingWindow,
)
from prmreportsgenerator.domain.reporting_windows.daily_reporting_window import DailyReportingWindow
from prmreportsgenerator.domain.reporting_windows.monthly_reporting_window import (
    MonthlyReportingWindow,
)
from prmreportsgenerator.domain.reporting_windows.reporting_window import ReportingWindow
from prmreportsgenerator.domain.reports_generator.sub_icb_location_level_integration_times import (
    SICBLLevelIntegrationTimesReportsGenerator,
)
from prmreportsgenerator.domain.reports_generator.transfer_details_per_hour import (
    TransferDetailsPerHourReportsGenerator,
)
from prmreportsgenerator.domain.reports_generator.transfer_level_technical_failures import (
    TransferLevelTechnicalFailuresReportsGenerator,
)
from prmreportsgenerator.domain.reports_generator.transfer_outcomes_per_supplier_pathway import (
    TransferOutcomesPerSupplierPathwayReportsGenerator,
)
from prmreportsgenerator.io.reports_io import ReportsIO, ReportsS3UriResolver
from prmreportsgenerator.io.s3 import S3DataManager
from prmreportsgenerator.report_name import ReportName
from prmreportsgenerator.utils.date_helpers import convert_to_datetime_string

logger = logging.getLogger(__name__)


class ReportsPipeline:
    def __init__(self, config: PipelineConfig):
        s3 = boto3.resource("s3", endpoint_url=config.s3_endpoint_url)
        s3_manager = S3DataManager(s3)

        self._reporting_window = self.create_reporting_window(config)
        self._cutoff_days = config.cutoff_days
        self._report_name = config.report_name
        self._alert_enabled = config.alert_enabled

        self._uri_resolver = ReportsS3UriResolver(
            transfer_data_bucket=config.input_transfer_data_bucket,
            reports_bucket=config.output_reports_bucket,
        )

        self._date_range_info_json = self._construct_date_range_info_json(config)
        self._additional_metadata = self._construct_additional_metadata(config)

        self._io = ReportsIO(s3_data_manager=s3_manager)

    @staticmethod
    def create_reporting_window(config: PipelineConfig) -> ReportingWindow:
        if config.start_datetime and config.end_datetime is None:
            raise ValueError("End datetime must be provided if start datetime is provided")
        if config.start_datetime and config.end_datetime:
            return CustomReportingWindow(config.start_datetime, config.end_datetime)
        if (config.number_of_days and config.cutoff_days) or (
            config.number_of_days and config.cutoff_days == 0
        ):
            return DailyReportingWindow(config.number_of_days, config.cutoff_days)
        if config.number_of_months:
            return MonthlyReportingWindow(config.number_of_months)
        raise ValueError("Missing required config to generate reports. Please see README.")

    def _read_transfer_table(self) -> pa.Table:
        transfer_data_s3_uris = self._uri_resolver.input_transfer_data_uris(
            reporting_window=self._reporting_window, cutoff_days=self._cutoff_days
        )

        logger.info(
            "Attempting to read from the following transfer data S3 Uris",
            extra={
                "event": "ATTEMPTING_TO_READ_FROM_TRANSFER_DATA_S3_URIS",
                "transfer_data_s3_uris": transfer_data_s3_uris,
            },
        )

        return self._io.read_transfers_as_table(transfer_data_s3_uris)

    def _log_technical_failure_percentage(self, transfers_metrics: Dict[str, str]):
        logger.info(
            f"Percentage of technical failures: {transfers_metrics['technical-failures-percentage']}%",
            extra={
                "total-transfers": transfers_metrics["total-transfers"],
                "total-technical-failures": transfers_metrics["total-technical-failures"],
                "percent-of-technical-failures": transfers_metrics["technical-failures-percentage"],
                "event": "PERCENT_OF_TECHNICAL_FAILURES",
                "alert-enabled": self._alert_enabled,
                **self._date_range_info_json,
            },
        )

    def _generate_transfers_metrics(self, transfers) -> Dict[str, str]:
        total_transfers = transfers.num_rows
        total_technical_failures = transfers.filter(
            pa.compute.equal(transfers["status"], "Technical failure")
        ).num_rows
        technical_failures_percentage = round((total_technical_failures / total_transfers) * 100, 2)
        return {
            "technical-failures-percentage": str(technical_failures_percentage),
            "total-technical-failures": str(total_technical_failures),
            "total-transfers": str(total_transfers),
        }

    def _write_table(self, table: pa.Table, output_metadata: Dict[str, str]):
        start_date = self._reporting_window.start_datetime
        end_date = self._reporting_window.end_datetime
        output_table_uri = self._uri_resolver.output_table_uri(
            start_date=start_date,
            end_date=end_date,
            supplement_s3_key=self._reporting_window.config_string,
            cutoff_days=self._cutoff_days,
            report_name=self._report_name,
        )
        self._io.write_table(table=table, s3_uri=output_table_uri, output_metadata=output_metadata)

    def _construct_date_range_info_json(self, config: PipelineConfig) -> dict:
        return {
            "config-cutoff-days": str(config.cutoff_days),
            "config-number-of-months": str(config.number_of_months),
            "config-number-of-days": str(config.number_of_days),
            "config-start-datetime": convert_to_datetime_string(config.start_datetime),
            "config-end-datetime": convert_to_datetime_string(config.end_datetime),
            "reporting-window-start-datetime": convert_to_datetime_string(
                self._reporting_window.start_datetime
            ),
            "reporting-window-end-datetime": convert_to_datetime_string(
                self._reporting_window.end_datetime
            ),
        }

    def _construct_additional_metadata(self, config: PipelineConfig) -> dict:
        return {
            "report-name": config.report_name.value,
            "reports-generator-version": config.build_tag,
            "send-email-notification": str(config.send_email_notification),
        }

    def _generate_report(self, transfers: pa.Table) -> pa.Table:
        reports = {
            ReportName.TRANSFER_OUTCOMES_PER_SUPPLIER_PATHWAY: TransferOutcomesPerSupplierPathwayReportsGenerator(
                transfers
            ).generate(),
            ReportName.TRANSFER_LEVEL_TECHNICAL_FAILURES: TransferLevelTechnicalFailuresReportsGenerator(
                transfers
            ).generate(),
            ReportName.SUB_ICB_LOCATION_LEVEL_INTEGRATION_TIMES: SICBLLevelIntegrationTimesReportsGenerator(
                transfers
            ).generate(),
            ReportName.TRANSFER_DETAILS_BY_HOUR: TransferDetailsPerHourReportsGenerator(
                transfers
            ).generate(),
        }
        return reports.get(self._report_name)

    def run(self):
        transfers = self._read_transfer_table()

        logger.info(
            f"Attempting to produce {self._report_name.value} report for transfers in date range",
            extra={
                "event": f"ATTEMPTING_TO_PRODUCE_{self._report_name.value}_REPORT",
                **self._date_range_info_json,
            },
        )

        table = self._generate_report(transfers)

        logger.info(
            f"Successfully produced {self._report_name.value} report for transfers in date range",
            extra={
                "event": f"PRODUCED_{self._report_name.value}_REPORT",
                **self._date_range_info_json,
            },
        )
        transfers_metrics = self._generate_transfers_metrics(transfers)

        self._log_technical_failure_percentage(transfers_metrics)

        self._write_table(
            table=table,
            output_metadata={
                **transfers_metrics,
                **self._date_range_info_json,
                **self._additional_metadata,
            },
        )
