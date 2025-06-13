FROM python:3.9-slim
RUN python --version
COPY . /prmexporter

ARG IMAGE_TAG
ENV BUILD_TAG=${IMAGE_TAG}

RUN cd /prmexporter && python setup.py install

ENTRYPOINT ["python", "-m", "prmexporter.main"]
