import logging
import time
from datetime import datetime, timedelta

import boto3
import requests

from prmexporter.config import SpineExporterConfig
from prmexporter.date_converter import convert_to_datetime_string
from prmexporter.io.http_client import HttpClient
from prmexporter.io.s3 import S3DataManager
from prmexporter.io.secret_manager import SsmSecretManager
from prmexporter.search_dates import SearchDates

logger = logging.getLogger(__name__)

VERSION = "v3"


class SpineExporter:
    def __init__(self, config: SpineExporterConfig):
        self._config = config

        ssm = boto3.client("ssm", endpoint_url=config.aws_endpoint_url)
        self._ssm_secret_manager = SsmSecretManager(ssm)

        s3_client = boto3.resource("s3", endpoint_url=config.aws_endpoint_url)
        self._s3_data_manager = S3DataManager(
            client=s3_client, bucket_name=config.output_spine_data_bucket
        )

        self._http_client = HttpClient(client=requests)

    @staticmethod
    def _construct_json_log_date_range_info(search_dates: SearchDates) -> dict:
        return {
            "config_start_datetime": search_dates.get_start_datetime_string(),
            "config_end_datetime": search_dates.get_end_datetime_string(),
            "datetimes": search_dates.get_dates_string(),
        }

    def _get_api_auth_token(self) -> str:
        return self._ssm_secret_manager.get_secret(self._config.splunk_api_token_param_name)

    def _fetch_spine_data(self, search_start_time: str, search_end_time: str) -> bytes:
        request_body = {
            "output_mode": "csv",
            "earliest_time": search_start_time,
            "latest_time": search_end_time,
            "search": """search index=\"spine2vfmmonitor\" service=\"gp2gp\" logReference=\"MPS0053d\"
            | table _time, conversationID, GUID, interactionID, messageSender,
            messageRecipient, messageRef, jdiEvent, toSystem, fromSystem""",
        }

        splunk_api_token = self._get_api_auth_token()

        return self._http_client.make_request(
            url=self._config.splunk_url, auth_token=splunk_api_token, request_body=request_body
        )

    @staticmethod
    def _create_s3_key(start_datetime: datetime) -> str:
        year = str(start_datetime.year)
        month = str(start_datetime.month).zfill(2)
        day = str(start_datetime.day).zfill(2)
        return f"{VERSION}/{year}/{month}/{day}/{year}-{month}-{day}_spine_messages.csv.gz"

    def _write_spine_data_to_s3(
        self, spine_data: bytes, s3_key: str, search_start_time: str, search_end_time: str
    ):
        output_metadata = {
            "search-start-time": search_start_time,
            "search-end-time": search_end_time,
            "build-tag": self._config.build_tag,
        }

        self._s3_data_manager.write_gzip_csv(
            data=spine_data, s3_key=s3_key, metadata=output_metadata
        )

    def run(self):
        search_dates = SearchDates(
            start_datetime=self._config.start_datetime, end_datetime=self._config.end_datetime
        )
        list_search_dates = search_dates.get_dates()

        log_date_range_info = self._construct_json_log_date_range_info(search_dates)

        logger.info(
            "Attempting to export data for a date range",
            extra={"event": "ATTEMPTING_EXPORT_DATA_FOR_A_DATE_RANGE", **log_date_range_info},
        )

        for date in list_search_dates:
            search_start_datetime = convert_to_datetime_string(date)
            search_end_datetime = convert_to_datetime_string(date + timedelta(days=1))

            spine_data = self._fetch_spine_data(
                search_start_time=search_start_datetime, search_end_time=search_end_datetime
            )

            s3_key = self._create_s3_key(date)
            self._write_spine_data_to_s3(
                spine_data=spine_data,
                s3_key=s3_key,
                search_start_time=search_start_datetime,
                search_end_time=search_end_datetime,
            )

            if self._config.search_wait_time_in_seconds > 0:
                logger.info(
                    "Waiting the specified search wait time before continuing",
                    extra={
                        "event": "WAITING_WAIT_TIME",
                        "search_wait_time_in_seconds": self._config.search_wait_time_in_seconds,
                    },
                )

            time.sleep(self._config.search_wait_time_in_seconds)

        logger.info(
            "Successfully exported data for a date range",
            extra={"event": "EXPORTED_DATA_FOR_A_DATE_RANGE", **log_date_range_info},
        )
