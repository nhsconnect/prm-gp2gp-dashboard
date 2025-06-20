from datetime import datetime

import polars as pl
import pyarrow as pa
import pytest

from prmreportsgenerator.domain.reports_generator.transfer_level_technical_failures import (
    TransferLevelTechnicalFailuresReportsGenerator,
)
from prmreportsgenerator.domain.transfer import TransferFailureReason, TransferStatus
from tests.builders.common import a_string
from tests.builders.pa_table import PaTableBuilder


@pytest.mark.filterwarnings("ignore:Conversion of")
def test_returns_table_with_transfer_level_technical_failure_columns():
    requesting_supplier = a_string(6)
    requesting_practice_asid = a_string(6)
    requesting_practice_ods_code = a_string(6)
    requesting_practice_sicbl_ods_code = a_string(3)
    sending_supplier = a_string(6)
    sending_practice_asid = a_string(6)
    sending_practice_ods_code = a_string(6)
    sending_practice_sicbl_ods_code = a_string(3)
    conversation_id = a_string(16)
    date_requested = datetime.now()
    status = TransferStatus.TECHNICAL_FAILURE.value
    failure_reason = TransferFailureReason.FINAL_ERROR.value
    table = (
        PaTableBuilder()
        .with_row(
            sending_practice_asid=sending_practice_asid,
            sending_supplier=sending_supplier,
            sending_practice_ods_code=sending_practice_ods_code,
            sending_practice_sicbl_ods_code=sending_practice_sicbl_ods_code,
            requesting_practice_asid=requesting_practice_asid,
            requesting_supplier=requesting_supplier,
            requesting_practice_ods_code=requesting_practice_ods_code,
            requesting_practice_sicbl_ods_code=requesting_practice_sicbl_ods_code,
            conversation_id=conversation_id,
            date_requested=date_requested,
            status=status,
            failure_reason=failure_reason,
        )
        .build()
    )

    report_generator = TransferLevelTechnicalFailuresReportsGenerator(table)
    actual_table = report_generator.generate()
    actual = actual_table.select(
        [
            "sending practice ASID",
            "sending supplier",
            "sending practice ODS code",
            "sending practice Sub ICB Location ODS code",
            "requesting practice ASID",
            "requesting supplier",
            "requesting practice ODS code",
            "requesting practice Sub ICB Location ODS code",
            "conversation ID",
            "date requested",
            "status",
            "failure reason",
        ]
    )

    expected = pa.table(
        {
            "sending practice ASID": [sending_practice_asid],
            "sending supplier": [sending_supplier],
            "sending practice ODS code": [sending_practice_ods_code],
            "sending practice Sub ICB Location ODS code": [sending_practice_sicbl_ods_code],
            "requesting practice ASID": [requesting_practice_asid],
            "requesting supplier": [requesting_supplier],
            "requesting practice ODS code": [requesting_practice_ods_code],
            "requesting practice Sub ICB Location ODS code": [requesting_practice_sicbl_ods_code],
            "conversation ID": [conversation_id],
            "date requested": [date_requested],
            "status": [status],
            "failure reason": [failure_reason],
        }
    )

    assert actual == expected


@pytest.mark.filterwarnings("ignore:Conversion of")
@pytest.mark.parametrize(
    "error_codes, expected",
    [
        ([7, 9, 6, 7, 7], "6 - Not at surgery, 7 - GP2GP disabled, 9 - Unexpected EHR"),
        ([7, 9, 9, 6, 7, 7, 9], "6 - Not at surgery, 7 - GP2GP disabled, 9 - Unexpected EHR"),
        ([None, None, 9], "9 - Unexpected EHR"),
        ([None], ""),
        ([], ""),
        ([1], "1 - Unknown error code"),
    ],
)
def test_returns_table_with_unique_final_error_codes(error_codes, expected):
    table = (
        PaTableBuilder()
        .with_row(final_error_codes=error_codes, status=TransferStatus.TECHNICAL_FAILURE.value)
        .build()
    )

    report_generator = TransferLevelTechnicalFailuresReportsGenerator(table)
    actual = report_generator.generate()
    actual_series = pl.Series("unique final errors", actual["unique final errors"])
    expected_unique_final_errors = pl.Series("unique final errors", [expected])

    assert actual_series.series_equal(expected_unique_final_errors)


