import { useState, useEffect } from "react";
import axios from "axios";

export const useApi = (url, params = null) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url, { params });
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(error.response.status);
        setIsLoading(false);
      }
    };
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return [isLoading, data, error];
};
