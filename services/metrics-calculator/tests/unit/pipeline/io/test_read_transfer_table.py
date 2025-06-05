from unittest.mock import Mock

import pyarrow as pa

from prmcalculator.pipeline.io import PlatformMetricsIO
from tests.builders.common import a_datetime

_METRIC_MONTH = 12
_METRIC_YEAR = 2020

_INTEGRATED_TRANSFER_DATA_DICT = {
    "conversation_id": ["123"],
    "sla_duration": [241241],
    "requesting_practice_asid": ["213125436412"],
    "requesting_supplier": ["SupplierA"],
    "status": ["INTEGRATED_ON_TIME"],
    "failure_reason": [None],
    "date_requested": [a_datetime()],
}


def test_read_transfer_table():
    transfer_table = pa.Table.from_pydict(_INTEGRATED_TRANSFER_DATA_DICT)
    s3_manager = Mock()
    s3_manager.read_parquet.return_value = transfer_table

    transfer_data_bucket = "test_transfer_data_bucket"
    s3_uri = f"s3://{transfer_data_bucket}/v4/{_METRIC_YEAR}/{_METRIC_MONTH}/transfers.parquet"

    metrics_io = PlatformMetricsIO(
        s3_data_manager=s3_manager,
        ssm_manager=Mock(),
        output_metadata={},
    )

    expected_table = transfer_table

    actual_table = metrics_io.read_transfers_as_table(s3_uris=[s3_uri])

    assert actual_table == expected_table

    s3_manager.read_parquet.assert_called_once_with(s3_uri)
