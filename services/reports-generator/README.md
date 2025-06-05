# prm-gp2gp-reports-generator

This repo contains the reports generator. It is responsible for generating various reports needed for reporting on
GP2GP. It will put the generated reports (such as the *Transfer outcomes per supplier pathway report*) into an S3 bucket.

## Configuration

### Date range options

There are three different ways to specify the date range that the reports-generator will produce reports for. See below
for more details.

<img width="449" alt="Screenshot 2022-01-31 at 15 53 40" src="https://user-images.githubusercontent.com/72742807/151827010-26b7913a-914a-4450-82af-7cfdee4d879a.png">

### For ad hoc reports

Required environment variables:

- START_DATETIME (must be at midnight)
- END_DATETIME (must be at midnight)
- CONVERSATION_CUTOFF_DAYS
- REPORT_NAME

The reports-generator will then use these to generate a report based on transfers within the start to end datetimes
specified. This is used for ad hoc reports to be generated. Ensure OUTPUT_REPORTS_BUCKET points to the notebook data
bucket.

The S3 output path where the reports will be uploaded to, would include `/custom/` and uses the start datetime to
generate the S3 key.

Example: if we want to generate data from 2022-01-03 to 2022-01-08 inclusively, the start and end datetime should be "2022-01-03T00:00:00Z", "2022-01-09T00:00:00Z" respectively

---

#### Number of days

Required environment variables:

- NUMBER_OF_DAYS (an integer)
- CONVERSATION_CUTOFF_DAYS
- REPORT_NAME

Then the reports-generator will calculate the start date as the today midnight minus the number of days for the
conversation cut off and the number of days specified. It will generate a report from this start datetime for the
specified number of days. This is used for automated purposes.

The S3 output path where the reports will be uploaded to, will include `/x-days/` and uses the start datetime to
generate the S3 key.

---

#### Number of months

Required environment variables:

- NUMBER_OF_MONTHS (an integer)
- CONVERSATION_CUTOFF_DAYS
- REPORT_NAME

If NUMBER_OF_MONTHS=1 then it will generate a report from the 1st of the previous month midnight to the last day in the
previous month at midnight. Or if number of months is more than 1, it will go back that many number of months. This is
used for automated purposes.

The S3 output path where the reports will be uploaded to, will include `/x-months/` and uses the start datetime to
generate the S3 key.

#### Environment variables

Configuration is achieved via the following environment variables:

| Environment variable       | Description                                                                                                                                                                                                        |
|----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| INPUT_TRANSFER_DATA_BUCKET | Bucket to read transfer files from.                                                                                                                                                                                |
| OUTPUT_REPORTS_BUCKET      | Bucket to write the reports.                                                                                                                                                                                       |
| BUILD_TAG                  | Unique identifier for version of code build tag (e.g. short git hash)                                                                                                                                              |
| CONVERSATION_CUTOFF_DAYS   | Integer denoting the number of days for the conversation cutoff.                                                                                                                                                   |
| REPORT_NAME                | Name of report to generate - must be one of the following: *TRANSFER_OUTCOMES_PER_SUPPLIER_PATHWAY*, *TRANSFER_LEVEL_TECHNICAL_FAILURES*, *SUB_ICB_LOCATION_LEVEL_INTEGRATION_TIMES* or *TRANSFER_DETAILS_BY_HOUR* |
| START_DATETIME             | Optional ISO-8601 datetime specifying start of date range to produce reports for (see date range options)                                                                                                          |
| END_DATETIME               | Optional ISO-8601 datetime specifying end of date range to produce reports for (see date range options)                                                                                                            |
| NUMBER_OF_MONTHS           | Optional integer specifying number of whole months to produce reports for (see date range options)                                                                                                                 |
| NUMBER_OF_DAYS             | Optional integer specifying number of days to produce reports for, calculated from today midnight (see date range options)                                                                                         |
| SEND_EMAIL_NOTIFICATION    | Optional boolean specifying whether an email should be sent with the report(s) attached (If not included - defaults to TRUE)                                                                                       |

Example of ISO-8601 datetime that is specified for START_DATETIME and END_DATETIME - "2022-01-19T00:00:00Z".

## Developing

Common development workflows are defined in the `tasks` script.

This project is written in Python 3.9.

### Recommended developer environment

- [pyenv](https://github.com/pyenv/pyenv) to easily switch Python versions.
- [Pipenv](https://pypi.org/project/pipenv/) to manage dependencies and virtual environments.
- [dojo](https://github.com/kudulab/dojo) and [Docker](https://www.docker.com/get-started)
  to run test suites in the same environment used by the CI/CD server.

#### Installing pyenv

```
brew install pyenv
```

#### Configure your shell's environment for Pyenv

```
For zsh:
echo 'eval "$(pyenv init --path)"' >> ~/.zprofile
echo 'eval "$(pyenv init -)"' >> ~/.zshrc
```

#### Install new python and set as default

```
pyenv install 3.9.6
pyenv global 3.9.6
```

#### Installing pipenv and updating pip

In a new shell, run the following:

```
python -m pip install pipenv
python -m pip install -U "pip>=21.1”
```

#### Build a dev env

In a new shell, in the project directory run:

```
./tasks devenv
```

This will create a python virtual environment containing all required dependencies.

#### Configure SDK

To find out the path of this new virtual environment, run:

```
pipenv --venv
```

Now you can configure the IDE. The steps for IntelliJ are following:
1. Go to `File -> Project Structure -> SDK -> Add SDK -> Python SDK -> Existing environments`
2. Click on three dots, paste the virtual environment path from before, and point to the python binary.
   The path should look like this: `/Users/janeDoe/.local/share/virtualenvs/prm-spine-exporter-NTBCQ41T/bin/python3.9`


### Running the unit and integration tests

`./tasks test`

### Running the end to end tests

`./tasks e2e-test`

### Running tests, linting, and type checking

`./tasks validate`

### Running tests, linting, and type checking in a docker container

This will run the validation commands in the same container used by the GoCD pipeline.

`./tasks dojo-validate`

### Auto Formatting

`./tasks format`

### Dependency Scanning

`./tasks check-deps`

- If this fails when running outside of Dojo, see [troubleshooting section](### Troubleshooting)

### Troubleshooting

#### Checking dependencies fails locally due to pip

If running `./tasks check-deps` fails due to an outdated version of pip, yet works when running it in dojo (
i.e. `./tasks dojo-deps`), then the local python environment containing pipenv may need to be updated (using pyenv
instead of brew - to better control the pip version). Ensure you have pyenv installed (use `brew install pyenv`).
Perform the following steps:

1. Run `brew uninstall pipenv`
2. Run the steps listed under [Install new python and set as default](#install-new-python-and-set-as-default) and [Installing pipenv and updating pip](#installing-pipenv-and-updating-pip)
3. Now running `./tasks check-deps` should pass.

#### Python virtual environments

If you see the below notice when trying to activate the python virtual environment, run `deactivate` before trying
again.

> Courtesy Notice: Pipenv found itself running within a virtual environment, so it will automatically use that environment, instead of creating its own for any project. You can set PIPENV_IGNORE_VIRTUALENVS=1 to force pipenv to ignore that environment and create its own instead. You can set PIPENV_VERBOSITY=-1 to suppress this warning.
