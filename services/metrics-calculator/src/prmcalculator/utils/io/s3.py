import json
import logging
from datetime import datetime
from io import BytesIO
from typing import Dict, Union
from urllib.parse import urlparse

import pyarrow.parquet as pq
from pyarrow.lib import Table

from prmcalculator.domain.national.construct_national_metrics_presentation import (
    NationalMetricsPresentation,
)

logger = logging.getLogger(__name__)


def _serialize_datetime(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} is not JSON serializable")


class S3DataManager:
    def __init__(self, client):
        self._client = client

    def _object_from_uri(self, uri: str):
        object_url = urlparse(uri)
        s3_bucket = object_url.netloc
        s3_key = object_url.path.lstrip("/")
        return self._client.Object(s3_bucket, s3_key)

    def read_json(self, object_uri: str):
        logger.info(
            "Reading file from: " + object_uri,
            extra={"event": "READING_FILE_FROM_S3", "object_uri": object_uri},
        )
        s3_object = self._object_from_uri(object_uri)

        try:
            response = s3_object.get()
        except self._client.meta.client.exceptions.NoSuchKey:
            logger.error(
                f"File not found: {object_uri}, exiting...",
                extra={"event": "FILE_NOT_FOUND_IN_S3"},
            )
            raise FileNotFoundError(object_uri)

        body = response["Body"].read()
        return json.loads(body.decode("utf8"))

    def write_json(
        self,
        object_uri: str,
        data: Union[dict, NationalMetricsPresentation],
        metadata: Dict[str, str],
        log_data: bool = False,
    ):
        logger.info(
            "Attempting to upload: " + object_uri,
            extra={"event": "ATTEMPTING_UPLOAD_JSON_TO_S3", "object_uri": object_uri},
        )
        s3_object = self._object_from_uri(object_uri)
        body = json.dumps(data, default=_serialize_datetime).encode("utf8")
        s3_object.put(Body=body, ContentType="application/json", Metadata=metadata)
        if log_data:
            logger.info(
                "Successfully uploaded to: " + object_uri,
                extra={
                    "event": "UPLOADED_JSON_TO_S3",
                    "object_uri": object_uri,
                    "data": str(data),
                },
            )
        else:
            logger.info(
                "Successfully uploaded to: " + object_uri,
                extra={"event": "UPLOADED_JSON_TO_S3", "object_uri": object_uri},
            )

    def read_parquet(self, object_uri: str) -> Table:
        logger.info(
            "Reading file from: " + object_uri,
            extra={"event": "READING_FILE_FROM_S3", "object_uri": object_uri},
        )
        s3_object = self._object_from_uri(object_uri)

        try:
            response = s3_object.get()
        except self._client.meta.client.exceptions.NoSuchKey:
            logger.error(
                f"File not found: {object_uri}, exiting...",
                extra={"event": "FILE_NOT_FOUND_IN_S3"},
            )
            raise FileNotFoundError(object_uri)

        body = BytesIO(response["Body"].read())
        return pq.read_table(body)
