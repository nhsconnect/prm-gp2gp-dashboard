import featureTogglesJson from "../../../../featureToggles.json";
import { useState, useEffect } from "react";
import { getEnv } from "../../utils/getEnv";

export type FeatureToggles = {
  showSomePage: boolean;
};

export const defaultToggleState = {
  showSomePage: false,
};

export function useFeatureToggles() {
  const [toggles, setToggles] = useState<FeatureToggles>(defaultToggleState);

  useEffect(() => {
    (async function() {
      // @ts-ignore
      const featureToggles = featureTogglesJson[getEnv()];
      await setToggles(featureToggles);
    })();
  }, []);

  return toggles;
}
