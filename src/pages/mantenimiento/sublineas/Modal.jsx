import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import * as Global from "../../../components/Global";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataLinea, setDataLinea] = useState([]);
  //#endregion

  //#region useEffect.
  useEffect(() => {
    if (Object.entries(dataLinea).length > 0) {
      document.getElementById("lineaId").value = data.lineaId;
    }
  }, [dataLinea]);
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

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(`api/Mantenimiento/Linea/Listar`);
    setDataLinea(result.data.data.data);
  };
  //#endregion

  //#region Render
  return (
    <>
      {Object.entries(dataLinea).length > 0 && (
        <ModalCrud
          setModal={setModal}
          setRespuestaModal={setRespuestaModal}
          objeto={data}
          modo={modo}
          menu={["Mantenimiento", "SubLinea"]}
          titulo="Sublinea"
          tamañoModal={[Global.ModalPequeño, Global.Form]}
        >
          <div className={Global.ContenedorBasico}>
            <div className={Global.ContenedorInputs}>
              <div className={Global.Input48}>
                <label htmlFor="subLineaId" className={Global.LabelStyle}>
                  Código
                </label>
                <input
                  type="text"
                  id="subLineaId"
                  name="subLineaId"
                  autoComplete="off"
                  maxLength="2"
                  placeholder="00"
                  readOnly={modo == "Registrar" ? false : true}
                  defaultValue={data.subLineaId ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="lineaId" className={Global.LabelStyle}>
                  Línea
                </label>
                <select
                  id="lineaId"
                  name="lineaId"
                  onChange={ValidarData}
                  disabled={modo == "Registrar" ? false : true}
                  className={Global.InputStyle}
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
              <label htmlFor="descripcion" className={Global.LabelStyle}>
                Descripción
              </label>
              <input
                type="text"
                id="descripcion"
                name="descripcion"
                autoComplete="off"
                placeholder="Descripción"
                readOnly={modo == "Consultar" ? true : false}
                value={data.descripcion ?? ""}
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
