import React, { useState } from "react";
import ModalCrud from "../../../components/Modal/ModalCrud";
import * as Global from "../../../components/Global";

const ModalClave = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  //#endregion

  //#region useEffect
  //#endregion

  //#region Funciones
  const ValidarData = ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  //#endregion

  return (
    <ModalCrud
      setModal={setModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "Usuario/CambiarClave"]}
      titulo="Contraseña"
      tamañoModal={[Global.ModalPequeño, Global.Form]}
    >
      <div className={Global.ContenedorBasico}>
        <div className={Global.InputFull}>
          <label htmlFor="claveAnterior" className={Global.LabelStyle}>
            Clave Anterior
          </label>
          <input
            type="text"
            id="claveAnterior"
            name="claveAnterior"
            placeholder="Clave Anterior"
            autoComplete="off"
            autoFocus
            value={data.claveAnterior ?? ""}
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
            autoComplete="off"
            value={data.claveNueva ?? ""}
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
            autoComplete="off"
            value={data.claveNuevaConfirmacion ?? ""}
            onChange={ValidarData}
            className={Global.InputStyle}
          />
        </div>
      </div>
    </ModalCrud>
  );
};

export default ModalClave;
