import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../Components/Global";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataModal, setdataModal] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    dataModal;
    document.getElementById("tiposDocumentoId").value = data.tiposDocumentoId;
  }, [dataModal]);
  useEffect(() => {
    data;
  }, [data]);
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
    setdataModal(result.data.data.tiposDocumento);
  };
  //#endregion

  //#region Render
  return (
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "Correlativos"]}
      tamañoModal={[Global.ModalPequeño, Global.FormSimple]}
    >
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="tiposDocumentoId" className={Global.LabelStyle}>
            Tipo de Documento
          </label>
          <select
            id="tiposDocumentoId"
            name="tiposDocumentoId"
            disabled={modo == "Registrar" ? false : true}
            onChange={ValidarData}
            className={Global.SelectStyle}
          >
            {dataModal.map((forma) => (
              <option key={forma.id} value={forma.id}>
                {forma.descripcion}
              </option>
            ))}
          </select>
        </div>
        <div className={Global.ContenedorInputFull}>
          <label
            htmlFor="tipoDocumentoDescripcion"
            className={Global.LabelStyle}
          >
            Serie
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
      </div>
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInputFull}>
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
        <div className={Global.ContenedorInput42pct}>
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
    </ModalBasic>
  );
  //#endregion
};

export default Modal;
