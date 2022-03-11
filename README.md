# prm-gp2gp-dashboard

## Dependencies

- `Node.js 16.14`
- `npm 8.3`
- `git`

## How to run the site locally

### Initial set up

1. `git clone git@github.com:nhsconnect/prm-gp2gp-dashboard.git`
2. `cd prm-gp2gp-dashboard`
3. `npm ci`
4. `npm run prepare`

GP2GP metrics JSON files are then required to build the dashboard. There are two options - to either retrieve them from the Data Pipeline Github repo, or to download them from S3. Below are instructions for both:

#### Retrieving required JSON files from Data Pipeline Github Repo (stubbed data)

1. Run `./tasks get-stubs`
2. Look inside `src/data/organisations` and there should be the following JSON files - nationalMetrics.json and practiceMetrics.json
3. Run `npm run develop`
   - This will run a local mock server that will mock API calls made dynamically on page load.
   - It will then build, with hot-reloading enabled and with test CCG and GP practices.
   - E2E tests are configured to test against this stubbed data.

#### Retrieving required JSON files from S3

To retrieve these files from S3 you will need to be authenticated with AWS. It will overwrite the JSON files that you already have.

1. `./tasks get-metrics <environment>`
   - Only available environments are dev or prod.
2. `npm run develop:ci`

Note: due to the nature of the E2E tests relying on having stubbed data, the E2E tests will fail if you have S3 data rather than stubbed data.

### Running the production build of the site

Note: Hot-reloading is not enabled, therefore after any changes are made you will need to repeat the above steps.

#### With stubbed data

1. `npm run build`
2. `npm run serve`

#### With S3 data

1. `npm run build:ci`
2. `npm run serve:ci`

## End to end (E2E) tests

Note: due to the nature of the E2E tests relying on having stubbed data, you will need to ensure you have the stubbed data rather than S3 data when running E2E tests.

### Development build

1. `npm ci`
2. `npm run develop`
3. `npm run e2e:open` (in a separate terminal)
   - This will open the Cypress test runner.

### Production/CI build

To run the E2E tests in CI mode, run `npm run build:ci` then run `./tasks dojo-test-e2e`. If you'd like to run the E2E tests in CI mode and open the Cypress test runner, run `npm run build:ci` and then `npm test:e2e:open`.

If Cypress has not been fully installed by npm you can force it to install the cypress binary by running `./node_modules/.bin/cypress install`.

## Updating for a new month

When updating for a new month the keys will need to be changed in s3-config.json and steps 3-4 above will need to be rerun.
