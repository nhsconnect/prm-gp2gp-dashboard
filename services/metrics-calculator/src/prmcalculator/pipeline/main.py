import logging
import sys
from os import environ

from prmcalculator.pipeline.config import PipelineConfig
from prmcalculator.pipeline.metrics_calculator import MetricsCalculator
from prmcalculator.utils.io.json_formatter import JsonFormatter

logger = logging.getLogger("prmcalculator")


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
        MetricsCalculator(config).run()
    except Exception as ex:
        logger.error(str(ex), extra={"event": "FAILED_TO_RUN_MAIN", "config": config.__str__()})
        sys.exit("Failed to run main, exiting...")


if __name__ == "__main__":
    main()
