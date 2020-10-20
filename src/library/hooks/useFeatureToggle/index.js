import flags from "../../../../flags.json";

const getEnv = () => {
  const PROD_HOSTNAME =
    "prm-gp2gp-dashboard-dev.s3-website.eu-west-2.amazonaws.com";

  return window.location.hostname === PROD_HOSTNAME ? "prod" : "dev";
};

export const useFeatureToggle = featureFlagName => {
  return flags[featureFlagName][getEnv()];
};
