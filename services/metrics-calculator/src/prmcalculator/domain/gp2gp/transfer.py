from dataclasses import dataclass
from datetime import datetime, timedelta
from enum import Enum
from typing import List, NamedTuple, Optional

import pyarrow as pa
from dateutil.tz import UTC

from prmcalculator.domain.reporting_window import ReportingWindow


class UnexpectedTransferOutcome(Exception):
    pass


class TransferStatus(Enum):
    INTEGRATED_ON_TIME = "Integrated on time"
    TECHNICAL_FAILURE = "Technical failure"
    PROCESS_FAILURE = "Process failure"
    UNCLASSIFIED_FAILURE = "Unclassified failure"


class TransferFailureReason(Enum):
    INTEGRATED_LATE = "Integrated late"
    FINAL_ERROR = "Final error"
    TRANSFERRED_NOT_INTEGRATED = "Transferred, not integrated"
    REQUEST_NOT_ACKNOWLEDGED = "Request not acknowledged"
    CORE_EHR_NOT_SENT = "Core extract not sent"
    FATAL_SENDER_ERROR = "Contains fatal sender error"
    COPC_NOT_SENT = "COPC(s) not sent"
    COPC_NOT_ACKNOWLEDGED = "COPC(s) not acknowledged"
    TRANSFERRED_NOT_INTEGRATED_WITH_ERROR = "Transferred, not integrated, with error"
    AMBIGUOUS_COPCS = "Ambiguous COPC messages"


@dataclass(frozen=True)
class TransferOutcome:
    status: TransferStatus
    failure_reason: Optional[TransferFailureReason]


@dataclass(frozen=True)
class PracticeDetails:
    asid: str
    supplier: str
    ods_code: str
    name: str
    sicbl_ods_code: str
    sicbl_name: str


class Transfer(NamedTuple):
    conversation_id: str
    sla_duration: Optional[timedelta]
    requesting_practice: PracticeDetails
    outcome: TransferOutcome
    date_requested: datetime
    last_sender_message_timestamp: Optional[datetime]


def filter_transfers_by_date_requested(
    transfers: List[Transfer], reporting_window: ReportingWindow
) -> List[Transfer]:
    return [
        transfer
        for transfer in transfers
        if reporting_window.last_month_contains(transfer.date_requested)
    ]


def _convert_to_timedelta(seconds: Optional[int]) -> Optional[timedelta]:
    if seconds is not None:
        return timedelta(seconds=seconds)
    else:
        return None


def _convert_pydict_to_list_of_dictionaries(pydict: dict):
    return (dict(zip(pydict.keys(), items)) for items in zip(*pydict.values()))


def _map_transfer_failure_reason(failure_reason: str) -> TransferFailureReason:
    try:
        return TransferFailureReason(failure_reason)
    except ValueError:
        raise UnexpectedTransferOutcome(
            f"Unexpected Failure Reason: {failure_reason} - cannot be mapped."
        )


def _map_transfer_status(status: str) -> TransferStatus:
    try:
        return TransferStatus(status)
    except ValueError:
        raise UnexpectedTransferOutcome(f"Unexpected Status: {status} - cannot be mapped.")


def convert_table_to_transfers(table: pa.Table) -> List[Transfer]:
    transfer_dict = table.to_pydict()

    transfers = _convert_pydict_to_list_of_dictionaries(transfer_dict)
    return [
        Transfer(
            conversation_id=transfer["conversation_id"],
            sla_duration=_convert_to_timedelta(transfer["sla_duration"]),
            requesting_practice=PracticeDetails(
                asid=transfer["requesting_practice_asid"],
                supplier=transfer["requesting_supplier"],
                ods_code=transfer["requesting_practice_ods_code"],
                name=transfer["requesting_practice_name"],
                sicbl_ods_code=transfer["requesting_practice_sicbl_ods_code"],
                sicbl_name=transfer["requesting_practice_sicbl_name"],
            ),
            outcome=TransferOutcome(
                status=_map_transfer_status(transfer["status"]),
                failure_reason=_map_transfer_failure_reason(transfer["failure_reason"])
                if transfer["failure_reason"]
                else None,
            ),
            date_requested=transfer["date_requested"].astimezone(UTC),
            last_sender_message_timestamp=transfer["last_sender_message_timestamp"].astimezone(UTC)
            if transfer["last_sender_message_timestamp"]
            else None,
        )
        for transfer in transfers
    ]
