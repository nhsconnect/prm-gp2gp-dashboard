import logging
import sys
from datetime import datetime
from os import environ
from threading import Thread
from unittest import mock
from unittest.mock import ANY, call, patch

import boto3
from botocore.config import Config
from freezegun import freeze_time
from moto.server import DomainDispatcherApplication, create_backend_app
from werkzeug import Request, Response
from werkzeug.serving import make_server

from prmexporter.main import logger, main
from prmexporter.spine_exporter import VERSION
from tests.builders.file import open_gzip

FAKE_SPLUNK_HOST = "127.0.0.1"
FAKE_SPLUNK_PORT = 9000
FAKE_SPLUNK_URL = f"http://{FAKE_SPLUNK_HOST}:{FAKE_SPLUNK_PORT}"

FAKE_AWS_HOST = "127.0.0.1"
FAKE_AWS_PORT = 8887
FAKE_AWS_URL = f"http://{FAKE_AWS_HOST}:{FAKE_AWS_PORT}"
FAKE_S3_ACCESS_KEY = "testing"
FAKE_S3_SECRET_KEY = "testing"
FAKE_S3_REGION = "us-west-1"

OUTPUT_BUCKET_NAME = "prm-gp2gp-spine-data"
API_TOKEN_PARAM_NAME = "test/splunk/api-token"

# flake8: noqa: E501
SPINE_DATA_DAY_1 = b"""_time,conversationID,GUID,interactionID,messageSender,messageRecipient,messageRef,jdiEvent,toSystem,fromSystem
    2021-02-06 08:41:48.337 UTC,abc,bcd,IN010000UK13,987654321240,003456789123,bcd,NONE,SupplierC,SupplierA
    2021-02-06 18:02:29.985 UTC,cde,cde,IN010000UK05,123456789123,003456789123,NotProvided,NONE
    2021-02-06 18:03:21.908 UTC,cde,efg,IN030000UK06,003456789123,123456789123,NotProvided,NONE"""

# flake8: noqa: E501
SPINE_DATA_DAY_2 = b"""_time,conversationID,GUID,interactionID,messageSender,messageRecipient,messageRef,jdiEvent,toSystem,fromSystem #no QA
    2021-02-07 08:41:48.337 BST,abc,bcd,IN010000UK13,987654321240,003456789123,bcd,NONE,SupplierC,SupplierA
    2021-02-07 18:02:29.985 BST,cde,cde,IN010000UK05,123456789123,003456789123,NotProvided,NONE
    2021-02-07 18:03:21.908 BST,cde,efg,IN030000UK06,003456789123,123456789123,NotProvided,NONE"""


class ThreadedServer:
    def __init__(self, server):
        self._server = server
        self._thread = Thread(target=server.serve_forever)

    def start(self):
        self._thread.start()

    def stop(self):
        self._server.shutdown()
        self._thread.join()


@Request.application
def fake_splunk_application(request):
    search_start_datetime = request.form.get("earliest_time")

    return Response(
        _get_fake_response(search_start_datetime),
        mimetype="text/csv",
    )


def _get_fake_response(search_start_datetime):
    if search_start_datetime == "2021-02-07T00:00:00":
        return SPINE_DATA_DAY_2
    else:
        return SPINE_DATA_DAY_1


def _build_fake_aws(host, port):
    app = DomainDispatcherApplication(create_backend_app)
    server = make_server(host, port, app)
    return ThreadedServer(server)


def _build_fake_splunk(host, port):
    server = make_server(host, port, fake_splunk_application)
    return ThreadedServer(server)


def _build_fake_s3_bucket(bucket_name: str, s3):
    s3_fake_bucket = s3.create_bucket(
        Bucket=bucket_name, CreateBucketConfiguration={"LocationConstraint": FAKE_S3_REGION}
    )
    return s3_fake_bucket


def _disable_werkzeug_logging():
    log = logging.getLogger("werkzeug")
    log.setLevel(logging.ERROR)


