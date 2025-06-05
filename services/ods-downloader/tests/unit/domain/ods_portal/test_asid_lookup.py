from prmods.domain.ods_portal.asid_lookup import AsidLookup, OdsAsid


def test_get_asids_returns_correct_asids_given_one_mapping():
    mappings = [OdsAsid("A12345", "123456789123")]

    asid_lookup = AsidLookup(mappings)

    expected = ["123456789123"]
    actual = asid_lookup.get_asids("A12345")

    assert actual == expected


def test_get_asids_returns_correct_asids_given_multiple_mappings():

    mappings = [
        OdsAsid("B12345", "223456789123"),
        OdsAsid("C12345", "323456789123"),
        OdsAsid("D12345", "023456789123"),
    ]

    asid_lookup = AsidLookup(mappings)

    expected = ["323456789123"]
    actual = asid_lookup.get_asids("C12345")

    assert actual == expected


def test_get_asids_returns_correct_asids_given_two_mappings_with_same_ods():
    mappings = [
        OdsAsid("A12345", "123456789123"),
        OdsAsid("A12345", "8765456789123"),
    ]

    asid_lookup = AsidLookup(mappings)

    expected = ["123456789123", "8765456789123"]
    actual = asid_lookup.get_asids("A12345")

    assert actual == expected


def test_returns_true_if_ods_is_in_mapping():
    mappings = [
        OdsAsid("A12345", "123456789123"),
    ]

    asid_lookup = AsidLookup(mappings)

    expected = True
    actual = asid_lookup.has_ods("A12345")

    assert actual == expected


def test_returns_false_if_ods_is_not_in_mapping():
    mappings = [
        OdsAsid("A12345", "123456789123"),
    ]

    asid_lookup = AsidLookup(mappings)

    expected = False
    actual = asid_lookup.has_ods("B12345")

    assert actual == expected


def test_build_asid_lookup_from_spine_directory_format():
    spine_directory_data = [
        {
            "ASID": "123456789123",
            "NACS": "A12345",
            "OrgName": "A GP",
            "MName": "A Supplier",
            "PName": "A system",
            "OrgType": "GP Practice",
            "PostCode": "X12 2TB",
        },
        {
            "ASID": "8765456789123",
            "NACS": "A12345",
            "OrgName": "A GP",
            "MName": "A Supplier",
            "PName": "A system",
            "OrgType": "GP Practice",
            "PostCode": "X12 2TB",
        },
    ]

    asid_lookup = AsidLookup.from_spine_directory_format(spine_directory_data)

    expected_is_in_mapping = True
    expected_asids = ["123456789123", "8765456789123"]

    actual_is_in_mapping = asid_lookup.has_ods("A12345")
    actual_asids = asid_lookup.get_asids("A12345")

    assert actual_asids == expected_asids
    assert actual_is_in_mapping == expected_is_in_mapping
