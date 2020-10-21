import flags from "../../../../flags.json";
import { useEffect, useState } from "react";

const PROD_ENV = "prod";
const DEV_ENV = "dev";

const getEnv = () => {
  const PROD_HOSTNAME =
    "prm-gp2gp-dashboard-dev.s3-website.eu-west-2.amazonaws.com";

  return window.location.hostname === PROD_HOSTNAME ? PROD_ENV : DEV_ENV;
};

const getUrlParam = paramName => {
  const params = new URLSearchParams(window.location.search.toLowerCase());
  return params.get(paramName.toLowerCase());
};

const getProdFeatureToggle = featureFlagName => {
  if (!flags[featureFlagName]) return false;
  return flags[featureFlagName][PROD_ENV];
};

const getDevFeatureToggle = featureFlagName => {
  if (!flags[featureFlagName]) return false;

  const urlParam = getUrlParam(featureFlagName);
  if (urlParam === "true" || urlParam === "false") {
    return urlParam === "true";
  }

  return flags[featureFlagName][DEV_ENV];
};

export const useFeatureToggle = featureFlagName => {
  const [featureIsOn, setFeatureIsOn] = useState(false);

  useEffect(() => {
    if (getEnv() === PROD_ENV) {
      setFeatureIsOn(getProdFeatureToggle(featureFlagName));
    } else {
      setFeatureIsOn(getDevFeatureToggle(featureFlagName));
    }
  }, []);

  return featureIsOn;
};
