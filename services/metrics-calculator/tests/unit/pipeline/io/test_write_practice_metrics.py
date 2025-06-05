from datetime import datetime
from unittest.mock import Mock

from prmcalculator.domain.practice.calculate_practice_metrics import (
    PracticeMetricsPresentation,
    SICBLPresentation,
)
from prmcalculator.domain.practice.construct_practice_summary import (
    MonthlyMetricsPresentation,
    PracticeSummary,
    RequestedTransferMetrics,
)
from prmcalculator.pipeline.io import PlatformMetricsIO
from tests.builders.common import a_string

_DATE_ANCHOR_MONTH = 1
_DATE_ANCHOR_YEAR = 2021
_METRIC_MONTH = 12
_METRIC_YEAR = 2020

_PRACTICE_METRICS_OBJECT = PracticeMetricsPresentation(
    generated_on=datetime(_DATE_ANCHOR_YEAR, _DATE_ANCHOR_MONTH, 1),
    practices=[
        PracticeSummary(
            ods_code="A12345",
            name="A test GP practice",
            sicbl_ods_code="12A",
            sicbl_name="A Test ICB",
            metrics=[
                MonthlyMetricsPresentation(
                    year=2021,
                    month=1,
                    requested_transfers=RequestedTransferMetrics(
                        requested_count=9,
                        received_count=3,
                        integrated_within_3_days_count=1,
                        integrated_within_8_days_count=0,
                        received_percent_of_requested=24.56,
                        integrated_within_3_days_percent_of_received=44.54,
                        integrated_within_8_days_percent_of_received=57.44,
                        not_integrated_within_8_days_total=13,
                        not_integrated_within_8_days_percent_of_received=78.15,
                        failures_total_count=17,
                        failures_total_percent_of_requested=14.54,
                    ),
                )
            ],
        )
    ],
    sicbls=[SICBLPresentation(name="A Test ICB", ods_code="12A", practices=["A12345"])],
)

_PRACTICE_METRICS_DICT = {
    "generatedOn": datetime(_DATE_ANCHOR_YEAR, _DATE_ANCHOR_MONTH, 1),
    "practices": [
        {
            "odsCode": "A12345",
            "name": "A test GP practice",
            "sicblOdsCode": "12A",
            "sicblName": "A Test ICB",
            "metrics": [
                {
                    "year": 2021,
                    "month": 1,
                    "requestedTransfers": {
                        "requestedCount": 9,
                        "receivedCount": 3,
                        "integratedWithin3DaysCount": 1,
                        "integratedWithin8DaysCount": 0,
                        "receivedPercentOfRequested": 24.56,
                        "integratedWithin3DaysPercentOfReceived": 44.54,
                        "integratedWithin8DaysPercentOfReceived": 57.44,
                        "notIntegratedWithin8DaysTotal": 13,
                        "notIntegratedWithin8DaysPercentOfReceived": 78.15,
                        "failuresTotalCount": 17,
                        "failuresTotalPercentOfRequested": 14.54,
                    },
                }
            ],
        },
    ],
    "sicbls": [{"name": "A Test ICB", "odsCode": "12A", "practices": ["A12345"]}],
}


def test_given_practice_metrics_object_will_generate_json():
    s3_manager = Mock()

    data_platform_metrics_bucket = a_string()
    s3_file_name = f"{_DATE_ANCHOR_YEAR}-{_DATE_ANCHOR_MONTH}-practiceMetrics.json"
    s3_key = f"v8/{_METRIC_YEAR}/{_METRIC_MONTH}/{s3_file_name}"
    s3_uri = f"s3://{data_platform_metrics_bucket}/{s3_key}"

    output_metadata = {"metadata-field": "metadata_value"}
    metrics_io = PlatformMetricsIO(
        s3_data_manager=s3_manager,
        ssm_manager=Mock(),
        output_metadata=output_metadata,
    )

    metrics_io.write_practice_metrics(
        practice_metrics_presentation_data=_PRACTICE_METRICS_OBJECT, s3_uri=s3_uri
    )

    expected_practice_metrics_dict = _PRACTICE_METRICS_DICT

    s3_manager.write_json.assert_called_once_with(
        object_uri=s3_uri, data=expected_practice_metrics_dict, metadata=output_metadata
    )


def test_given_data_platform_metrics_version_will_override_default():
    s3_manager = Mock()

    data_platform_metrics_bucket = a_string()
    data_platform_metrics_version = "99"
    s3_uri = (
        f"s3://{data_platform_metrics_bucket}"
        f"/{data_platform_metrics_version}"
        f"/{_METRIC_YEAR}/{_METRIC_MONTH}/{_METRIC_YEAR}-{_METRIC_MONTH}-practiceMetrics.json"
    )

    metrics_io = PlatformMetricsIO(
        s3_data_manager=s3_manager,
        ssm_manager=Mock(),
        output_metadata={},
    )

    metrics_io.write_practice_metrics(
        practice_metrics_presentation_data=_PRACTICE_METRICS_OBJECT, s3_uri=s3_uri
    )

    expected_practice_metrics_dict = _PRACTICE_METRICS_DICT

    s3_manager.write_json.assert_called_once_with(
        object_uri=s3_uri, data=expected_practice_metrics_dict, metadata={}
    )
