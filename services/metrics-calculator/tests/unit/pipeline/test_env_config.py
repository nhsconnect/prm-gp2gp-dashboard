from datetime import date, datetime

import pytest
from dateutil.tz import UTC

from prmcalculator.pipeline.config import EnvConfig, InvalidEnvironmentVariableValue


@pytest.mark.parametrize(
    "string",
    ["True", "true", "TRUE", "TrUe"],
)
def test_read_optional_bool_returns_true_given_different_casing(string):
    env = EnvConfig({"OPTIONAL_BOOL_CONFIG": string})
    actual = env.read_optional_bool(name="OPTIONAL_BOOL_CONFIG", default=False)
    expected = True

    assert actual == expected


@pytest.mark.parametrize(
    "string",
    ["False", "false", "FALSE", "FaLse", "mango"],
)
def test_read_optional_bool_returns_false_given_different_casing(string):
    env = EnvConfig({"OPTIONAL_BOOL_CONFIG": string})
    actual = env.read_optional_bool(name="OPTIONAL_BOOL_CONFIG", default=True)
    expected = False

    assert actual == expected


def test_read_optional_int_returns_one_given_string_value_one():
    env = EnvConfig({"OPTIONAL_INT_CONFIG": "1"})
    actual = env.read_optional_int(name="OPTIONAL_INT_CONFIG", default=0)
    expected = 1

    assert actual == expected


def test_read_optional_int_throws_exception_given_invalid_string():
    env = EnvConfig({"OPTIONAL_INT_CONFIG": "one"})

    with pytest.raises(InvalidEnvironmentVariableValue) as e:
        env.read_optional_int(name="OPTIONAL_INT_CONFIG", default=0)
    assert (
        str(e.value)
        == "Expected environment variable OPTIONAL_INT_CONFIG value is invalid, exiting..."
    )


def test_read_optional_datetime_returns_specific_datetime_given_a_datetime():
    env = EnvConfig({"OPTIONAL_DATETIME_CONFIG": "2020-01-30T18:44:49Z"})
    actual = env.read_optional_datetime(name="OPTIONAL_DATETIME_CONFIG")
    expected = datetime(2020, 1, 30, 18, 44, 49, tzinfo=UTC)

    assert actual == expected


def test_read_optional_datetime_returns_now_if_no_env_variable_is_provided():
    env = EnvConfig({})
    actual = env.read_optional_datetime(name="OPTIONAL_DATETIME_CONFIG")
    expected = datetime.combine(date.today(), datetime.min.time())

    assert actual == expected
