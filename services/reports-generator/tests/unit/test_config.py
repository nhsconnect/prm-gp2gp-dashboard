from datetime import datetime

import pytest
from dateutil.tz import tzutc

from prmreportsgenerator.config import (
    InvalidEnvironmentVariableValue,
    MissingEnvironmentVariable,
    PipelineConfig,
)
from prmreportsgenerator.report_name import ReportName
from tests.builders.common import a_string


def test_reads_from_environment_variables_and_converts_to_required_format():
    build_tag = "61ad1e1c"
    environment = {
        "INPUT_TRANSFER_DATA_BUCKET": "input-transfer-data-bucket",
        "OUTPUT_REPORTS_BUCKET": "output-reports-bucket",
        "START_DATETIME": "2020-01-29T00:00:00Z",
        "END_DATETIME": "2020-01-30T00:00:00Z",
        "NUMBER_OF_MONTHS": "1",
        "NUMBER_OF_DAYS": "0",
        "CONVERSATION_CUTOFF_DAYS": "1",
        "S3_ENDPOINT_URL": "a_url",
        "BUILD_TAG": build_tag,
        "REPORT_NAME": ReportName.TRANSFER_OUTCOMES_PER_SUPPLIER_PATHWAY.value,
        "ALERT_ENABLED": "True",
        "SEND_EMAIL_NOTIFICATION": "True",
    }

    expected_config = PipelineConfig(
        input_transfer_data_bucket="input-transfer-data-bucket",
        output_reports_bucket="output-reports-bucket",
        start_datetime=datetime(
            year=2020, month=1, day=29, hour=0, minute=0, second=0, tzinfo=tzutc()
        ),
        end_datetime=datetime(
            year=2020, month=1, day=30, hour=0, minute=0, second=0, tzinfo=tzutc()
        ),
        number_of_months=1,
        number_of_days=0,
        cutoff_days=1,
        s3_endpoint_url="a_url",
        build_tag=build_tag,
        report_name=ReportName.TRANSFER_OUTCOMES_PER_SUPPLIER_PATHWAY,
        alert_enabled=True,
        send_email_notification=True,
    )

    actual_config = PipelineConfig.from_environment_variables(environment)

    assert actual_config == expected_config


def test_read_config_from_environment_when_optional_parameters_are_not_set():
    build_tag = "61ad1e1c"
    environment = {
        "INPUT_TRANSFER_DATA_BUCKET": "input-transfer-data-bucket",
        "OUTPUT_REPORTS_BUCKET": "output-reports-bucket",
        "CONVERSATION_CUTOFF_DAYS": "14",
        "BUILD_TAG": build_tag,
        "REPORT_NAME": ReportName.TRANSFER_OUTCOMES_PER_SUPPLIER_PATHWAY.value,
    }

    expected_config = PipelineConfig(
        input_transfer_data_bucket="input-transfer-data-bucket",
        output_reports_bucket="output-reports-bucket",
        start_datetime=None,
        end_datetime=None,
        number_of_months=None,
        number_of_days=None,
        cutoff_days=14,
        s3_endpoint_url=None,
        build_tag=build_tag,
        report_name=ReportName.TRANSFER_OUTCOMES_PER_SUPPLIER_PATHWAY,
        alert_enabled=False,
        send_email_notification=True,
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


def test_report_name_error_from_environment_when_invalid_report_provided():
    environment = {
        "INPUT_TRANSFER_DATA_BUCKET": "input-transfer-data-bucket",
        "OUTPUT_REPORTS_BUCKET": "output-reports-bucket",
        "CONVERSATION_CUTOFF_DAYS": "14",
        "BUILD_TAG": a_string(),
        "REPORT_NAME": "invalid-report-name",
    }

    with pytest.raises(ValueError) as e:
        PipelineConfig.from_environment_variables(environment)
    assert str(e.value) == "'invalid-report-name' is not a valid ReportName"


def test_error_from_environment_when_invalid_type_field_set():
    environment = {
        "INPUT_TRANSFER_DATA_BUCKET": "input-transfer-data-bucket",
        "OUTPUT_REPORTS_BUCKET": "output-reports-bucket",
        "CONVERSATION_CUTOFF_DAYS": "14",
        "START_DATETIME": "invalid type",
        "BUILD_TAG": a_string(),
        "REPORT_NAME": ReportName.TRANSFER_OUTCOMES_PER_SUPPLIER_PATHWAY,
    }

    with pytest.raises(InvalidEnvironmentVariableValue) as e:
        PipelineConfig.from_environment_variables(environment)
    assert (
        str(e.value) == "Expected environment variable START_DATETIME value is invalid, exiting..."
    )
