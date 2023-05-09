import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import * as Global from "../../../components/Global";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataTipoDocumento, setDataTipoDocumento] = useState([]);
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

  //#region API
  const Tablas = async () => {
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
          tamañoModal={[Global.ModalPequeño, Global.Form]}
        >
          <div className={Global.ContenedorBasico}>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="tipoDocumentoId" className={Global.LabelStyle}>
                  Tipo de Documento
                </label>
                <select
                  id="tipoDocumentoId"
                  name="tipoDocumentoId"
                  value={data.tipoDocumentoId ?? ""}
                  onChange={ValidarData}
                  disabled={modo == "Consultar" ? true : false}
                  className={Global.InputStyle}
                >
                  {dataTipoDocumento.map((forma) => (
                    <option key={forma.id} value={forma.id}>
                      {forma.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className={Global.InputMitad}>
                <label htmlFor="serie" className={Global.LabelStyle}>
                  Serie
                </label>
                <input
                  type="text"
                  id="serie"
                  name="serie"
                  autoComplete="off"
                  placeholder="Serie"
                  readOnly={modo == "Consultar" ? true : false}
                  value={data.serie}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label
                  htmlFor="tipoDocumentoDescripcion"
                  className={Global.LabelStyle}
                >
                  Descripción
                </label>
                <input
                  type="text"
                  id="tipoDocumentoDescripcion"
                  name="tipoDocumentoDescripcion"
                  autoComplete="off"
                  placeholder="Descripción"
                  readOnly={modo == "Consultar" ? true : false}
                  value={data.tipoDocumentoDescripcion}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputMitad}>
                <label htmlFor="numero" className={Global.LabelStyle}>
                  Número
                </label>
                <input
                  type="number"
                  id="numero"
                  name="numero"
                  autoComplete="off"
                  placeholder="numero"
                  readOnly={modo == "Consultar" ? true : false}
                  value={data.numero}
                  onChange={ValidarData}
                  className={Global.InputStyle}
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
