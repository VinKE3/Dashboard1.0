import React, { createContext, useContext, useState } from "react";

const apiErrorContext = createContext();

export function ApiProvider({ children }) {
  const values = useApiProvider();
  return (
    <apiErrorContext.Provider value={values}>
      {children}
    </apiErrorContext.Provider>
  );
}

export const useApi = () => {
  return useContext(apiErrorContext);
};

export const useApiProvider = () => {
  const [apiStatus, setApiStatus] = useState("");
  const [apiError, setApiError] = useState("");

  const handleApiStatus = (status) => {
    setApiStatus(status);
  };

  const handleApiError = (error) => {
    setApiError(error);
  };

  return {
    apiStatus,
    apiError,
    handleApiStatus,
    handleApiError,
  };
};