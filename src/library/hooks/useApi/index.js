import { useState, useEffect } from "react";
import axios from "axios";

export const useApi = (url, params) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const apiParams = params ? { params } : null;
        const response = await axios.get(url, apiParams);
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(error.response.status);
        setIsLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { isLoading, data, error };
};
