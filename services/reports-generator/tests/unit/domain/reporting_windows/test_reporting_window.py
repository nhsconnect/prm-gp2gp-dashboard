from datetime import datetime
from unittest.mock import patch

from dateutil.tz import UTC

from prmreportsgenerator.domain.reporting_windows.reporting_window import ReportingWindow


@patch.multiple(ReportingWindow, __abstractmethods__=set())
def test_property_given_start_datetime_and_end_datetime():
    start_datetime = datetime(year=2021, month=12, day=30, tzinfo=UTC)
    end_datetime = datetime(year=2022, month=1, day=3, tzinfo=UTC)

    reporting_window = ReportingWindow(start_datetime, end_datetime)
    actual_start_datetime = reporting_window.start_datetime
    actual_end_datetime = reporting_window.end_datetime

    assert actual_start_datetime == start_datetime
    assert actual_end_datetime == end_datetime


@patch.multiple(ReportingWindow, __abstractmethods__=set())
def test_get_dates_returns_list_of_datetimes_within_start_and_end_datetime():
    start_datetime = datetime(year=2021, month=12, day=30, tzinfo=UTC)
    end_datetime = datetime(year=2022, month=1, day=3, tzinfo=UTC)

    reporting_window = ReportingWindow(start_datetime, end_datetime)

    expected = [
        datetime(year=2021, month=12, day=30, tzinfo=UTC),
        datetime(year=2021, month=12, day=31, tzinfo=UTC),
        datetime(year=2022, month=1, day=1, tzinfo=UTC),
        datetime(year=2022, month=1, day=2, tzinfo=UTC),
    ]

    actual = reporting_window.get_dates()

    assert actual == expected
