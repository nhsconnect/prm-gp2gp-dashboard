import csv
import gzip
import json
import logging
from datetime import datetime
from typing import Dict
from urllib.parse import urlparse

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

    def write_json(self, object_uri: str, data: dict, metadata: Dict[str, str]):
        logger.info(
            "Attempting to upload: " + object_uri,
            extra={"event": "ATTEMPTING_UPLOAD_JSON_TO_S3", "object_uri": object_uri},
        )
        s3_object = self._object_from_uri(object_uri)
        body = json.dumps(data, default=_serialize_datetime)
        s3_object.put(Body=body, ContentType="application/json", Metadata=metadata)
        logger.info(
            "Successfully uploaded to: " + object_uri,
            extra={"event": "UPLOADED_JSON_TO_S3", "object_uri": object_uri},
        )

    def read_gzip_csv(self, object_uri: str):
        logger.info(
            "Reading file from: " + object_uri,
            extra={"event": "READING_FILE_FROM_S3", "object_uri": object_uri},
        )
        s3_object = self._object_from_uri(object_uri)
        response = s3_object.get()
        body = response["Body"]
        with gzip.open(body, mode="rt") as f:
            input_csv = csv.DictReader(f)
            yield from input_csv
