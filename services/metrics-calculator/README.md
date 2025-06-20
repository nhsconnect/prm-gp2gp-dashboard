# prm-gp2gp-metrics-calculator

Metrics calculator for the gp registrations data platform.

## Configuration

Configuration is achieved via the following environment variables:

| Environment variable                     | Description                                                                                       |
|------------------------------------------|---------------------------------------------------------------------------------------------------|
| INPUT_TRANSFER_DATA_BUCKET               | Bucket to read transfer files from.                                                               |
| OUTPUT_METRICS_BUCKET                    | Bucket to write metrics.                                                                          |
| NUMBER_OF_MONTHS                         | Optional Number of months to create metrics for (historical data). Defaults to 6                  |
| BUILD_TAG                                | Unique identifier for version of code build tag (e.g. short git hash)                             |
| DATE_ANCHOR                              | ISO-8601 datetime specifying "now". Example date "2022-01-15T10:16:00Z"                           |
| NATIONAL_METRICS_S3_PATH_PARAM_NAME      | String that is the AWS SSM Parameter Name where the National Metrics S3 path will be outputted to |
| PRACTICE_METRICS_S3_PATH_PARAM_NAME      | String that is the AWS SSM Parameter Name where the Practice Metrics S3 path will be outputted to |

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
   The path should look like this: `/Users/janeDoe/.local/share/virtualenvs/prm-gp2gp-metrics-calculator-NXBCQ41T/bin/python3.9`


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

If running `./tasks check-deps` fails due to an outdated version of pip, yet works when running it in dojo (i.e. `./tasks dojo-deps`), then the local python environment containing pipenv may need to be updated (using pyenv instead of brew - to better control the pip version).
Ensure you have pyenv installed (use `brew install pyenv`).
Perform the following steps:

1. Run `brew uninstall pipenv`
2. Run the steps listed under [Install new python and set as default](#install-new-python-and-set-as-default) and [Installing pipenv and updating pip](#installing-pipenv-and-updating-pip)
3. Now running `./tasks check-deps` should pass.

#### Python virtual environments

If you see the below notice when trying to activate the python virtual environment, run `deactivate` before trying again.

> Courtesy Notice: Pipenv found itself running within a virtual environment, so it will automatically use that environment, instead of creating its own for any project. You can set PIPENV_IGNORE_VIRTUALENVS=1 to force pipenv to ignore that environment and create its own instead. You can set PIPENV_VERBOSITY=-1 to suppress this warning.
