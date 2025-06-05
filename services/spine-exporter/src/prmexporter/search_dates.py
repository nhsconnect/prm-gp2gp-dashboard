from datetime import datetime, time, timedelta
from typing import List, Optional

from dateutil.tz import UTC

from prmexporter.date_converter import convert_date_range_to_dates, convert_to_datetime_string


class SearchDates:
    def __init__(self, start_datetime: Optional[datetime], end_datetime: Optional[datetime]):
        self._validate_datetimes(start_datetime, end_datetime)
        self._end_datetime = end_datetime
        self._start_datetime = start_datetime
        self._dates = self._calculate_search_dates(start_datetime, end_datetime)

    def _calculate_search_dates(
        self, start_datetime: Optional[datetime], end_datetime: Optional[datetime]
    ) -> List[datetime]:
        if start_datetime and end_datetime:
            return convert_date_range_to_dates(start_datetime, end_datetime)
        if start_datetime:
            return [start_datetime]
        else:
            return [self._calculate_yesterday_midnight_datetime()]

    def _validate_datetimes(
        self, start_datetime: Optional[datetime], end_datetime: Optional[datetime]
    ):
        if start_datetime is None and end_datetime:
            raise ValueError("Start datetime must be provided if end datetime is provided")

        self._validate_datetime_is_at_midnight(start_datetime)
        self._validate_datetime_is_at_midnight(end_datetime)

    @staticmethod
    def _validate_datetime_is_at_midnight(a_datetime: Optional[datetime]):
        midnight = time(hour=0, minute=0, second=0)
        if a_datetime and a_datetime.time() != midnight:
            raise ValueError("Datetime must be at midnight")

    @staticmethod
    def _calculate_yesterday_midnight_datetime() -> datetime:
        today_utc = datetime.now(UTC).date()
        today_midnight_datetime = datetime.combine(today_utc, time.min, tzinfo=UTC)
        return today_midnight_datetime - timedelta(days=1)

    def get_dates(self) -> List[datetime]:
        return self._dates

    def get_dates_string(self) -> List[str]:
        return [convert_to_datetime_string(a_datetime) for a_datetime in self._dates]

    def get_end_datetime_string(self) -> str:
        return convert_to_datetime_string(self._end_datetime) if self._end_datetime else "None"

    def get_start_datetime_string(self) -> str:
        return convert_to_datetime_string(self._start_datetime) if self._start_datetime else "None"
