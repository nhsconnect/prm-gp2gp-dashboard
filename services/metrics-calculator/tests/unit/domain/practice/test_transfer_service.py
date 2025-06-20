from unittest.mock import Mock

from prmcalculator.domain.practice.transfer_service import SICBL, Practice, TransfersService
from tests.builders.common import a_datetime, a_string
from tests.builders.gp2gp import build_practice_details, build_transfer


def test_produces_empty_list_given_no_transfers():
    mock_probe = Mock()

    expected = []  # type: ignore

    actual = TransfersService(transfers=[], observability_probe=mock_probe).grouped_practices_by_ods
    assert actual == expected


def test_produces_a_group_given_a_single_practice_with_a_single_transfer():
    mock_probe = Mock()

    transfer_one = build_transfer(
        requesting_practice=build_practice_details(
            ods_code="A1234", name="Practice 1", sicbl_name="SICBL 1", sicbl_ods_code="AA1234"
        )
    )

    expected = [
        Practice(
            name="Practice 1",
            ods_code="A1234",
            transfers=[transfer_one],
            sicbl_name="SICBL 1",
            sicbl_ods_code="AA1234",
        )
    ]

    actual = TransfersService(
        transfers=[transfer_one], observability_probe=mock_probe
    ).grouped_practices_by_ods

    assert actual == expected


def test_produces_a_group_given_a_single_practice_with_multiple_transfer():
    mock_probe = Mock()

    transfer_one = build_transfer(
        requesting_practice=build_practice_details(
            ods_code="A1234", name="Practice 1", sicbl_name="SICBL 1", sicbl_ods_code="AA1234"
        ),
    )
    transfer_two = build_transfer(
        requesting_practice=build_practice_details(
            ods_code="A1234", name="Practice 1", sicbl_name="SICBL 1", sicbl_ods_code="AA1234"
        ),
    )

    expected = [
        Practice(
            name="Practice 1",
            ods_code="A1234",
            transfers=[transfer_one, transfer_two],
            sicbl_name="SICBL 1",
            sicbl_ods_code="AA1234",
        )
    ]

    actual = TransfersService(
        transfers=[transfer_one, transfer_two], observability_probe=mock_probe
    ).grouped_practices_by_ods

    assert actual == expected


def test_sets_practice_fields_based_on_latest_transfer_transfer():
    mock_probe = Mock()

    transfer_one_oldest = build_transfer(
        date_requested=a_datetime(year=2020, month=1, day=1),
        requesting_practice=build_practice_details(
            ods_code="A1234", name="Practice Older", sicbl_name="SICBL 1", sicbl_ods_code="AA1234"
        ),
    )
    transfer_two_latest = build_transfer(
        date_requested=a_datetime(year=2020, month=1, day=30),
        requesting_practice=build_practice_details(
            ods_code="A1234",
            name="Practice Latest",
            sicbl_name="SICBL Latest",
            sicbl_ods_code="LATEST1234",
        ),
    )
    transfer_three_old = build_transfer(
        date_requested=a_datetime(year=2020, month=1, day=5),
        requesting_practice=build_practice_details(
            ods_code="A1234", name="Practice Old", sicbl_name="SICBL 1", sicbl_ods_code="AA1234"
        ),
    )

    expected = [
        Practice(
            name="Practice Latest",
            ods_code="A1234",
            transfers=[transfer_one_oldest, transfer_two_latest, transfer_three_old],
            sicbl_name="SICBL Latest",
            sicbl_ods_code="LATEST1234",
        )
    ]

    actual = TransfersService(
        transfers=[transfer_one_oldest, transfer_two_latest, transfer_three_old],
        observability_probe=mock_probe,
    ).grouped_practices_by_ods

    assert actual == expected


def test_produces_correct_groups_given_two_practices_each_with_transfers():
    mock_probe = Mock()

    transfer_one = build_transfer(
        requesting_practice=build_practice_details(
            ods_code="A1234", name="Practice 1", sicbl_name="SICBL 1", sicbl_ods_code="AA1234"
        ),
    )
    transfer_two = build_transfer(
        requesting_practice=build_practice_details(
            ods_code="B1234", name="Practice 2", sicbl_name="SICBL 2", sicbl_ods_code="BB1234"
        ),
    )
    transfer_three = build_transfer(
        requesting_practice=build_practice_details(
            ods_code="B1234", name="Practice 2", sicbl_name="SICBL 2", sicbl_ods_code="BB1234"
        ),
    )

    expected = [
        Practice(
            name="Practice 1",
            ods_code="A1234",
            transfers=[transfer_one],
            sicbl_name="SICBL 1",
            sicbl_ods_code="AA1234",
        ),
        Practice(
            name="Practice 2",
            ods_code="B1234",
            transfers=[transfer_two, transfer_three],
            sicbl_name="SICBL 2",
            sicbl_ods_code="BB1234",
        ),
    ]

    actual = TransfersService(
        transfers=[transfer_one, transfer_two, transfer_three], observability_probe=mock_probe
    ).grouped_practices_by_ods

    assert actual == expected


