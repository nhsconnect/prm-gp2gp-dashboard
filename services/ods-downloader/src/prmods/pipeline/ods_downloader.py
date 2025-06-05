import logging
from dataclasses import asdict
from datetime import datetime

import boto3
from dateutil.relativedelta import relativedelta

from prmods.domain.ods_portal.asid_lookup import AsidLookup
from prmods.domain.ods_portal.metadata_service import (
    Gp2gpOrganisationMetadataService,
    MetadataServiceObservabilityProbe,
    OrganisationMetadata,
)
from prmods.domain.ods_portal.ods_portal_client import OdsPortalClient
from prmods.domain.ods_portal.ods_portal_data_fetcher import OdsPortalDataFetcher
from prmods.pipeline.s3_uri_resolver import OdsDownloaderS3UriResolver
from prmods.utils.io.s3 import S3DataManager

logger = logging.getLogger(__name__)


class OdsDownloader:
    def __init__(self, config):
        self._s3_client = boto3.resource("s3", endpoint_url=config.s3_endpoint_url)
        self._s3_manager = S3DataManager(self._s3_client)

        self._config = config
        self._uris = OdsDownloaderS3UriResolver(
            asid_lookup_bucket=self._config.mapping_bucket,
            ods_metadata_bucket=self._config.output_bucket,
        )

        ods_client = OdsPortalClient(search_url=self._config.search_url)
        ods_data_fetcher = OdsPortalDataFetcher(ods_client=ods_client)
        probe = MetadataServiceObservabilityProbe()
        self._metadata_service = Gp2gpOrganisationMetadataService(
            data_fetcher=ods_data_fetcher, observability_probe=probe
        )

        self._output_metadata = {
            "date-anchor": self._config.date_anchor.isoformat(),
            "build-tag": self._config.build_tag,
        }

    def _add_asid_lookup_month_to_metadata(self, asid_lookup_datetime: datetime):
        self._output_metadata[
            "asid-lookup-month"
        ] = f"{asid_lookup_datetime.year}-{asid_lookup_datetime.month}"

    def _read_asid_lookup(self, date_anchor: datetime) -> AsidLookup:
        asid_lookup_s3_path = self._uris.asid_lookup(date_anchor)
        raw_asid_lookup = self._s3_manager.read_gzip_csv(asid_lookup_s3_path)
        return AsidLookup.from_spine_directory_format(raw_asid_lookup)

    def _read_previous_month_asid_lookup(self):
        previous_month_datetime = self._config.date_anchor - relativedelta(months=1)
        self._add_asid_lookup_month_to_metadata(previous_month_datetime)

        try:
            return self._read_asid_lookup(previous_month_datetime)
        except self._s3_client.meta.client.exceptions.NoSuchKey:
            logger.error(
                "ASID lookup files not found for both current and previous month, exiting...",
                extra={
                    "event": "ASID_LOOKUP_FILES_NOT_FOUND_IN_S3",
                    "current_month": (
                        f"{self._config.date_anchor.year}-{self._config.date_anchor.month}"
                    ),
                    "previous_month": (
                        f"{previous_month_datetime.year}-{previous_month_datetime.month}"
                    ),
                },
            )
            raise FileNotFoundError(
                "ASID lookup files not found for both current and previous month"
            )

    def _read_most_recent_asid_lookup(self) -> AsidLookup:
        try:
            self._add_asid_lookup_month_to_metadata(self._config.date_anchor)
            return self._read_asid_lookup(self._config.date_anchor)

        except self._s3_client.meta.client.exceptions.NoSuchKey:
            return self._read_previous_month_asid_lookup()

    def _write_ods_metadata(self, organisation_metadata: OrganisationMetadata):
        metadata_output_s3_path = self._uris.ods_metadata(self._config.date_anchor)
        self._s3_manager.write_json(
            metadata_output_s3_path, asdict(organisation_metadata), self._output_metadata
        )

    def run(self):
        asid_lookup = self._read_most_recent_asid_lookup()
        practice_metadata = self._metadata_service.retrieve_practices_with_asids(
            asid_lookup=asid_lookup,
            show_prison_practices_toggle=self._config.show_prison_practices_toggle,
        )
        sicbl_metadata = self._metadata_service.retrieve_sicbl_practice_allocations(
            canonical_practice_list=practice_metadata
        )
        organisation_metadata = OrganisationMetadata.from_practice_and_sicbl_lists(
            practice_metadata,
            sicbl_metadata,
            self._config.date_anchor.year,
            self._config.date_anchor.month,
        )
        self._write_ods_metadata(organisation_metadata)
