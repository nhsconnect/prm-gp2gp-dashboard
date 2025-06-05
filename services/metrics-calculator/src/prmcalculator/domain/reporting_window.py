from datetime import datetime
from typing import List, Tuple

from dateutil.relativedelta import relativedelta

from prmcalculator.utils.date_converter import (
    convert_date_range_to_dates,
    get_first_day_of_month_datetime,
)

YearNumber = int
MonthNumber = int
YearMonth = Tuple[YearNumber, MonthNumber]


class ReportingWindow:
    def __init__(
        self,
        date_anchor_month_start: datetime,
        dates: List[datetime],
        metric_months_datetimes: List[datetime],
    ):
        self._date_anchor_month_start = date_anchor_month_start
        self._dates = dates
        self._metric_months_datetimes = metric_months_datetimes
        self._latest_metric_month = metric_months_datetimes[0]

    @classmethod
    def prior_to(cls, date_anchor: datetime, number_of_months: int):
        date_anchor_month_start = get_first_day_of_month_datetime(date_anchor)
        first_metric_month_start = date_anchor_month_start - relativedelta(months=number_of_months)

        metric_months_datetimes = [
            date_anchor_month_start - relativedelta(months=number + 1)
            for number in range(number_of_months)
        ]

        dates = convert_date_range_to_dates(
            start_datetime=first_metric_month_start, end_datetime=date_anchor_month_start
        )

        return cls(date_anchor_month_start, dates, metric_months_datetimes)

    @property
    def last_metric_month(self) -> YearMonth:
        month = self._latest_metric_month
        return month.year, month.month

    @property
    def metric_months(self) -> List[YearMonth]:
        return [
            (metric_month.year, metric_month.month)
            for metric_month in self._metric_months_datetimes
        ]

    @property
    def dates(self) -> List[datetime]:
        return self._dates

    @property
    def date_anchor_month(self) -> YearMonth:
        month = self._date_anchor_month_start
        return month.year, month.month

    def last_month_contains(self, time: datetime) -> bool:
        return self._latest_metric_month <= time < self._date_anchor_month_start
