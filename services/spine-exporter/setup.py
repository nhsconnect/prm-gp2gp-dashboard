from setuptools import find_packages, setup

setup(
    name="prm-spine-exporter",
    version="1.0.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=["requests>=2.26", "boto3>=1.18", "urllib3==1.26.18"],
)
