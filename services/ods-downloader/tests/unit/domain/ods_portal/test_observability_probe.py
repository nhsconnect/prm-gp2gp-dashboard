from unittest.mock import Mock

from prmods.domain.ods_portal.metadata_service import MetadataServiceObservabilityProbe


def test_probe_should_log_warning_given_missing_ods_code():
    mock_logger = Mock()
    probe = MetadataServiceObservabilityProbe(mock_logger)

    probe.record_asids_not_found("ABC123")

    mock_logger.warning.assert_called_once_with(
        "ASIDS not found for ODS code: ABC123",
        extra={"event": "ASIDS_NOT_FOUND", "ods_code": "ABC123"},
    )


def test_probe_should_log_warning_given_duplicate_organisation():
    mock_logger = Mock()
    probe = MetadataServiceObservabilityProbe(mock_logger)

    probe.record_duplicate_organisation("X45")

    mock_logger.warning.assert_called_once_with(
        "Duplicate ODS code found: X45",
        extra={"event": "DUPLICATE_ODS_CODE_FOUND", "ods_code": "X45"},
    )
