from datetime import datetime
from unittest import mock

import boto3
from moto import mock_s3

from prmcalculator.utils.io.s3 import S3DataManager, logger
from tests.unit.utils.io.s3 import MOTO_MOCK_REGION

SOME_METADATA = {"metadata_field": "metadata_value"}


@mock_s3
def test_writes_dictionary():
    conn = boto3.resource("s3", region_name=MOTO_MOCK_REGION)
    bucket = conn.create_bucket(Bucket="test_bucket")
    s3_manager = S3DataManager(conn)
    data = {"fruit": "mango"}

    expected = b'{"fruit": "mango"}'

    s3_manager.write_json(
        object_uri="s3://test_bucket/test_object.json", data=data, metadata=SOME_METADATA
    )

    actual = bucket.Object("test_object.json").get()["Body"].read()

    assert actual == expected


@mock_s3
def test_writes_dictionary_with_timestamp():
    conn = boto3.resource("s3", region_name=MOTO_MOCK_REGION)
    bucket = conn.create_bucket(Bucket="test_bucket")
    s3_manager = S3DataManager(conn)
    data = {"timestamp": datetime(2020, 7, 23)}

    expected = b'{"timestamp": "2020-07-23T00:00:00"}'

    s3_manager.write_json(
        object_uri="s3://test_bucket/test_object.json", data=data, metadata=SOME_METADATA
    )

    actual = bucket.Object("test_object.json").get()["Body"].read()

    assert actual == expected


@mock_s3
def test_writes_correct_content_type():
    conn = boto3.resource("s3", region_name=MOTO_MOCK_REGION)
    bucket_name = "test_bucket"
    bucket = conn.create_bucket(Bucket=bucket_name)
    data = {"fruit": "mango"}
    s3_manager = S3DataManager(conn)

    expected = "application/json"

    s3_manager.write_json(
        object_uri=f"s3://{bucket_name}/test_object.json", data=data, metadata=SOME_METADATA
    )

    actual = bucket.Object("test_object.json").get()["ContentType"]

    assert actual == expected


@mock_s3
def test_write_json_will_write_metadata_when_supplied():
    conn = boto3.resource("s3", region_name=MOTO_MOCK_REGION)
    bucket_name = "test_bucket"
    bucket = conn.create_bucket(Bucket=bucket_name)
    data = {"fruit": "mango"}
    s3_manager = S3DataManager(conn)

    metadata = {
        "metadata_field": "metadata_field_value",
        "second_metadata_field": "metadata_field_second_value",
    }

    s3_manager.write_json(
        object_uri=f"s3://{bucket_name}/test_object.json", data=data, metadata=metadata
    )

    expected = metadata
    actual = bucket.Object("test_object.json").get()["Metadata"]

    assert actual == expected


@mock_s3
def test_will_log_writing_file_events():
    conn = boto3.resource("s3", region_name=MOTO_MOCK_REGION)
    bucket_name = "test_bucket"
    conn.create_bucket(Bucket=bucket_name)
    data = {"fruit": "mango"}

    s3_manager = S3DataManager(conn)
    object_uri = f"s3://{bucket_name}/test_object.json"

    with mock.patch.object(logger, "info") as mock_log_info:
        s3_manager.write_json(
            object_uri=object_uri, data=data, metadata=SOME_METADATA, log_data=True
        )
        mock_log_info.assert_has_calls(
            [
                mock.call(
                    f"Attempting to upload: {object_uri}",
                    extra={"event": "ATTEMPTING_UPLOAD_JSON_TO_S3", "object_uri": object_uri},
                ),
                mock.call(
                    f"Successfully uploaded to: {object_uri}",
                    extra={
                        "event": "UPLOADED_JSON_TO_S3",
                        "object_uri": object_uri,
                        "data": "{'fruit': 'mango'}",
                    },
                ),
            ]
        )
