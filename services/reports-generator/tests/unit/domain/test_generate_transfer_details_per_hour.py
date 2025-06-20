import pyarrow as pa
from dateutil.tz import UTC

from prmreportsgenerator.domain.reports_generator.transfer_details_per_hour import (
    TransferDetailsPerHourReportsGenerator,
)
from prmreportsgenerator.domain.transfer import TransferStatus
from tests.builders.common import a_datetime
from tests.builders.pa_table import PaTableBuilder


def test_total_transfers_shown_per_hour():
    input_data = (
        PaTableBuilder()
        .with_row(
            date_requested=a_datetime(year=2021, month=1, day=1, hour=12, minute=10).astimezone(
                UTC
            ),
            status=TransferStatus.TECHNICAL_FAILURE.value,
        )
        .with_row(
            date_requested=a_datetime(year=2021, month=1, day=1, hour=12, minute=20).astimezone(
                UTC
            ),
            status=TransferStatus.TECHNICAL_FAILURE.value,
        )
        .with_row(
            date_requested=a_datetime(year=2021, month=1, day=2, hour=15, minute=10).astimezone(
                UTC
            ),
            status=TransferStatus.UNCLASSIFIED_FAILURE.value,
        )
        .with_row(
            date_requested=a_datetime(year=2021, month=1, day=1, hour=14, minute=10).astimezone(
                UTC
            ),
            status=TransferStatus.UNCLASSIFIED_FAILURE.value,
        )
        .with_row(
            date_requested=a_datetime(year=2021, month=1, day=1, hour=14, minute=10).astimezone(
                UTC
            ),
            status=TransferStatus.PROCESS_FAILURE.value,
        )
        .with_row(
            date_requested=a_datetime(year=2021, month=1, day=2, hour=15, minute=45).astimezone(
                UTC
            ),
            status=TransferStatus.UNCLASSIFIED_FAILURE.value,
        )
        .with_row(
            date_requested=a_datetime(year=2021, month=1, day=2, hour=14, minute=30).astimezone(
                UTC
            ),
            status=TransferStatus.TECHNICAL_FAILURE.value,
        )
        .with_row(
            date_requested=a_datetime(year=2021, month=1, day=2, hour=14, minute=30).astimezone(
                UTC
            ),
            status=TransferStatus.INTEGRATED_ON_TIME.value,
        )
        .build()
    )

    expected_output = pa.table(
        {
            "Date/Time": [
                "2021-01-01 12:00",
                "2021-01-01 14:00",
                "2021-01-02 14:00",
                "2021-01-02 15:00",
            ],
            "Total number of transfers": [2, 2, 2, 2],
            "Total technical failures": [2, 0, 1, 0],
            "Total unclassified failures": [0, 1, 0, 2],
        }
    )

    report_generator = TransferDetailsPerHourReportsGenerator(input_data)
    result = report_generator.generate()

    assert result == expected_output
