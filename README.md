# prm-gp2gp-dashboard

## Dependencies

- `Node.js 12.13`
- `npm 6.12`
- `git`

## How to run the site locally

### Initial set up

1. `git clone git@github.com:nhsconnect/prm-gp2gp-dashboard.git`
2. `cd prm-gp2gp-dashboard`
3. `npm install`

GP2GP metrics and metadata JSON files are then required to build the dashboard. There are two options - to either retrieve them from the Data Pipeline Github repo, or to download them from S3. Below are instructions for both:

#### Retrieving required JSON files from Data Pipeline Github Repo

1. Run `./tasks get-stubs`
2. Look inside `src/data/organisations` and there should be the following JSON files - nationalMetrics.json, organisationMetrics.json and practiceMetrics.json
3. Run `npm run develop`
   - N.B. This will run a local mock server that will mock API calls made dynamically on page load.
   - It will then build, with hot-reloading enabled and with test CCG and GP practices.

#### Retrieving required JSON files from S3

To retrieve these files from S3 you will need to be authenticated with AWS. It will overwrite the JSON files that you already have.

1. `./tasks get-metrics <environment> && ./tasks get-metadata <environment>`
   - Only available environments are dev or prod.
2. `npm run develop`

### Running the production build of the site

1. `npm run build`
2. `npm run serve`
   - N.B. Hot-reloading is not enabled, therefore after any changes are made you will need to repeat the above steps.

## End to end (E2E) tests

1. `npm install`
2. `npm run develop`
3. `npm run e2e:open` (in a separate terminal)
   - This will open the Cypress test runner.

To run the E2E tests in CI mode, run `npm run build` then run `./tasks dojo-test-e2e`. If you'd like to run the E2E tests in CI mode and open the Cypress test runner, run `npm run build` and then `npm test:e2e:open`.

If cypress has not been fully installed by npm you can force it to install the cypress binary by running `./node_modules/.bin/cypress install`.

## Updating for a new month

When updating for a new month the keys will need to be changed in s3-config.json and steps 3-4 above will need to be rerun.
