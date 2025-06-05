from dataclasses import dataclass
from typing import List, Optional

from prmcalculator.domain.practice.practice_transfer_metrics import PracticeTransferMetrics
from prmcalculator.domain.practice.transfer_metrics import TransferMetrics
from prmcalculator.domain.reporting_window import ReportingWindow


@dataclass
class RequestedTransferMetrics:
    requested_count: int
    received_count: int
    received_percent_of_requested: Optional[float]
    integrated_within_3_days_count: int
    integrated_within_3_days_percent_of_received: Optional[float]
    integrated_within_8_days_count: int
    integrated_within_8_days_percent_of_received: Optional[float]
    not_integrated_within_8_days_total: int
    not_integrated_within_8_days_percent_of_received: Optional[float]
    failures_total_count: int
    failures_total_percent_of_requested: Optional[float]


@dataclass
class MonthlyMetricsPresentation:
    year: int
    month: int
    requested_transfers: RequestedTransferMetrics


@dataclass
class PracticeSummary:
    name: str
    ods_code: Optional[str]
    sicbl_ods_code: Optional[str]
    sicbl_name: Optional[str]
    metrics: List[MonthlyMetricsPresentation]


# flake8: noqa: E501
def _construct_monthly_metrics_presentation(
    transfer_month_metrics: TransferMetrics, year: int, month: int
) -> MonthlyMetricsPresentation:
    return MonthlyMetricsPresentation(
        year=year,
        month=month,
        requested_transfers=RequestedTransferMetrics(
            requested_count=transfer_month_metrics.requested_by_practice_total(),
            received_count=transfer_month_metrics.received_by_practice_total(),
            received_percent_of_requested=transfer_month_metrics.received_by_practice_percent_of_requested(),
            integrated_within_3_days_count=transfer_month_metrics.integrated_within_3_days(),
            integrated_within_3_days_percent_of_received=transfer_month_metrics.integrated_within_3_days_percent_of_received(),
            integrated_within_8_days_count=transfer_month_metrics.integrated_within_8_days(),
            integrated_within_8_days_percent_of_received=transfer_month_metrics.integrated_within_8_days_percent_of_received(),
            not_integrated_within_8_days_total=transfer_month_metrics.not_integrated_within_8_days_total(),
            not_integrated_within_8_days_percent_of_received=transfer_month_metrics.not_integrated_within_8_days_percent_of_received(),
            failures_total_count=transfer_month_metrics.failures_total_count(),
            failures_total_percent_of_requested=transfer_month_metrics.failures_percent_of_requested(),
        ),
    )


def construct_practice_summary(
    practice_metrics: PracticeTransferMetrics,
    reporting_window: ReportingWindow,
) -> PracticeSummary:
    return PracticeSummary(
        name=practice_metrics.name,
        ods_code=practice_metrics.ods_code,
        sicbl_ods_code=practice_metrics.sicbl_ods_code,
        sicbl_name=practice_metrics.sicbl_name,
        metrics=[
            _construct_monthly_metrics_presentation(
                transfer_month_metrics=practice_metrics.monthly_metrics(year=year, month=month),
                year=year,
                month=month,
            )
            for (year, month) in reporting_window.metric_months
        ],
    )
