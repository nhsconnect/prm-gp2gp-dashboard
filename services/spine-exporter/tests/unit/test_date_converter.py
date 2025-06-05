from datetime import datetime

import pytest

from prmexporter.date_converter import convert_date_range_to_dates, convert_to_datetime_string


def test_convert_date_range_to_dates_returns_datetimes_between_start_and_end_datetime():
    start_datetime = datetime(year=2021, month=2, day=1, hour=0, minute=0, second=0)
    end_datetime = datetime(year=2021, month=2, day=3, hour=0, minute=0, second=0)

    actual = convert_date_range_to_dates(start_datetime, end_datetime)

    expected = [
        datetime(year=2021, month=2, day=1, hour=0, minute=0, second=0),
        datetime(year=2021, month=2, day=2, hour=0, minute=0, second=0),
    ]

    assert actual == expected


def test_convert_date_range_to_dates_throws_exception_when_end_datetime_is_before_start_datetime():
    start_datetime = datetime(year=2021, month=2, day=1, hour=0, minute=0, second=0)
    end_datetime = datetime(year=2021, month=1, day=31, hour=0, minute=0, second=0)

    with pytest.raises(ValueError) as e:
        convert_date_range_to_dates(start_datetime, end_datetime)

    assert str(e.value) == "Start datetime must be before end datetime"


def test_convert_date_range_to_dates_throws_exception_when_start_and_end_datetimes_are_the_same():
    start_datetime = datetime(year=2021, month=2, day=1, hour=0, minute=0, second=0)
    end_datetime = datetime(year=2021, month=2, day=1, hour=0, minute=0, second=0)

    with pytest.raises(ValueError) as e:
        convert_date_range_to_dates(start_datetime, end_datetime)

    assert str(e.value) == "Start datetime must be before end datetime"


def test_convert_to_datetime_string_returns_a_datetime_string():
    a_datetime = datetime(year=2021, month=11, day=13, hour=2, minute=0, second=0)

    actual = convert_to_datetime_string(a_datetime)

    expected = "2021-11-13T02:00:00"

    assert actual == expected
