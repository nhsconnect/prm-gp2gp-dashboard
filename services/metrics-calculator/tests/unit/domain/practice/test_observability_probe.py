from unittest.mock import Mock

from prmcalculator.domain.practice.calculate_practice_metrics import (
    PracticeMetricsObservabilityProbe,
)
from prmcalculator.domain.reporting_window import ReportingWindow
from tests.builders.common import a_datetime, a_string
from tests.builders.gp2gp import build_practice_details, build_transfer


def test_probe_should_log_event_when_calculating_practice_metrics():
    mock_logger = Mock()
    probe = PracticeMetricsObservabilityProbe(mock_logger)

    date_anchor = a_datetime(year=2021, month=8)
    reporting_window = ReportingWindow.prior_to(date_anchor=date_anchor, number_of_months=3)

    probe.record_calculating_practice_metrics(reporting_window)

    mock_logger.info.assert_called_once_with(
        "Calculating practice metrics",
        extra={
            "event": "CALCULATING_PRACTICE_METRICS",
            "metric_months": [(2021, 7), (2021, 6), (2021, 5)],
        },
    )


def test_probe_should_warn_given_a_transfer_with_unknown_practice_ods_code():
    mock_logger = Mock()
    probe = PracticeMetricsObservabilityProbe(mock_logger)

    asid = a_string(12)
    conversation_id = a_string()
    transfer = build_transfer(
        conversation_id=conversation_id,
        requesting_practice=build_practice_details(asid=asid, ods_code=None),
    )

    probe.record_unknown_practice_ods_code_for_transfer(transfer=transfer)

    mock_logger.warning.assert_called_once_with(
        "Unknown practice ods_code for transfer, ignoring transfer from metrics",
        extra={
            "event": "UNKNOWN_PRACTICE_ODS_CODE_FOR_TRANSFER",
            "asid": asid,
            "conversation_id": conversation_id,
        },
    )


def test_probe_should_warn_given_a_transfer_with_unknown_sicbl_ods_code():
    mock_logger = Mock()
    probe = PracticeMetricsObservabilityProbe(mock_logger)

    asid = a_string(12)
    ods_code = a_string(12)
    conversation_id = a_string()
    transfer = build_transfer(
        conversation_id=conversation_id,
        requesting_practice=build_practice_details(asid=asid, ods_code=ods_code),
    )

    probe.record_unknown_practice_sicbl_ods_code_for_transfer(transfer=transfer)

    mock_logger.warning.assert_called_once_with(
        "Unknown sicbl_ods_code for transfer, ignoring transfer from metrics",
        extra={
            "event": "UNKNOWN_SICBL_ODS_CODE_FOR_TRANSFER",
            "conversation_id": conversation_id,
            "asid": asid,
            "practice_ods_code": ods_code,
        },
    )
