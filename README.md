# prm-gp2gp-dashboard

## Dependencies

- `Node.js 12.13`
- `npm 6.12`
- `git`

## How to run the site locally

GP2GP metrics and metadata are required to build the dashboard. To retrieve these files from S3 you will need to be authenticated with AWS.

1. `git clone git@github.com:nhsconnect/prm-gp2gp-dashboard.git`
2. `cd prm-gp2gp-dashboard`
3. `./tasks get-metrics && ./tasks get-metadata`
4. `npm run develop`
