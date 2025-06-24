from datetime import datetime

import pytest
from dateutil.tz import UTC, gettz
from freezegun import freeze_time

from prmexporter.search_dates import SearchDates


def test_throws_exception_when_only_end_datetime_is_passed():
    end_datetime_input = datetime(year=2020, month=6, day=6, tzinfo=UTC)

    with pytest.raises(ValueError) as e:
        SearchDates(start_datetime=None, end_datetime=end_datetime_input)

    assert str(e.value) == "Start datetime must be provided if end datetime is provided"


def test_returns_list_of_datetimes_when_start_and_end_datetimes_are_passed():
    start_datetime_input = datetime(year=2021, month=12, day=30, tzinfo=UTC)
    end_datetime_input = datetime(year=2022, month=1, day=3, tzinfo=UTC)

    search_dates = SearchDates(start_datetime=start_datetime_input, end_datetime=end_datetime_input)

    expected = [
        datetime(year=2021, month=12, day=30, hour=0, minute=0, second=0, tzinfo=UTC),
        datetime(year=2021, month=12, day=31, hour=0, minute=0, second=0, tzinfo=UTC),
        datetime(year=2022, month=1, day=1, hour=0, minute=0, second=0, tzinfo=UTC),
        datetime(year=2022, month=1, day=2, hour=0, minute=0, second=0, tzinfo=UTC),
    ]

    actual = search_dates.get_dates()

    assert actual == expected


def test_returns_list_of_datetimes_str_when_start_and_end_datetimes_are_passed():
    start_datetime_input = datetime(year=2021, month=12, day=30, tzinfo=UTC)
    end_datetime_input = datetime(year=2022, month=1, day=3, tzinfo=UTC)

    search_dates = SearchDates(start_datetime=start_datetime_input, end_datetime=end_datetime_input)

    expected = [
        "2021-12-30T00:00:00",
        "2021-12-31T00:00:00",
        "2022-01-01T00:00:00",
        "2022-01-02T00:00:00",
    ]

    actual = search_dates.get_dates_string()

    assert actual == expected


def test_returns_list_with_one_start_datetime_when_only_start_datetime_is_passed():
    start_datetime_input = datetime(year=2021, month=12, day=30, tzinfo=UTC)

    search_dates = SearchDates(start_datetime=start_datetime_input, end_datetime=None)

    expected = [datetime(year=2021, month=12, day=30, hour=0, minute=0, second=0, tzinfo=UTC)]

    actual = search_dates.get_dates()

    assert actual == expected


@freeze_time(datetime(year=2021, month=1, day=1, hour=2, minute=4, second=45))
def test_returns_list_with_yesterday_midnight_datetime_when_start_and_end_datetime_not_passed():
    search_dates = SearchDates(start_datetime=None, end_datetime=None)

    expected = [datetime(year=2020, month=12, day=31, hour=0, minute=0, second=0, tzinfo=UTC)]

    actual = search_dates.get_dates()

    assert actual == expected


@freeze_time(
    datetime(year=2021, month=5, day=1, hour=3, minute=0, second=0, tzinfo=UTC).astimezone(
        gettz("Europe/London")
    )
)
def test_returns_dates_list_when_today_time_is_bst():
    search_dates = SearchDates(start_datetime=None, end_datetime=None)

    expected = [datetime(year=2021, month=4, day=30, hour=0, minute=0, second=0, tzinfo=UTC)]

    actual = search_dates.get_dates()

    assert actual == expected


def test_throws_exception_when_start_datetime_is_not_at_midnight():
    start_datetime_input = datetime(
        year=2020, month=6, day=6, hour=6, minute=6, second=6, tzinfo=UTC
    )

    with pytest.raises(ValueError) as e:
        SearchDates(start_datetime=start_datetime_input, end_datetime=None)

    assert str(e.value) == "Datetime must be at midnight"


def test_throws_exception_when_end_datetime_is_not_at_midnight():
    start_datetime_input = datetime(year=2020, month=6, day=6, hour=0, minute=0, second=0)
    end_datetime_input = datetime(year=2020, month=6, day=8, hour=6, minute=6, second=6)

    with pytest.raises(ValueError) as e:
        SearchDates(start_datetime=start_datetime_input, end_datetime=end_datetime_input)

    assert str(e.value) == "Datetime must be at midnight"


@pytest.mark.parametrize(
    "end_datetime_input, expected",
    [(datetime(year=2020, month=6, day=8), "2020-06-08T00:00:00"), (None, "None")],
)
def test_returns_end_datetime_string_given_end_datetime(end_datetime_input, expected):
    start_datetime_input = datetime(year=2020, month=6, day=6)

    search_dates = SearchDates(start_datetime=start_datetime_input, end_datetime=end_datetime_input)

    actual = search_dates.get_end_datetime_string()

    assert actual == expected


@pytest.mark.parametrize(
    "start_datetime_input, expected",
    [(datetime(year=2020, month=1, day=6), "2020-01-06T00:00:00"), (None, "None")],
)
def test_returns_start_datetime_string_given_start_datetime(start_datetime_input, expected):
    search_dates = SearchDates(start_datetime=start_datetime_input, end_datetime=None)

    actual = search_dates.get_start_datetime_string()

    assert actual == expected
