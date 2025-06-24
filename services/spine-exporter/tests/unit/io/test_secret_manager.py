from unittest.mock import MagicMock

from prmexporter.io.secret_manager import SsmSecretManager


def _build_mock_ssm_client(secrets):
    def mock_get_param(**kwargs):
        return {"Parameter": {"Value": secrets[kwargs["Name"]]}}

    mock_ssm_client = MagicMock()
    mock_ssm_client.get_parameter.side_effect = mock_get_param
    return mock_ssm_client


def test_secret_manger_reads_from_ssm():
    secret_name = "fruit"
    secret_value = "mango"
    mock_ssm_client = _build_mock_ssm_client({secret_name: secret_value})

    secret_manager = SsmSecretManager(mock_ssm_client)

    actual_secret_value = secret_manager.get_secret(secret_name)

    assert actual_secret_value == secret_value
    mock_ssm_client.get_parameter.assert_called_once_with(Name=secret_name, WithDecryption=True)
