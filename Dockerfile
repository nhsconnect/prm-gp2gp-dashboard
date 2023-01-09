FROM node:16.14.2-buster
COPY . /tmp

ENV DATA_BUCKET_ENV="dev"
#RUN cd /tmp && npm run ci --production -y
#RUN npm run build:ci
#ENTRYPOINT ["npm", "run", "getPracticeMetrics:stub"]

ENTRYPOINT ["node", "/tmp/scripts/testLog.js"]