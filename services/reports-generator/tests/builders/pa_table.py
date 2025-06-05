import pyarrow as pa
from dateutil.tz import UTC

from prmreportsgenerator.domain.transfer import TransferStatus
from tests.builders.common import a_datetime, a_string, an_integer

requesting_supplier = a_string(5)
sending_supplier = a_string(5)


class PaTableBuilder:
    def __init__(self):
        self._conversation_id_list = []
        self._sla_duration_list = []
        self._requesting_practice_asid_list = []
        self._requesting_practice_name_list = []
        self._sending_practice_asid_list = []
        self._sending_practice_name_list = []
        self._requesting_supplier_list = []
        self._sending_supplier_list = []
        self._requesting_practice_ods_code_list = []
        self._sending_practice_ods_code_list = []
        self._requesting_practice_sicbl_ods_code_list = []
        self._requesting_practice_sicbl_name_list = []
        self._sending_practice_sicbl_ods_code_list = []
        self._sending_practice_sicbl_name_list = []
        self._sender_error_codes_list = []
        self._final_error_codes_list = []
        self._intermediate_error_codes_list = []
        self._status_list = []
        self._failure_reason_list = []
        self._date_requested_list = []
        self._date_completed_list = []
        self._last_sender_message_timestamp_list = []

    def with_row(self, **kwargs):
        self._conversation_id_list.append(kwargs.get("conversation_id", a_string(36)))
        self._sla_duration_list.append(kwargs.get("sla_duration", an_integer()))
        self._requesting_practice_asid_list.append(
            kwargs.get("requesting_practice_asid", a_string(12))
        )
        self._requesting_practice_name_list.append(
            kwargs.get("requesting_practice_name", a_string(12))
        )
        self._sending_practice_asid_list.append(kwargs.get("sending_practice_asid", a_string(12)))
        self._sending_practice_name_list.append(kwargs.get("sending_practice_name", a_string(12)))
        self._requesting_supplier_list.append(
            kwargs.get("requesting_supplier", requesting_supplier)
        )
        self._sending_supplier_list.append(kwargs.get("sending_supplier", sending_supplier))
        self._requesting_practice_ods_code_list.append(
            kwargs.get("requesting_practice_ods_code", a_string(6))
        )
        self._sending_practice_ods_code_list.append(
            kwargs.get("sending_practice_ods_code", a_string(6))
        )
        self._requesting_practice_sicbl_ods_code_list.append(
            kwargs.get("requesting_practice_sicbl_ods_code", a_string(3))
        )
        self._requesting_practice_sicbl_name_list.append(
            kwargs.get("requesting_practice_sicbl_name", a_string(3))
        )
        self._sending_practice_sicbl_ods_code_list.append(
            kwargs.get("sending_practice_sicbl_ods_code", a_string(3))
        )
        self._sending_practice_sicbl_name_list.append(
            kwargs.get("sending_practice_sicbl_name", a_string(3))
        )
        self._sender_error_codes_list.append(kwargs.get("sender_error_codes", []))
        self._final_error_codes_list.append(kwargs.get("final_error_codes", []))
        self._intermediate_error_codes_list.append(kwargs.get("intermediate_error_codes", []))
        self._status_list.append(kwargs.get("status", TransferStatus.INTEGRATED_ON_TIME.value))
        self._failure_reason_list.append(kwargs.get("failure_reason", None))
        self._date_requested_list.append(kwargs.get("date_requested", a_datetime().astimezone(UTC)))
        self._date_completed_list.append(kwargs.get("date_completed", a_datetime().astimezone(UTC)))
        self._last_sender_message_timestamp_list.append(
            kwargs.get("last_sender_message", a_datetime().astimezone(UTC))
        )

        return self

    def build(self):
        return pa.table(
            data={
                "conversation_id": self._conversation_id_list,
                "date_requested": self._date_requested_list,
                "last_sender_message_timestamp": self._last_sender_message_timestamp_list,
                "requesting_practice_asid": self._requesting_practice_asid_list,
                "requesting_practice_name": self._requesting_practice_name_list,
                "requesting_supplier": self._requesting_supplier_list,
                "requesting_practice_ods_code": self._requesting_practice_ods_code_list,
                "requesting_practice_sicbl_ods_code": self._requesting_practice_sicbl_ods_code_list,
                "requesting_practice_sicbl_name": self._requesting_practice_sicbl_name_list,
                "sending_practice_asid": self._sending_practice_asid_list,
                "sending_practice_name": self._sending_practice_name_list,
                "sending_supplier": self._sending_supplier_list,
                "sending_practice_ods_code": self._sending_practice_ods_code_list,
                "sending_practice_sicbl_ods_code": self._sending_practice_sicbl_ods_code_list,
                "sending_practice_sicbl_name": self._sending_practice_sicbl_name_list,
                "sla_duration": self._sla_duration_list,
                "status": self._status_list,
                "failure_reason": self._failure_reason_list,
                "final_error_codes": self._final_error_codes_list,
                "sender_error_codes": self._sender_error_codes_list,
                "intermediate_error_codes": self._intermediate_error_codes_list,
            },
            schema=self.get_schema(),
        )

    @staticmethod
    def get_schema() -> pa.schema:
        return pa.schema(
            [
                ("conversation_id", pa.string()),
                ("date_requested", pa.timestamp("us")),
                ("last_sender_message_timestamp", pa.timestamp("us")),
                ("requesting_practice_asid", pa.string()),
                ("requesting_practice_name", pa.string()),
                ("requesting_supplier", pa.string()),
                ("requesting_practice_ods_code", pa.string()),
                ("requesting_practice_sicbl_ods_code", pa.string()),
                ("requesting_practice_sicbl_name", pa.string()),
                ("sending_practice_asid", pa.string()),
                ("sending_practice_name", pa.string()),
                ("sending_supplier", pa.string()),
                ("sending_practice_ods_code", pa.string()),
                ("sending_practice_sicbl_ods_code", pa.string()),
                ("sending_practice_sicbl_name", pa.string()),
                ("sla_duration", pa.uint64()),
                ("status", pa.string()),
                ("failure_reason", pa.string()),
                ("final_error_codes", _int_list()),
                ("sender_error_codes", _int_list()),
                ("intermediate_error_codes", _int_list()),
            ]
        )


def _int_list():
    return pa.list_(pa.int64())
