import React, { useState, useEffect } from "react";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../Components/Global";

const ModalConfiguracion = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState([]);
  const [dataUpperCase, setDataUpperCase] = useState([]);

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
  //   function uppercase(value) {
  //     if (value && typeof value === "string") {
  //       return value.toUpperCase();
  //     }
  //     return value;
  //   }

  //   const handleChange = ({ target }) => {
  //     const value = uppercase(target.value);
  //     setData({ ...data, [target.name]: value });
  //   };
  function uppercase(value) {
    if (value && typeof value === "string") {
      return value.toUpperCase();
    }
    return value;
  }

  const handleChange = ({ target }) => {
    const value = target.value;
    const valueUpperCase = uppercase(value);
    setData({ ...data, [target.name]: value });
    setDataUpperCase({ ...dataUpperCase, [target.name]: valueUpperCase });
  };

  const handleKeyUp = ({ target }) => {
    const value = target.value;
    const valueUpperCase = uppercase(value);
    setData({ ...data, [target.name]: value });
    setDataUpperCase({ ...dataUpperCase, [target.name]: valueUpperCase });
  };

  //#endregion

  return (
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "Usuario"]}
    >
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInput56}>
          <label htmlFor="id" className={Global.LabelStyle}>
            Código
          </label>
          <input
            type="text"
            id="id"
            name="id"
            placeholder="id"
            defaultValue={data.id}
            onChange={handleChange}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="nombre" className={Global.LabelStyle}>
            Descripción
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            placeholder="nombre"
            defaultValue={data.nombre}
            onChange={handleChange}
            onKeyUp={handleKeyUp}
            className={Global.InputStyle}
          />
        </div>
      </div>
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInput56}>
          <label htmlFor="id" className={Global.LabelStyle}>
            Código2
          </label>
          <input
            type="text"
            id="id2"
            name="id2"
            placeholder="id2"
            defaultValue={data.id2}
            onChange={handleChange}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="nombre" className={Global.LabelStyle}>
            Descripción2
          </label>
          <input
            type="text"
            id="nombre2"
            name="nombre2"
            placeholder="nombre2"
            defaultValue={data.nombre2}
            onChange={handleChange}
            className={Global.InputStyle}
          />
        </div>
      </div>
    </ModalBasic>
  );
};

export default ModalConfiguracion;
