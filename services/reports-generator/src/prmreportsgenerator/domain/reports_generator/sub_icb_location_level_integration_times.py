from enum import Enum

import polars as pl
import pyarrow as pa
from polars import DataFrame, col, count, when

from prmreportsgenerator.domain.reports_generator.reports_generator import ReportsGenerator
from prmreportsgenerator.domain.transfer import TransferFailureReason, TransferStatus

THREE_DAYS_IN_SECONDS = 259200
EIGHT_DAYS_IN_SECONDS = 691200


class SlaDuration(Enum):
    WITHIN_3_DAYS = "WITHIN_3_DAYS"
    WITHIN_8_DAYS = "WITHIN_8_DAYS"
    BEYOND_8_DAYS = "BEYOND_8_DAYS"


def assign_to_sla_band(sla_duration) -> str:
    sla_duration_in_seconds = sla_duration
    if sla_duration_in_seconds <= THREE_DAYS_IN_SECONDS:
        return SlaDuration.WITHIN_3_DAYS.value
    elif sla_duration_in_seconds <= EIGHT_DAYS_IN_SECONDS:
        return SlaDuration.WITHIN_8_DAYS.value
    else:
        return SlaDuration.BEYOND_8_DAYS.value


class SICBLLevelIntegrationTimesReportsGenerator(ReportsGenerator):
    def __init__(self, transfers: pa.Table):
        super().__init__()
        self._transfers = transfers

    def _filter_received_transfers(self, transfer_dataframe: DataFrame) -> DataFrame:
        received_transfers = (col("status") == TransferStatus.INTEGRATED_ON_TIME.value) | (
            col("status") == TransferStatus.PROCESS_FAILURE.value
        )
        # remove technical and unclassified failures
        return transfer_dataframe.filter(received_transfers)

    def _calculate_sla_band(self, transfer_dataframe: DataFrame) -> DataFrame:
        return transfer_dataframe.with_columns(
            col("sla_duration").apply(assign_to_sla_band, return_dtype=pl.Utf8).alias("sla_band")
        )

    def _calculate_integrated_within_3_days(self, transfer_dataframe: DataFrame) -> DataFrame:
        within_3_days_sla_band_bool = col("sla_band") == SlaDuration.WITHIN_3_DAYS.value
        integrated_on_time_bool = col("status") == TransferStatus.INTEGRATED_ON_TIME.value
        integrated_within_3_days_bool = within_3_days_sla_band_bool & integrated_on_time_bool
        return transfer_dataframe.with_columns(
            when(integrated_within_3_days_bool)
            .then(1)
            .otherwise(0)
            .alias("Integrated within 3 days")
        )

    def _calculate_integrated_within_8_days(self, transfer_dataframe: DataFrame) -> DataFrame:
        within_8_days_sla_band_bool = col("sla_band") == SlaDuration.WITHIN_8_DAYS.value
        integrated_on_time_bool = col("status") == TransferStatus.INTEGRATED_ON_TIME.value
        integrated_within_8_days_bool = within_8_days_sla_band_bool & integrated_on_time_bool
        return transfer_dataframe.with_columns(
            when(integrated_within_8_days_bool)
            .then(1)
            .otherwise(0)
            .alias("Integrated within 8 days")
        )

    def _calculate_not_integrated_within_8_days(self, transfer_dataframe: DataFrame) -> DataFrame:
        integrated_late_failure_reason_bool = (
            col("failure_reason") == TransferFailureReason.INTEGRATED_LATE.value
        )
        not_integrated_within_14_days = (
            col("failure_reason") == TransferFailureReason.TRANSFERRED_NOT_INTEGRATED.value
        )
        not_integrated_within_8_days_bool = (
            integrated_late_failure_reason_bool | not_integrated_within_14_days
        )
        return transfer_dataframe.with_columns(
            when(not_integrated_within_8_days_bool)
            .then(1)
            .otherwise(0)
            .alias("Not integrated within 8 days (integrated late + not integrated)")
        )

    def _calculate_integrated_late(self, transfer_dataframe: DataFrame) -> DataFrame:
        integrated_late_failure_reason_bool = (
            col("failure_reason") == TransferFailureReason.INTEGRATED_LATE.value
        )
        return transfer_dataframe.with_columns(
            when(integrated_late_failure_reason_bool).then(1).otherwise(0).alias("Integrated late")
        )

    def _calculate_not_integrated_within_14_days(self, transfer_dataframe: DataFrame) -> DataFrame:
        # transfers that are received but not integrated have a transferred not integrated reason
        not_integrated_within_14_days = (
            col("failure_reason") == TransferFailureReason.TRANSFERRED_NOT_INTEGRATED.value
        )
        return transfer_dataframe.with_columns(
            when(not_integrated_within_14_days)
            .then(1)
            .otherwise(0)
            .alias("Not integrated within 14 days")
        )

    def _generate_sicbl_level_integration_times_totals(
        self, transfer_dataframe: DataFrame
    ) -> DataFrame:
        return transfer_dataframe.groupby(["requesting_practice_ods_code"]).agg(
            [
                col("requesting_practice_sicbl_name").first().keep_name(),
                col("requesting_practice_sicbl_ods_code").first().keep_name(),
                col("requesting_practice_name").first().keep_name(),
                col("Integrated within 3 days").sum().keep_name(),
                col("Integrated within 8 days").sum().keep_name(),
                col("Not integrated within 8 days (integrated late + not integrated)")
                .sum()
                .keep_name(),
                col("Integrated late").sum().keep_name(),
                col("Not integrated within 14 days").sum().keep_name(),
                count("conversation_id").alias("GP2GP Transfers received"),
            ]
        )

    def _generate_sicbl_level_integration_times_percentages(
        self, transfer_dataframe: DataFrame
    ) -> DataFrame:
        return transfer_dataframe.with_columns(
            [
                (col("Integrated within 3 days") / col("GP2GP Transfers received") * 100).alias(
                    "Integrated within 3 days - %"
                ),
                (col("Integrated within 8 days") / col("GP2GP Transfers received") * 100).alias(
                    "Integrated within 8 days - %"
                ),
                (
                    col("Not integrated within 8 days (integrated late + not integrated)")
                    / col("GP2GP Transfers received")
                    * 100
                ).alias("Not integrated within 8 days (integrated late + not integrated) - %"),
                (col("Integrated late") / col("GP2GP Transfers received") * 100).alias(
                    "Integrated late - %"
                ),
                (
                    col("Not integrated within 14 days") / col("GP2GP Transfers received") * 100
                ).alias("Not integrated within 14 days - %"),
            ]
        )

    def _generate_output(self, transfer_dataframe: DataFrame) -> DataFrame:
        return transfer_dataframe.select(
            [
                col("requesting_practice_sicbl_name").alias("Sub ICB Location name"),
                col("requesting_practice_sicbl_ods_code").alias("Sub ICB Location ODS"),
                col("requesting_practice_name").alias("Requesting practice name"),
                col("requesting_practice_ods_code").alias("Requesting practice ODS"),
                col("GP2GP Transfers received"),
                col("Integrated within 3 days"),
                col("Integrated within 3 days - %"),
                col("Integrated within 8 days"),
                col("Integrated within 8 days - %"),
                col("Not integrated within 8 days (integrated late + not integrated)"),
                col("Not integrated within 8 days (integrated late + not integrated) - %"),
                col("Integrated late"),
                col("Integrated late - %"),
                col("Not integrated within 14 days"),
                col("Not integrated within 14 days - %"),
            ]
        ).sort(["Sub ICB Location name", "Requesting practice name"])

    def generate(self) -> pa.Table:
        transfers_frame = pl.from_arrow(self._transfers)
        processed_transfers = self._process(
            transfers_frame,
            self._filter_received_transfers,
            self._calculate_sla_band,
            self._calculate_integrated_within_3_days,
            self._calculate_integrated_within_8_days,
            self._calculate_not_integrated_within_8_days,
            self._calculate_integrated_late,
            self._calculate_not_integrated_within_14_days,
            self._generate_sicbl_level_integration_times_totals,
            self._generate_sicbl_level_integration_times_percentages,
            self._generate_output,
        ).to_dict()
        return pa.table(processed_transfers)
