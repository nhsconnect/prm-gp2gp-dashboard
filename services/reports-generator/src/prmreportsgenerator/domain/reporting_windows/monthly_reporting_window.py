from datetime import datetime

from dateutil.relativedelta import relativedelta
from dateutil.tz import UTC

from prmreportsgenerator.domain.reporting_windows.reporting_window import ReportingWindow
from prmreportsgenerator.utils.date_helpers import calculate_today_midnight_datetime


class MonthlyReportingWindow(ReportingWindow):
    def __init__(self, number_of_months: int):
        self._number_of_months = number_of_months

        self._current_month_start_datetime = self.get_current_month_start_datetime()

        super().__init__(self.start_datetime, self.end_datetime)

    @staticmethod
    def get_current_month_start_datetime() -> datetime:
        today_datetime = calculate_today_midnight_datetime()
        return datetime(today_datetime.year, today_datetime.month, 1, tzinfo=UTC)

    @property
    def start_datetime(self) -> datetime:
        return self._current_month_start_datetime - relativedelta(months=self._number_of_months)

    @property
    def end_datetime(self) -> datetime:
        return self._current_month_start_datetime

    @property
    def config_string(self) -> str:
        return f"{self._number_of_months}-months"
