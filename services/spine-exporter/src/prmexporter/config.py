import logging
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from dateutil.parser import isoparse

logger = logging.getLogger(__name__)


class MissingEnvironmentVariable(Exception):
    pass


class InvalidEnvironmentVariableValue(Exception):
    pass


class EnvConfig:
    def __init__(self, env_vars):
        self._env_vars = env_vars

    def _read_env(self, name: str, optional: bool, converter=None, default=None):  # noqa: C901
        try:
            env_var = self._env_vars[name]
            if converter:
                return converter(env_var)
            else:
                return env_var
        except KeyError:
            if optional:
                return default
            else:
                raise MissingEnvironmentVariable(
                    f"Expected environment variable {name} was not set, exiting..."
                )
        except ValueError:
            raise InvalidEnvironmentVariableValue(
                f"Expected environment variable {name} value is invalid, exiting..."
            )

    def read_str(self, name: str) -> str:
        return self._read_env(name, optional=False)

    def read_optional_str(self, name: str) -> Optional[str]:
        return self._read_env(name, optional=True)

    def read_optional_int(self, name: str, default: int) -> int:
        return self._read_env(name, optional=True, converter=int, default=default)

    def read_optional_datetime(self, name) -> datetime:
        return self._read_env(name, optional=True, converter=isoparse)


@dataclass
class SpineExporterConfig:
    splunk_url: str
    splunk_api_token_param_name: str
    output_spine_data_bucket: str
    build_tag: str
    start_datetime: Optional[datetime]
    end_datetime: Optional[datetime]
    aws_endpoint_url: Optional[str]
    search_wait_time_in_seconds: int

    @classmethod
    def from_environment_variables(cls, env_vars):
        env = EnvConfig(env_vars)
        return cls(
            splunk_url=env.read_str("SPLUNK_URL"),
            splunk_api_token_param_name=env.read_str("SPLUNK_API_TOKEN_PARAM_NAME"),
            output_spine_data_bucket=env.read_str("OUTPUT_SPINE_DATA_BUCKET"),
            build_tag=env.read_str("BUILD_TAG"),
            aws_endpoint_url=env.read_optional_str("AWS_ENDPOINT_URL"),
            start_datetime=env.read_optional_datetime("START_DATETIME"),
            end_datetime=env.read_optional_datetime("END_DATETIME"),
            search_wait_time_in_seconds=env.read_optional_int("SEARCH_WAIT_TIME_IN_SECONDS", 0),
        )
