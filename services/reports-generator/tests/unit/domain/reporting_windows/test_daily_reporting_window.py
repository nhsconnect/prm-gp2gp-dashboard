from datetime import datetime

import pytest
from dateutil.tz import UTC
from freezegun import freeze_time

from prmreportsgenerator.domain.reporting_windows.daily_reporting_window import DailyReportingWindow
from tests.builders.common import a_datetime


@pytest.mark.parametrize(
    "number_of_days, expected_start_datetime",
    [
        (1, datetime(year=2020, month=12, day=31, hour=0, minute=0, second=0, tzinfo=UTC)),
        (3, datetime(year=2020, month=12, day=29, hour=0, minute=0, second=0, tzinfo=UTC)),
        (10, datetime(year=2020, month=12, day=22, hour=0, minute=0, second=0, tzinfo=UTC)),
    ],
)
@freeze_time(datetime(year=2021, month=1, day=1, hour=3, minute=0, second=0, tzinfo=UTC))
def test_returns_today_midnight_minus_days_given_number_of_days_and_0_cutoff(
    number_of_days, expected_start_datetime
):
    reporting_window = DailyReportingWindow(number_of_days=number_of_days, cutoff_days=0)
    actual = reporting_window.start_datetime

    assert actual == expected_start_datetime


@pytest.mark.parametrize(
    "cutoff_days, expected_start_datetime",
    [
        (1, datetime(year=2020, month=12, day=30, hour=0, minute=0, second=0, tzinfo=UTC)),
        (3, datetime(year=2020, month=12, day=28, hour=0, minute=0, second=0, tzinfo=UTC)),
        (10, datetime(year=2020, month=12, day=21, hour=0, minute=0, second=0, tzinfo=UTC)),
    ],
)
@freeze_time(datetime(year=2021, month=1, day=1, hour=3, minute=0, second=0, tzinfo=UTC))
def test_returns_today_midnight_minus_days_given_1_number_of_days_and_various_cutoffs(
    cutoff_days, expected_start_datetime
):
    reporting_window = DailyReportingWindow(number_of_days=1, cutoff_days=cutoff_days)
    actual = reporting_window.start_datetime

    assert actual == expected_start_datetime


@freeze_time(a_datetime(year=2022, month=1, day=3))
def test_get_dates_returns_list_of_datetimes_given_4_number_of_days_and_0_cutoff():
    reporting_window = DailyReportingWindow(number_of_days=4, cutoff_days=0)

    expected = [
        datetime(year=2021, month=12, day=30, tzinfo=UTC),
        datetime(year=2021, month=12, day=31, tzinfo=UTC),
        datetime(year=2022, month=1, day=1, tzinfo=UTC),
        datetime(year=2022, month=1, day=2, tzinfo=UTC),
    ]

    actual = reporting_window.get_dates()

    assert actual == expected


@pytest.mark.parametrize(
    "cutoff_days, expected_dates",
    [
        (1, [datetime(year=2021, month=12, day=30, hour=0, minute=0, second=0, tzinfo=UTC)]),
        (3, [datetime(year=2021, month=12, day=28, hour=0, minute=0, second=0, tzinfo=UTC)]),
        (10, [datetime(year=2021, month=12, day=21, hour=0, minute=0, second=0, tzinfo=UTC)]),
    ],
)
@freeze_time(a_datetime(year=2022, month=1, day=1))
def test_get_dates_returns_list_of_datetimes_given_1_day_and_various_cutoffs(
    cutoff_days, expected_dates
):
    reporting_window = DailyReportingWindow(cutoff_days=cutoff_days, number_of_days=1)

    actual = reporting_window.get_dates()

    assert actual == expected_dates


def test_config_string_returns_string_containing_number_of_days():
    reporting_window = DailyReportingWindow(number_of_days=4, cutoff_days=0)

    actual = reporting_window.config_string
    expected = "4-days"

    assert actual == expected
