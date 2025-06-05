import logging
from datetime import datetime
from io import BytesIO
from typing import Dict
from urllib.parse import urlparse

import pyarrow as pa
import pyarrow.csv as csv
import pyarrow.parquet as pq

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

    def read_parquet(self, object_uri: str) -> pa.Table:
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

    def write_table_to_csv(self, object_uri: str, table: pa.Table, metadata: Dict[str, str]):
        logger.info(
            "Attempting to upload: " + object_uri,
            extra={"event": "ATTEMPTING_UPLOAD_CSV_TO_S3", "object_uri": object_uri},
        )
        s3_object = self._object_from_uri(object_uri)
        csv_buffer = BytesIO()
        csv.write_csv(table, csv_buffer)
        csv_buffer.seek(0)
        s3_object.put(Body=csv_buffer.getvalue(), ContentType="text/csv", Metadata=metadata)
        logger.info(
            "Successfully uploaded to: " + object_uri,
            extra={"event": "SUCCESSFULLY_UPLOADED_CSV_TO_S3", "object_uri": object_uri},
        )
