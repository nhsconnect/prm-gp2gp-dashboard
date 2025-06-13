from unittest.mock import Mock

from prmods.domain.ods_portal.ods_portal_data_fetcher import (
    OdsPortalDataFetcher,
    OrganisationDetails,
)
from tests.builders.ods_portal import build_ods_organisation_data_response


def test_fetch_all_practices_returns_org_details_by_role_when_show_prison_practices_toggled_off():
    mock_ods_client = Mock()
    mock_ods_client.fetch_organisation_data.return_value = [
        build_ods_organisation_data_response(name="GP Practice", org_id="A12345"),
        build_ods_organisation_data_response(name="GP Practice 2", org_id="B12345"),
    ]

    ods_portal_data_fetcher = OdsPortalDataFetcher(ods_client=mock_ods_client)

    expected = [
        OrganisationDetails(name="GP Practice", ods_code="A12345"),
        OrganisationDetails(name="GP Practice 2", ods_code="B12345"),
    ]
    actual = ods_portal_data_fetcher.fetch_all_practices(show_prison_practices_toggle=False)

    assert actual == expected
    mock_ods_client.fetch_organisation_data.assert_called_once_with(
        {
            "PrimaryRoleId": "RO177",
            "Status": "Active",
            "NonPrimaryRoleId": "RO76",
            "Limit": "1000",
        }
    )


def test_fetch_all_practices_returns_org_details_when_show_prison_practices_toggled_on():
    mock_ods_client = Mock()
    mock_ods_client.fetch_organisation_data.return_value = [
        build_ods_organisation_data_response(name="GP Practice", org_id="A12345"),
        build_ods_organisation_data_response(name="GP Practice 2", org_id="B12345"),
    ]

    ods_portal_data_fetcher = OdsPortalDataFetcher(ods_client=mock_ods_client)

    expected = [
        OrganisationDetails(name="GP Practice", ods_code="A12345"),
        OrganisationDetails(name="GP Practice 2", ods_code="B12345"),
    ]
    actual = ods_portal_data_fetcher.fetch_all_practices(show_prison_practices_toggle=True)

    assert actual == expected
    mock_ods_client.fetch_organisation_data.assert_called_once_with(
        {
            "Status": "Active",
            "Roles": "RO177,RO82,RO257,RO251,RO260",
            "Limit": "1000",
        }
    )


def test_fetch_all_sicbls_returns_a_list_of_organisation_details():
    mock_ods_client = Mock()
    mock_ods_client.fetch_organisation_data.return_value = [
        build_ods_organisation_data_response(name="SICBL", org_id="12A"),
        build_ods_organisation_data_response(name="SICBL 2", org_id="34B"),
    ]

    ods_portal_data_fetcher = OdsPortalDataFetcher(ods_client=mock_ods_client)

    expected = [
        OrganisationDetails(name="SICBL", ods_code="12A"),
        OrganisationDetails(name="SICBL 2", ods_code="34B"),
    ]

    actual = ods_portal_data_fetcher.fetch_all_sicbls()

    assert actual == expected
    mock_ods_client.fetch_organisation_data.assert_called_once_with(
        {
            "PrimaryRoleId": "RO98",
            "Status": "Active",
            "Limit": "1000",
        }
    )


def test_fetch_practices_for_sicbl_returns_a_list_of_organisation_details():
    mock_ods_client = Mock()
    mock_ods_client.fetch_organisation_data.return_value = [
        build_ods_organisation_data_response(name="GP Practice", org_id="A12345"),
        build_ods_organisation_data_response(name="GP Practice 2", org_id="B12345"),
    ]

    ods_portal_data_fetcher = OdsPortalDataFetcher(ods_client=mock_ods_client)

    expected = [
        OrganisationDetails(name="GP Practice", ods_code="A12345"),
        OrganisationDetails(name="GP Practice 2", ods_code="B12345"),
    ]

    actual = ods_portal_data_fetcher.fetch_practices_for_sicbl("12A")

    assert actual == expected
    mock_ods_client.fetch_organisation_data.assert_called_once_with(
        {"RelTypeId": "RE4", "RelStatus": "active", "Limit": "1000", "TargetOrgId": "12A"}
    )
