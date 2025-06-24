import logging
from dataclasses import dataclass
from datetime import datetime
from typing import Optional

from dateutil.parser import isoparse

from prmods.domain.ods_portal.ods_portal_client import ODS_PORTAL_SEARCH_URL

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

    def read_optional_str(self, name: str, default: Optional[str] = None) -> str:
        return self._read_env(name, optional=True, default=default)

    def read_optional_int(self, name: str) -> Optional[int]:
        return self._read_env(name, optional=True, converter=int)

    @staticmethod
    def _bool_string_converter(string: str) -> bool:
        return True if string == "True" else False

    def read_optional_bool(self, name: str, default: Optional[bool] = False) -> bool:
        return self._read_env(
            name, optional=True, default=default, converter=self._bool_string_converter
        )

    def read_int(self, name: str) -> int:
        return self._read_env(name, optional=False, converter=int)

    def read_optional_datetime(self, name: str) -> datetime:
        return self._read_env(name, optional=True, converter=isoparse)


@dataclass
class OdsPortalConfig:
    output_bucket: str
    mapping_bucket: str
    build_tag: str
    date_anchor: datetime
    search_url: Optional[str]
    show_prison_practices_toggle: Optional[bool]
    s3_endpoint_url: Optional[str] = None

    def __str__(self):
        return str(self.__dict__)

    @classmethod
    def from_environment_variables(cls, env_vars):

        env = EnvConfig(env_vars)
        return cls(
            output_bucket=env.read_str("OUTPUT_BUCKET"),
            mapping_bucket=env.read_str("MAPPING_BUCKET"),
            build_tag=env.read_str("BUILD_TAG"),
            date_anchor=env.read_optional_datetime("DATE_ANCHOR"),
            search_url=env.read_optional_str("SEARCH_URL", default=ODS_PORTAL_SEARCH_URL),
            show_prison_practices_toggle=env.read_optional_bool(
                "SHOW_PRISON_PRACTICES_TOGGLE", default=True
            ),
            s3_endpoint_url=env.read_optional_str("S3_ENDPOINT_URL"),
        )
