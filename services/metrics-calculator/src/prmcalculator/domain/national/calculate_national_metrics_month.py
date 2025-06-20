from collections import Counter
from typing import Iterable

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


class NationalMetricsMonth:
    def __init__(self, transfers: Iterable[Transfer], year: int, month: int):
        self.year = year
        self.month = month
        self._counts_by_outcome: Counter[TransferOutcome] = Counter()
        self._counts_by_status: Counter[TransferStatus] = Counter()
        self.total = 0

        for transfer in transfers:
            self._counts_by_outcome.update([transfer.outcome])
            self._counts_by_status.update([transfer.outcome.status])
            self.total += 1

    def integrated_on_time_total(self) -> int:
        return self._counts_by_status[TransferStatus.INTEGRATED_ON_TIME]

    def process_failure_total(self) -> int:
        return self._counts_by_status[TransferStatus.PROCESS_FAILURE]

    def technical_failure_total(self) -> int:
        return self._counts_by_status[TransferStatus.TECHNICAL_FAILURE]

    def unclassified_failure_total(self) -> int:
        return self._counts_by_status[TransferStatus.UNCLASSIFIED_FAILURE]

    def process_failure_not_integrated(self) -> int:
        return self._counts_by_outcome[_NOT_INTEGRATED]

    def process_failure_integrated_late(self) -> int:
        return self._counts_by_outcome[_INTEGRATED_LATE]
