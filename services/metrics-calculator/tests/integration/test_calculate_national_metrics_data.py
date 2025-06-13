from datetime import datetime
from unittest.mock import Mock

from dateutil.tz import UTC
from freezegun import freeze_time

from prmcalculator.domain.national.calculate_national_metrics_data import (
    calculate_national_metrics_data,
)
from prmcalculator.domain.national.construct_national_metrics_presentation import (
    NationalMetricMonthPresentation,
    NationalMetricsPresentation,
    OutcomeMetricsPresentation,
    PaperFallbackMetricsPresentation,
    ProcessFailureMetricsPresentation,
)
from prmcalculator.domain.reporting_window import ReportingWindow
from tests.builders.common import a_date_in, a_datetime, a_duration
from tests.builders.gp2gp import (
    a_transfer_integrated_between_3_and_8_days,
    a_transfer_integrated_beyond_8_days,
    a_transfer_integrated_within_3_days,
    a_transfer_that_was_never_integrated,
    a_transfer_where_a_copc_triggered_an_error,
    a_transfer_where_copc_fragments_remained_unacknowledged,
    a_transfer_where_copc_fragments_were_required_but_not_sent,
    a_transfer_where_no_copc_continue_was_sent,
    a_transfer_where_no_core_ehr_was_sent,
    a_transfer_where_the_request_was_never_acknowledged,
    a_transfer_where_the_sender_reported_an_unrecoverable_error,
    a_transfer_with_a_final_error,
    build_transfer,
)


@freeze_time(datetime(year=2020, month=1, day=17, hour=21, second=32), tz_offset=0)
def test_calculates_correct_national_metrics_given_series_of_transfers():
    mock_probe = Mock()
    a_date_in_2019_12 = a_date_in(year=2019, month=12)
    transfers_integrated_on_time = [
        a_transfer_integrated_within_3_days(date_requested=a_date_in_2019_12()),
        a_transfer_integrated_between_3_and_8_days(date_requested=a_date_in_2019_12()),
        a_transfer_integrated_between_3_and_8_days(date_requested=a_date_in_2019_12()),
    ]
    transfers_unclassified_error = [
        a_transfer_where_a_copc_triggered_an_error(date_requested=a_date_in_2019_12()),
    ]
    transfers_technical_failure = [
        a_transfer_where_the_request_was_never_acknowledged(date_requested=a_date_in_2019_12()),
        a_transfer_where_no_core_ehr_was_sent(date_requested=a_date_in_2019_12()),
        a_transfer_where_no_copc_continue_was_sent(date_requested=a_date_in_2019_12()),
        a_transfer_where_copc_fragments_were_required_but_not_sent(
            date_requested=a_date_in_2019_12()
        ),
        a_transfer_where_copc_fragments_remained_unacknowledged(date_requested=a_date_in_2019_12()),
        a_transfer_where_the_sender_reported_an_unrecoverable_error(
            date_requested=a_date_in_2019_12()
        ),
        a_transfer_with_a_final_error(date_requested=a_date_in_2019_12()),
    ]

    transfers_process_failure = [
        a_transfer_integrated_beyond_8_days(date_requested=a_date_in_2019_12()),
        a_transfer_integrated_beyond_8_days(date_requested=a_date_in_2019_12()),
        a_transfer_integrated_beyond_8_days(date_requested=a_date_in_2019_12()),
        a_transfer_that_was_never_integrated(date_requested=a_date_in_2019_12()),
    ]
    transfers = (
        transfers_process_failure
        + transfers_integrated_on_time
        + transfers_technical_failure
        + transfers_unclassified_error
    )

    metric_month_start = datetime(year=2019, month=12, day=1, tzinfo=UTC)
    reporting_window = ReportingWindow(
        date_anchor_month_start=a_datetime(year=2020, month=1, day=1),
        dates=[],
        metric_months_datetimes=[metric_month_start],
    )
    current_datetime = datetime.now(UTC)

    expected_national_metrics_month_presentation = NationalMetricMonthPresentation(
        year=2019,
        month=12,
        transfer_count=15,
        integrated_on_time=OutcomeMetricsPresentation(
            transfer_count=3,
            transfer_percentage=20.0,
        ),
        paper_fallback=PaperFallbackMetricsPresentation(
            transfer_count=12,
            transfer_percentage=80.0,
            process_failure=ProcessFailureMetricsPresentation(
                integrated_late=OutcomeMetricsPresentation(
                    transfer_count=3,
                    transfer_percentage=20.0,
                ),
                transferred_not_integrated=OutcomeMetricsPresentation(
                    transfer_count=1,
                    transfer_percentage=6.67,
                ),
            ),
            technical_failure=OutcomeMetricsPresentation(
                transfer_count=7,
                transfer_percentage=46.67,
            ),
            unclassified_failure=OutcomeMetricsPresentation(
                transfer_count=1,
                transfer_percentage=6.67,
            ),
        ),
    )

    expected_national_metrics = NationalMetricsPresentation(
        generated_on=current_datetime, metrics=[expected_national_metrics_month_presentation]
    )

    actual = calculate_national_metrics_data(
        transfers=transfers, reporting_window=reporting_window, observability_probe=mock_probe
    )

    assert actual == expected_national_metrics


