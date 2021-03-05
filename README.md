# prm-gp2gp-dashboard

## Dependencies

- `Node.js 12.13`
- `npm 6.12`
- `git`

## How to run the site locally

GP2GP metrics and metadata are required to build the dashboard. To retrieve these files from S3 you will need to be authenticated with AWS.

1. `git clone git@github.com:nhsconnect/prm-gp2gp-dashboard.git`
2. `cd prm-gp2gp-dashboard`
3. `./tasks get-metrics <environment> && ./tasks get-metadata <environment>` only available environments are dev or prod.
4. `npm run develop`

## End to end tests

1. `npm install`
2. `npm run develop`
3. `npm run e2e:open` (in a seperate terminal)

This will open the cypress test runner. To run the e2e tests in ci mode use `./tasks dojo-test-e2e`

If cypress has not been fully installed by npm you can force it to install the cypress binary by running `./node_modules/.bin/cypress install`.

## Updating for a new month

When updating for a new month the keys will need to be changed in s3-config.json and steps 3-4 above will need to be rerun.
