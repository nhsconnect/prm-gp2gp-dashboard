from datetime import datetime

import pytest
from dateutil.tz import tzutc

from prmods.domain.ods_portal.ods_portal_client import ODS_PORTAL_SEARCH_URL
from prmods.pipeline.config import MissingEnvironmentVariable, OdsPortalConfig


def test_reads_from_environment_variables_and_converts_to_required_format():
    build_tag = "61ad1e1c"
    environment = {
        "S3_ENDPOINT_URL": "https://an.endpoint:3000",
        "OUTPUT_BUCKET": "output-bucket",
        "MAPPING_BUCKET": "mapping-bucket",
        "SEARCH_URL": "https://an.endpoint:3000",
        "DATE_ANCHOR": "2020-01-30T18:44:49Z",
        "BUILD_TAG": build_tag,
        "SHOW_PRISON_PRACTICES_TOGGLE": "False",
    }

    expected_config = OdsPortalConfig(
        s3_endpoint_url="https://an.endpoint:3000",
        mapping_bucket="mapping-bucket",
        output_bucket="output-bucket",
        search_url="https://an.endpoint:3000",
        date_anchor=datetime(
            year=2020, month=1, day=30, hour=18, minute=44, second=49, tzinfo=tzutc()
        ),
        build_tag=build_tag,
        show_prison_practices_toggle=False,
    )

    actual_config = OdsPortalConfig.from_environment_variables(environment)

    assert actual_config == expected_config


def test_read_config_from_environment_when_optional_parameters_are_not_set():
    build_tag = "61ad1e1c"
    environment = {
        "OUTPUT_BUCKET": "output-bucket",
        "MAPPING_BUCKET": "mapping-bucket",
        "DATE_ANCHOR": "2020-01-30T18:44:49Z",
        "BUILD_TAG": build_tag,
    }

    expected_config = OdsPortalConfig(
        mapping_bucket="mapping-bucket",
        output_bucket="output-bucket",
        search_url=ODS_PORTAL_SEARCH_URL,
        date_anchor=datetime(
            year=2020, month=1, day=30, hour=18, minute=44, second=49, tzinfo=tzutc()
        ),
        build_tag=build_tag,
        show_prison_practices_toggle=True,
    )

    actual_config = OdsPortalConfig.from_environment_variables(environment)

    assert actual_config == expected_config


def test_error_from_environment_when_required_fields_are_not_set():
    environment = {
        "OUTPUT_TRANSFER_DATA_BUCKET": "output-transfer-data-bucket",
        "INPUT_TRANSFER_DATA_BUCKET": "input-transfer-data-bucket",
    }

    with pytest.raises(MissingEnvironmentVariable):
        OdsPortalConfig.from_environment_variables(environment)
