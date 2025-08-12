from unittest.mock import MagicMock

import pytest

from prmexporter.io.http_client import HttpClient, HttpClientException


def _build_mock_response(content=None, messages=None, status_code=200):
    mock_response = MagicMock()
    mock_response.content = content
    mock_response.messages = messages
    mock_response.status_code = status_code
    return mock_response


def test_makes_an_api_call_to_given_url_with_auth_token_and_returns_data():
    mock_client = MagicMock()
    test_url = "https://test.com"
    test_token = "Abc123"
    request_body = {"post": "data"}
    mock_response = _build_mock_response(
        content=b'{"data": [{"fruit": "mango", "colour": "orange"}]}'
    )

    mock_client.post.side_effect = [mock_response]

    http_client = HttpClient(client=mock_client)

    expected_header = {"Authorization": f"Bearer {test_token}"}
    expected_data = b'{"data": [{"fruit": "mango", "colour": "orange"}]}'

    actual_data = http_client.make_request(
        url=test_url, auth_token=test_token, request_body=request_body
    )

    mock_client.post.assert_called_with(url=test_url, data=request_body, headers=expected_header)
    assert actual_data == expected_data


def test_throws_exception_when_status_code_is_not_200():
    mock_client = MagicMock()
    test_token = "Abc123"
    mock_response = _build_mock_response(status_code=500)

    mock_client.post.side_effect = [mock_response]

    http_client = HttpClient(client=mock_client)

    with pytest.raises(HttpClientException) as e:
        http_client.make_request(url="test.com", auth_token=test_token)

    assert str(e.value).find(
        "Unable to fetch data from test.com with status code: 500 and response: Some error message"
    )
