FROM node:16.14.2-buster
COPY . /tmp

ARG IMAGE_TAG
ENV BUILD_TAG=${IMAGE_TAG}
ENV DATA_BUCKET_ENV="dev"

WORKDIR /tmp

CMD npm run getNationalMetrics:stub && npm run getPracticeMetrics:stub && npm run build:ci && npm run deploy