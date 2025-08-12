import datetime

import pytest

from prmcalculator.domain.gp2gp.sla import (
    EIGHT_DAYS_IN_SECONDS,
    THREE_DAYS_IN_SECONDS,
    SlaBand,
    assign_to_sla_band,
)


@pytest.mark.parametrize(
    "sla_duration, expected",
    [
        (datetime.timedelta(seconds=THREE_DAYS_IN_SECONDS - 1), SlaBand.WITHIN_3_DAYS),
        (datetime.timedelta(seconds=EIGHT_DAYS_IN_SECONDS), SlaBand.WITHIN_8_DAYS),
        (datetime.timedelta(seconds=EIGHT_DAYS_IN_SECONDS + 1), SlaBand.BEYOND_8_DAYS),
    ],
)
def test_return_sla_band_given_sla_duration(sla_duration, expected):
    assert assign_to_sla_band(sla_duration=sla_duration) == expected
