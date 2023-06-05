import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import * as G from "../../../components/Global";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataTipoDocumento, setDataTipoDocumento] = useState([]);
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

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Correlativo/FormularioTablas`
    );
    setDataTipoDocumento(result.data.data.tiposDocumento);
  };

  //#endregion

  //#region Render
  return (
    <>
      {Object.entries(dataTipoDocumento).length > 0 && (
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={["Mantenimiento", "Correlativo"]}
          titulo="Correlativo"
          foco={document.getElementById("tablaCorrelativo")}
          tamañoModal={[G.ModalPequeño, G.Form]}
        >
          <div className={G.ContenedorBasico}>
            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label htmlFor="tipoDocumentoId" className={G.LabelStyle}>
                  Tipo de Documento
                </label>
                <select
                  id="tipoDocumentoId"
                  name="tipoDocumentoId"
                  autoFocus
                  value={data.tipoDocumentoId ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Consultar" }
                  className={G.InputStyle}
                >
                  {dataTipoDocumento.map((forma) => (
                    <option key={forma.id} value={forma.id}>
                      {forma.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className={G.InputMitad}>
                <label htmlFor="serie" className={G.LabelStyle}>
                  Serie
                </label>
                <input
                  type="text"
                  id="serie"
                  name="serie"
                  placeholder="Serie"
                  autoComplete="off"
                  disabled={modo == "Consultar" }
                  value={data.serie}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
            </div>
            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label
                  htmlFor="tipoDocumentoDescripcion"
                  className={G.LabelStyle}
                >
                  Descripción
                </label>
                <input
                  type="text"
                  id="tipoDocumentoDescripcion"
                  name="tipoDocumentoDescripcion"
                  placeholder="Descripción"
                  autoComplete="off"
                  disabled={modo == "Consultar" }
                  value={data.tipoDocumentoDescripcion}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputMitad}>
                <label htmlFor="numero" className={G.LabelStyle}>
                  Número
                </label>
                <input
                  type="number"
                  id="numero"
                  name="numero"
                  placeholder="numero"
                  autoComplete="off"
                  min={0}
                  disabled={modo == "Consultar" }
                  value={data.numero}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
            </div>
          </div>
        </ModalCrud>
      )}
    </>
  );
  //#endregion
};

export default Modal;
