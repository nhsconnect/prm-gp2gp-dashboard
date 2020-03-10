import { useState, useEffect } from "react";
import axios from "axios";

export const useApi = url => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(error.response.status);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return [isLoading, data, error];
};
