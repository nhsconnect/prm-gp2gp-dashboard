import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Union

import pyarrow as pa

from prmreportsgenerator.domain.reporting_windows.reporting_window import ReportingWindow
from prmreportsgenerator.io.s3 import S3DataManager
from prmreportsgenerator.report_name import ReportName
from prmreportsgenerator.utils.add_leading_zero import add_leading_zero

logger = logging.getLogger(__name__)


class ReportsS3UriResolver:
    _TRANSFER_DATA_FILE_NAME = "transfers.parquet"
    _TRANSFER_DATA_VERSION = "v11"
    _REPORTS_VERSION = "v5"

    def __init__(self, transfer_data_bucket: str, reports_bucket: str):
        self._transfer_data_bucket = transfer_data_bucket
        self._reports_bucket = reports_bucket

    @staticmethod
    def _s3_path(*fragments):
        return "s3://" + "/".join(fragments)

    @staticmethod
    def _filepath(start_date: datetime, filename: str, end_date: Optional[datetime] = None) -> str:
        start_year = add_leading_zero(start_date.year)
        start_month = add_leading_zero(start_date.month)
        start_day = add_leading_zero(start_date.day)

        if end_date:
            end_year = add_leading_zero(end_date.year)
            end_month = add_leading_zero(end_date.month)
            end_day = add_leading_zero(end_date.day)
            return (
                f"{start_year}-{start_month}-{start_day}-to-"
                f"{end_year}-{end_month}-{end_day}-{filename}"
            )

        return f"{start_year}-{start_month}-{start_day}-{filename}"

    def input_transfer_data_uris(
        self, reporting_window: ReportingWindow, cutoff_days: int
    ) -> List[str]:
        return [
            self._s3_path(
                self._transfer_data_bucket,
                self._TRANSFER_DATA_VERSION,
                f"cutoff-{cutoff_days}",
                f"{add_leading_zero(start_date.year)}",
                f"{add_leading_zero(start_date.month)}",
                f"{add_leading_zero(start_date.day)}",
                self._filepath(start_date=start_date, filename=self._TRANSFER_DATA_FILE_NAME),
            )
            for start_date in reporting_window.get_dates()
        ]

    def _output_table_file_name(
        self, start_date: datetime, end_date: datetime, cutoff_days: int, report_name: ReportName
    ):
        filename = f"{report_name.value.lower()}--{cutoff_days}-days-cutoff.csv"
        actual_end_date = end_date - timedelta(
            days=1
        )  # data is at until midnight, so the actual data is for the previous day
        return self._filepath(start_date=start_date, end_date=actual_end_date, filename=filename)

    def output_table_uri(
        self,
        start_date: datetime,
        end_date: datetime,
        supplement_s3_key: str,
        cutoff_days: int,
        report_name: ReportName,
    ) -> str:
        return self._s3_path(
            self._reports_bucket,
            self._REPORTS_VERSION,
            supplement_s3_key,
            f"{add_leading_zero(start_date.year)}",
            f"{add_leading_zero(start_date.month)}",
            f"{add_leading_zero(start_date.day)}",
            self._output_table_file_name(start_date, end_date, cutoff_days, report_name),
        )


class ReportsIO:
    def __init__(
        self,
        s3_data_manager: S3DataManager,
    ):
        self._s3_manager = s3_data_manager

    def read_transfers_as_table(self, s3_uris: List[str]) -> pa.Table:
        return pa.concat_tables(
            [self._s3_manager.read_parquet(s3_path) for s3_path in s3_uris],
        )

    def write_table(
        self, table: pa.Table, s3_uri: str, output_metadata: Dict[str, Union[str, int, float]]
    ):
        self._s3_manager.write_table_to_csv(
            object_uri=s3_uri, table=table, metadata=output_metadata
        )
