from datetime import datetime

import pytest
from dateutil.tz import UTC, gettz

from prmcalculator.domain.reporting_window import ReportingWindow
from tests.builders.common import a_datetime


def test_prior_to_correctly_determines_last_metric_month():
    moment = a_datetime(year=2021, month=3, day=4)

    reporting_window = ReportingWindow.prior_to(date_anchor=moment, number_of_months=6)

    expected = 2021, 2

    actual = reporting_window.last_metric_month

    assert actual == expected


def test_prior_to_correctly_determines_last_metric_month_over_new_year():
    moment = a_datetime(year=2021, month=1, day=4)

    reporting_window = ReportingWindow.prior_to(date_anchor=moment, number_of_months=6)

    expected = 2020, 12

    actual = reporting_window.last_metric_month

    assert actual == expected


def test_prior_to_correctly_determines_date_anchor_month():
    moment = a_datetime(year=2021, month=3, day=4)

    reporting_window = ReportingWindow.prior_to(date_anchor=moment, number_of_months=6)

    expected = 2021, 3

    actual = reporting_window.date_anchor_month

    assert actual == expected


def test_prior_to_correctly_determines_multiple_metric_months():
    moment = a_datetime(year=2021, month=2, day=4)

    reporting_window = ReportingWindow.prior_to(date_anchor=moment, number_of_months=3)

    expected = [(2021, 1), (2020, 12), (2020, 11)]

    actual = reporting_window.metric_months

    assert actual == expected


def test_prior_to_correctly_determines_datetimes_for_two_metric_months():
    moment = a_datetime(year=2021, month=2, day=4)

    reporting_window = ReportingWindow.prior_to(date_anchor=moment, number_of_months=2)

    dec_datetimes = [datetime(year=2020, month=12, day=day, tzinfo=UTC) for day in range(1, 32)]
    jan_datetimes = [datetime(year=2021, month=1, day=day, tzinfo=UTC) for day in range(1, 32)]

    expected = [*dec_datetimes, *jan_datetimes]

    actual = reporting_window.dates

    assert actual == expected


@pytest.mark.parametrize(
    "test_case",
    [
        ({"date": a_datetime(year=2021, month=1, day=31), "expected": False}),
        ({"date": a_datetime(year=2021, month=2, day=1), "expected": True}),
        ({"date": a_datetime(year=2021, month=2, day=20), "expected": True}),
        ({"date": a_datetime(year=2021, month=2, day=28), "expected": True}),
        ({"date": a_datetime(year=2021, month=3, day=1), "expected": False}),
    ],
)
def test_last_month_contains_returns_correct_boolean(test_case):
    moment = a_datetime(year=2021, month=3, day=4)

    reporting_window = ReportingWindow.prior_to(date_anchor=moment, number_of_months=6)

    actual = reporting_window.last_month_contains(test_case["date"])

    assert actual == test_case["expected"]


def test_returns_dates_list_when_date_anchor_is_bst():
    moment = datetime(year=2021, month=5, day=1, hour=3, minute=0, second=0, tzinfo=UTC).astimezone(
        gettz("Europe/London")
    )
    reporting_window = ReportingWindow.prior_to(date_anchor=moment, number_of_months=1)

    actual_dates = reporting_window.dates

    expected_dates = [datetime(year=2021, month=4, day=day, tzinfo=UTC) for day in range(1, 31)]

    assert actual_dates == expected_dates
