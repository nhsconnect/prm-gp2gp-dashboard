from prmexporter.io.file_utils import calculate_number_of_rows

EXPORTED_FILE_IN_BYTES = b"""_time,conversationID,GUID,interactionID,messageSender,messageRecipient,messageRef,jdiEvent,toSystem,fromSystem
    2021-02-06 08:41:48.337 UTC,abc,bcd,IN010000UK13,987654321240,003456789123,bcd,NONE,SupplierC,SupplierA
    2021-02-06 18:02:29.985 UTC,cde,cde,IN010000UK05,123456789123,003456789123,NotProvided,NONE
    2021-02-06 18:03:21.908 UTC,cde,efg,IN030000UK06,003456789123,123456789123,NotProvided,NONE"""


def test_returns_number_of_rows():
    number_of_rows = calculate_number_of_rows(EXPORTED_FILE_IN_BYTES)

    assert number_of_rows == 4


def test_returns_0_number_of_rows():
    number_of_rows = calculate_number_of_rows(b"")

    assert number_of_rows == 0
