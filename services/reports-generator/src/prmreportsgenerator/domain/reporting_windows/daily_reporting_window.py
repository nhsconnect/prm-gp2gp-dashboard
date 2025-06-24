from datetime import datetime, timedelta

from prmreportsgenerator.domain.reporting_windows.reporting_window import ReportingWindow
from prmreportsgenerator.utils.date_helpers import calculate_today_midnight_datetime


class DailyReportingWindow(ReportingWindow):
    def __init__(self, number_of_days: int, cutoff_days: int):
        self._number_of_days = number_of_days
        self._cutoff_days = cutoff_days
        self._today_midnight_datetime = calculate_today_midnight_datetime()

        super().__init__(self.start_datetime, self.end_datetime)

    @property
    def start_datetime(self) -> datetime:
        return self._today_midnight_datetime - timedelta(
            days=self._number_of_days + self._cutoff_days
        )

    @property
    def end_datetime(self) -> datetime:
        return self._today_midnight_datetime - timedelta(days=self._cutoff_days)

    @property
    def config_string(self) -> str:
        return f"{self._number_of_days}-days"
