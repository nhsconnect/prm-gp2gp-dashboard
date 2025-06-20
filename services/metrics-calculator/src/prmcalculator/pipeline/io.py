import logging
from dataclasses import asdict
from typing import Dict, List

import pyarrow as pa
from botocore.exceptions import ClientError

from prmcalculator.domain.gp2gp.transfer import Transfer, convert_table_to_transfers
from prmcalculator.domain.national.construct_national_metrics_presentation import (
    NationalMetricsPresentation,
)
from prmcalculator.utils.io.dictionary import camelize_dict
from prmcalculator.utils.io.s3 import S3DataManager

logger = logging.getLogger(__name__)


class PlatformMetricsIO:
    def __init__(
        self,
        s3_data_manager: S3DataManager,
        ssm_manager,
        output_metadata: Dict[str, str],
    ):
        self._ssm_manager = ssm_manager
        self._s3_manager = s3_data_manager
        self._output_metadata = output_metadata

    @staticmethod
    def _create_platform_json_object(platform_data) -> dict:
        content_dict = asdict(platform_data)
        return camelize_dict(content_dict)

    def read_transfers_as_dataclass(self, s3_uris: List[str]) -> List[Transfer]:
        transfer_table = self.read_transfers_as_table(s3_uris)
        return convert_table_to_transfers(transfer_table)

    def read_transfers_as_table(self, s3_uris: List[str]) -> pa.Table:
        return pa.concat_tables(
            [self._s3_manager.read_parquet(s3_path) for s3_path in s3_uris],
        )

    def write_national_metrics(
        self, national_metrics_presentation_data: NationalMetricsPresentation, s3_uri: str
    ):
        self._s3_manager.write_json(
            object_uri=s3_uri,
            data=self._create_platform_json_object(national_metrics_presentation_data),
            metadata=self._output_metadata,
            log_data=True,
        )

    def store_ssm_param(self, ssm_param_name: str, ssm_param_value: str):
        try:
            logger.info(f"Attempting to store SSM param {ssm_param_name}: {ssm_param_value}")
            self._ssm_manager.put_parameter(
                Name=ssm_param_name, Value=ssm_param_value, Type="String", Overwrite=True
            )
            logger.info(f"Successfully stored value for SSM param {ssm_param_name}")
        except ClientError as e:
            logger.error(
                str(e),
                extra={
                    "event": "FAILED_TO_STORE_SSM",
                    "ssm_param_name": ssm_param_name,
                    "ssm_param_value": ssm_param_value,
                },
            )
            raise e

    def write_practice_metrics(self, practice_metrics_presentation_data, s3_uri: str):
        self._s3_manager.write_json(
            object_uri=s3_uri,
            data=self._create_platform_json_object(practice_metrics_presentation_data),
            metadata=self._output_metadata,
        )
