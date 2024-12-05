import { useEffect, useState, useCallback } from "react";

// Helper function to send HTTP request
async function sendHttpRequest(url, config) {
  const response = await fetch(url, config);
  const resData = await response.json();

  if (!response.ok) {
    throw new Error(resData.message || 'Something went wrong. Failed to send HTTP request');
  }

  return resData;
}

export default function useHttp(url, config, initialData) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  function clearData(){
    setData(initialData);
  }

  // The function to send the request
  const sendRequest = useCallback(
    async function sendRequest(data) {
    setIsLoading(true);
    try {
      const resData = await sendHttpRequest(url, {...config,body:data});
      setData(resData);  // Set response data
    } catch (error) {
      setError(error.message || "Something went wrong");
    }
    setIsLoading(false);
  }, [url, config]);

  useEffect(() => {
    if ((config && (config.method === "GET"|| !config.method))|| !config) {
      sendRequest();
    }
  }, [sendRequest, config]);  // Ensure sendRequest is called when `config` changes

  return {
    data,
    isLoading,
    error,
    sendRequest,
    clearData
  };
}
