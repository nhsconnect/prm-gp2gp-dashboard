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

export function useFetchFeatureToggles() {
  const [toggles, setToggles] = useState<FeatureToggles>(defaultToggleState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async function() {
      // @ts-ignore
      const featureToggles = await featureTogglesJson[getEnv()];
      setToggles(featureToggles);
      setIsLoading(false);
    })();
  }, []);

  return { toggles, isLoadingToggles: isLoading };
}

export function useFeatureToggles(): FeatureToggles {
  return useContext(FeatureTogglesContext);
}