def _read_s3_gzip_csv_file(s3_client, bucket_name, key):
    s3_object = s3_client.Object(bucket_name, key)
    body = s3_object.get()["Body"]
    return open_gzip(body)


def _populate_ssm_parameter(name, value):
    ssm = boto3.client(service_name="ssm", endpoint_url=FAKE_AWS_URL)
    ssm.put_parameter(Name=name, Value=value, Type="SecureString", Overwrite=True)


def _read_s3_metadata(bucket, key):
    return bucket.Object(key).get()["Metadata"]


@freeze_time(datetime(year=2021, month=2, day=7, hour=2, second=0))
def test_with_s3():
    fake_aws, fake_splunk, s3 = _setup()
    fake_aws.start()
    fake_splunk.start()

    output_bucket = _build_fake_s3_bucket(OUTPUT_BUCKET_NAME, s3)

    try:
        year = "2021"
        month = "02"
        day = "06"
        output_path = f"{VERSION}/{year}/{month}/{day}/{year}-{month}-{day}_spine_messages.csv.gz"

        _populate_ssm_parameter(API_TOKEN_PARAM_NAME, "abc")

        main()

        expected_spine_data = SPINE_DATA_DAY_1.decode("utf-8")
        actual_spine_data = _read_s3_gzip_csv_file(s3, OUTPUT_BUCKET_NAME, output_path)

        assert actual_spine_data == expected_spine_data

        expected_s3_metadata = {
            "search-start-time": "2021-02-06T00:00:00",
            "search-end-time": "2021-02-07T00:00:00",
            "build-tag": "61ad1e1c",
        }
        actual_s3_metadata = _read_s3_metadata(output_bucket, output_path)
        assert actual_s3_metadata == expected_s3_metadata

    finally:
        output_bucket.objects.all().delete()
        output_bucket.delete()
        fake_splunk.stop()
        fake_aws.stop()
        environ.clear()


def test_with_specified_start_datetime():
    environ["START_DATETIME"] = "2021-02-06T00:00:00"
    fake_aws, fake_splunk, s3 = _setup()
    fake_aws.start()
    fake_splunk.start()

    output_bucket = _build_fake_s3_bucket(OUTPUT_BUCKET_NAME, s3)

    try:
        year = "2021"
        month = "02"
        day = "06"
        output_path = f"{VERSION}/{year}/{month}/{day}/{year}-{month}-{day}_spine_messages.csv.gz"

        _populate_ssm_parameter(API_TOKEN_PARAM_NAME, "abc")

        main()

        expected_spine_data = SPINE_DATA_DAY_1.decode("utf-8")
        actual_spine_data = _read_s3_gzip_csv_file(s3, OUTPUT_BUCKET_NAME, output_path)

        assert actual_spine_data == expected_spine_data

        expected_s3_metadata = {
            "search-start-time": "2021-02-06T00:00:00",
            "search-end-time": "2021-02-07T00:00:00",
            "build-tag": "61ad1e1c",
        }
        actual_s3_metadata = _read_s3_metadata(output_bucket, output_path)
        assert actual_s3_metadata == expected_s3_metadata

    finally:
        output_bucket.objects.all().delete()
        output_bucket.delete()
        fake_splunk.stop()
        fake_aws.stop()
        environ.clear()


