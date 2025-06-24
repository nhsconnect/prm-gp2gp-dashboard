from collections import defaultdict
from dataclasses import dataclass
from typing import DefaultDict, Iterable, List


@dataclass
class OdsAsid:
    ods_code: str
    asid: str


class AsidLookup:
    @classmethod
    def from_spine_directory_format(cls, rows: Iterable[dict]):
        return cls([OdsAsid(row["NACS"], row["ASID"]) for row in rows])

    def __init__(self, mappings: Iterable[OdsAsid]):
        self._ods_asid_mapping = _construct_ods_asid_mapping(mappings)

    def has_ods(self, ods_code: str):
        return ods_code in self._ods_asid_mapping

    def get_asids(self, ods_code):
        return self._ods_asid_mapping[ods_code]


def _construct_ods_asid_mapping(mappings: Iterable[OdsAsid]) -> defaultdict:
    ods_asid_mapping: DefaultDict[str, List[str]] = defaultdict(list)
    for mapping in mappings:
        ods_asid_mapping[mapping.ods_code].append(mapping.asid)
    return ods_asid_mapping
