import polars as pl
import pyarrow as pa
from polars import DataFrame, col, count

from prmreportsgenerator.domain.reports_generator.reports_generator import ReportsGenerator
from prmreportsgenerator.domain.transfer import TransferStatus


class TransferDetailsPerHourReportsGenerator(ReportsGenerator):
    def __init__(self, transfers: pa.Table):
        super().__init__()
        self._transfers = transfers

    def _create_hour_column(self, transfer_dataframe: DataFrame) -> DataFrame:
        date_requested_by_hour = col("date_requested").dt.strftime("%Y-%m-%d %H:00")

        return transfer_dataframe.with_columns(date_requested_by_hour.alias("Date/Time"))

    def _create_technical_failure_column(self, transfer_dataframe: DataFrame) -> DataFrame:
        is_technical_failure = col("status") == TransferStatus.TECHNICAL_FAILURE.value

        return transfer_dataframe.with_columns(is_technical_failure.alias("is_technical_failure"))

    def _create_unclassified_failure_column(self, transfer_dataframe: DataFrame) -> DataFrame:
        is_unclassified_failure = col("status") == TransferStatus.UNCLASSIFIED_FAILURE.value

        return transfer_dataframe.with_columns(
            is_unclassified_failure.alias("is_unclassified_failure")
        )

    def _group_by_date_requested_hourly(self, transfer_dataframe: DataFrame) -> DataFrame:
        return (
            transfer_dataframe.groupby(["Date/Time"])
            .agg(
                [
                    count("conversation_id").alias("Total number of transfers"),
                    col("is_technical_failure").sum().alias("Total technical failures"),
                    col("is_unclassified_failure").sum().alias("Total unclassified failures"),
                ]
            )
            .sort("Date/Time")
        )

    def generate(self) -> pa.Table:
        transfers_frame = pl.from_arrow(self._transfers)
        processed_transfers = self._process(
            transfers_frame,
            self._create_hour_column,
            self._create_technical_failure_column,
            self._create_unclassified_failure_column,
            self._group_by_date_requested_hourly,
        ).to_dict()
        return pa.table(processed_transfers)
