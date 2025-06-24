from unittest.mock import Mock

from prmcalculator.domain.practice.construct_practice_summary import (
    MonthlyMetricsPresentation,
    PracticeSummary,
    RequestedTransferMetrics,
    construct_practice_summary,
)
from prmcalculator.domain.reporting_window import ReportingWindow
from tests.builders.common import a_datetime


def test_returns_a_practice_summary_for_one_month_of_metrics():
    mock_transfer_metrics = Mock()
    mock_transfer_metrics.ods_code = "ABC123"
    mock_transfer_metrics.name = "Test Practice"
    mock_transfer_metrics.sicbl_ods_code = "11S"
    mock_transfer_metrics.sicbl_name = "Test ICB 11S"

    mock_monthly_metrics = Mock()
    mock_transfer_metrics.monthly_metrics.return_value = mock_monthly_metrics
    mock_monthly_metrics.requested_by_practice_total.return_value = 1
    mock_monthly_metrics.received_by_practice_total.return_value = 2
    mock_monthly_metrics.received_by_practice_percent_of_requested.return_value = 24.56
    mock_monthly_metrics.integrated_within_3_days.return_value = 4
    mock_monthly_metrics.integrated_within_3_days_percent_of_received.return_value = 44.54
    mock_monthly_metrics.integrated_within_8_days.return_value = 5
    mock_monthly_metrics.integrated_within_8_days_percent_of_received.return_value = 57.44
    mock_monthly_metrics.not_integrated_within_8_days_total.return_value = 13
    mock_monthly_metrics.not_integrated_within_8_days_percent_of_received.return_value = 78.15
    mock_monthly_metrics.failures_total_count.return_value = 17
    mock_monthly_metrics.failures_percent_of_requested.return_value = 14.54

    reporting_window = ReportingWindow.prior_to(a_datetime(year=2021, month=7), number_of_months=1)

    expected = PracticeSummary(
        ods_code="ABC123",
        name="Test Practice",
        sicbl_ods_code="11S",
        sicbl_name="Test ICB 11S",
        metrics=[
            MonthlyMetricsPresentation(
                year=2021,
                month=6,
                requested_transfers=RequestedTransferMetrics(
                    requested_count=1,
                    received_count=2,
                    received_percent_of_requested=24.56,
                    integrated_within_3_days_count=4,
                    integrated_within_3_days_percent_of_received=44.54,
                    integrated_within_8_days_count=5,
                    integrated_within_8_days_percent_of_received=57.44,
                    not_integrated_within_8_days_total=13,
                    not_integrated_within_8_days_percent_of_received=78.15,
                    failures_total_count=17,
                    failures_total_percent_of_requested=14.54,
                ),
            )
        ],
    )

    actual = construct_practice_summary(
        practice_metrics=mock_transfer_metrics,
        reporting_window=reporting_window,
    )

    assert actual == expected


def test_returns_a_practice_summary_for_multiple_months():
    mock_transfer_metrics = Mock()
    mock_transfer_metrics.monthly_metrics.return_value = Mock()

    reporting_window = ReportingWindow.prior_to(a_datetime(year=2021, month=7), number_of_months=3)

    actual = construct_practice_summary(
        practice_metrics=mock_transfer_metrics,
        reporting_window=reporting_window,
    )

    assert actual.metrics[0].month == 6
    assert actual.metrics[1].month == 5
    assert actual.metrics[2].month == 4
    mock_transfer_metrics.monthly_metrics.assert_any_call(year=2021, month=6)
    mock_transfer_metrics.monthly_metrics.assert_any_call(year=2021, month=5)
    mock_transfer_metrics.monthly_metrics.assert_any_call(year=2021, month=4)
    assert mock_transfer_metrics.monthly_metrics.call_count == 3
