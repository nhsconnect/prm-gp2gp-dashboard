from datetime import datetime, timedelta

import pyarrow as pa
from dateutil.tz import UTC

from prmcalculator.domain.gp2gp.transfer import (
    Transfer,
    TransferFailureReason,
    TransferOutcome,
    TransferStatus,
    UnexpectedTransferOutcome,
    convert_table_to_transfers,
)
from tests.builders.common import a_datetime, a_string
from tests.builders.gp2gp import build_practice_details


def _build_transfer_table(**kwargs) -> pa.Table:
    return pa.Table.from_pydict(
        {
            "conversation_id": kwargs.get("conversation_id", [a_string(36)]),
            "sla_duration": kwargs.get("sla_duration", [1234]),
            "requesting_practice_asid": kwargs.get("requesting_practice_asid", [a_string(12)]),
            "requesting_supplier": kwargs.get("requesting_supplier", [a_string(12)]),
            "status": kwargs.get("status", ["Integrated on time"]),
            "failure_reason": kwargs.get("failure_reason", [""]),
            "date_requested": kwargs.get("date_requested", [a_datetime()]),
            "last_sender_message_timestamp": kwargs.get(
                "last_sender_message_timestamp", [a_datetime()]
            ),
            "requesting_practice_ods_code": kwargs.get(
                "requesting_practice_ods_code", [a_string(6)]
            ),
            "requesting_practice_name": kwargs.get("requesting_practice_name", [a_string(12)]),
            "requesting_practice_sicbl_ods_code": kwargs.get(
                "requesting_practice_sicbl_ods_code", [a_string(6)]
            ),
            "requesting_practice_sicbl_name": kwargs.get(
                "requesting_practice_sicbl_name", [a_string(12)]
            ),
        }
    )


def test_conversation_id_column_is_converted_to_a_transfer_field():
    conversation_id = "123"

    table = _build_transfer_table(conversation_id=[conversation_id])

    transfers = convert_table_to_transfers(table)
    actual_conversation_id = next(iter(transfers)).conversation_id

    assert actual_conversation_id == conversation_id


def test_sla_duration_column_is_converted_to_timedelta():
    table = _build_transfer_table(sla_duration=[176586])
    transfers = convert_table_to_transfers(table)

    actual_sla_duration = next(iter(transfers)).sla_duration
    expected_sla_duration = timedelta(days=2, hours=1, minutes=3, seconds=6)

    assert actual_sla_duration == expected_sla_duration


def test_sla_duration_column_is_converted_to_a_transfer_field_if_none():
    table = _build_transfer_table(sla_duration=[None])
    transfers = convert_table_to_transfers(table)

    actual_sla_duration = next(iter(transfers)).sla_duration
    expected_sla_duration = None

    assert actual_sla_duration == expected_sla_duration


def test_requesting_practice_asid_column_is_converted_to_a_transfer_field():
    requesting_practice_asid = "121212121212"

    table = _build_transfer_table(requesting_practice_asid=[requesting_practice_asid])

    transfers = convert_table_to_transfers(table)
    actual_requesting_practice_asid = next(iter(transfers)).requesting_practice.asid

    assert actual_requesting_practice_asid == requesting_practice_asid


def test_requesting_supplier_column_is_converted_to_a_transfer_field():
    requesting_supplier = "EMIS Web"

    table = _build_transfer_table(requesting_supplier=[requesting_supplier])

    transfers = convert_table_to_transfers(table)
    actual_requesting_supplier = next(iter(transfers)).requesting_practice.supplier

    assert actual_requesting_supplier == requesting_supplier


def test_status_and_failure_reason_columns_are_converted_to_a_transfer_outcome_field():
    table = _build_transfer_table(status=["Technical failure"], failure_reason=["Final error"])

    transfers = convert_table_to_transfers(table)
    actual_transfer_outcome = next(iter(transfers)).outcome
    expected_transfer_outcome = TransferOutcome(
        status=TransferStatus.TECHNICAL_FAILURE, failure_reason=TransferFailureReason.FINAL_ERROR
    )

    assert actual_transfer_outcome == expected_transfer_outcome


def test_throw_unexpected_transfer_outcome_when_failure_reason_cannot_be_mapped():
    table = _build_transfer_table(
        status=["Technical failure"], failure_reason=["Missing Failure Reason"]
    )

    try:
        convert_table_to_transfers(table)
    except UnexpectedTransferOutcome as ex:
        assert str(ex) == "Unexpected Failure Reason: Missing Failure Reason - cannot be mapped."


def test_throw_unexpected_transfer_outcome_when_status_cannot_be_mapped():
    table = _build_transfer_table(status=["MISSING_STATUS"], failure_reason=["Final error"])

    try:
        convert_table_to_transfers(table)
    except UnexpectedTransferOutcome as ex:
        assert str(ex) == "Unexpected Status: MISSING_STATUS - cannot be mapped."


def test_date_requested_column_converts_to_a_transfer_field():
    date_requested = a_datetime()

    table = _build_transfer_table(date_requested=[date_requested])

    transfers = convert_table_to_transfers(table)
    actual_date_requested = next(iter(transfers)).date_requested

    assert actual_date_requested == date_requested


