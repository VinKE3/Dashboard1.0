import { useContext } from "react";
import { APIErrorContext } from "../context/ContextError";

function useApiError() {
  const { error, addError, removeError } = useContext(APIErrorContext);

  return { error, addError, removeError };
}

export default useApiError;
