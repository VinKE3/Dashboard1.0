import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import * as G from "../../../components/Global";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataDepartamento, setDataDepartamento] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
  const HandleData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  //#endregion

  //#region Funciones API
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Provincia/FormularioTablas`
    );
    setDataDepartamento(result.data.data.departamentos);
    if (modo == "Nuevo") {
      //Datos Iniciales
      let departamentos = result.data.data.departamentos.find((map) => map);
      //Datos Iniciales
      setData((prev) => ({
        ...prev,
        departamentoId: departamentos.id,
      }));
    }
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
          menu={"Mantenimiento/Provincia"}
          titulo="Provincia"
          foco={document.getElementById("tablaProvincia")}
          tamañoModal={[G.ModalPequeño, G.Form]}
        >
          <div className={G.ContenedorBasico}>
            <div className={G.ContenedorInputs}>
              <div className={G.Input48}>
                <label htmlFor="provinciaId" className={G.LabelStyle}>
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
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputFull}>
                <label htmlFor="departamentoId" className={G.LabelStyle}>
                  Departamento
                </label>
                <select
                  id="departamentoId"
                  name="departamentoId"
                  value={data.departamentoId ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Nuevo" ? false : true}
                  className={G.InputStyle}
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
              <label htmlFor="nombre" className={G.LabelStyle}>
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
                onChange={HandleData}
                className={G.InputStyle}
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
