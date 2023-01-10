FROM node:16.14.2-buster
COPY . /tmp

ARG IMAGE_TAG
ENV BUILD_TAG=${IMAGE_TAG}
ENV DATA_BUCKET_ENV="dev"
#RUN cd /tmp && npm run ci --production -y
#RUN npm run build:ci
#ENTRYPOINT ["npm", "run", "getPracticeMetrics:stub"]

WORKDIR /tmp
CMD ["node", "./scripts/testLog.js"]

ENTRYPOINT ["npm", "run", "getPracticeMetrics:stub"]
RUN dir -s