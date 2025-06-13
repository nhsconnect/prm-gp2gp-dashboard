# mypy: ignore-errors

import polars as pl
import pyarrow as pa
from polars import col

from prmreportsgenerator.domain.reports_generator.reports_generator import ReportsGenerator
from prmreportsgenerator.domain.transfer import TransferStatus


class TransferLevelTechnicalFailuresReportsGenerator(ReportsGenerator):
    def __init__(self, transfers: pa.Table):
        super().__init__()
        self._transfers = transfers

    def _filter_status_technical_and_unclassified_failures(self):
        return (col("status") == TransferStatus.TECHNICAL_FAILURE.value) | (
            col("status") == TransferStatus.UNCLASSIFIED_FAILURE.value
        )

    def generate(self) -> pa.Table:
        transfers_frame = pl.from_arrow(self._transfers)
        processed_transfers = (
            transfers_frame.filter(self._filter_status_technical_and_unclassified_failures())
            .select(  # type: ignore
                [
                    col("sending_practice_asid").alias("sending practice ASID"),
                    col("sending_supplier").alias("sending supplier"),
                    col("sending_practice_ods_code").alias("sending practice ODS code"),
                    col("sending_practice_sicbl_ods_code").alias(
                        "sending practice Sub ICB Location ODS code"
                    ),
                    col("requesting_practice_asid").alias("requesting practice ASID"),
                    col("requesting_supplier").alias("requesting supplier"),
                    col("requesting_practice_ods_code").alias("requesting practice ODS code"),
                    col("requesting_practice_sicbl_ods_code").alias(
                        "requesting practice Sub ICB Location ODS code"
                    ),
                    col("conversation_id").alias("conversation ID"),
                    col("date_requested").alias("date requested"),
                    col("status"),
                    col("failure_reason").alias("failure reason"),
                    col("final_error_codes")
                    .apply(self._unique_errors, skip_nulls=False, return_dtype=pl.Utf8)
                    .alias("unique final errors"),
                    col("sender_error_codes")
                    .apply(self._unique_errors, skip_nulls=False, return_dtype=pl.Utf8)
                    .alias("unique sender errors"),
                    col("intermediate_error_codes")
                    .apply(self._unique_errors, skip_nulls=False, return_dtype=pl.Utf8)
                    .alias("unique intermediate errors"),
                ]
            )
            .to_dict()
        )

        return pa.table(processed_transfers)
