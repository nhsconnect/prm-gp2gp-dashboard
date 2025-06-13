from prmcalculator.domain.national.calculate_national_metrics_month import NationalMetricsMonth
from tests.builders.common import an_integer
from tests.builders.gp2gp import (
    a_transfer_integrated_between_3_and_8_days,
    a_transfer_integrated_beyond_8_days,
    a_transfer_that_was_never_integrated,
    a_transfer_where_a_copc_triggered_an_error,
    a_transfer_where_no_core_ehr_was_sent,
    a_transfer_where_the_request_was_never_acknowledged,
    a_transfer_with_a_final_error,
    build_transfer,
)


def test_returns_0_total_default_given_no_transfers():
    national_metrics_month = NationalMetricsMonth(transfers=[], year=2020, month=1)
    assert national_metrics_month.total == 0


def test_returns_1_total_default_given_1_transfer():
    a_transfer = build_transfer()

    national_metrics_month = NationalMetricsMonth(transfers=[a_transfer], year=2020, month=1)
    assert national_metrics_month.total == 1


def test_returns_year_and_month():
    national_metrics_month = NationalMetricsMonth(transfers=[], year=2020, month=1)
    assert national_metrics_month.year == 2020
    assert national_metrics_month.month == 1


def test_returns_transfer_counts():
    transfers = [
        a_transfer_integrated_between_3_and_8_days(),
        a_transfer_with_a_final_error(),
        a_transfer_where_the_request_was_never_acknowledged(),
        a_transfer_where_no_core_ehr_was_sent(),
        a_transfer_that_was_never_integrated(),
        a_transfer_integrated_beyond_8_days(),
        a_transfer_where_a_copc_triggered_an_error(),
    ]

    national_metrics_month = NationalMetricsMonth(
        transfers=transfers, year=an_integer(), month=an_integer()
    )

    assert national_metrics_month.integrated_on_time_total() == 1
    assert national_metrics_month.technical_failure_total() == 3
    assert national_metrics_month.process_failure_total() == 2
    assert national_metrics_month.unclassified_failure_total() == 1
    assert national_metrics_month.process_failure_not_integrated() == 1
    assert national_metrics_month.process_failure_integrated_late() == 1
