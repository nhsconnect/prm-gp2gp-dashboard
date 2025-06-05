import polars as pl
import pyarrow as pa
import pytest

from prmreportsgenerator.domain.reports_generator.transfer_outcomes_per_supplier_pathway import (
    TransferOutcomesPerSupplierPathwayReportsGenerator,
)
from prmreportsgenerator.domain.transfer import TransferFailureReason, TransferStatus
from tests.builders.common import a_string
from tests.builders.pa_table import PaTableBuilder


@pytest.mark.filterwarnings("ignore:Conversion of")
def test_returns_table_with_supplier_and_transfer_outcome_columns():
    requesting_supplier = a_string(6)
    sending_supplier = a_string(6)
    status = TransferStatus.TECHNICAL_FAILURE.value
    failure_reason = TransferFailureReason.FINAL_ERROR.value
    table = (
        PaTableBuilder()
        .with_row(
            requesting_supplier=requesting_supplier,
            sending_supplier=sending_supplier,
            status=status,
            failure_reason=failure_reason,
        )
        .build()
    )

    report_generator = TransferOutcomesPerSupplierPathwayReportsGenerator(table)
    actual_table = report_generator.generate()
    actual = actual_table.select(
        ["requesting supplier", "sending supplier", "status", "failure reason"]
    )

    expected = pa.table(
        {
            "requesting supplier": [requesting_supplier],
            "sending supplier": [sending_supplier],
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
    table = PaTableBuilder().with_row(final_error_codes=error_codes).build()

    report_generator = TransferOutcomesPerSupplierPathwayReportsGenerator(table)
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
    table = PaTableBuilder().with_row(sender_error_codes=error_codes).build()

    report_generator = TransferOutcomesPerSupplierPathwayReportsGenerator(table)
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
    table = PaTableBuilder().with_row(intermediate_error_codes=error_codes).build()

    report_generator = TransferOutcomesPerSupplierPathwayReportsGenerator(table)
    actual = report_generator.generate()
    actual_series = pl.Series("unique intermediate errors", actual["unique intermediate errors"])
    expected_unique_intermediate_errors = pl.Series("unique intermediate errors", [expected])

    assert actual_series.series_equal(expected_unique_intermediate_errors)


@pytest.mark.filterwarnings("ignore:Conversion of")
@pytest.mark.parametrize(
    "error_code, expected",
    [
        (6, "6 - Not at surgery"),
        (7, "7 - GP2GP disabled"),
        (9, "9 - Unexpected EHR"),
        (10, "10 - Failed to generate"),
        (11, "11 - Failed to integrate"),
        (12, "12 - Duplicate EHR"),
        (13, "13 - Config issue"),
        (14, "14 - Req not LM compliant"),
        (15, "15 - ABA suppressed"),
        (17, "17 - ABA wrong patient"),
        (18, "18 - Req malformed"),
        (19, "19 - Unauthorised req"),
        (20, "20 - Spine error"),
        (21, "21 - Extract malformed"),
        (23, "23 - Sender not LM compliant"),
        (24, "24 - SDS lookup"),
        (25, "25 - Timeout"),
        (26, "26 - Filed as attachment"),
        (28, "28 - Wrong patient"),
        (29, "29 - LM reassembly"),
        (30, "30 - LM general failure"),
        (31, "31 - Missing LM"),
        (99, "99 - Unexpected"),
    ],
)
def test_returns_table_with_correct_description_of_error(error_code, expected):
    table = PaTableBuilder().with_row(intermediate_error_codes=[error_code]).build()

    report_generator = TransferOutcomesPerSupplierPathwayReportsGenerator(table)
    actual = report_generator.generate()
    actual_series = pl.Series("unique intermediate errors", actual["unique intermediate errors"])
    expected_unique_intermediate_errors = pl.Series("unique intermediate errors", [expected])

    assert actual_series.series_equal(expected_unique_intermediate_errors)


@pytest.mark.filterwarnings("ignore:Conversion of")
def test_returns_sorted_count_per_supplier_pathway():
    supplier_a = a_string(6)
    supplier_b = a_string(6)
    table = (
        PaTableBuilder()
        .with_row(
            requesting_supplier=supplier_b,
            sending_supplier=supplier_a,
        )
        .with_row(
            requesting_supplier=supplier_a,
            sending_supplier=supplier_b,
        )
        .with_row(
            requesting_supplier=supplier_a,
            sending_supplier=supplier_b,
        )
        .build()
    )

    report_generator = TransferOutcomesPerSupplierPathwayReportsGenerator(table)
    actual_table = report_generator.generate()
    actual = actual_table.select(["requesting supplier", "sending supplier", "number of transfers"])
    expected = pa.Table.from_pydict(
        {
            "requesting supplier": [supplier_a, supplier_b],
            "sending supplier": [supplier_b, supplier_a],
            "number of transfers": [2, 1],
        }
    )
    assert actual == expected


@pytest.mark.filterwarnings("ignore:Conversion of")
def test_returns_sorted_count_per_transfer_outcome():
    integrated_status = TransferStatus.INTEGRATED_ON_TIME.value
    integrated_failure_reason = None
    failed_status = TransferStatus.TECHNICAL_FAILURE.value
    failed_failure_reason = TransferFailureReason.FINAL_ERROR.value
    table = (
        PaTableBuilder()
        .with_row(status=integrated_status, failure_reason=integrated_failure_reason)
        .with_row(status=integrated_status, failure_reason=integrated_failure_reason)
        .with_row(status=failed_status, failure_reason=failed_failure_reason)
        .build()
    )

    report_generator = TransferOutcomesPerSupplierPathwayReportsGenerator(table)
    actual_table = report_generator.generate()
    actual = actual_table.select(["status", "failure reason", "number of transfers"])

    expected = pa.Table.from_pydict(
        {
            "status": [integrated_status, failed_status],
            "failure reason": [integrated_failure_reason, failed_failure_reason],
            "number of transfers": [2, 1],
        }
    )
    assert actual == expected


@pytest.mark.filterwarnings("ignore:Conversion of")
def test_returns_sorted_count_by_count_and_supplier_and_status_per_scenario():
    integrated_status = TransferStatus.INTEGRATED_ON_TIME.value
    failed_status = TransferStatus.TECHNICAL_FAILURE.value
    process_failure_status = TransferStatus.PROCESS_FAILURE.value
    supplier_a = "SupplierA"
    supplier_b = "SupplierB"

    table = (
        PaTableBuilder()
        .with_row(
            status=integrated_status, requesting_supplier=supplier_b, sending_supplier=supplier_a
        )
        .with_row(
            status=integrated_status, requesting_supplier=supplier_b, sending_supplier=supplier_a
        )
        .with_row(
            status=integrated_status, requesting_supplier=supplier_b, sending_supplier=supplier_a
        )
        .with_row(
            status=integrated_status, requesting_supplier=supplier_a, sending_supplier=supplier_b
        )
        .with_row(
            status=integrated_status, requesting_supplier=supplier_a, sending_supplier=supplier_b
        )
        .with_row(status=failed_status, requesting_supplier=supplier_b, sending_supplier=supplier_a)
        .with_row(
            status=failed_status,
            requesting_supplier=supplier_a,
            sending_supplier=supplier_b,
        )
        .with_row(
            status=process_failure_status,
            requesting_supplier=supplier_b,
            sending_supplier=supplier_a,
        )
        .build()
    )

    report_generator = TransferOutcomesPerSupplierPathwayReportsGenerator(table)
    actual_table = report_generator.generate()
    actual = actual_table.select(
        ["status", "requesting supplier", "sending supplier", "number of transfers"]
    )
    expected = pa.Table.from_pydict(
        {
            "status": [
                integrated_status,
                integrated_status,
                failed_status,
                process_failure_status,
                failed_status,
            ],
            "requesting supplier": [supplier_b, supplier_a, supplier_a, supplier_b, supplier_b],
            "sending supplier": [supplier_a, supplier_b, supplier_b, supplier_a, supplier_a],
            "number of transfers": [3, 2, 1, 1, 1],
        }
    )
    assert actual == expected


@pytest.mark.filterwarnings("ignore:Conversion of")
def test_returns_table_with_percentage_of_transfers():
    integrated_status = TransferStatus.INTEGRATED_ON_TIME.value
    failed_status = TransferStatus.TECHNICAL_FAILURE.value
    process_failure_status = TransferStatus.PROCESS_FAILURE.value

    table = (
        PaTableBuilder()
        .with_row(status=integrated_status)
        .with_row(status=integrated_status)
        .with_row(status=integrated_status)
        .with_row(status=integrated_status)
        .with_row(status=failed_status)
        .with_row(status=failed_status)
        .with_row(status=process_failure_status)
        .build()
    )

    report_generator = TransferOutcomesPerSupplierPathwayReportsGenerator(table)
    actual_table = report_generator.generate()
    actual = actual_table.select(["status", "% of transfers"])

    expected = pa.Table.from_pydict(
        {
            "status": [integrated_status, failed_status, process_failure_status],
            "% of transfers": [57.14285714285714, 28.57142857142857, 14.285714285714285],
        }
    )
    assert actual == expected


@pytest.mark.filterwarnings("ignore:Conversion of")
def test_returns_table_with_percentage_of_technical_failures():
    integrated_status = TransferStatus.INTEGRATED_ON_TIME.value
    failed_status = TransferStatus.TECHNICAL_FAILURE.value
    final_error_failure_reason = TransferFailureReason.FINAL_ERROR.value
    sender_error_failure_reason = TransferFailureReason.FATAL_SENDER_ERROR.value
    copc_not_sent_failure_reason = TransferFailureReason.COPC_NOT_SENT.value

    table = (
        PaTableBuilder()
        .with_row(status=integrated_status, failure_reason=None)
        .with_row(status=failed_status, failure_reason=final_error_failure_reason)
        .with_row(status=failed_status, failure_reason=final_error_failure_reason)
        .with_row(status=failed_status, failure_reason=final_error_failure_reason)
        .with_row(status=failed_status, failure_reason=final_error_failure_reason)
        .with_row(status=failed_status, failure_reason=sender_error_failure_reason)
        .with_row(status=failed_status, failure_reason=sender_error_failure_reason)
        .with_row(status=failed_status, failure_reason=copc_not_sent_failure_reason)
        .build()
    )

    report_generator = TransferOutcomesPerSupplierPathwayReportsGenerator(table)
    actual_table = report_generator.generate()
    actual = actual_table.select(["status", "failure reason", "% of technical failures"])

    expected = pa.Table.from_pydict(
        {
            "status": [failed_status, failed_status, integrated_status, failed_status],
            "failure reason": [
                final_error_failure_reason,
                sender_error_failure_reason,
                None,
                copc_not_sent_failure_reason,
            ],
            "% of technical failures": [
                57.14285714285714,
                28.57142857142857,
                None,
                14.285714285714285,
            ],
        }
    )
    assert actual == expected


@pytest.mark.filterwarnings("ignore:Conversion of")
def test_returns_table_with_percentage_of_supplier_pathway():
    supplier_a = "SupplierA"
    supplier_b = "SupplierB"
    integrated_status = TransferStatus.INTEGRATED_ON_TIME.value
    failed_status = TransferStatus.TECHNICAL_FAILURE.value
    process_failure_status = TransferStatus.PROCESS_FAILURE.value

    table = (
        PaTableBuilder()
        .with_row(
            requesting_supplier=supplier_a, sending_supplier=supplier_b, status=integrated_status
        )
        .with_row(
            requesting_supplier=supplier_a, sending_supplier=supplier_b, status=integrated_status
        )
        .with_row(
            requesting_supplier=supplier_a, sending_supplier=supplier_b, status=integrated_status
        )
        .with_row(
            requesting_supplier=supplier_a, sending_supplier=supplier_b, status=integrated_status
        )
        .with_row(requesting_supplier=supplier_a, sending_supplier=supplier_b, status=failed_status)
        .with_row(requesting_supplier=supplier_a, sending_supplier=supplier_b, status=failed_status)
        .with_row(
            requesting_supplier=supplier_a,
            sending_supplier=supplier_b,
            status=process_failure_status,
        )
        .with_row(
            requesting_supplier=supplier_b, sending_supplier=supplier_a, status=integrated_status
        )
        .with_row(
            requesting_supplier=supplier_a, sending_supplier=supplier_a, status=integrated_status
        )
        .with_row(
            requesting_supplier=supplier_a, sending_supplier=supplier_a, status=integrated_status
        )
        .build()
    )

    report_generator = TransferOutcomesPerSupplierPathwayReportsGenerator(table)
    actual_table = report_generator.generate()
    actual = actual_table.select(
        ["requesting supplier", "sending supplier", "status", "% of supplier pathway"]
    )

    expected = pa.Table.from_pydict(
        {
            "requesting supplier": [supplier_a, supplier_a, supplier_a, supplier_a, supplier_b],
            "sending supplier": [supplier_b, supplier_a, supplier_b, supplier_b, supplier_a],
            "status": [
                integrated_status,
                integrated_status,
                failed_status,
                process_failure_status,
                integrated_status,
            ],
            "% of supplier pathway": [
                57.14285714285714,
                100,
                28.57142857142857,
                14.285714285714285,
                100,
            ],
        }
    )
    assert actual == expected
