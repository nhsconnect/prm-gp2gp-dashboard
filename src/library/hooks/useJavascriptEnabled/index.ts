import { useEffect, useState } from "react";

export function useJavascriptEnabled() {
  const [hasJavascriptEnabled, setJavascriptEnabled] = useState(false);
  useEffect(() => {
    setJavascriptEnabled(true);
  }, []);
  return { hasJavascriptEnabled };
}
