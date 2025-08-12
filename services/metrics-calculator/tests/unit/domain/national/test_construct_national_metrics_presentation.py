from datetime import datetime

from dateutil.tz import UTC
from freezegun import freeze_time

from prmcalculator.domain.national.calculate_national_metrics_month import NationalMetricsMonth
from prmcalculator.domain.national.construct_national_metrics_presentation import (
    construct_national_metrics_presentation,
)
from tests.builders.common import a_datetime
from tests.builders.gp2gp import (
    a_transfer_integrated_beyond_8_days,
    a_transfer_that_was_never_integrated,
    a_transfer_where_a_copc_triggered_an_error,
    a_transfer_with_a_final_error,
    an_integrated_transfer,
    build_transfer,
)

a_year = a_datetime().year
a_month = a_datetime().month


@freeze_time(datetime(year=2019, month=6, day=2, hour=23, second=42), tz_offset=0)
def test_has_correct_generated_on_given_time():
    national_metrics_month = NationalMetricsMonth(transfers=[], year=a_year, month=a_month)

    actual = construct_national_metrics_presentation([national_metrics_month])
    expected_generated_on = datetime(year=2019, month=6, day=2, hour=23, second=42, tzinfo=UTC)

    assert actual.generated_on == expected_generated_on


def test_has_correct_metric_month_and_year():
    national_metrics_month = NationalMetricsMonth(transfers=[], year=a_year, month=a_month)

    actual = construct_national_metrics_presentation([national_metrics_month])

    assert len(actual.metrics) == 1
    assert actual.metrics[0].year == a_year
    assert actual.metrics[0].month == a_month


def test_returns_transfers_total_of_2_for_metric_month():
    national_metrics_month = NationalMetricsMonth(
        transfers=[build_transfer(), build_transfer()], year=a_year, month=a_month
    )

    actual = construct_national_metrics_presentation([national_metrics_month])

    assert actual.metrics[0].transfer_count == 2


def test_returns_integrated_on_time_metrics_transfer_count_and_percent():
    transfers = [
        an_integrated_transfer(),
        an_integrated_transfer(),
        a_transfer_with_a_final_error(),
    ]
    national_metrics_month = NationalMetricsMonth(
        transfers=transfers,
        year=a_year,
        month=a_month,
    )

    actual = construct_national_metrics_presentation([national_metrics_month])

    assert actual.metrics[0].integrated_on_time.transfer_count == 2
    assert actual.metrics[0].integrated_on_time.transfer_percentage == 66.67


def test_returns_technical_failure_metrics_transfer_count_and_percent():
    transfers = [a_transfer_with_a_final_error(), a_transfer_with_a_final_error(), build_transfer()]
    national_metrics_month = NationalMetricsMonth(
        transfers=transfers,
        year=a_year,
        month=a_month,
    )

    actual = construct_national_metrics_presentation([national_metrics_month])

    assert actual.metrics[0].paper_fallback.technical_failure.transfer_count == 2
    assert actual.metrics[0].paper_fallback.technical_failure.transfer_percentage == 66.67


def test_returns_paper_fallback_metrics_transfer_count_and_percent():
    transfers = [
        a_transfer_integrated_beyond_8_days(),
        a_transfer_integrated_beyond_8_days(),
        a_transfer_that_was_never_integrated(),
        build_transfer(),
    ]
    national_metrics_month = NationalMetricsMonth(
        transfers=transfers,
        year=a_year,
        month=a_month,
    )

    actual = construct_national_metrics_presentation([national_metrics_month])

    assert actual.metrics[0].paper_fallback.transfer_count == 3
    assert actual.metrics[0].paper_fallback.transfer_percentage == 75.0


def test_returns_process_failure_metrics_transfer_count_and_percent():
    transfers = [
        a_transfer_integrated_beyond_8_days(),
        a_transfer_integrated_beyond_8_days(),
        a_transfer_that_was_never_integrated(),
        build_transfer(),
    ]
    national_metrics_month = NationalMetricsMonth(
        transfers=transfers,
        year=a_year,
        month=a_month,
    )

    actual = construct_national_metrics_presentation([national_metrics_month])
    actual_process_failure_metric_month = actual.metrics[0].paper_fallback.process_failure

    assert actual_process_failure_metric_month.integrated_late.transfer_count == 2
    assert actual_process_failure_metric_month.integrated_late.transfer_percentage == 50.0

    assert actual_process_failure_metric_month.transferred_not_integrated.transfer_count == 1
    assert (
        actual_process_failure_metric_month.transferred_not_integrated.transfer_percentage == 25.0
    )


def test_returns_unclassified_failure_metrics_transfer_count_and_percent():
    transfers = [
        a_transfer_where_a_copc_triggered_an_error(),
        build_transfer(),
        build_transfer(),
        build_transfer(),
    ]
    national_metrics_month = NationalMetricsMonth(
        transfers=transfers,
        year=a_year,
        month=a_month,
    )

    actual = construct_national_metrics_presentation([national_metrics_month])
    actual_paper_fallback_metric_month = actual.metrics[0].paper_fallback

    assert actual_paper_fallback_metric_month.unclassified_failure.transfer_count == 1
    assert actual_paper_fallback_metric_month.unclassified_failure.transfer_percentage == 25.0
