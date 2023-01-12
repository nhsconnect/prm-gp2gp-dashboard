FROM node:16.14.2-buster
COPY . /tmp

WORKDIR /tmp

CMD npm run getNationalMetrics:ci && npm run getPracticeMetrics:ci && npm run build:ci && npm run deploy:ci
