import gzip
import logging
from typing import Dict

from prmexporter.io.file_utils import calculate_number_of_rows

logger = logging.getLogger(__name__)


class S3DataManager:
    def __init__(self, client, bucket_name: str):
        self._client = client
        self._bucket_name = bucket_name
        self._s3_spine_output_data_bucket = self._client.Bucket(self._bucket_name)

    def write_gzip_csv(self, data: bytes, s3_key: str, metadata: Dict[str, str]):
        if calculate_number_of_rows(data) < 2:
            logger.error(
                "Spine extract is empty",
                extra={"event": "ERROR_EMPTY_SPINE_EXTRACT", "size_in_bytes": len(data)},
            )
            raise ValueError("Spine extract is empty")

        if calculate_number_of_rows(data) < 1000:
            logger.warning(
                "Spine extract is small",
                extra={"event": "WARNING_SMALL_SPINE_EXTRACT", "size_in_bytes": len(data)},
            )

        object_uri = f"s3://{self._bucket_name}/{s3_key}"
        logger.info(
            "Attempting to upload to S3",
            extra={"event": "ATTEMPTING_UPLOAD_CSV_TO_S3", "object_uri": object_uri},
        )

        gzip_object = gzip.compress(data)

        self._s3_spine_output_data_bucket.put_object(
            Body=gzip_object, Key=s3_key, Metadata=metadata
        )

        logger.info(
            "Successfully uploaded to S3",
            extra={"event": "UPLOADED_CSV_TO_S3", "object_uri": object_uri},
        )

        logger.info(
            "Spine extract gzip csv byte size",
            extra={"event": "SPINE_EXTRACT_SIZE_BYTES", "size_in_bytes": len(gzip_object)},
        )

        logger.info(
            "Spine extract row count",
            extra={"event": "SPINE_EXTRACT_ROW_COUNT", "row_count": calculate_number_of_rows(data)},
        )
