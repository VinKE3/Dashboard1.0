import React, { useState, useEffect } from "react";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../Components/Global";
import ApiMasy from "../../../api/ApiMasy";
import Mensajes from "../../../components/Mensajes";

const ModalClave = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    objeto;
    setData(objeto);
  }, [objeto]);

  useEffect(() => {
    data;
  }, [data]);
  //#endregion

  //#region Funciones
  const handleChange = ({ target }) => {
    if (target.name == "isActivo" || target.name == "habilitarAfectarStock") {
      setData({ ...data, [target.name]: target.checked });
    } else {
      setData({ ...data, [target.name]: target.value });
    }
    console.log(data);
  };
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
          placeholder="claveAnterior"
          defaultValue={data.id}
          autoComplete="off"
          onKeyUp={uppercase}
          onChange={handleChange}
          readOnly={true}
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
          placeholder="claveNueva"
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
          placeholder="claveNuevaConfirmacion"
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
