import logging
import sys
from os import environ

from prmods.pipeline.config import OdsPortalConfig
from prmods.pipeline.ods_downloader import OdsDownloader
from prmods.utils.io.json_formatter import JsonFormatter

logger = logging.getLogger("prmods")


def _setup_logger():
    logger.setLevel(logging.INFO)
    formatter = JsonFormatter()
    handler = logging.StreamHandler()
    handler.setFormatter(formatter)
    logger.addHandler(handler)


def main():
    config = {}
    try:
        _setup_logger()
        config = OdsPortalConfig.from_environment_variables(environ)
        OdsDownloader(config).run()
    except Exception as ex:
        logger.error(str(ex), extra={"event": "FAILED_TO_RUN_MAIN", "config": config.__str__()})
        sys.exit("Failed to run main, exiting...")


if __name__ == "__main__":
    main()
