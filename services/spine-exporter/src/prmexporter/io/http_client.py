import logging
from typing import Optional

logger = logging.getLogger(__name__)


class HttpClientException(Exception):
    pass


class HttpClient:
    def __init__(self, client):
        self._client = client

    def make_request(
        self, url: str, auth_token: str, request_body: Optional[object] = None
    ) -> bytes:
        logger.info(
            "Attempting to make POST request to API",
            extra={
                "event": "ATTEMPTING_POST_REQUEST_TO_API",
                "url": url,
                "request_body": request_body,
            },
        )

        headers = {"Authorization": f"Bearer {auth_token}"}
        response = self._client.post(url=url, data=request_body, headers=headers)

        if response.status_code != 200:
            logger.error(
                f"Unable to fetch data from {url} with status code: {response.status_code} "
                f"and response: {str(response)}",
                extra={
                    "event": "FAILED_TO_FETCH_DATA_FROM_API",
                },
            )

            raise HttpClientException(response)

        logger.info(
            "Successfully fetched data from API",
            extra={
                "event": "SUCCESSFULLY_FETCHED_DATA_FROM_API",
                "url": url,
                "response_status_code": response.status_code,
            },
        )

        return response.content
