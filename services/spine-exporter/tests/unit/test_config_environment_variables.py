from datetime import datetime

import pytest

from prmexporter.config import (
    EnvConfig,
    InvalidEnvironmentVariableValue,
    MissingEnvironmentVariable,
    SpineExporterConfig,
)


def test_reads_from_environment_variables():
    environment = {
        "SPLUNK_URL": "https://test.com",
        "SPLUNK_API_TOKEN_PARAM_NAME": "/param/name/api-token",
        "OUTPUT_SPINE_DATA_BUCKET": "output-spine-data-bucket",
        "BUILD_TAG": "61ad1e1c",
        "AWS_ENDPOINT_URL": "https://an.endpoint:3000",
        "START_DATETIME": "2021-01-01T00:00:00",
        "END_DATETIME": "2021-01-02T00:00:00",
        "SEARCH_WAIT_TIME_IN_SECONDS": "30",
    }

    expected_config = SpineExporterConfig(
        splunk_url="https://test.com",
        splunk_api_token_param_name="/param/name/api-token",
        output_spine_data_bucket="output-spine-data-bucket",
        build_tag="61ad1e1c",
        aws_endpoint_url="https://an.endpoint:3000",
        start_datetime=datetime(year=2021, month=1, day=1, hour=0, minute=0, second=0),
        end_datetime=datetime(year=2021, month=1, day=2, hour=0, minute=0, second=0),
        search_wait_time_in_seconds=30,
    )

    actual_config = SpineExporterConfig.from_environment_variables(environment)

    assert actual_config == expected_config


def test_error_from_environment_when_required_fields_are_not_set():
    environment = {"SPLUNK_API_TOKEN_PARAM_NAME": "/param/name/api-token"}

    with pytest.raises(MissingEnvironmentVariable) as e:
        SpineExporterConfig.from_environment_variables(environment)

    assert str(e.value) == "Expected environment variable SPLUNK_URL was not set, exiting..."


def test_reads_from_environment_variables_when_optional_fields_are_not_set():
    environment = {
        "SPLUNK_URL": "https://test.com",
        "SPLUNK_API_TOKEN_PARAM_NAME": "/param/name/api-token",
        "OUTPUT_SPINE_DATA_BUCKET": "output-spine-data-bucket",
        "BUILD_TAG": "61ad1e1c",
    }

    expected_config = SpineExporterConfig(
        splunk_url="https://test.com",
        splunk_api_token_param_name="/param/name/api-token",
        output_spine_data_bucket="output-spine-data-bucket",
        build_tag="61ad1e1c",
        aws_endpoint_url=None,
        start_datetime=None,
        end_datetime=None,
        search_wait_time_in_seconds=0,
    )

    actual_config = SpineExporterConfig.from_environment_variables(environment)

    assert actual_config == expected_config


def test_read_optional_int_throws_exception_given_invalid_string():
    env = EnvConfig({"OPTIONAL_INT_CONFIG": "one"})

    with pytest.raises(InvalidEnvironmentVariableValue) as e:
        env.read_optional_int(name="OPTIONAL_INT_CONFIG", default=0)
    assert (
        str(e.value)
        == "Expected environment variable OPTIONAL_INT_CONFIG value is invalid, exiting..."
    )
