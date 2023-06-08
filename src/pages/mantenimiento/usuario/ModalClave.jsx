import React, { useState } from "react";
import ModalCrud from "../../../components/modal/ModalCrud";
import * as G from "../../../components/Global";

const ModalClave = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  //#endregion

  //#region useEffect
  //#endregion

  //#region Funciones
  const HandleData = ({ target }) => {
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
      menu={"Mantenimiento/Usuario/CambiarClave"}
      titulo="Contraseña"
      foco={document.getElementById("tablaUsuario")}
      tamañoModal={[G.ModalPequeño, G.Form]}
    >
      <div className={G.ContenedorBasico}>
        <div className={G.InputFull}>
          <label htmlFor="claveAnterior" className={G.LabelStyle}>
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
            onChange={HandleData}
            className={G.InputStyle}
          />
        </div>
        <div className={G.InputFull}>
          <label htmlFor="claveNueva" className={G.LabelStyle}>
            Clave Nueva
          </label>
          <input
            type="text"
            id="claveNueva"
            name="claveNueva"
            placeholder="Clave Nueva"
            autoComplete="off"
            value={data.claveNueva ?? ""}
            onChange={HandleData}
            className={G.InputStyle}
          />
        </div>
        <div className={G.InputFull}>
          <label htmlFor="claveNuevaConfirmacion" className={G.LabelStyle}>
            Confirmar Clave Nueva
          </label>
          <input
            type="text"
            id="claveNuevaConfirmacion"
            name="claveNuevaConfirmacion"
            placeholder="Confirmar Clave Nueva"
            autoComplete="off"
            value={data.claveNuevaConfirmacion ?? ""}
            onChange={HandleData}
            className={G.InputStyle}
          />
        </div>
      </div>
    </ModalCrud>
  );
};

export default ModalClave;
