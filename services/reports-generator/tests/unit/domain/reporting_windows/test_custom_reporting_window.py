from datetime import datetime

import pytest
from dateutil.tz import UTC

from prmreportsgenerator.domain.reporting_windows.custom_reporting_window import (
    CustomReportingWindow,
)
from tests.builders.common import a_datetime


def test_throws_value_error_given_start_datetime_not_at_midnight():
    start_datetime = a_datetime(year=2020, hour=5, minute=0, second=0)

    with pytest.raises(ValueError) as e:
        CustomReportingWindow(
            start_datetime=start_datetime,
            end_datetime=a_datetime(year=2021, hour=0, minute=0, second=0),
        )
    assert str(e.value) == "Datetime must be at midnight"


def test_throws_value_error_given_end_datetime_not_at_midnight():
    end_datetime = a_datetime(year=2022, hour=5, minute=0, second=0)

    with pytest.raises(ValueError) as e:
        CustomReportingWindow(
            start_datetime=a_datetime(year=2021, hour=0, minute=0, second=0),
            end_datetime=end_datetime,
        )
    assert str(e.value) == "Datetime must be at midnight"


def test_throws_value_error_given_start_datetime_is_after_end_datetime():
    start_datetime = datetime(year=2019, month=12, day=2, hour=0, minute=0, second=0, tzinfo=UTC)
    end_datetime = datetime(year=2019, month=12, day=1, hour=0, minute=0, second=0, tzinfo=UTC)
    custom_reporting_window = CustomReportingWindow(
        start_datetime=start_datetime,
        end_datetime=end_datetime,
    )
    with pytest.raises(ValueError) as e:
        custom_reporting_window.get_dates()
    assert str(e.value) == "Start datetime must be before end datetime"


def test_returns_start_datetime_given_start_datetime():
    start_datetime = datetime(year=2019, month=12, day=1, hour=0, minute=0, second=0, tzinfo=UTC)

    reporting_window = CustomReportingWindow(
        start_datetime=start_datetime,
        end_datetime=a_datetime(year=2020, hour=0, minute=0, second=0),
    )
    actual = reporting_window.start_datetime

    assert actual == start_datetime


def test_get_dates_returns_list_of_datetimes_within_start_and_end_datetime():
    start_datetime = datetime(year=2021, month=12, day=30, tzinfo=UTC)
    end_datetime = datetime(year=2022, month=1, day=3, tzinfo=UTC)

    reporting_window = CustomReportingWindow(start_datetime, end_datetime)

    expected = [
        datetime(year=2021, month=12, day=30, tzinfo=UTC),
        datetime(year=2021, month=12, day=31, tzinfo=UTC),
        datetime(year=2022, month=1, day=1, tzinfo=UTC),
        datetime(year=2022, month=1, day=2, tzinfo=UTC),
    ]

    actual = reporting_window.get_dates()

    assert actual == expected


def test_config_string_returns_custom_string():
    start_datetime = datetime(year=2021, month=12, day=30, tzinfo=UTC)
    end_datetime = datetime(year=2022, month=1, day=3, tzinfo=UTC)

    reporting_window = CustomReportingWindow(start_datetime, end_datetime)

    actual = reporting_window.config_string
    expected = "custom"

    assert actual == expected
