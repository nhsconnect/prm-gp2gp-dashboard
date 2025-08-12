from prmcalculator.domain.practice.practice_transfer_metrics import PracticeTransferMetrics
from tests.builders.common import a_datetime, a_string
from tests.builders.gp2gp import (
    a_transfer_integrated_beyond_8_days,
    a_transfer_integrated_within_3_days,
)


def test_returns_transfer_metrics():
    transfers = [
        a_transfer_integrated_beyond_8_days(
            date_requested=a_datetime(year=2021, month=7),
        ),
        a_transfer_integrated_within_3_days(
            date_requested=a_datetime(year=2021, month=8),
        ),
        a_transfer_integrated_beyond_8_days(
            date_requested=a_datetime(year=2021, month=8),
        ),
    ]

    practice_transfers = PracticeTransferMetrics(
        ods_code=a_string(5),
        name=a_string(12),
        sicbl_ods_code=a_string(5),
        sicbl_name=a_string(12),
        transfers=transfers,
    )

    july_transfer_metrics = practice_transfers.monthly_metrics(2021, 7)
    aug_transfer_metrics = practice_transfers.monthly_metrics(2021, 8)

    assert july_transfer_metrics.integrated_total() == 1
    assert july_transfer_metrics.integrated_within_3_days() == 0
    assert july_transfer_metrics.integrated_beyond_8_days() == 1
    assert aug_transfer_metrics.integrated_total() == 2
    assert aug_transfer_metrics.integrated_within_3_days() == 1
    assert aug_transfer_metrics.integrated_beyond_8_days() == 1


def test_returns_empty_transfer_metrics_given_month_with_no_transfers():
    practice_transfers = PracticeTransferMetrics(
        ods_code=a_string(5),
        name=a_string(12),
        sicbl_ods_code=a_string(5),
        sicbl_name=a_string(12),
        transfers=[],
    )
    expected_transfer_count = 0

    actual = practice_transfers.monthly_metrics(2021, 7)
    actual_transfer_count = actual.received_by_practice_total()

    assert actual_transfer_count == expected_transfer_count


def test_returns_ods_code():
    practice_transfers = PracticeTransferMetrics(
        ods_code="ABC123",
        name=a_string(12),
        sicbl_ods_code=a_string(5),
        sicbl_name=a_string(12),
        transfers=[],
    )
    actual_ods_code = practice_transfers.ods_code

    assert actual_ods_code == "ABC123"


def test_returns_practice_name():
    practice_transfers = PracticeTransferMetrics(
        ods_code=a_string(5),
        name="Test Practice",
        sicbl_ods_code=a_string(5),
        sicbl_name=a_string(12),
        transfers=[],
    )
    actual_name = practice_transfers.name

    assert actual_name == "Test Practice"


def test_returns_sicbl_ods_code():
    practice_transfers = PracticeTransferMetrics(
        ods_code=a_string(5),
        name=a_string(12),
        sicbl_ods_code="ABC123",
        sicbl_name=a_string(5),
        transfers=[],
    )
    actual_sicbl_ods_code = practice_transfers.sicbl_ods_code

    assert actual_sicbl_ods_code == "ABC123"


def test_returns_sicbl_name_name():
    practice_transfers = PracticeTransferMetrics(
        ods_code=a_string(5),
        name=a_string(5),
        sicbl_ods_code=a_string(5),
        sicbl_name="Test ICB - 10D",
        transfers=[],
    )
    actual_sicbl_name = practice_transfers.sicbl_name

    assert actual_sicbl_name == "Test ICB - 10D"
