from prmods.pipeline.s3_uri_resolver import OdsDownloaderS3UriResolver
from tests.builders.common import a_datetime, a_string


def test_resolver_returns_correct_asid_lookup_uri_given_date_anchor():
    asid_lookup_bucket = a_string()
    date_anchor = a_datetime()
    year = date_anchor.year
    month = date_anchor.month

    uri_resolver = OdsDownloaderS3UriResolver(
        asid_lookup_bucket=asid_lookup_bucket, ods_metadata_bucket=a_string()
    )

    actual = uri_resolver.asid_lookup(date_anchor)

    expected = f"s3://{asid_lookup_bucket}/{year}/{month}/asidLookup.csv.gz"

    assert actual == expected


def test_resolver_returns_correct_ods_metadata_uri_given_date_anchor():
    ods_metadata_bucket = a_string()
    date_anchor = a_datetime()
    year = date_anchor.year
    month = date_anchor.month

    uri_resolver = OdsDownloaderS3UriResolver(
        asid_lookup_bucket=a_string(), ods_metadata_bucket=ods_metadata_bucket
    )

    actual = uri_resolver.ods_metadata(date_anchor)

    expected = f"s3://{ods_metadata_bucket}/v5/{year}/{month}/organisationMetadata.json"

    assert actual == expected