@freeze_time(datetime(year=2020, month=1, day=17, hour=21, second=32), tz_offset=0)
def test_calculates_correct_national_metrics_for_transfers_within_reporting_window():
    mock_probe = Mock()
    metric_month_start = a_datetime(year=2019, month=12, day=1)

    transfer_within_reporting_window = build_transfer(
        date_requested=a_datetime(year=2019, month=12, day=14), sla_duration=a_duration(600)
    )
    transfer_before_reporting_window = build_transfer(
        date_requested=a_datetime(year=2019, month=11, day=10)
    )
    transfer_after_reporting_window = build_transfer(
        date_requested=a_datetime(year=2020, month=1, day=4)
    )

    transfers = [
        transfer_within_reporting_window,
        transfer_before_reporting_window,
        transfer_after_reporting_window,
    ]

    reporting_window = ReportingWindow(
        date_anchor_month_start=a_datetime(year=2020, month=1, day=1),
        dates=[],
        metric_months_datetimes=[metric_month_start],
    )
    current_datetime = datetime.now(UTC)

    expected_national_metrics_month_presentation = NationalMetricMonthPresentation(
        year=2019,
        month=12,
        transfer_count=1,
        integrated_on_time=OutcomeMetricsPresentation(
            transfer_count=1,
            transfer_percentage=100.0,
        ),
        paper_fallback=PaperFallbackMetricsPresentation(
            transfer_count=0,
            transfer_percentage=0.0,
            process_failure=ProcessFailureMetricsPresentation(
                integrated_late=OutcomeMetricsPresentation(
                    transfer_count=0,
                    transfer_percentage=0.0,
                ),
                transferred_not_integrated=OutcomeMetricsPresentation(
                    transfer_count=0,
                    transfer_percentage=0.0,
                ),
            ),
            technical_failure=OutcomeMetricsPresentation(
                transfer_count=0,
                transfer_percentage=0.0,
            ),
            unclassified_failure=OutcomeMetricsPresentation(
                transfer_count=0,
                transfer_percentage=0.0,
            ),
        ),
    )

    expected_national_metrics = NationalMetricsPresentation(
        generated_on=current_datetime, metrics=[expected_national_metrics_month_presentation]
    )

    actual = calculate_national_metrics_data(
        transfers=transfers, reporting_window=reporting_window, observability_probe=mock_probe
    )

    assert actual == expected_national_metrics


def test_calls_observability_probe_calculating_national_metrics():
    mock_probe = Mock()
    reporting_window = ReportingWindow(
        date_anchor_month_start=a_datetime(),
        dates=[],
        metric_months_datetimes=[a_datetime()],
    )

    calculate_national_metrics_data(
        transfers=[], reporting_window=reporting_window, observability_probe=mock_probe
    )

    mock_probe.record_calculating_national_metrics.assert_called_once_with(reporting_window)
