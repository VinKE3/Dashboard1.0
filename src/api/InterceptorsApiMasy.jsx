import { useContext, useEffect } from "react";
import APIErrorContext from "../context/ContextError";
import Swal from "sweetalert2";
import ApiMasy from "./ApiMasy";

function Interceptor({ children }) {
  const { addError } = useContext(APIErrorContext);
  useEffect(() => {
    ApiMasy.interceptors.response.use(
      (response) => {
        if (response.status === 201) {
          Swal.fire({
            icon: "success",
            title: "Exito",
            text: "Operación realizada con éxito",
          });
        }
        return response;
      },
      (error) => {
        if (error.response.status === 401) {
          addError("No tiene permisos para realizar esta operación" + error);
        }
        if (error.response.status === 400) {
          console.log(error.response.data.messages[0].tipo);
          console.log(error.response.data.messages[0].textos);
        }
        if (error.response.status === 500) {
          console.log(error.response.data.messages[0].tipo);
        }
      }
    );
  }, []);

  return <>{children}</>;
}

export default Interceptor;
