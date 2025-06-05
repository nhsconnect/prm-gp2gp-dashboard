from unittest.mock import Mock

import pyarrow as pa

from prmreportsgenerator.io.reports_io import ReportsIO
from tests.builders.common import a_string

_DATE_ANCHOR_MONTH = 1
_DATE_ANCHOR_YEAR = 2021


def test_given_table_will_write_csv():
    s3_manager = Mock()
    reports_bucket = a_string()
    s3_key = f"v1/{_DATE_ANCHOR_YEAR}/{_DATE_ANCHOR_MONTH}/supplier_pathway_outcome_counts.csv"
    s3_uri = f"s3://{reports_bucket}/{s3_key}"

    output_metadata = {"metadata-field": "metadata_value"}

    metrics_io = ReportsIO(s3_data_manager=s3_manager)
    data = {"Fruit": ["Banana"]}
    table = pa.table(data)

    metrics_io.write_table(table=table, s3_uri=s3_uri, output_metadata=output_metadata)

    expected_table = table

    s3_manager.write_table_to_csv.assert_called_once_with(
        object_uri=s3_uri, table=expected_table, metadata=output_metadata
    )
