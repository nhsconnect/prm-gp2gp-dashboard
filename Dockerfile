FROM node:16.14.2-buster

# Copy only required files for building and deploying pipeline
COPY analytics-config.json /tmp/analytics-config.json
COPY custom.d.ts /tmp/custom.d.ts
COPY featureToggles.json /tmp/featureToggles.json
COPY gatsby-config.js /tmp/gatsby-config.js
COPY gatsby-node.js /tmp/gatsby-node.js
COPY gatsby-ssr.js /tmp/gatsby-ssr.js
COPY node_modules /tmp/node_modules
COPY package-lock.json /tmp/package-lock.json
COPY package.json /tmp/package.json
COPY s3-config.js /tmp/s3-config.js
COPY src /tmp/src
COPY scripts/*.js /tmp/scripts
COPY static /tmp/static
COPY tsconfig.json /tmp/tsconfig.json

WORKDIR /tmp

CMD npm run getNationalMetrics:ci && npm run getPracticeMetrics:ci && npm run build:ci && npm run deploy:ci
