import React, { useState, useEffect } from "react";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../components/Global";
import Ubigeo from "../../../components/filtros/Ubigeo";
const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataUbigeo, setDataUbigeo] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    dataUbigeo;
    if (Object.keys(dataUbigeo).length > 0) {
      setData({
        ...data,
        departamentoId: dataUbigeo.departamentoId,
        provinciaId: dataUbigeo.provinciaId,
        distritoId: dataUbigeo.distritoId,
      });
    }
  }, [dataUbigeo]);
  useEffect(() => {
    data;
  }, [data]);
  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  //#endregion

  //#region  Render
  return (
    <ModalBasic
      setModal={setModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "EmpresaTransporte"]}
      tamañoModal={[Global.ModalPequeño, Global.FormGrande]}
    >
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInput72}>
          <label htmlFor="id" className={Global.LabelStyle}>
            Código
          </label>
          <input
            type="text"
            id="id"
            name="id"
            placeholder="id"
            autoComplete="off"
            readOnly={true}
            value={data.id}
            onChange={ValidarData}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInputFull}>
          <label
            htmlFor="numeroDocumentoIdentidad"
            className={Global.LabelStyle}
          >
            RUC N°
          </label>
          <input
            type="text"
            id="numeroDocumentoIdentidad"
            name="numeroDocumentoIdentidad"
            placeholder="N° Documento Identidad"
            autoComplete="off"
            readOnly={modo == "Consultar" ? true : false}
            value={data.numeroDocumentoIdentidad}
            onChange={ValidarData}
            className={Global.InputStyle}
          />
        </div>
      </div>
      <div className="flex">
        <label htmlFor="nombre" className={Global.LabelStyle}>
          Razón Social
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          placeholder="Razón Social"
          autoComplete="off"
          readOnly={modo == "Consultar" ? true : false}
          value={data.nombre}
          onChange={ValidarData}
          className={Global.InputStyle}
        />
      </div>
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInputMitad}>
          <label htmlFor="telefono" className={Global.LabelStyle}>
            Telefono
          </label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            placeholder="Telefono"
            autoComplete="off"
            readOnly={modo == "Consultar" ? true : false}
            value={data.telefono == null ? "" : data.telefono}
            onChange={ValidarData}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInputMitad}>
          <label htmlFor="celular" className={Global.LabelStyle}>
            Celular
          </label>
          <input
            type="text"
            id="celular"
            name="celular"
            placeholder="Celular"
            autoComplete="off"
            readOnly={modo == "Consultar" ? true : false}
            value={data.celular == null ? "" : data.celular}
            onChange={ValidarData}
            className={Global.InputStyle}
          />
        </div>
      </div>
      <div className="flex">
        <label htmlFor="correoElectronico" className={Global.LabelStyle}>
          Email
        </label>
        <input
          type="email"
          id="correoElectronico"
          name="correoElectronico"
          placeholder="Email"
          autoComplete="off"
          readOnly={modo == "Consultar" ? true : false}
          value={data.correoElectronico == null ? "" : data.correoElectronico}
          onChange={ValidarData}
          className={Global.InputStyle}
        />
      </div>
      <div className="flex">
        <label htmlFor="direccion" className={Global.LabelStyle}>
          Dirección
        </label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          placeholder="Direccion"
          autoComplete="off"
          readOnly={modo == "Consultar" ? true : false}
          value={data.direccion == null ? "" : data.direccion}
          onChange={ValidarData}
          className={Global.InputStyle}
        />
      </div>
      <Ubigeo
        modo={modo}
        setDataUbigeo={setDataUbigeo}
        id={["departamentoId", "provinciaId", "distritoId"]}
        dato={{
          departamentoId: data.departamentoId,
          provinciaId: data.provinciaId,
          distritoId: data.distritoId,
        }}
      ></Ubigeo>

      <div className="flex">
        <label htmlFor="observacion" className={Global.LabelStyle}>
          Observación
        </label>
        <input
          type="text"
          id="observacion"
          name="observacion"
          placeholder="Observación"
          autoComplete="off"
          readOnly={modo == "Consultar" ? true : false}
          value={data.observacion == null ? "" : data.observacion}
          onChange={ValidarData}
          className={Global.InputStyle}
        />
      </div>
    </ModalBasic>
  );
  //#endregion
};

export default Modal;
