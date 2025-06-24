from unittest.mock import MagicMock

from tests.builders.common import a_string


def build_mock_response(content=None, status_code=200, next_page=None):
    mock_response = MagicMock()
    mock_response.content = content
    mock_response.status_code = status_code
    if next_page is not None:
        mock_response.headers = {"Next-Page": next_page}
    return mock_response


def build_ods_organisation_data_response(**kwargs):
    return {
        "Name": kwargs.get("name", a_string()),
        "OrgId": kwargs.get("org_id", a_string()),
        "Status": "Active",
        "OrgRecordClass": kwargs.get("org_record_class", a_string()),
        "PostCode": kwargs.get("post_code", a_string()),
        "LastChangeDate": kwargs.get("last_change_date", a_string()),
        "PrimaryRoleId": kwargs.get("primary_role_id", a_string()),
        "PrimaryRoleDescription": kwargs.get("primary_role_description", a_string()),
        "OrgLink": kwargs.get("org_link", a_string()),
    }
