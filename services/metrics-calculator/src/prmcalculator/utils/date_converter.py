from datetime import datetime, timedelta
from typing import List

from dateutil.tz import UTC


def convert_date_range_to_dates(start_datetime: datetime, end_datetime: datetime) -> List[datetime]:
    if start_datetime > end_datetime:
        raise ValueError("Start datetime must be before end datetime")

    delta = end_datetime - start_datetime
    return [start_datetime + timedelta(days=days) for days in range(delta.days)]


def get_first_day_of_month_datetime(a_datetime: datetime) -> datetime:
    return datetime(year=a_datetime.year, month=a_datetime.month, day=1, tzinfo=UTC)
