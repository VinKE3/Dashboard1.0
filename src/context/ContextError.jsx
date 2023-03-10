import React, { createContext, useState } from "react";

const ApiContext = createContext({
  error: null,
  setError: () => {},
});

export const ApiContextProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const contextValue = {
    error,
    setError,
  };

  return (
    <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>
  );
};

export default ApiContext;
// import React, { createContext, useState, useCallback } from "react";

// export const APIErrorContext = createContext({
//   error: null,
//   addError: () => {},
//   removeError: () => {},
// });

// export default function APIErrorProvider({ children }) {
//   const [error, setError] = useState(null);

//   const removeError = () => setError(null);

//   const addError = (message, status) => setError({ message, status });

//   const contextValue = {
//     error,
//     addError: useCallback((message, status) => addError(message, status), []),
//     removeError: useCallback(() => removeError(), []),
//   };

//   return (
//     <APIErrorContext.Provider value={contextValue}>
//       {children}
//     </APIErrorContext.Provider>
//   );
// }

//context for errors

// import React, { createContext, useState } from "react";

// const APIErrorContext = createContext();

// export function APIErrorProvider({ children }) {
//   const values = useAPIErrorProvider();
//   return (
//     <APIErrorContext.Provider value={values}>
//       {children}
//     </APIErrorContext.Provider>
//   );
// }

// export const useAPIError = () => {
//   return useContext(APIErrorContext);
// };

// export const useAPIErrorProvider = () => {
//   const [error, setError] = useState(null);

//   const addError = (error) => {
//     setError(error);
//   };

//   return {
//     error,
//     addError,
//   };
// };

// export default APIErrorContext;
