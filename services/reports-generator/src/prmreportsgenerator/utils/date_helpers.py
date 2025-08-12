from datetime import datetime, time, timedelta
from typing import List, Optional

from dateutil.tz import UTC


def convert_date_range_to_dates(start_datetime: datetime, end_datetime: datetime) -> List[datetime]:
    if start_datetime > end_datetime:
        raise ValueError("Start datetime must be before end datetime")

    delta = end_datetime - start_datetime
    return [start_datetime + timedelta(days=days) for days in range(delta.days)]


def calculate_today_midnight_datetime() -> datetime:
    today = datetime.now(UTC).date()
    today_midnight_utc = datetime.combine(today, time.min, tzinfo=UTC)
    return today_midnight_utc


def convert_to_datetime_string(a_datetime: Optional[datetime]) -> str:
    return a_datetime.isoformat() if a_datetime else "None"
