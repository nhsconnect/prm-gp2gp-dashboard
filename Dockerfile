FROM node:16.14.2-buster
COPY . /tmp

WORKDIR /tmp

CMD npm run getNationalMetrics:stub && npm run getPracticeMetrics:stub && npm run build:ci && npm run deploy:ci