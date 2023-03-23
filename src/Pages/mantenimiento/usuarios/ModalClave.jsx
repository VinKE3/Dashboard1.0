import React, { useState, useEffect } from "react";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../Components/Global";
import ApiMasy from "../../../api/ApiMasy";
import Mensajes from "../../../components/Mensajes";

const ModalClave = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState({
    claveAnterior: "",
    claveNueva: "",
    claveNuevaConfirmacion: "",
  });
  //#endregion

  //#region useEffect
  useEffect(() => {
    objeto;
    if (modo != "Clave") {
      setData(objeto);
    }
  }, [objeto]);

  useEffect(() => {
    data;
    console.log(data);
  }, [data]);
  //#endregion

  //#region Funciones
  function handleChange({ target }) {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  }

  function uppercase(e) {
    e.target.value = e.target.value.toUpperCase();
  }
  //#endregion

  return (
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "Usuario"]}
    >
      <div className={Global.ContenedorInputFull}>
        <label htmlFor="claveAnterior" className={Global.LabelStyle}>
          Clave Anterior
        </label>
        <input
          type="text"
          id="claveAnterior"
          name="claveAnterior"
          placeholder="Clave Anterior"
          defaultValue={data.id}
          autoComplete="off"
          onKeyUp={uppercase}
          onChange={handleChange}
          className={Global.InputStyle}
        />
      </div>
      <div className={Global.ContenedorInputFull}>
        <label htmlFor="claveNueva" className={Global.LabelStyle}>
          Clave Nueva
        </label>
        <input
          type="text"
          id="claveNueva"
          name="claveNueva"
          placeholder="Clave Nueva"
          defaultValue={data.id}
          autoComplete="off"
          onKeyUp={uppercase}
          onChange={handleChange}
          className={Global.InputStyle}
        />
      </div>
      <div className={Global.ContenedorInputFull}>
        <label htmlFor="claveNuevaConfirmacion" className={Global.LabelStyle}>
          Confirmar Clave Nueva
        </label>
        <input
          type="text"
          id="claveNuevaConfirmacion"
          name="claveNuevaConfirmacion"
          placeholder="Confirmar Clave Nueva"
          defaultValue={data.id}
          autoComplete="off"
          onKeyUp={uppercase}
          className={Global.InputStyle}
        />
      </div>
    </ModalBasic>
  );
};

export default ModalClave;
