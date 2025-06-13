from datetime import datetime

import pytest
from dateutil.tz import UTC
from freezegun import freeze_time

from prmreportsgenerator.domain.reporting_windows.custom_reporting_window import (
    CustomReportingWindow,
)
from prmreportsgenerator.domain.reporting_windows.daily_reporting_window import DailyReportingWindow
from prmreportsgenerator.domain.reporting_windows.monthly_reporting_window import (
    MonthlyReportingWindow,
)
from prmreportsgenerator.reports_pipeline import ReportsPipeline
from tests.builders.common import a_datetime
from tests.builders.pipeline_config import create_pipeline_config


def test_generates_custom_reporting_window_given_start_datetime_and_end_datetime():
    a_start_datetime = datetime(year=2021, month=12, day=30, tzinfo=UTC)
    a_end_datetime = datetime(year=2022, month=1, day=3, tzinfo=UTC)

    reporting_window = ReportsPipeline.create_reporting_window(
        create_pipeline_config(start_datetime=a_start_datetime, end_datetime=a_end_datetime)
    )

    assert isinstance(reporting_window, CustomReportingWindow)
    assert len(reporting_window.get_dates()) == 4


def test_generates_daily_reporting_window_given_number_of_days_and_cutoff_days_as_0():
    reporting_window = ReportsPipeline.create_reporting_window(
        create_pipeline_config(number_of_days=2, cutoff_days=0)
    )

    assert isinstance(reporting_window, DailyReportingWindow)
    assert len(reporting_window.get_dates()) == 2


def test_generates_daily_reporting_window_given_number_of_days_and_cutoff_days():
    reporting_window = ReportsPipeline.create_reporting_window(
        create_pipeline_config(number_of_days=2, cutoff_days=1)
    )

    assert isinstance(reporting_window, DailyReportingWindow)
    assert len(reporting_window.get_dates()) == 2


@freeze_time(a_datetime(year=2021, month=1, day=2))
def test_generates_monthly_reporting_window_given_number_of_months():
    reporting_window = ReportsPipeline.create_reporting_window(
        create_pipeline_config(number_of_months=1)
    )

    assert isinstance(reporting_window, MonthlyReportingWindow)
    assert len(reporting_window.get_dates()) == 31


def test_throws_if_missing_end_date_but_start_date_provided():
    start_datetime = a_datetime()
    end_datetime = None
    with pytest.raises(ValueError) as e:
        ReportsPipeline.create_reporting_window(
            create_pipeline_config(start_datetime=start_datetime, end_datetime=end_datetime)
        )
    assert str(e.value) == "End datetime must be provided if start datetime is provided"


def test_throws_if_missing_valid_inputs():
    with pytest.raises(ValueError) as e:
        ReportsPipeline.create_reporting_window(create_pipeline_config())
    assert str(e.value) == "Missing required config to generate reports. Please see README."
