from collections import Counter
from typing import Iterable, Optional

from prmcalculator.domain.gp2gp.sla import SlaCounter
from prmcalculator.domain.gp2gp.transfer import (
    Transfer,
    TransferFailureReason,
    TransferOutcome,
    TransferStatus,
)

_NOT_INTEGRATED = TransferOutcome(
    TransferStatus.PROCESS_FAILURE, TransferFailureReason.TRANSFERRED_NOT_INTEGRATED
)

_INTEGRATED_LATE = TransferOutcome(
    TransferStatus.PROCESS_FAILURE, TransferFailureReason.INTEGRATED_LATE
)


class TransferMetrics:
    def __init__(self, transfers: Iterable[Transfer]):
        self._counts_by_outcome: Counter[TransferOutcome] = Counter()
        self._counts_by_status: Counter[TransferStatus] = Counter()
        self._sla_counter: SlaCounter = SlaCounter()
        self._transfers_requested_count = 0

        for transfer in transfers:
            self._counts_by_outcome.update([transfer.outcome])
            self._counts_by_status.update([transfer.outcome.status])
            self._transfers_requested_count += 1
            if transfer.outcome.status == TransferStatus.INTEGRATED_ON_TIME:
                self._sla_counter.increment(transfer.sla_duration)

    def integrated_total(self) -> int:
        return (
            self._counts_by_outcome[_INTEGRATED_LATE]
            + self._counts_by_status[TransferStatus.INTEGRATED_ON_TIME]
        )

    def integrated_within_3_days(self) -> int:
        return self._sla_counter.within_3_days

    def integrated_within_3_days_percent_of_received(self) -> Optional[float]:
        return self._calculate_percentage(
            self.integrated_within_3_days(), self.received_by_practice_total()
        )

    def integrated_within_8_days(self) -> int:
        return self._sla_counter.within_8_days

    def integrated_within_8_days_percent_of_received(self) -> Optional[float]:
        return self._calculate_percentage(
            self.integrated_within_8_days(), self.received_by_practice_total()
        )

    def integrated_beyond_8_days(self) -> int:
        return self._counts_by_outcome[_INTEGRATED_LATE]

    def process_failure_not_integrated(self) -> int:
        return self._counts_by_outcome[_NOT_INTEGRATED]

    def not_integrated_within_8_days_total(self) -> int:
        return self.integrated_beyond_8_days() + self.process_failure_not_integrated()

    def not_integrated_within_8_days_percent_of_received(self) -> Optional[float]:
        return self._calculate_percentage(
            self.not_integrated_within_8_days_total(), self.received_by_practice_total()
        )

    def received_by_practice_total(self) -> int:
        return self.integrated_total() + self.process_failure_not_integrated()

    def requested_by_practice_total(self) -> int:
        return self._transfers_requested_count

    def received_by_practice_percent_of_requested(self) -> Optional[float]:
        return self._calculate_percentage(
            self.received_by_practice_total(), self.requested_by_practice_total()
        )

    def technical_failures_total(self) -> int:
        return self._counts_by_status[TransferStatus.TECHNICAL_FAILURE]

    def unclassified_failure_total(self) -> int:
        return self._counts_by_status[TransferStatus.UNCLASSIFIED_FAILURE]

    def failures_total_count(self) -> int:
        return self.technical_failures_total() + self.unclassified_failure_total()

    def failures_percent_of_requested(self) -> Optional[float]:
        return self._calculate_percentage(
            self.failures_total_count(), self.requested_by_practice_total()
        )

    @staticmethod
    def _calculate_percentage(portion: int, total: int) -> Optional[float]:
        return None if total == 0 else round((portion / total) * 100, 1)
