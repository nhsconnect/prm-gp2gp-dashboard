from unittest import mock

import boto3
import pyarrow as pa
import pytest
from moto import mock_s3
from pyarrow.parquet import write_table

from prmcalculator.utils.io.s3 import S3DataManager, logger
from tests.unit.utils.io.s3 import MOTO_MOCK_REGION


@mock_s3
def test_read_parquet_returns_table():
    conn = boto3.resource("s3", region_name=MOTO_MOCK_REGION)
    bucket_name = "test_bucket"
    bucket = conn.create_bucket(Bucket=bucket_name)
    s3_object = bucket.Object("fruits.parquet")

    data = {"fruit": ["mango", "lemon"]}
    fruit_table = pa.table(data)
    writer = pa.BufferOutputStream()
    write_table(fruit_table, writer)
    body = bytes(writer.getvalue())
    s3_object.put(Body=body)

    s3_manager = S3DataManager(conn)
    actual_data = s3_manager.read_parquet(f"s3://{bucket_name}/fruits.parquet")

    expected_data = fruit_table

    assert actual_data == expected_data


@mock_s3
def test_will_log_reading_file_event():
    conn = boto3.resource("s3", region_name=MOTO_MOCK_REGION)
    bucket_name = "test_bucket"
    bucket = conn.create_bucket(Bucket=bucket_name)
    s3_object = bucket.Object("fruits.parquet")

    data = {"fruit": ["mango", "lemon"]}
    fruit_table = pa.table(data)
    writer = pa.BufferOutputStream()
    write_table(fruit_table, writer)
    body = bytes(writer.getvalue())
    s3_object.put(Body=body)

    s3_manager = S3DataManager(conn)
    object_uri = f"s3://{bucket_name}/fruits.parquet"

    with mock.patch.object(logger, "info") as mock_log_info:
        s3_manager.read_parquet(object_uri)
        mock_log_info.assert_called_once_with(
            f"Reading file from: {object_uri}",
            extra={"event": "READING_FILE_FROM_S3", "object_uri": object_uri},
        )


@mock_s3
def test_read_parquet_logs_error_when_s3_parquet_file_not_found(capsys):
    conn = boto3.resource("s3", region_name=MOTO_MOCK_REGION)
    bucket_name = "test_bucket"
    conn.create_bucket(Bucket=bucket_name)

    s3_manager = S3DataManager(conn)
    object_uri = f"s3://{bucket_name}/fruits.parquet"

    with pytest.raises(FileNotFoundError) as e:
        with mock.patch.object(logger, "error") as mock_log_error:
            s3_manager.read_parquet(object_uri)

    mock_log_error.assert_called_once_with(
        f"File not found: {object_uri}, exiting...",
        extra={"event": "FILE_NOT_FOUND_IN_S3"},
    )

    assert str(e.value) == object_uri


@mock_s3
def test_read_json_logs_error_when_s3_json_file_not_found():
    conn = boto3.resource("s3", region_name=MOTO_MOCK_REGION)
    bucket_name = "test_bucket"
    conn.create_bucket(Bucket=bucket_name)

    s3_manager = S3DataManager(conn)
    object_uri = f"s3://{bucket_name}/fruits.parquet"

    with pytest.raises(FileNotFoundError) as e:
        with mock.patch.object(logger, "error") as mock_log_error:
            s3_manager.read_json(object_uri)

    mock_log_error.assert_called_with(
        f"File not found: {object_uri}, exiting...",
        extra={"event": "FILE_NOT_FOUND_IN_S3"},
    )

    assert str(e.value) == object_uri
