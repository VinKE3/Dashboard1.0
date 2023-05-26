import React, { useEffect } from "react";
import * as Funciones from "../Funciones/Validaciones";

function Enter({ children }) {
  //#region useEffect
  useEffect(() => {
    document.addEventListener("keydown", KeyDown);
    return () => {
      document.removeEventListener("keydown", KeyDown);
    };
  }, []);
  //#endregion

  //#region Funciones
  const KeyDown = async (e) => {
    if (e.key === "Enter") {
      const elementoActivo = document.activeElement;
      if (
        elementoActivo.tagName === "INPUT" ||
        elementoActivo.tagName === "SELECT" ||
        elementoActivo.tagName === "BUTTON" ||
        elementoActivo.tagName === "TABLE"
      ) {
        const inputs = Array.from(
          document.querySelectorAll("input, select, button, table")
        );
        const foco = inputs.indexOf(elementoActivo);
        let siguienteElemento = (foco + 1) % inputs.length;
        while (inputs[siguienteElemento].disabled) {
          siguienteElemento = (siguienteElemento + 1) % inputs.length;
        }
        e.preventDefault();
        if (document.activeElement.tagName != "TABLE") {
          inputs[siguienteElemento].focus();
        }
      }
    }
  };
  //#endregion

  //#region Render
  return <>{children}</>;
  //#endregion
}

export default Enter;
