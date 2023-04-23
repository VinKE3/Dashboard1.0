import React, { useState } from "react";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../components/Global";

const ModalClave = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  //#endregion

  //#region useEffect
  //#endregion

  //#region Funciones
  const ValidarData = ({ target }) => {
    const value = uppercase(target.value);
    setData({
      ...data,
      [target.name]: value,
    });
  };
  function uppercase(value) {
    if (value && typeof value === "string") {
      return value.toUpperCase();
    }
    return value;
  }
  //#endregion

  return (
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "Usuario/CambiarClave"]}
      titulo="Contraseña"
      tamañoModal={[Global.ModalPequeño, Global.Form]}
    >
      <div className={Global.InputFull}>
        <label htmlFor="claveAnterior" className={Global.LabelStyle}>
          Clave Anterior
        </label>
        <input
          type="text"
          id="claveAnterior"
          name="claveAnterior"
          placeholder="Clave Anterior"
          value={data.claveAnterior ?? ""}
          autoComplete="off"
          onChange={ValidarData}
          className={Global.InputStyle}
        />
      </div>
      <div className={Global.InputFull}>
        <label htmlFor="claveNueva" className={Global.LabelStyle}>
          Clave Nueva
        </label>
        <input
          type="text"
          id="claveNueva"
          name="claveNueva"
          placeholder="Clave Nueva"
          value={data.claveNueva ?? ""}
          autoComplete="off"
          onChange={ValidarData}
          className={Global.InputStyle}
        />
      </div>
      <div className={Global.InputFull}>
        <label htmlFor="claveNuevaConfirmacion" className={Global.LabelStyle}>
          Confirmar Clave Nueva
        </label>
        <input
          type="text"
          id="claveNuevaConfirmacion"
          name="claveNuevaConfirmacion"
          placeholder="Confirmar Clave Nueva"
          value={data.claveNuevaConfirmacion ?? ""}
          autoComplete="off"
          onChange={ValidarData}
          className={Global.InputStyle}
        />
      </div>
    </ModalBasic>
  );
};

export default ModalClave;
