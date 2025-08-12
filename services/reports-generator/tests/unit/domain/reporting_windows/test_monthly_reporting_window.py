from datetime import datetime, timedelta

import pytest
from dateutil.tz import UTC
from freezegun import freeze_time

from prmreportsgenerator.domain.reporting_windows.monthly_reporting_window import (
    MonthlyReportingWindow,
)
from tests.builders.common import a_datetime


@freeze_time(a_datetime(year=2022, month=1, day=1))
def test_property_given_start_datetime():
    reporting_window = MonthlyReportingWindow(number_of_months=1)

    actual_start_datetime = reporting_window.start_datetime

    expected_start_datetime = datetime(
        year=2021, month=12, day=1, hour=0, minute=0, second=0, tzinfo=UTC
    )

    assert actual_start_datetime == expected_start_datetime


@freeze_time(a_datetime(year=2022, month=1, day=1))
def test_end_datetime_property_of_current_month_1st_midnight():
    reporting_window = MonthlyReportingWindow(number_of_months=1)

    actual_start_datetime = reporting_window.end_datetime

    expected_start_datetime = datetime(year=2022, month=1, day=1, tzinfo=UTC)

    assert actual_start_datetime == expected_start_datetime


@pytest.mark.parametrize(
    "number_of_months, expected_datetimes",
    [
        (
            1,
            [
                datetime(year=2021, month=5, day=1, tzinfo=UTC) + timedelta(days=day)
                for day in range(0, 31)
            ],
        ),
        (
            3,
            [
                datetime(year=2021, month=3, day=1, tzinfo=UTC) + timedelta(days=day)
                for day in range(0, 92)
            ],
        ),
    ],
)
@freeze_time(a_datetime(year=2021, month=6, day=13))
def test_get_dates_returns_a_list_of_datetimes_of_previous_months(
    number_of_months, expected_datetimes
):
    reporting_window = MonthlyReportingWindow(number_of_months=number_of_months)

    actual_datetimes = reporting_window.get_dates()

    assert actual_datetimes == expected_datetimes


def test_config_string_returns_string_containing_number_of_months():
    reporting_window = MonthlyReportingWindow(number_of_months=3)

    actual = reporting_window.config_string
    expected = "3-months"

    assert actual == expected
