import React, { useEffect } from "react";

function Enter({ children, contenedor }) {
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
        // document.querySelector(contenedor).querySelectorAll("input, select, button, table")
        const inputs = Array.from(
          document.querySelectorAll("input, select, button, table")
        );
        // console.log(inputs);
        const foco = inputs.indexOf(elementoActivo);
        let siguienteElemento = (foco + 1) % inputs.length;
        while (inputs[siguienteElemento].disabled) {
          siguienteElemento = (siguienteElemento + 1) % inputs.length;
        }
        e.preventDefault();
        if (inputs[foco].tagName != "TABLE") {
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
