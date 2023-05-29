import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import * as Global from "../../../components/Global";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataDepartamento, setDataDepartamento] = useState([]);
  //#endregion

  //#region useEffect
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
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={["Mantenimiento", "Provincia"]}
          titulo="Provincia"
          foco={document.getElementById("tablaProvincia")}
          tamañoModal={[Global.ModalPequeño, Global.Form]}
        >
          <div className={Global.ContenedorBasico}>
            <div className={Global.ContenedorInputs}>
              <div className={Global.Input48}>
                <label htmlFor="provinciaId" className={Global.LabelStyle}>
                  Código
                </label>
                <input
                  type="text"
                  id="provinciaId"
                  name="provinciaId"
                  placeholder="Código"
                  autoComplete="off"
                  maxLength="2"
                  autoFocus
                  disabled={modo == "Nuevo" ? false : true}
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
                  value={data.departamentoId ?? ""}
                  onChange={ValidarData}
                  disabled={modo == "Nuevo" ? false : true}
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
                placeholder="Provincia"
                autoComplete="off"
                autoFocus={modo == "Modificar"}
                disabled={modo == "Consultar"}
                value={data.nombre ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
          </div>
        </ModalCrud>
      )}
    </>
  );
  //#endregion
};

export default Modal;
