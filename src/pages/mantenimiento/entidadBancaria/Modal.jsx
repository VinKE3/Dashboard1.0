import React, { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import * as G from "../../../components/Global";
import ModalCrud from "../../../components/modal/ModalCrud";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataEntidadBancaria, setDataEntidadBancaria] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    GetTablas();
  }, []);
  //#endregion

  //#region Funcions
  const HandleData = async ({ target }) => {
    setData((prev) => ({
      ...prev,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  //#endregion

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/EntidadBancaria/FormularioTablas`
    );
    setDataEntidadBancaria(result.data.data.tiposEntidadesBancarias);
    if (modo == "Nuevo") {
      //Datos Iniciales
      let tiposEntidadesBancarias =
        result.data.data.tiposEntidadesBancarias.find((map) => map);
      //Datos Iniciales
      setData((prev) => ({
        ...prev,
        tipo: tiposEntidadesBancarias.id,
      }));
    }
  };
  //#endregion

  return (
    <>
      {dataEntidadBancaria.length > 0 && (
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={"Mantenimiento/EntidadBancaria"}
          titulo="Entidad Bancaria"
          foco={document.getElementById("tablaEntidadBancaria")}
          tamañoModal={[G.ModalPequeño, G.Form]}
        >
          <div className={G.ContenedorBasico}>
            <div className={G.ContenedorInputs}>
              {modo != "Nuevo" && (
                <div className={G.Input72}>
                  <label htmlFor="id" className={G.LabelStyle}>
                    Código
                  </label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    placeholder="Código"
                    autoComplete="off"
                    value={data.id ?? ""}
                    onChange={HandleData}
                    disabled={true}
                    className={G.InputStyle}
                  />
                </div>
              )}
              <div className={G.InputMitad}>
                <label
                  htmlFor="numeroDocumentoIdentidad"
                  className={G.LabelStyle}
                >
                  RUC
                </label>
                <input
                  type="text"
                  id="numeroDocumentoIdentidad"
                  name="numeroDocumentoIdentidad"
                  placeholder="Documento Identidad"
                  autoComplete="off"
                  maxLength="11"
                  autoFocus
                  disabled={modo == "Consultar"}
                  value={data.numeroDocumentoIdentidad ?? ""}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputMitad}>
                <label htmlFor="tipo" className={G.LabelStyle}>
                  Tipo
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={data.tipo ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Consultar"}
                  className={G.InputStyle}
                >
                  {dataEntidadBancaria.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex">
              <label htmlFor="nombre" className={G.LabelStyle}>
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Nombre"
                autoComplete="off"
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
};

export default Modal;
