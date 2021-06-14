import featureTogglesJson from "../../../../featureToggles.json";
import { useState, useEffect, createContext, useContext } from "react";
import { getEnv } from "../../utils/getEnv";

export type FeatureTogglesType = Record<string, boolean>;

export const FeatureTogglesContext = createContext<FeatureTogglesType>({});

const PROD_ENV = "prod";
const DEV_ENV = "dev";

const getUrlParam = (paramName: string) => {
  const params = new URLSearchParams(window.location.search.toLowerCase());
  return params.get(paramName.toLowerCase());
};

const getDevFeatureToggles = async (): Promise<FeatureTogglesType> => {
  const defaultFeatureToggles = await featureTogglesJson[DEV_ENV];

  const urlParamToggleOverrides = Object.keys(defaultFeatureToggles).reduce(
    (acc, featureToggleName) => {
      const urlParam = getUrlParam(featureToggleName);
      if (urlParam === "true" || urlParam === "false") {
        // @ts-ignore
        acc[featureToggleName] = urlParam === "true";
      }
      return acc;
    },
    {}
  );

  return { ...defaultFeatureToggles, ...urlParamToggleOverrides };
};

export function useFetchFeatureToggles() {
  const [toggles, setToggles] = useState<FeatureTogglesType>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async function () {
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

export function useFeatureToggles(): FeatureTogglesType {
  return useContext(FeatureTogglesContext);
}
