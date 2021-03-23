import featureTogglesJson from "../../../../featureToggles.json";
import { useState, useEffect, createContext, useContext } from "react";
import { getEnv } from "../../utils/getEnv";

// TODO: fix below
export type FeatureToggles = any;

export const defaultToggleState = {
  showSomePage: false,
};

export const FeatureTogglesContext = createContext<FeatureToggles>(
  defaultToggleState
);

const PROD_ENV = "prod";
const DEV_ENV = "dev";

const getUrlParam = (paramName: string) => {
  const params = new URLSearchParams(window.location.search.toLowerCase());
  return params.get(paramName.toLowerCase());
};

const getDevFeatureToggles = async (): Promise<FeatureToggles> => {
  const featureToggles = await featureTogglesJson[DEV_ENV];

  Object.keys(featureToggles).map(featureToggleName => {
    const urlParam = getUrlParam(featureToggleName);
    if (urlParam === "true" || urlParam === "false") {
      // @ts-ignore
      featureToggles[featureToggleName] = urlParam === "true";
    }
  });
  // @ts-ignore
  return featureToggles;
};

export function useFetchFeatureToggles() {
  const [toggles, setToggles] = useState<FeatureToggles>(defaultToggleState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async function() {
      // @ts-ignore
      const featureToggles =
        getEnv() === DEV_ENV
          ? await getDevFeatureToggles()
          : await featureTogglesJson[PROD_ENV];
      setToggles(featureToggles);
      setIsLoading(false);
    })();
  }, []);

  return { toggles, isLoadingToggles: isLoading };
}

export function useFeatureToggles(): FeatureToggles {
  return useContext(FeatureTogglesContext);
}
