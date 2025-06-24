from enum import Enum


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