@pytest.mark.filterwarnings("ignore:Conversion of")
@pytest.mark.parametrize(
    "error_codes, expected",
    [
        ([7, 9, 6, 7, 7], "6 - Not at surgery, 7 - GP2GP disabled, 9 - Unexpected EHR"),
        ([7, 9, 9, 6, 7, 7, 9], "6 - Not at surgery, 7 - GP2GP disabled, 9 - Unexpected EHR"),
        ([None, None, 9], "9 - Unexpected EHR"),
        ([None], ""),
        ([], ""),
        ([1], "1 - Unknown error code"),
    ],
)
def test_returns_table_with_unique_sender_errors(error_codes, expected):
    table = (
        PaTableBuilder()
        .with_row(sender_error_codes=error_codes, status=TransferStatus.TECHNICAL_FAILURE.value)
        .build()
    )

    report_generator = TransferLevelTechnicalFailuresReportsGenerator(table)
    actual = report_generator.generate()
    actual_series = pl.Series("unique sender errors", actual["unique sender errors"])
    expected_unique_sender_errors = pl.Series("unique sender errors", [expected])

    assert actual_series.series_equal(expected_unique_sender_errors)


@pytest.mark.filterwarnings("ignore:Conversion of")
@pytest.mark.parametrize(
    "error_codes, expected",
    [
        ([7, 9, 6, 7, 7], "6 - Not at surgery, 7 - GP2GP disabled, 9 - Unexpected EHR"),
        ([7, 9, 9, 6, 7, 7, 9], "6 - Not at surgery, 7 - GP2GP disabled, 9 - Unexpected EHR"),
        ([], ""),
        ([1], "1 - Unknown error code"),
    ],
)
def test_returns_table_with_unique_intermediate_error_codes(error_codes, expected):
    table = (
        PaTableBuilder()
        .with_row(
            intermediate_error_codes=error_codes, status=TransferStatus.TECHNICAL_FAILURE.value
        )
        .build()
    )

    report_generator = TransferLevelTechnicalFailuresReportsGenerator(table)
    actual = report_generator.generate()
    actual_series = pl.Series("unique intermediate errors", actual["unique intermediate errors"])
    expected_unique_intermediate_errors = pl.Series("unique intermediate errors", [expected])

    assert actual_series.series_equal(expected_unique_intermediate_errors)


@pytest.mark.filterwarnings("ignore:Conversion of")
def test_filter_only_maintains_technical_and_unclassified_failures():
    conversation_1 = a_string(16)
    filtered_status_1 = TransferStatus.TECHNICAL_FAILURE.value
    conversation_2 = a_string(16)
    filtered_status_2 = TransferStatus.TECHNICAL_FAILURE.value
    conversation_3 = a_string(16)
    filtered_status_3 = TransferStatus.UNCLASSIFIED_FAILURE.value

    table = (
        PaTableBuilder()
        .with_row(
            conversation_id=conversation_1,
            status=filtered_status_1,
        )
        .with_row(
            conversation_id=a_string(16),
            status=TransferStatus.INTEGRATED_ON_TIME.value,
        )
        .with_row(
            conversation_id=conversation_2,
            status=filtered_status_2,
        )
        .with_row(
            conversation_id=a_string(16),
            status=TransferStatus.PROCESS_FAILURE.value,
        )
        .with_row(
            conversation_id=conversation_3,
            status=filtered_status_3,
        )
        .build()
    )

    report_generator = TransferLevelTechnicalFailuresReportsGenerator(table)
    actual_table = report_generator.generate()
    actual = actual_table.select(
        [
            "conversation ID",
            "status",
        ]
    )

    expected = pa.table(
        {
            "conversation ID": [conversation_1, conversation_2, conversation_3],
            "status": [filtered_status_1, filtered_status_2, filtered_status_3],
        },
    )

    assert actual == expected
