import { useState, useEffect } from "react";
import axios from "axios";

export const useApi = (
  url: string,
  params?: any
): { isLoading: boolean; data: any; error: number | null } => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(url, { params });
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