def test_date_without_timezone_requested_column__converts_to_a_utc_datetime_transfer_field():
    date_requested = datetime(year=2020, month=2, day=1, hour=1, minute=2, second=3)

    table = _build_transfer_table(date_requested=[date_requested])

    transfers = convert_table_to_transfers(table)
    actual_date_requested = next(iter(transfers)).date_requested

    assert actual_date_requested == datetime(
        year=2020, month=2, day=1, hour=1, minute=2, second=3, tzinfo=UTC
    )


def test_last_sender_message_timestamp_column_converts_to_a_transfer_field():
    last_sender_message_timestamp = a_datetime()

    table = _build_transfer_table(last_sender_message_timestamp=[last_sender_message_timestamp])

    transfers = convert_table_to_transfers(table)
    actual_last_sender_message_timestamp = next(iter(transfers)).last_sender_message_timestamp

    assert actual_last_sender_message_timestamp == last_sender_message_timestamp


def test_explicit_last_sender_message_timestamp_column_converts_to_a_utc_datetime_transfer_field():
    last_sender_message_timestamp = datetime(year=2020, month=2, day=1, hour=1, minute=2, second=3)

    table = _build_transfer_table(last_sender_message_timestamp=[last_sender_message_timestamp])

    transfers = convert_table_to_transfers(table)
    actual_last_sender_message_timestamp = next(iter(transfers)).last_sender_message_timestamp

    assert actual_last_sender_message_timestamp == datetime(
        year=2020, month=2, day=1, hour=1, minute=2, second=3, tzinfo=UTC
    )


def test_converts_multiple_rows_into_list_of_transfers():
    integrated_date_requested = a_datetime()
    integrated_sla_duration = timedelta(days=2, hours=19, minutes=0, seconds=41)
    technical_failure_date_request = a_datetime()
    last_sender_message_timestamp = a_datetime()

    table = _build_transfer_table(
        conversation_id=["123", "2345"],
        sla_duration=[241241, 12413],
        requesting_practice_asid=["213125436412", "124135423412"],
        requesting_supplier=["Vision", "Systm One"],
        status=["Integrated on time", "Technical failure"],
        failure_reason=[None, "Contains fatal sender error"],
        date_requested=[integrated_date_requested, technical_failure_date_request],
        last_sender_message_timestamp=[
            last_sender_message_timestamp,
            last_sender_message_timestamp,
        ],
        requesting_practice_ods_code=["A123", "B123"],
        requesting_practice_name=["Practice 1", "Practice 2"],
        requesting_practice_sicbl_ods_code=["AA123", "BB123"],
        requesting_practice_sicbl_name=["SICBL 1", "SICBL 2"],
    )

    expected_transfers = [
        Transfer(
            conversation_id="123",
            sla_duration=integrated_sla_duration,
            requesting_practice=build_practice_details(
                asid="213125436412",
                supplier="Vision",
                name="Practice 1",
                ods_code="A123",
                sicbl_name="SICBL 1",
                sicbl_ods_code="AA123",
            ),
            outcome=TransferOutcome(status=TransferStatus.INTEGRATED_ON_TIME, failure_reason=None),
            date_requested=integrated_date_requested,
            last_sender_message_timestamp=last_sender_message_timestamp,
        ),
        Transfer(
            conversation_id="2345",
            sla_duration=timedelta(hours=3, minutes=26, seconds=53),
            requesting_practice=build_practice_details(
                asid="124135423412",
                supplier="Systm One",
                name="Practice 2",
                ods_code="B123",
                sicbl_name="SICBL 2",
                sicbl_ods_code="BB123",
            ),
            outcome=TransferOutcome(
                status=TransferStatus.TECHNICAL_FAILURE,
                failure_reason=TransferFailureReason.FATAL_SENDER_ERROR,
            ),
            date_requested=technical_failure_date_request,
            last_sender_message_timestamp=last_sender_message_timestamp,
        ),
    ]

    actual_transfers = convert_table_to_transfers(table)

    assert actual_transfers == expected_transfers


def test_convert_table_to_transfers_handles_none_values_gracefully():
    date_requested = a_datetime()

    table = _build_transfer_table(
        conversation_id=["123"],
        sla_duration=[None],
        requesting_practice_asid=["213125436412"],
        requesting_supplier=["Vision"],
        status=["Technical failure"],
        failure_reason=["Contains fatal sender error"],
        date_requested=[date_requested],
        last_sender_message_timestamp=[None],
        requesting_practice_ods_code=["A123"],
        requesting_practice_name=["Practice 1"],
        requesting_practice_sicbl_ods_code=["AA123"],
        requesting_practice_sicbl_name=["SICBL 1"],
    )

    actual_transfers = convert_table_to_transfers(table)
    expected_transfers = [
        Transfer(
            conversation_id="123",
            sla_duration=None,
            requesting_practice=build_practice_details(
                asid="213125436412",
                supplier="Vision",
                ods_code="A123",
                name="Practice 1",
                sicbl_ods_code="AA123",
                sicbl_name="SICBL 1",
            ),
            outcome=TransferOutcome(
                status=TransferStatus.TECHNICAL_FAILURE,
                failure_reason=TransferFailureReason.FATAL_SENDER_ERROR,
            ),
            date_requested=date_requested,
            last_sender_message_timestamp=None,
        ),
    ]

    assert actual_transfers == expected_transfers
