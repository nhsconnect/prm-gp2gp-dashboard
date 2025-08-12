from unittest import mock

import boto3
from moto import mock_s3

from prmods.utils.io.s3 import S3DataManager, logger
from tests.builders.file import build_gzip_csv
from tests.unit.utils.io.s3 import MOTO_MOCK_REGION


@mock_s3
def test_returns_csv_row_as_dictionary():
    conn = boto3.resource("s3", region_name=MOTO_MOCK_REGION)
    bucket = conn.create_bucket(Bucket="test_bucket")
    s3_object = bucket.Object("test_object.csv.gz")
    s3_object.put(
        Body=build_gzip_csv(
            header=["header1", "header2"],
            rows=[["row1-col1", "row1-col2"], ["row2-col1", "row2-col2"]],
        )
    )

    s3_manager = S3DataManager(conn)

    expected = [
        {"header1": "row1-col1", "header2": "row1-col2"},
        {"header1": "row2-col1", "header2": "row2-col2"},
    ]

    actual = s3_manager.read_gzip_csv("s3://test_bucket/test_object.csv.gz")

    assert list(actual) == expected


@mock_s3
def test_will_log_reading_file_event():
    conn = boto3.resource("s3", region_name=MOTO_MOCK_REGION)
    bucket_name = "test_bucket"
    bucket = conn.create_bucket(Bucket=bucket_name)
    s3_object = bucket.Object("test_object.csv.gz")
    s3_object.put(
        Body=build_gzip_csv(
            header=["header1", "header2"],
            rows=[["row1-col1", "row1-col2"], ["row2-col1", "row2-col2"]],
        )
    )

    s3_manager = S3DataManager(conn)
    object_uri = f"s3://{bucket_name}/test_object.csv.gz"

    with mock.patch.object(logger, "info") as mock_log_info:
        gzip_csv = s3_manager.read_gzip_csv(object_uri)
        list(gzip_csv)
        mock_log_info.assert_called_once_with(
            f"Reading file from: {object_uri}",
            extra={"event": "READING_FILE_FROM_S3", "object_uri": object_uri},
        )
