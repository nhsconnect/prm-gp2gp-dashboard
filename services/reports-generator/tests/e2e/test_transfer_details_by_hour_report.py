from os import environ

import pytest

from prmreportsgenerator.main import main
from prmreportsgenerator.report_name import ReportName
from tests.e2e.e2e_setup import (
    BUILD_TAG,
    DEFAULT_CONVERSATION_CUTOFF_DAYS,
    S3_INPUT_TRANSFER_DATA_BUCKET,
    S3_OUTPUT_REPORTS_BUCKET,
    _build_fake_s3_bucket,
    _override_transfer_data,
    _read_csv,
    _read_s3_csv,
    _read_s3_metadata,
    _setup,
    _upload_template_transfer_data,
)


@pytest.mark.filterwarnings("ignore:Conversion of")
def test_e2e_with_custom_reporting_window_given_start_and_end_date(
    shared_datadir,
):
    fake_s3, s3_client = _setup()
    fake_s3.start()

    output_reports_bucket = _build_fake_s3_bucket(S3_OUTPUT_REPORTS_BUCKET, s3_client)
    input_transfer_bucket = _build_fake_s3_bucket(S3_INPUT_TRANSFER_DATA_BUCKET, s3_client)

    expected_transfer_details_by_hour_output_key = (
        "/2019-12-01-to-2019-12-31-transfer_details_by_hour--14-days-cutoff.csv"
    )
    expected_transfer_details_by_hour_csv = _read_csv(
        shared_datadir
        / "expected_outputs"
        / "transfer_details_by_hour_report"
        / "custom_transfer_details_by_hour.csv"
    )

    s3_reports_output_path = "v5/custom/2019/12/01"

    try:
        environ["START_DATETIME"] = "2019-12-01T00:00:00Z"
        environ["END_DATETIME"] = "2020-01-01T00:00:00Z"
        environ["CONVERSATION_CUTOFF_DAYS"] = DEFAULT_CONVERSATION_CUTOFF_DAYS
        environ["REPORT_NAME"] = ReportName.TRANSFER_DETAILS_BY_HOUR.value

        _upload_template_transfer_data(
            shared_datadir,
            S3_INPUT_TRANSFER_DATA_BUCKET,
            year=2019,
            data_month=12,
            time_range=range(1, 32),
        )

        for day in [1, 3, 5, 19, 20, 23, 24, 25, 29, 30, 31]:
            _override_transfer_data(
                shared_datadir,
                S3_INPUT_TRANSFER_DATA_BUCKET,
                year=2019,
                data_month=12,
                data_day=day,
            )

        main()

        transfer_details_by_hour_s3_path = (
            f"{s3_reports_output_path}{expected_transfer_details_by_hour_output_key}"
        )
        actual_transfer_details_by_hour = _read_s3_csv(
            output_reports_bucket, transfer_details_by_hour_s3_path
        )
        assert actual_transfer_details_by_hour == expected_transfer_details_by_hour_csv

        expected_metadata = {
            "reports-generator-version": BUILD_TAG,
            "config-start-datetime": "2019-12-01T00:00:00+00:00",
            "config-end-datetime": "2020-01-01T00:00:00+00:00",
            "config-number-of-months": "None",
            "config-number-of-days": "None",
            "config-cutoff-days": DEFAULT_CONVERSATION_CUTOFF_DAYS,
            "reporting-window-start-datetime": "2019-12-01T00:00:00+00:00",
            "reporting-window-end-datetime": "2020-01-01T00:00:00+00:00",
            "report-name": ReportName.TRANSFER_DETAILS_BY_HOUR.value,
            "technical-failures-percentage": "15.38",
            "total-technical-failures": "2",
            "total-transfers": "13",
            "send-email-notification": "True",
        }

        actual_transfer_details_by_hour_s3_metadata = _read_s3_metadata(
            output_reports_bucket, transfer_details_by_hour_s3_path
        )

        assert actual_transfer_details_by_hour_s3_metadata == expected_metadata

    finally:
        output_reports_bucket.objects.all().delete()
        output_reports_bucket.delete()
        input_transfer_bucket.objects.all().delete()
        input_transfer_bucket.delete()
        fake_s3.stop()
        environ.clear()
