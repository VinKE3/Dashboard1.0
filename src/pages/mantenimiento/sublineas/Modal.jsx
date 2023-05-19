import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import * as Global from "../../../components/Global";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataModal, setDataModal] = useState([]);
  //#endregion

  //#region useEffect.
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
    setDataModal(result.data.data.data);
  };
  //#endregion

  //#region Render
  return (
    <>
      {Object.entries(dataModal).length > 0 && (
        <ModalCrud
          setModal={setModal}
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
                  placeholder="00"
                  autoComplete="off"
                  maxLength="2"
                  value={data.subLineaId ?? ""}
                  onChange={ValidarData}
                  disabled={modo == "Registrar" ? false : true}
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
                  autoFocus
                  value={data.lineaId ?? ""}
                  onChange={ValidarData}
                  disabled={modo == "Registrar" ? false : true}
                  className={Global.InputStyle}
                >
                  {dataModal.map((linea) => (
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
                placeholder="Descripción"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
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
