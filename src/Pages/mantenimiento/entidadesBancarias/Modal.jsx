import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../Components/Global";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState([]);
  const [dataModal, setdataModal] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    objeto;
    setData(objeto);
  }, [objeto]);
  useEffect(() => {
    dataModal;
    document.getElementById("tipo").value = data.tipo;
  }, [dataModal]);
  useEffect(() => {
    data;
  }, [data]);
  useEffect(() => {
    Tablas();
  }, []);
  //#endregion

  //#region Funcions
  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
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
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "EntidadBancaria"]}
    >
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInput48}>
          <label htmlFor="id" className={Global.LabelStyle}>
            Código
          </label>
          <input
            type="text"
            id="id"
            name="id"
            autoComplete="off"
            placeholder="00"
            readOnly
            defaultValue={data.id}
            onChange={handleChange}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInput72}>
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
            defaultValue={data.numeroDocumentoIdentidad}
            onChange={handleChange}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInput56}>
          <label htmlFor="tipo" className={Global.LabelStyle}>
            Tipo
          </label>
          <select
            id="tipo"
            name="tipo"
            onChange={handleChange}
            disabled={modo == "Consultar" ? true : false}
            className={Global.SelectStyle}
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
          readOnly={modo == "Registrar" ? false : true}
          defaultValue={data.nombre}
          onChange={handleChange}
          className={Global.InputStyle}
        />
      </div>
    </ModalBasic>
  );
};

export default Modal;
