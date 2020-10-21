import flags from "../../../../flags.json";
import { useState, useLayoutEffect } from "react";

const PROD_ENV = "prod";
const DEV_ENV = "dev";

const getEnv = () => {
  return process.env.GATSBY_ENV || "dev";
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

  useLayoutEffect(() => {
    if (getEnv() === PROD_ENV) {
      setFeatureIsOn(getProdFeatureToggle(featureFlagName));
    } else {
      setFeatureIsOn(getDevFeatureToggle(featureFlagName));
    }
  }, [featureFlagName]);

  return featureIsOn;
};