import React, { useContext } from "react";
import ApiContext from "../context/ContextError";

const ErrorComponent = () => {
  const { error } = useContext(ApiContext);

  if (!error) {
    return null;
  }

  return <div>Error: {error}</div>;
};

export default ErrorComponent;