@patch("time.sleep", return_value=None)
def test_with_specified_start_datetime_and_end_datetime_and_wait_time(patched_time_sleep):
    environ["START_DATETIME"] = "2021-02-06T00:00:00"
    environ["END_DATETIME"] = "2021-02-08T00:00:00"
    environ["SEARCH_WAIT_TIME_IN_SECONDS"] = "30"
    fake_aws, fake_splunk, s3 = _setup()
    fake_aws.start()
    fake_splunk.start()

    output_bucket = _build_fake_s3_bucket(OUTPUT_BUCKET_NAME, s3)

    try:
        year = "2021"
        month = "02"
        day_1 = "06"
        day_2 = "07"
        output_path_day_1 = (
            f"{VERSION}/{year}/{month}/{day_1}/{year}-{month}-{day_1}_spine_messages.csv.gz"
        )
        output_path_day_2 = (
            f"{VERSION}/{year}/{month}/{day_2}/{year}-{month}-{day_2}_spine_messages.csv.gz"
        )
        _populate_ssm_parameter(API_TOKEN_PARAM_NAME, "abc")

        main()

        expected_spine_data_day_1 = SPINE_DATA_DAY_1.decode("utf-8")
        actual_spine_data_day_1 = _read_s3_gzip_csv_file(s3, OUTPUT_BUCKET_NAME, output_path_day_1)

        expected_spine_data_day_2 = SPINE_DATA_DAY_2.decode("utf-8")
        actual_spine_data_day_2 = _read_s3_gzip_csv_file(s3, OUTPUT_BUCKET_NAME, output_path_day_2)

        assert actual_spine_data_day_1 == expected_spine_data_day_1
        assert actual_spine_data_day_2 == expected_spine_data_day_2

        expected_s3_metadata_day_1 = {
            "search-start-time": "2021-02-06T00:00:00",
            "search-end-time": "2021-02-07T00:00:00",
            "build-tag": "61ad1e1c",
        }
        actual_s3_metadata_day_1 = _read_s3_metadata(output_bucket, output_path_day_1)

        expected_s3_metadata_day_2 = {
            "search-start-time": "2021-02-07T00:00:00",
            "search-end-time": "2021-02-08T00:00:00",
            "build-tag": "61ad1e1c",
        }
        actual_s3_metadata_day_2 = _read_s3_metadata(output_bucket, output_path_day_2)

        assert actual_s3_metadata_day_1 == expected_s3_metadata_day_1
        assert actual_s3_metadata_day_2 == expected_s3_metadata_day_2

        patched_time_sleep.assert_has_calls([call(30), call(30)])
    finally:
        output_bucket.objects.all().delete()
        output_bucket.delete()
        fake_splunk.stop()
        fake_aws.stop()
        environ.clear()


def _setup():
    _disable_werkzeug_logging()
    s3 = boto3.resource(
        "s3",
        endpoint_url=FAKE_AWS_URL,
        aws_access_key_id=FAKE_S3_ACCESS_KEY,
        aws_secret_access_key=FAKE_S3_SECRET_KEY,
        config=Config(signature_version="s3v4"),
        region_name=FAKE_S3_REGION,
    )
    environ["AWS_ACCESS_KEY_ID"] = "testing"
    environ["AWS_SECRET_ACCESS_KEY"] = "testing"
    environ["AWS_DEFAULT_REGION"] = "us-west-1"
    environ["SPLUNK_URL"] = FAKE_SPLUNK_URL
    environ["OUTPUT_SPINE_DATA_BUCKET"] = OUTPUT_BUCKET_NAME
    environ["SPLUNK_API_TOKEN_PARAM_NAME"] = API_TOKEN_PARAM_NAME
    environ["AWS_ENDPOINT_URL"] = FAKE_AWS_URL
    environ["BUILD_TAG"] = "61ad1e1c"
    fake_aws = _build_fake_aws(FAKE_AWS_HOST, FAKE_AWS_PORT)
    fake_splunk = _build_fake_splunk(FAKE_SPLUNK_HOST, FAKE_SPLUNK_PORT)
    return fake_aws, fake_splunk, s3


def test_exception_in_main():
    with mock.patch.object(sys, "exit") as exitSpy:
        with mock.patch.object(logger, "error") as mock_log_error:
            main()

    mock_log_error.assert_called_with(
        ANY,
        extra={"event": "FAILED_TO_RUN_MAIN"},
    )

    exitSpy.assert_called_with("Failed to run main, Exiting...")
