import csv
import gzip
from typing import List


def build_csv_bytes(header: List, rows: List) -> bytes:
    def build_line(values):
        return ",".join(values)

    header_line = build_line(header)
    row_lines = [build_line(row) for row in rows]

    return str.encode("\n".join([header_line] + row_lines))


def open_gzip(body: bytes) -> str:
    def build_line(values):
        return ",".join(values)

    with gzip.open(body, mode="rt") as f:
        input_csv = csv.reader(f)
        row_lines = [build_line(row) for row in input_csv]
        return "\n".join(row_lines)
