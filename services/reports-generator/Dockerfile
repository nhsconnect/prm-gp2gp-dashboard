FROM python:3.9-slim

COPY . /prmreportsgenerator

ARG IMAGE_TAG
ENV BUILD_TAG=${IMAGE_TAG}

RUN cd /prmreportsgenerator && python setup.py install

ENTRYPOINT ["python", "-m", "prmreportsgenerator.main"]
