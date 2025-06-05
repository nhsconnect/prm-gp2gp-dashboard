# prm-spine-exporter

This repo contains the spine exporter. It is responsible for retrieving data from Splunk that will be consumed as part of the data pipeline for the GP2GP Data Platform. It will put the retrieved data (Spine messaging logs related to GP2GP) into an S3 bucket.

## Running

The spine exporter can be installed via `python setup.py install`, or packaged into a docker container via `docker build`.
Alternatively, you can download one of the docker containers already published to ECR.

The main code entrypoint is via `python -m prmexporter.main`.


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
pyenv install 3.9.16
pyenv global 3.9.16
```

#### Installing pipenv and updating pip

In a new shell, run the following:
```
python -m pip install -U pipenv
python -m pip install -U "pip>=23.0.1"
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

### Running the unit tests

`./tasks test`

### Running tests, linting, and type checking

`./tasks validate`

### Running tests, linting, and type checking in a docker container

This will run the validation commands in the same container used by the GoCD pipeline.

`./tasks dojo-validate`

### Auto Formatting

This will format the code and the imports.

`./tasks format`

### Dependency Scanning

`./tasks check-deps`

- If this fails when running outside of Dojo, see [troubleshooting section](### Troubleshooting)

### Configuration

#### Date range options
- When START_DATETIME and END_DATETIME are **not** passed then the data retrieved will be for the previous day from midnight plus 24 hours.
- When START_DATETIME and END_DATETIME are passed then the data retrieved will be for a given date range (end datetime is not included in the date range). Each day within the date range will be saved in a separate file.
- When START_DATETIME is passed on its own then the data retrieved will be for the given start datetime from midnight plus 24 hours.
Note: date interpretation is using UTC.

#### Environment variables
Configuration is achieved via the following environment variables:

| Environment variable        | Description                                                                                                                                                                                                   | 
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| SPLUNK_URL                  | URL of the Splunk API                                                                                                                                                                                         |
| SPLUNK_API_TOKEN_PARAM_NAME | AWS Parameter store name which contains the Splunk API token                                                                                                                                                  |
| OUTPUT_SPINE_DATA_BUCKET    | Output S3 Bucket to write the Spine logs                                                                                                                                                                      |
| BUILD_TAG                   | Optional - Unique identifier for version of code build tag (e.g. short git hash)                                                                                                                              |
| START_DATETIME              | Optional - The start date and time for the search results date range from Splunk API (must be at midnight)                                                                                                    |
| END_DATETIME                | Optional - The end date and time for the search results date range from Splunk API (must be at midnight)                                                                                                      |
| SEARCH_WAIT_TIME_IN_SECONDS | Optional - Wait time before making another request to Splunk API (default is 0). When running Spine Exporter task manually for more than 1 day, set to 30 to make sure Splunk is not overloaded with requests |


### Troubleshooting

#### Checking dependencies fails locally due to pip

If running `./tasks check-deps` fails due to an outdated version of pip, yet works when running it in dojo (i.e. `./tasks dojo-deps`), then the local python environment containing pipenv may need to be updated (using pyenv instead of brew - to better control the pip version).
Ensure you have pyenv installed (use `brew install pyenv`).
Perform the following steps:

1. Run `brew uninstall pipenv`
2. Run the steps listed under [Install new python and set as default](#install-new-python-and-set-as-default) and [Installing pipenv and updating pip](#installing-pipenv-and-updating-pip)
3. Now running `./tasks check-deps` should pass.

#### Python virtual environments

If you see the below notice when trying to activate the python virtual environment, run `deactivate` before trying again.

> Courtesy Notice: Pipenv found itself running within a virtual environment, so it will automatically use that environment, instead of creating its own for any project. You can set PIPENV_IGNORE_VIRTUALENVS=1 to force pipenv to ignore that environment and create its own instead. You can set PIPENV_VERBOSITY=-1 to suppress this warning.
