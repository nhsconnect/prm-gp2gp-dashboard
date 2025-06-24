from datetime import date, datetime

import pytest
from dateutil.tz import UTC

from prmcalculator.pipeline.config import (
    InvalidEnvironmentVariableValue,
    MissingEnvironmentVariable,
    PipelineConfig,
)
from tests.builders.common import a_string


def test_reads_from_environment_variables_and_converts_to_required_format():
    build_tag = "61ad1e1c"
    environment = {
        "INPUT_TRANSFER_DATA_BUCKET": "input-transfer-data-bucket",
        "OUTPUT_METRICS_BUCKET": "output-metrics-bucket",
        "NUMBER_OF_MONTHS": "3",
        "DATE_ANCHOR": "2020-01-30T18:44:49Z",
        "S3_ENDPOINT_URL": "a_url",
        "BUILD_TAG": build_tag,
        "NATIONAL_METRICS_S3_PATH_PARAM_NAME": "a/param/name",
        "PRACTICE_METRICS_S3_PATH_PARAM_NAME": "another/param/name",
    }

    expected_config = PipelineConfig(
        input_transfer_data_bucket="input-transfer-data-bucket",
        output_metrics_bucket="output-metrics-bucket",
        number_of_months=3,
        date_anchor=datetime(year=2020, month=1, day=30, hour=18, minute=44, second=49, tzinfo=UTC),
        s3_endpoint_url="a_url",
        build_tag=build_tag,
        national_metrics_s3_path_param_name="a/param/name",
        practice_metrics_s3_path_param_name="another/param/name",
    )

    actual_config = PipelineConfig.from_environment_variables(environment)

    assert actual_config == expected_config


def test_read_config_from_environment_when_optional_parameters_are_not_set():
    build_tag = "61ad1e1c"
    environment = {
        "INPUT_TRANSFER_DATA_BUCKET": "input-transfer-data-bucket",
        "OUTPUT_METRICS_BUCKET": "output-metrics-bucket",
        "BUILD_TAG": build_tag,
        "NATIONAL_METRICS_S3_PATH_PARAM_NAME": "a/param/name",
        "PRACTICE_METRICS_S3_PATH_PARAM_NAME": "another/param/name",
    }

    expected_config = PipelineConfig(
        input_transfer_data_bucket="input-transfer-data-bucket",
        output_metrics_bucket="output-metrics-bucket",
        number_of_months=6,
        date_anchor=datetime.combine(date.today(), datetime.min.time()),
        s3_endpoint_url=None,
        build_tag=build_tag,
        national_metrics_s3_path_param_name="a/param/name",
        practice_metrics_s3_path_param_name="another/param/name",
    )

    actual_config = PipelineConfig.from_environment_variables(environment)

    assert actual_config == expected_config


def test_error_from_environment_when_required_fields_are_not_set():
    environment = {
        "INPUT_TRANSFER_DATA_BUCKET": "input-transfer-data-bucket",
    }

    with pytest.raises(MissingEnvironmentVariable) as e:
        PipelineConfig.from_environment_variables(environment)
    assert str(e.value) == "Expected environment variable BUILD_TAG was not set, exiting..."


def test_error_from_environment_when_incorrect_type_field_set():
    environment = {
        "INPUT_TRANSFER_DATA_BUCKET": "input-transfer-data-bucket",
        "OUTPUT_METRICS_BUCKET": "output-metrics-bucket",
        "DATE_ANCHOR": "incorrect type",
        "BUILD_TAG": a_string(),
    }

    with pytest.raises(InvalidEnvironmentVariableValue) as e:
        PipelineConfig.from_environment_variables(environment)
    assert str(e.value) == "Expected environment variable DATE_ANCHOR value is invalid, exiting..."
