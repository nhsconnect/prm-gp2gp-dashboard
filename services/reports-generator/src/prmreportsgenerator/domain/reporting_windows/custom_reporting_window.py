from datetime import datetime, time

from prmreportsgenerator.domain.reporting_windows.reporting_window import ReportingWindow


class CustomReportingWindow(ReportingWindow):
    def __init__(self, start_datetime: datetime, end_datetime: datetime):
        self._validate_datetime_is_at_midnight(start_datetime)
        self._validate_datetime_is_at_midnight(end_datetime)
        super().__init__(start_datetime, end_datetime)

    @staticmethod
    def _validate_datetime_is_at_midnight(a_datetime: datetime):
        midnight = time(hour=0, minute=0, second=0)
        if a_datetime.time() != midnight:
            raise ValueError("Datetime must be at midnight")

    @property
    def config_string(self) -> str:
        return "custom"
