from datetime import datetime

from prmcalculator.pipeline.s3_uri_resolver import PlatformMetricsS3UriResolver
from tests.builders.common import a_datetime, a_string


def test_resolver_returns_correct_practice_metrics_uri_with_default_version():
    data_platform_metrics_bucket = a_string()
    date_anchor = a_datetime()
    year = date_anchor.year
    month = date_anchor.month

    uri_resolver = PlatformMetricsS3UriResolver(
        data_platform_metrics_bucket=data_platform_metrics_bucket,
        transfer_data_bucket=a_string(),
    )

    actual = uri_resolver.practice_metrics((year, month))

    expected_filename = f"{year}-{month}-practiceMetrics.json"
    expected = f"s3://{data_platform_metrics_bucket}/v12/{year}/{month}/{expected_filename}"

    assert actual == expected


def test_resolver_returns_correct_practice_metrics_uri_with_specified_version():
    data_platform_metrics_bucket = a_string()
    date_anchor = a_datetime()
    year = date_anchor.year
    month = date_anchor.month

    uri_resolver = PlatformMetricsS3UriResolver(
        data_platform_metrics_bucket=data_platform_metrics_bucket,
        data_platform_metrics_version="v4",
        transfer_data_bucket=a_string(),
    )

    actual = uri_resolver.practice_metrics((year, month))

    expected_filename = f"{year}-{month}-practiceMetrics.json"
    expected = f"s3://{data_platform_metrics_bucket}/v4/{year}/{month}/{expected_filename}"

    assert actual == expected


def test_resolver_returns_correct_practice_metrics_s3_key():
    date_anchor = a_datetime()
    year = date_anchor.year
    month = date_anchor.month

    uri_resolver = PlatformMetricsS3UriResolver(
        data_platform_metrics_bucket=a_string(),
        transfer_data_bucket=a_string(),
    )

    actual = uri_resolver.practice_metrics_key((year, month))

    expected = f"{year}/{month}/{year}-{month}-practiceMetrics.json"

    assert actual == expected


def test_resolver_returns_correct_national_metrics_uri():
    data_platform_metrics_bucket = a_string()
    date_anchor = a_datetime()
    year = date_anchor.year
    month = date_anchor.month

    uri_resolver = PlatformMetricsS3UriResolver(
        data_platform_metrics_bucket=data_platform_metrics_bucket,
        transfer_data_bucket=a_string(),
    )

    actual = uri_resolver.national_metrics((year, month))
    expected_filename = f"{year}-{month}-nationalMetrics.json"
    expected = f"s3://{data_platform_metrics_bucket}/v12/{year}/{month}/{expected_filename}"

    assert actual == expected


def test_resolver_returns_correct_national_metrics_uri_with_specified_version():
    data_platform_metrics_bucket = a_string()
    date_anchor = a_datetime()
    year = date_anchor.year
    month = date_anchor.month

    uri_resolver = PlatformMetricsS3UriResolver(
        data_platform_metrics_bucket=data_platform_metrics_bucket,
        data_platform_metrics_version="v4",
        transfer_data_bucket=a_string(),
    )

    actual = uri_resolver.national_metrics((year, month))
    expected_filename = f"{year}-{month}-nationalMetrics.json"
    expected = f"s3://{data_platform_metrics_bucket}/v4/{year}/{month}/{expected_filename}"

    assert actual == expected


def test_resolver_returns_correct_national_metrics_s3_key():
    date_anchor = a_datetime()
    year = date_anchor.year
    month = date_anchor.month

    uri_resolver = PlatformMetricsS3UriResolver(
        data_platform_metrics_bucket=a_string(),
        transfer_data_bucket=a_string(),
    )

    actual = uri_resolver.national_metrics_key((year, month))

    expected = f"{year}/{month}/{year}-{month}-nationalMetrics.json"

    assert actual == expected


def test_resolver_returns_correct_transfer_data_uris():
    transfer_data_bucket = a_string()

    datetimes = [
        datetime(year=2021, month=12, day=1),
        datetime(year=2021, month=12, day=2),
        datetime(year=2021, month=12, day=3),
    ]

    uri_resolver = PlatformMetricsS3UriResolver(
        data_platform_metrics_bucket=a_string(),
        transfer_data_bucket=transfer_data_bucket,
    )

    actual = uri_resolver.transfer_data(datetimes)

    expected = [
        f"s3://{transfer_data_bucket}/v11/cutoff-14/2021/12/01/2021-12-01-transfers.parquet",
        f"s3://{transfer_data_bucket}/v11/cutoff-14/2021/12/02/2021-12-02-transfers.parquet",
        f"s3://{transfer_data_bucket}/v11/cutoff-14/2021/12/03/2021-12-03-transfers.parquet",
    ]

    assert actual == expected
