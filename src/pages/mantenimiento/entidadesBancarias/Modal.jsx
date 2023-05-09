import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import * as Global from "../../../components/Global";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataModal, setdataModal] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    Tablas();
  }, []);
  //#endregion

  //#region Funcions
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
      `api/Mantenimiento/EntidadBancaria/FormularioTablas`
    );
    setdataModal(result.data.data.tiposEntidadesBancarias);
  };
  //#endregion

  return (
    <>
      {dataModal.length > 0 && (
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={["Mantenimiento", "EntidadBancaria"]}
          titulo="Entidad Bancaria"
          tamañoModal={[Global.ModalPequeño, Global.Form]}
        >
          <div className={Global.ContenedorBasico}>
            <div className={Global.ContenedorInputs}>
              <div className={Global.Input40pct}>
                <label htmlFor="id" className={Global.LabelStyle}>
                  Código
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  autoComplete="off"
                  placeholder="00"
                  readOnly={true}
                  value={data.id ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label
                  htmlFor="numeroDocumentoIdentidad"
                  className={Global.LabelStyle}
                >
                  RUC
                </label>
                <input
                  type="text"
                  id="numeroDocumentoIdentidad"
                  name="numeroDocumentoIdentidad"
                  autoComplete="off"
                  maxLength="11"
                  placeholder="00000000000"
                  readOnly={modo == "Consultar" ? true : false}
                  value={data.numeroDocumentoIdentidad ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.Input42pct}>
                <label htmlFor="tipo" className={Global.LabelStyle}>
                  Tipo
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={data.tipo ?? ""}
                  onChange={ValidarData}
                  disabled={modo == "Consultar" ? true : false}
                  className={Global.InputStyle}
                >
                  {dataModal.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex">
              <label htmlFor="nombre" className={Global.LabelStyle}>
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                autoComplete="off"
                placeholder="Nombre"
                readOnly={modo == "Consultar" ? true : false}
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
};

export default Modal;
