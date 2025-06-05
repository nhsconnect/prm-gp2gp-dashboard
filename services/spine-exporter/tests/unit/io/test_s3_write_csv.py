from unittest import mock
from unittest.mock import call

import boto3
import pytest
from moto import mock_s3

from prmexporter.io.s3 import S3DataManager, logger
from tests.builders.file import build_csv_bytes, open_gzip

MOTO_MOCK_REGION = "us-east-1"
SOME_METADATA = {"metadata_field": "metadata_value"}


@mock_s3
def test_writes_csv_to_s3():
    conn = boto3.resource("s3", region_name=MOTO_MOCK_REGION)
    bucket_name = "test_bucket"
    s3_key = "v2/fruits.csv.gz"
    bucket = conn.create_bucket(Bucket=bucket_name)
    s3_manager = S3DataManager(client=conn, bucket_name=bucket_name)

    csv_data = build_csv_bytes(
        header=["header1", "header2"],
        rows=[["row1-col1", "row1-col2"], ["row2-col1", "row2-col2"]],
    )

    expected = "header1,header2\nrow1-col1,row1-col2\nrow2-col1,row2-col2"

    s3_manager.write_gzip_csv(data=csv_data, s3_key=s3_key, metadata=SOME_METADATA)

    body = bucket.Object(s3_key).get()["Body"]
    actual = open_gzip(body)

    assert actual == expected


@mock_s3
def test_writes_metadata():
    conn = boto3.resource("s3", region_name=MOTO_MOCK_REGION)
    bucket_name = "test_bucket"
    s3_key = "fruits.csv.gz"
    bucket = conn.create_bucket(Bucket=bucket_name)
    data = build_csv_bytes(["abc"], ["def"])
    s3_manager = S3DataManager(client=conn, bucket_name=bucket_name)

    metadata = {
        "metadata_field": "metadata_field_value",
        "second_metadata_field": "metadata_field_second_value",
    }

    s3_manager.write_gzip_csv(data=data, s3_key=s3_key, metadata=metadata)

    actual_metadata = bucket.Object(s3_key).get()["Metadata"]

    assert actual_metadata == metadata


@mock_s3
def test_exits_if_there_is_no_data():
    conn = boto3.resource("s3", region_name=MOTO_MOCK_REGION)
    bucket_name = "test_bucket"
    s3_key = "fruits.csv.gz"
    conn.create_bucket(Bucket=bucket_name)
    s3_manager = S3DataManager(client=conn, bucket_name=bucket_name)

    with pytest.raises(ValueError) as e:
        with mock.patch.object(logger, "error") as logger_spy:
            s3_manager.write_gzip_csv(data=b"", s3_key=s3_key, metadata={})

    logger_spy.assert_called_with(
        "Spine extract is empty",
        extra={"event": "ERROR_EMPTY_SPINE_EXTRACT", "size_in_bytes": 0},
    )

    assert str(e.value) == "Spine extract is empty"


@mock_s3
def test_logs_events():
    conn = boto3.resource("s3", region_name=MOTO_MOCK_REGION)
    bucket_name = "test_bucket"
    s3_key = "fruits.csv.gz"
    conn.create_bucket(Bucket=bucket_name)
    data = build_csv_bytes(["abc"], ["def"])
    s3_manager = S3DataManager(client=conn, bucket_name=bucket_name)

    with mock.patch.object(logger, "info") as logger_spy:
        s3_manager.write_gzip_csv(data=data, s3_key=s3_key, metadata={})

    logger_spy.assert_has_calls(
        [
            call(
                "Attempting to upload to S3",
                extra={
                    "event": "ATTEMPTING_UPLOAD_CSV_TO_S3",
                    "object_uri": "s3://test_bucket/fruits.csv.gz",
                },
            ),
            call(
                "Successfully uploaded to S3",
                extra={
                    "event": "UPLOADED_CSV_TO_S3",
                    "object_uri": "s3://test_bucket/fruits.csv.gz",
                },
            ),
            call(
                "Spine extract gzip csv byte size",
                extra={"event": "SPINE_EXTRACT_SIZE_BYTES", "size_in_bytes": 29},
            ),
            call(
                "Spine extract row count",
                extra={"event": "SPINE_EXTRACT_ROW_COUNT", "row_count": 2},
            ),
        ]
    )
