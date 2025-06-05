def calculate_number_of_rows(file: bytes) -> int:
    return len(file.decode("utf-8").splitlines())
