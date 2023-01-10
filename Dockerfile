FROM node:16.14.2-buster
COPY . /tmp

ARG IMAGE_TAG
ENV BUILD_TAG=${IMAGE_TAG}
ENV DATA_BUCKET_ENV="dev"

WORKDIR /tmp

CMD ["npm", "run", "getNationalMetrics:ci"]
CMD ["npm", "run", "getPracticeMetrics:stub"]
CMD ["npm", "run", "build:ci"]
CMD ["npm", "run", "deploy"]