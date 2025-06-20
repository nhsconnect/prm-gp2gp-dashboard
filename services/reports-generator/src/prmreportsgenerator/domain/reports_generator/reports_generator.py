from abc import ABC, abstractmethod
from functools import reduce
from typing import List, Optional

from prmreportsgenerator.domain.reports_generator.error_code_mapping import error_code_mapping


class ReportsGenerator(ABC):
    def __init__(self):
        pass

    def _error_description(self, error_code: int) -> str:
        try:
            return error_code_mapping[error_code]
        except KeyError:
            return "Unknown error code"

    def _unique_errors(self, errors: List[Optional[int]]) -> str:
        unique_error_codes = {error_code for error_code in errors if error_code is not None}
        return ", ".join(
            [f"{e} - {self._error_description(e)}" for e in sorted(unique_error_codes)]
        )

    def _process(self, data, *function_chain):
        return reduce(lambda d, func: func(d), list(function_chain), data)

    @abstractmethod
    def generate(self):
        pass
