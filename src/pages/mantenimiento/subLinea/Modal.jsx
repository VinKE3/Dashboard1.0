import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import * as G from "../../../components/Global";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataLinea, setDataLinea] = useState([]);
  //#endregion

  //#region useEffect.
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

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/SubLinea/FormularioTablas`
    );
    setDataLinea(result.data.data.lineas);

    if (modo == "Nuevo") {
      //Datos Iniciales
      let lineas = result.data.data.lineas.find((map) => map);
      //Datos Iniciales
      setData((prev) => ({
        ...prev,
        lineaId: lineas.id,
      }));
    }
  };
  //#endregion

  //#region Render
  return (
    <>
      {Object.entries(dataLinea).length > 0 && (
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={"Mantenimiento/SubLinea"}
          titulo="Sublínea"
          foco={document.getElementById("tablaSubLinea")}
          tamañoModal={[G.ModalPequeño, G.Form]}
        >
          <div className={G.ContenedorBasico}>
            <div className={G.ContenedorInputs}>
              <div className={G.Input48}>
                <label htmlFor="subLineaId" className={G.LabelStyle}>
                  Código
                </label>
                <input
                  type="text"
                  id="subLineaId"
                  name="subLineaId"
                  placeholder="Código"
                  autoComplete="off"
                  maxLength="2"
                  autoFocus
                  value={data.subLineaId ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Nuevo" ? false : true}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputFull}>
                <label htmlFor="lineaId" className={G.LabelStyle}>
                  Línea
                </label>
                <select
                  id="lineaId"
                  name="lineaId"
                  value={data.lineaId ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Nuevo" ? false : true}
                  className={G.InputStyle}
                >
                  {dataLinea.map((linea) => (
                    <option key={linea.id} value={linea.id}>
                      {linea.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex">
              <label htmlFor="descripcion" className={G.LabelStyle}>
                Descripción
              </label>
              <input
                type="text"
                id="descripcion"
                name="descripcion"
                placeholder="Descripción"
                autoComplete="off"
                autoFocus={modo == "Modificar"}
                disabled={modo == "Consultar"}
                value={data.descripcion ?? ""}
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
