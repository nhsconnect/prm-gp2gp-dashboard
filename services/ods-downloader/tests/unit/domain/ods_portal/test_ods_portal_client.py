from typing import Dict
from unittest.mock import MagicMock

import pytest

from prmods.domain.ods_portal.ods_portal_client import OdsPortalClient, OdsPortalException
from tests.builders.ods_portal import build_mock_response

MOCK_PARAMS: Dict[str, str] = {}


def test_returns_a_list_of_organisations():
    http_client = MagicMock()
    mock_response = build_mock_response(
        content=b'{"Organisations": [{"Name": "GP Practice", "OrgId": "A12345"}]}'
    )

    http_client.get.side_effect = [mock_response]

    ods_client = OdsPortalClient(http_client)

    expected = [{"Name": "GP Practice", "OrgId": "A12345"}]

    actual = ods_client.fetch_organisation_data(MOCK_PARAMS)

    assert actual == expected


def test_returns_combined_list_of_organisations_given_several_pages_query():
    http_client = MagicMock()

    url_1 = "https://test.link/1"
    url_2 = "https://test.link/2"
    url_3 = "https://test.link/3"

    pages = {
        url_1: build_mock_response(
            content=b'{"Organisations": [{"Name": "GP Practice", "OrgId": "A12345"}]}',
            next_page=url_2,
        ),
        url_2: build_mock_response(
            content=b'{"Organisations": [{"Name": "GP Practice 2", "OrgId": "B64573"}]}',
            next_page=url_3,
        ),
        url_3: build_mock_response(
            content=b'{"Organisations": [{"Name": "GP Practice 3", "OrgId": "Y23467"}]}'
        ),
    }

    http_client.get.side_effect = lambda *args: pages[args[0]]

    ods_client = OdsPortalClient(http_client, search_url=url_1)

    expected = [
        {"Name": "GP Practice", "OrgId": "A12345"},
        {"Name": "GP Practice 2", "OrgId": "B64573"},
        {"Name": "GP Practice 3", "OrgId": "Y23467"},
    ]

    actual = ods_client.fetch_organisation_data(MOCK_PARAMS)

    assert actual == expected


def test_throws_ods_portal_exception_when_status_code_is_not_200():
    http_client = MagicMock()
    mock_response = build_mock_response(status_code=500)

    http_client.get.side_effect = [mock_response]

    ods_client = OdsPortalClient(http_client)

    with pytest.raises(OdsPortalException):
        ods_client.fetch_organisation_data(MOCK_PARAMS)


def test_throws_ods_portal_exception_when_status_code_is_not_200_on_paginated_request():
    http_client = MagicMock()

    url_1 = "https://test.link/1"
    url_2 = "https://test.link/2"

    pages = {
        url_1: build_mock_response(
            content=b'{"Organisations": [{"Name": "GP Practice", "OrgId": "A12345"}]}',
            next_page=url_2,
        ),
        url_2: build_mock_response(status_code=500),
    }

    http_client.get.side_effect = lambda *args: pages[args[0]]

    ods_client = OdsPortalClient(http_client, search_url=url_1)

    with pytest.raises(OdsPortalException):
        ods_client.fetch_organisation_data(MOCK_PARAMS)
