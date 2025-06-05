import logging
import sys
from os import environ

from prmreportsgenerator.config import PipelineConfig
from prmreportsgenerator.io.json_formatter import JsonFormatter
from prmreportsgenerator.reports_pipeline import ReportsPipeline

logger = logging.getLogger("prmreportsgenerator")


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
        config = PipelineConfig.from_environment_variables(environ)
        ReportsPipeline(config).run()
    except Exception as ex:
        logger.error(str(ex), extra={"event": "FAILED_TO_RUN_MAIN", "config": config.__str__()})
        sys.exit("Failed to run main, exiting...")


if __name__ == "__main__":
    main()
