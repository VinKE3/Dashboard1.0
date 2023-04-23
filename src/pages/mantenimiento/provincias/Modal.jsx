import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../components/Global";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataDepartamento, setDataDepartamento] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (Object.entries(dataDepartamento).length > 0) {
      document.getElementById("departamentoId").value = data.departamentoId;
    }
  }, [dataDepartamento]);
  useEffect(() => {
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  //#endregion

  //#region Funciones API
  const Tablas = async () => {
    const result = await ApiMasy.get(`api/Mantenimiento/Departamento/Listar`);
    setDataDepartamento(result.data.data.data);
  };
  //#endregion

  //#region Render
  return (
    <>
      {Object.entries(dataDepartamento).length > 0 && (
        <ModalBasic
          setModal={setModal}
          setRespuestaModal={setRespuestaModal}
          objeto={data}
          modo={modo}
          menu={["Mantenimiento", "Provincia"]}
          titulo="Provincia"
          tamañoModal={[Global.ModalPequeño, Global.Form]}
        >
          <div className={Global.ContenedorInputs}>
            <div className={Global.ContenedorInput48}>
              <label htmlFor="provinciaId" className={Global.LabelStyle}>
                Código
              </label>
              <input
                type="text"
                id="provinciaId"
                name="provinciaId"
                autoComplete="off"
                maxLength="2"
                placeholder="00"
                readOnly={modo == "Registrar" ? false : true}
                value={data.provinciaId ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.InputFull}>
              <label htmlFor="departamentoId" className={Global.LabelStyle}>
                Departamento
              </label>
              <select
                id="departamentoId"
                name="departamentoId"
                onChange={ValidarData}
                disabled={modo == "Registrar" ? false : true}
                className={Global.InputStyle}
              >
                {dataDepartamento.map((departamento) => (
                  <option key={departamento.id} value={departamento.id}>
                    {departamento.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex">
            <label htmlFor="nombre" className={Global.LabelStyle}>
              Provincia
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              autoComplete="off"
              placeholder="Provincia"
              readOnly={modo == "Consultar" ? true : false}
              value={data.nombre ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </ModalBasic>
      )}
    </>
  );
  //#endregion
};

export default Modal;
