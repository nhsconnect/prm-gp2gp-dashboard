from unittest import mock
from unittest.mock import Mock

import pytest
from botocore.exceptions import ClientError

from prmcalculator.pipeline.io import PlatformMetricsIO, logger


def test_store_ssm_param():
    ssm_manager = Mock()
    s3_key = "some/uri/nationalMetrics.json"
    ssm_param_name = "a/param/name"

    metrics_io = PlatformMetricsIO(
        s3_data_manager=Mock(),
        ssm_manager=ssm_manager,
        output_metadata={},
    )

    metrics_io.store_ssm_param(ssm_param_name=ssm_param_name, ssm_param_value=s3_key)

    ssm_manager.put_parameter.assert_called_once_with(
        Name=ssm_param_name, Value=s3_key, Type="String", Overwrite=True
    )


def test_exit_when_fails_to_store_ssm_param():
    ssm_manager = Mock()
    s3_uri = "some/uri/nationalMetrics.json"
    ssm_param_name = "a/param/name"

    client_error = ClientError(
        {"Error": {"Code": "500", "Message": "Error Uploading"}}, "operation_name"
    )
    ssm_manager.put_parameter.side_effect = client_error

    metrics_io = PlatformMetricsIO(
        s3_data_manager=Mock(),
        ssm_manager=ssm_manager,
        output_metadata={},
    )

    with pytest.raises(ClientError):
        with mock.patch.object(logger, "error") as mock_log_error:
            metrics_io.store_ssm_param(ssm_param_name=ssm_param_name, ssm_param_value=s3_uri)

    mock_log_error.assert_called_once_with(
        "An error occurred (500) when calling the operation_name operation: Error Uploading",
        extra={
            "event": "FAILED_TO_STORE_SSM",
            "ssm_param_name": ssm_param_name,
            "ssm_param_value": s3_uri,
        },
    )
