from datetime import datetime
from typing import List, Optional

from prmcalculator.domain.reporting_window import YearMonth
from prmcalculator.utils.add_leading_zero import add_leading_zero


class PlatformMetricsS3UriResolver:

    _TRANSFER_DATA_VERSION = "v11"
    _DEFAULT_DATA_PLATFORM_METRICS_VERSION = "v12"

    _PRACTICE_METRICS_FILE_NAME = "practiceMetrics.json"
    _NATIONAL_METRICS_FILE_NAME = "nationalMetrics.json"
    _SUPPLIER_PATHWAY_OUTCOME_COUNTS_FILE_NAME = "supplier_pathway_outcome_counts.csv"
    _TRANSFER_DATA_FILE_NAME = "transfers.parquet"
    _TRANSFER_DATA_CUTOFF_FOLDER_NAME = "cutoff-14"

    def __init__(
        self,
        transfer_data_bucket: str,
        data_platform_metrics_bucket: str,
        data_platform_metrics_version: Optional[str] = None,
    ):
        self._transfer_data_bucket = transfer_data_bucket
        _data_platform_metrics_version = (
            data_platform_metrics_version or self._DEFAULT_DATA_PLATFORM_METRICS_VERSION
        )
        self._data_platform_metrics_s3_prefix = (
            f"s3://{data_platform_metrics_bucket}/{_data_platform_metrics_version}"
        )

    def practice_metrics_key(self, year_month: YearMonth) -> str:
        year, month = year_month
        return "/".join(
            [
                f"{year}/{month}",
                f"{year}-{month}-{self._PRACTICE_METRICS_FILE_NAME}",
            ]
        )

    def practice_metrics(self, year_month: YearMonth) -> str:
        return "/".join(
            [self._data_platform_metrics_s3_prefix, self.practice_metrics_key(year_month)]
        )

    def national_metrics_key(self, year_month: YearMonth) -> str:
        year, month = year_month
        return "/".join(
            [
                f"{year}/{month}",
                f"{year}-{month}-{self._NATIONAL_METRICS_FILE_NAME}",
            ]
        )

    def national_metrics(self, year_month: YearMonth) -> str:
        return "/".join(
            [self._data_platform_metrics_s3_prefix, self.national_metrics_key(year_month)]
        )

    def _transfer_data_uri(self, a_date: datetime) -> str:
        year = a_date.year
        month = add_leading_zero(a_date.month)
        day = add_leading_zero(a_date.day)

        s3_file_name = f"{year}-{month}-{day}-{self._TRANSFER_DATA_FILE_NAME}"
        return "/".join(
            [
                self._transfer_data_bucket,
                self._TRANSFER_DATA_VERSION,
                self._TRANSFER_DATA_CUTOFF_FOLDER_NAME,
                f"{year}/{month}/{day}",
                s3_file_name,
            ]
        )

    def transfer_data(self, dates: List[datetime]) -> List[str]:
        return [f"s3://{self._transfer_data_uri(a_date)}" for a_date in dates]
