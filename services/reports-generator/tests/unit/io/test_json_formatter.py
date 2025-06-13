import json
from logging import makeLogRecord

from prmreportsgenerator.io.json_formatter import JsonFormatter


def test_json_formatter_correctly_formats_record():

    record = makeLogRecord(
        {
            "levelname": "warning",
            "msg": "a message",
            "module": "a.module",
            "created": 1607965513.358049,
            "extra_field": "some_value",
            "tuple_field": [(2021, 7), (2021, 6)],
        }
    )

    expected = {
        "level": "warning",
        "message": "a message",
        "module": "a.module",
        "time": "2020-12-14T17:05:13.358049",
        "extra_field": "some_value",
        "tuple_field": [[2021, 7], [2021, 6]],
    }

    actual_json_string = JsonFormatter().format(record)
    actual = json.loads(actual_json_string)

    assert actual == expected