def test_ignore_transfer_and_log_when_missing_practice_ods_code():
    mock_probe = Mock()

    transfer_missing_ods_code = build_transfer(
        requesting_practice=build_practice_details(
            ods_code=None, name="Practice 1", sicbl_name="SICBL 1", sicbl_ods_code="AA1234"
        ),
    )

    expected = []  # type: ignore

    actual = TransfersService(
        transfers=[transfer_missing_ods_code], observability_probe=mock_probe
    ).grouped_practices_by_ods

    mock_probe.record_unknown_practice_ods_code_for_transfer.assert_called_once_with(
        transfer_missing_ods_code
    )

    assert actual == expected


def test_ignore_transfer_and_log_when_missing_sicbl_ods_code():
    mock_probe = Mock()

    transfer_missing_sicbl_ods_code = build_transfer(
        requesting_practice=build_practice_details(
            ods_code=a_string(6), name="Practice 1", sicbl_name="SICBL 1", sicbl_ods_code=None
        ),
    )

    expected = []  # type: ignore

    actual = TransfersService(
        transfers=[transfer_missing_sicbl_ods_code], observability_probe=mock_probe
    ).grouped_practices_by_ods

    mock_probe.record_unknown_practice_sicbl_ods_code_for_transfer.assert_called_once_with(
        transfer_missing_sicbl_ods_code
    )

    assert actual == expected


# SICBL
def test_produces_empty_sicbl_list_given_no_practices():
    mock_probe = Mock()

    expected = []  # type: ignore

    actual = TransfersService(
        transfers=[], observability_probe=mock_probe
    ).grouped_practices_by_sicbl

    assert actual == expected


def test_produces_a_sicbl_group_given_single_practice():
    mock_probe = Mock()
    practice_ods_code = "A1234"
    transfer_one = build_transfer(
        requesting_practice=build_practice_details(
            ods_code=practice_ods_code, sicbl_name="SICBL 1", sicbl_ods_code="AA1234"
        ),
    )

    expected = [
        SICBL(
            sicbl_name="SICBL 1",
            sicbl_ods_code="AA1234",
            practices_ods_codes=[practice_ods_code],
        )
    ]

    actual = TransfersService(
        transfers=[transfer_one], observability_probe=mock_probe
    ).grouped_practices_by_sicbl

    assert actual == expected


def test_produces_multiple_sicbl_groups_given_a_multiple_practices():
    mock_probe = Mock()
    practice_one_ods_code = "A1234"
    practice_two_ods_code = "A2345"
    practice_three_ods_code = "B1234"
    transfer_one = build_transfer(
        requesting_practice=build_practice_details(
            name="Practice 1",
            ods_code=practice_one_ods_code,
            sicbl_name="SICBL 1",
            sicbl_ods_code="AA1234",
        ),
    )

    transfer_two = build_transfer(
        requesting_practice=build_practice_details(
            name="Practice 2",
            ods_code=practice_two_ods_code,
            sicbl_name="SICBL 1",
            sicbl_ods_code="AA1234",
        ),
    )

    transfer_three = build_transfer(
        requesting_practice=build_practice_details(
            name="Practice 3",
            ods_code=practice_three_ods_code,
            sicbl_name="SICBL 2",
            sicbl_ods_code="BB1234",
        ),
    )

    expected = [
        SICBL(
            sicbl_name="SICBL 1",
            sicbl_ods_code="AA1234",
            practices_ods_codes=[practice_one_ods_code, practice_two_ods_code],
        ),
        SICBL(
            sicbl_name="SICBL 2",
            sicbl_ods_code="BB1234",
            practices_ods_codes=[practice_three_ods_code],
        ),
    ]

    actual = TransfersService(
        transfers=[transfer_one, transfer_two, transfer_three], observability_probe=mock_probe
    ).grouped_practices_by_sicbl

    assert actual == expected
