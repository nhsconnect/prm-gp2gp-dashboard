import csv
import json
import logging
from datetime import datetime
from io import BytesIO, StringIO
from os import environ
from threading import Thread

import boto3
import pyarrow as pa
from botocore.config import Config
from moto.server import DomainDispatcherApplication, create_backend_app
from pyarrow._s3fs import S3FileSystem
from pyarrow.parquet import write_table
from werkzeug.serving import make_server

from prmreportsgenerator.utils.add_leading_zero import add_leading_zero
from tests.builders.common import a_string
from tests.builders.pa_table import PaTableBuilder

logger = logging.getLogger(__name__)


class ThreadedServer:
    def __init__(self, server):
        self._server = server
        self._thread = Thread(target=server.serve_forever)

    def start(self):
        self._thread.start()

    def stop(self):
        self._server.shutdown()
        self._thread.join()


FAKE_AWS_HOST = "127.0.0.1"
FAKE_AWS_PORT = 8887
FAKE_AWS_URL = f"http://{FAKE_AWS_HOST}:{FAKE_AWS_PORT}"
FAKE_S3_ACCESS_KEY = "testing"
FAKE_S3_SECRET_KEY = "testing"
FAKE_S3_REGION = "us-west-1"
S3_INPUT_TRANSFER_DATA_BUCKET = "input-transfer-data-bucket"
S3_OUTPUT_REPORTS_BUCKET = "output-reports-data-bucket"
DEFAULT_CONVERSATION_CUTOFF_DAYS = "14"
BUILD_TAG = a_string(7)


def _setup():
    s3_client = boto3.resource(
        "s3",
        endpoint_url=FAKE_AWS_URL,
        aws_access_key_id=FAKE_S3_ACCESS_KEY,
        aws_secret_access_key=FAKE_S3_SECRET_KEY,
        config=Config(signature_version="s3v4"),
        region_name=FAKE_S3_REGION,
    )

    environ["AWS_ACCESS_KEY_ID"] = FAKE_S3_ACCESS_KEY
    environ["AWS_SECRET_ACCESS_KEY"] = FAKE_S3_SECRET_KEY
    environ["AWS_DEFAULT_REGION"] = FAKE_S3_REGION

    environ["INPUT_TRANSFER_DATA_BUCKET"] = S3_INPUT_TRANSFER_DATA_BUCKET
    environ["OUTPUT_REPORTS_BUCKET"] = S3_OUTPUT_REPORTS_BUCKET

    environ["S3_ENDPOINT_URL"] = FAKE_AWS_URL
    environ["BUILD_TAG"] = BUILD_TAG

    fake_s3 = _build_fake_s3(FAKE_AWS_HOST, FAKE_AWS_PORT)
    return fake_s3, s3_client


def _read_json(path):
    return json.loads(path.read_text())


def _read_csv(path):
    with open(path, "r") as csvfile:
        reader = csv.reader(csvfile, skipinitialspace=True)
        return list(reader)


def _parse_dates(items):
    return [None if item is None else datetime.fromisoformat(item) for item in items]


def _read_parquet_columns_json(path):
    datetime_columns = ["date_requested", "last_sender_message_timestamp"]
    return {
        column_name: _parse_dates(values) if column_name in datetime_columns else values
        for column_name, values in _read_json(path).items()
    }


def _get_s3_path(bucket_name, year, month, day, cutoff_days):
    s3_filename = f"{year}-{month}-{day}-transfers.parquet"
    return f"{bucket_name}/v11/cutoff-{cutoff_days}/{year}/{month}/{day}/{s3_filename}"


def _read_s3_csv(bucket, key):
    f = BytesIO()
    bucket.download_fileobj(key, f)
    f.seek(0)
    data = f.read().decode("utf-8")
    reader = csv.reader(StringIO(data))
    return list(reader)


def _read_s3_metadata(bucket, key):
    return bucket.Object(key).get()["Metadata"]


def _write_transfer_parquet(input_transfer_parquet_columns_json, s3_path: str):
    transfers_dictionary = _read_parquet_columns_json(input_transfer_parquet_columns_json)
    transfers_table = pa.table(data=transfers_dictionary, schema=PaTableBuilder.get_schema())
    write_table(
        table=transfers_table,
        where=s3_path,
        filesystem=S3FileSystem(endpoint_override=FAKE_AWS_URL),
    )


def _build_fake_s3(host, port):
    app = DomainDispatcherApplication(create_backend_app, "s3")
    server = make_server(host, port, app)
    return ThreadedServer(server)


def _build_fake_s3_bucket(bucket_name: str, s3):
    s3_fake_bucket = s3.create_bucket(
        Bucket=bucket_name, CreateBucketConfiguration={"LocationConstraint": FAKE_S3_REGION}
    )
    return s3_fake_bucket


def _upload_template_transfer_data(
    shared_datadir,
    input_transfer_bucket: str,
    year: int,
    data_month: int,
    time_range: range,
    cutoff_days: str = DEFAULT_CONVERSATION_CUTOFF_DAYS,
):
    for data_day in time_range:
        day = add_leading_zero(data_day)
        month = add_leading_zero(data_month)

        _write_transfer_parquet(
            shared_datadir / "inputs" / "template-transfers.json",
            _get_s3_path(input_transfer_bucket, year, month, day, cutoff_days),
        )


def _override_transfer_data(
    shared_datadir,
    input_transfer_bucket,
    year: int,
    data_month: int,
    data_day: int,
    cutoff_days: str = DEFAULT_CONVERSATION_CUTOFF_DAYS,
):
    day = add_leading_zero(data_day)
    month = add_leading_zero(data_month)

    _write_transfer_parquet(
        shared_datadir / "inputs" / f"{year}-{month}-{day}-transfers.json",
        _get_s3_path(input_transfer_bucket, year, month, day, cutoff_days=cutoff_days),
    )
