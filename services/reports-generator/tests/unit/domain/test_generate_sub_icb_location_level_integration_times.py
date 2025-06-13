from datetime import timedelta

import pyarrow as pa
import pytest

from prmreportsgenerator.domain.reports_generator.sub_icb_location_level_integration_times import (
    SICBLLevelIntegrationTimesReportsGenerator,
)
from prmreportsgenerator.domain.transfer import TransferFailureReason, TransferStatus
from tests.builders.common import a_string
from tests.builders.pa_table import PaTableBuilder


@pytest.mark.filterwarnings("ignore:Conversion of")
def test_returns_table_with_sicbl_level_integration_times_columns():
    requesting_practice_name = "Practice A"
    requesting_practice_name2 = "Practice B"
    requesting_practice_ods_code = a_string(6)
    requesting_practice_ods_code2 = a_string(6)
    requesting_practice_sicbl_ods_code = a_string(3)
    requesting_practice_sicbl_name = a_string(6)
    table = (
        PaTableBuilder()
        .with_row(
            requesting_practice_name=requesting_practice_name,
            requesting_practice_ods_code=requesting_practice_ods_code,
            requesting_practice_sicbl_ods_code=requesting_practice_sicbl_ods_code,
            requesting_practice_sicbl_name=requesting_practice_sicbl_name,
            status=TransferStatus.INTEGRATED_ON_TIME.value,
            failure_reason=None,
            sla_duration=timedelta(days=1).total_seconds(),
        )
        .with_row(
            requesting_practice_name=requesting_practice_name,
            requesting_practice_ods_code=requesting_practice_ods_code,
            requesting_practice_sicbl_ods_code=requesting_practice_sicbl_ods_code,
            requesting_practice_sicbl_name=requesting_practice_sicbl_name,
            status=TransferStatus.TECHNICAL_FAILURE.value,
            failure_reason=TransferFailureReason.FINAL_ERROR.value,
            sla_duration=timedelta(days=5).total_seconds(),
        )
        .with_row(
            requesting_practice_name=requesting_practice_name2,
            requesting_practice_ods_code=requesting_practice_ods_code2,
            requesting_practice_sicbl_ods_code=requesting_practice_sicbl_ods_code,
            requesting_practice_sicbl_name=requesting_practice_sicbl_name,
            status=TransferStatus.UNCLASSIFIED_FAILURE.value,
            failure_reason=TransferFailureReason.AMBIGUOUS_COPCS.value,
            sla_duration=timedelta(days=1).total_seconds(),
        )
        .with_row(
            requesting_practice_name=requesting_practice_name2,
            requesting_practice_ods_code=requesting_practice_ods_code2,
            requesting_practice_sicbl_ods_code=requesting_practice_sicbl_ods_code,
            requesting_practice_sicbl_name=requesting_practice_sicbl_name,
            status=TransferStatus.INTEGRATED_ON_TIME.value,
            failure_reason=None,
            sla_duration=timedelta(days=6).total_seconds(),
        )
        .with_row(
            requesting_practice_name=requesting_practice_name2,
            requesting_practice_ods_code=requesting_practice_ods_code2,
            requesting_practice_sicbl_ods_code=requesting_practice_sicbl_ods_code,
            requesting_practice_sicbl_name=requesting_practice_sicbl_name,
            status=TransferStatus.PROCESS_FAILURE.value,
            failure_reason=TransferFailureReason.INTEGRATED_LATE.value,
            sla_duration=timedelta(days=10).total_seconds(),
        )
        .with_row(
            requesting_practice_name=requesting_practice_name2,
            requesting_practice_ods_code=requesting_practice_ods_code2,
            requesting_practice_sicbl_ods_code=requesting_practice_sicbl_ods_code,
            requesting_practice_sicbl_name=requesting_practice_sicbl_name,
            status=TransferStatus.PROCESS_FAILURE.value,
            failure_reason=TransferFailureReason.TRANSFERRED_NOT_INTEGRATED.value,
            sla_duration=None,
        )
        .build()
    )

    report_generator = SICBLLevelIntegrationTimesReportsGenerator(table)
    actual_table = report_generator.generate()
    actual = actual_table.select(
        [
            "Sub ICB Location name",
            "Sub ICB Location ODS",
            "Requesting practice name",
            "Requesting practice ODS",
            "GP2GP Transfers received",
            "Integrated within 3 days",
            "Integrated within 3 days - %",
            "Integrated within 8 days",
            "Integrated within 8 days - %",
            "Not integrated within 8 days (integrated late + not integrated)",
            "Not integrated within 8 days (integrated late + not integrated) - %",
            "Integrated late",
            "Integrated late - %",
            "Not integrated within 14 days",
            "Not integrated within 14 days - %",
        ]
    )

    expected = pa.table(
        {
            "Sub ICB Location name": [
                requesting_practice_sicbl_name,
                requesting_practice_sicbl_name,
            ],
            "Sub ICB Location ODS": [
                requesting_practice_sicbl_ods_code,
                requesting_practice_sicbl_ods_code,
            ],
            "Requesting practice name": [
                requesting_practice_name,
                requesting_practice_name2,
            ],
            "Requesting practice ODS": [
                requesting_practice_ods_code,
                requesting_practice_ods_code2,
            ],
            "GP2GP Transfers received": [1, 3],
            "Integrated within 3 days": [1, 0],
            "Integrated within 3 days - %": [100.00, 0.00],
            "Integrated within 8 days": [0, 1],
            "Integrated within 8 days - %": [0.00, 33.33333333333333],
            "Not integrated within 8 days (integrated late + not integrated)": [0, 2],
            "Not integrated within 8 days (integrated late + not integrated) - %": [
                0.00,
                66.66666666666666,
            ],
            "Integrated late": [0, 1],
            "Integrated late - %": [0.00, 33.33333333333333],
            "Not integrated within 14 days": [0, 1],
            "Not integrated within 14 days - %": [0, 33.33333333333333],
        }
    )

    assert actual == expected
