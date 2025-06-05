from logging import Logger, getLogger
from typing import List

from prmcalculator.domain.gp2gp.transfer import Transfer, filter_transfers_by_date_requested
from prmcalculator.domain.national.calculate_national_metrics_month import NationalMetricsMonth
from prmcalculator.domain.national.construct_national_metrics_presentation import (
    NationalMetricsPresentation,
    construct_national_metrics_presentation,
)
from prmcalculator.domain.reporting_window import ReportingWindow

module_logger = getLogger(__name__)


class NationalMetricsObservabilityProbe:
    def __init__(self, logger: Logger = module_logger):
        self._logger = logger

    def record_calculating_national_metrics(self, reporting_window: ReportingWindow):
        self._logger.info(
            "Calculating national metrics",
            extra={
                "event": "CALCULATING_NATIONAL_METRICS",
                "metric_month": reporting_window.metric_months[0],
            },
        )


def calculate_national_metrics_data(
    transfers: List[Transfer],
    reporting_window: ReportingWindow,
    observability_probe: NationalMetricsObservabilityProbe,
) -> NationalMetricsPresentation:
    observability_probe.record_calculating_national_metrics(reporting_window)
    metric_month_transfers = filter_transfers_by_date_requested(transfers, reporting_window)
    (year, month) = reporting_window.last_metric_month
    national_metrics = NationalMetricsMonth(
        transfers=metric_month_transfers,
        year=year,
        month=month,
    )
    return construct_national_metrics_presentation(
        national_metrics_months=[national_metrics],
    )
