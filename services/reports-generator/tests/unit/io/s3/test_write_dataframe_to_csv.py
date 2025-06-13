from unittest import mock

import boto3
import pyarrow as pa
from moto import mock_s3

from prmreportsgenerator.io.s3 import S3DataManager, logger
from tests.unit.io.s3 import MOTO_MOCK_REGION

SOME_METADATA = {"metadata_field": "metadata_value"}


@mock_s3
def test_writes_csv():
    conn = boto3.resource("s3", region_name=MOTO_MOCK_REGION)
    bucket = conn.create_bucket(Bucket="test_bucket")
    s3_manager = S3DataManager(conn)
    data = {"Fruit": ["Banana", "Strawberry"], "Colour": ["yellow", "red"], "Quantity": [2, 3]}
    table = pa.table(data)

    expected = b'"Fruit","Colour","Quantity"\n"Banana","yellow",2\n"Strawberry","red",3\n'

    s3_manager.write_table_to_csv(
        object_uri="s3://test_bucket/test_object.csv", table=table, metadata=SOME_METADATA
    )

    actual = bucket.Object("test_object.csv").get()["Body"].read()

    assert actual == expected


@mock_s3
def test_writes_correct_content_type():
    conn = boto3.resource("s3", region_name=MOTO_MOCK_REGION)
    bucket = conn.create_bucket(Bucket="test_bucket")
    s3_manager = S3DataManager(conn)
    data = {"Fruit": ["Banana"]}
    table = pa.table(data)

    expected = "text/csv"

    s3_manager.write_table_to_csv(
        object_uri="s3://test_bucket/test_object.csv", table=table, metadata=SOME_METADATA
    )

    actual = bucket.Object("test_object.csv").get()["ContentType"]

    assert actual == expected


@mock_s3
def test_writes_metadata_when_supplied():
    conn = boto3.resource("s3", region_name=MOTO_MOCK_REGION)
    bucket = conn.create_bucket(Bucket="test_bucket")
    s3_manager = S3DataManager(conn)
    data = {"Fruit": ["Banana"]}
    table = pa.table(data)

    metadata = {
        "metadata_field": "metadata_field_value",
        "second_metadata_field": "metadata_field_second_value",
    }

    s3_manager.write_table_to_csv(
        object_uri="s3://test_bucket/test_object.csv", table=table, metadata=metadata
    )

    expected = metadata
    actual = bucket.Object("test_object.csv").get()["Metadata"]

    assert actual == expected


@mock_s3
def test_logs_writing_file_events():
    conn = boto3.resource("s3", region_name=MOTO_MOCK_REGION)
    conn.create_bucket(Bucket="test_bucket")
    data = {"Fruit": ["Banana"]}
    table = pa.table(data)

    s3_manager = S3DataManager(conn)
    object_uri = "s3://test_bucket/test_object.csv"

    with mock.patch.object(logger, "info") as mock_log_info:
        s3_manager.write_table_to_csv(object_uri=object_uri, table=table, metadata=SOME_METADATA)
        mock_log_info.assert_has_calls(
            [
                mock.call(
                    f"Attempting to upload: {object_uri}",
                    extra={"event": "ATTEMPTING_UPLOAD_CSV_TO_S3", "object_uri": object_uri},
                ),
                mock.call(
                    f"Successfully uploaded to: {object_uri}",
                    extra={"event": "SUCCESSFULLY_UPLOADED_CSV_TO_S3", "object_uri": object_uri},
                ),
            ]
        )
