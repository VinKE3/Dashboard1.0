import React, { useState, useEffect } from "react";
import ModalCrud from "../../../components/ModalCrud";
import * as Global from "../../../components/Global";
import moment from "moment";
import ApiMasy from "../../../api/ApiMasy";
import styled from "styled-components";
import TableBasic from "../../../components/tablas/TableBasic";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;
//#endregion

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [personal, setPersonal] = useState([]);
  const [tipoSalida, setTipoSalida] = useState([]);
  const [detalles, setDetalles] = useState([]);
  //#endregion
  //#region useEffect
  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    GetTablas();
  }, []);

  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };

  const GetTablas = async () => {
    const result = await ApiMasy(
      `/api/almacen/SalidaCilindros/FormularioTablas`
    );
    let model = result.data.data.personal.map((res) => ({
      personalId: res.apellidoPaterno + res.apellidoMaterno + res.nombres,
      ...res,
    }));
    setPersonal(model);
    setTipoSalida(result.data.data.tiposSalida);
  };

  //#endregion
  return (
    <ModalCrud
      setModal={setModal}
      objeto={data}
      modo={modo}
      menu={["Almacen", "SalidaCilindros"]}
      titulo="Salida de Cilindros"
      tamañoModal={[Global.ModalGrande, Global.Form]}
    >
      <div className={Global.ContenedorBasico + Global.FondoContenedor + " mb-2"}>
        <div className={Global.ContenedorInputs}>
          <div className={Global.Input60pct}>
            <label htmlFor="serie" className={Global.LabelStyle}>
              Serie
            </label>
            <input
              type="text"
              id="serie"
              name="serie"
              maxLength="2"
              autoComplete="off"
              placeholder="00"
              disabled={modo == "Registrar" ? false : true}
              value={data.serie ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.Input60pct}>
            <label htmlFor="numero" className={Global.LabelStyle}>
              Número
            </label>
            <input
              type="text"
              id="numero"
              name="numero"
              maxLength="2"
              autoComplete="off"
              placeholder="00"
              disabled={modo == "Registrar" ? false : true}
              value={data.numero ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.Input40pct}>
            <label htmlFor="fechaEmision" className={Global.LabelStyle}>
              Fecha
            </label>
            <input
              type="date"
              id="fechaEmision"
              name="fechaEmision"
              maxLength="2"
              autoComplete="off"
              disabled={modo == "Consultar" ? true : false}
              value={moment(data.fechaEmision).format("yyyy-MM-DD") ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
      </div>
      <div className={Global.ContenedorBasico + Global.FondoContenedor}>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="clienteId" className={Global.LabelStyle}>
              Cliente
            </label>
            <input
              type="text"
              id="clienteId"
              name="clienteId"
              autoComplete="off"
              disabled={modo == "Consultar" ? true : false}
              value={data.clienteId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="numeroFactura" className={Global.LabelStyle}>
              N° Factura
            </label>
            <input
              type="text"
              id="numeroFactura"
              name="numeroFactura"
              autoComplete="off"
              disabled={modo == "Consultar" ? true : false}
              value={data.numeroFactura ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="personalId" className={Global.LabelStyle}>
              Personal
            </label>
            <select
              id="personalId"
              name="personalId"
              disabled={modo == "Consultar" ? true : false}
              value={data.personalId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            >
              {personal.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.personalId}
                </option>
              ))}
            </select>
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="numeroGuia" className={Global.LabelStyle}>
              N° Guia
            </label>
            <input
              type="text"
              id="numeroGuia"
              name="numeroGuia"
              autoComplete="off"
              value={data.numeroGuia ?? ""}
              disabled={modo == "Consultar" ? true : false}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="observacion" className={Global.LabelStyle}>
              Observación
            </label>
            <input
              type="text"
              id="observacion"
              name="observacion"
              autoComplete="off"
              disabled={modo == "Consultar" ? true : false}
              value={data.observacion ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="descripcion" className={Global.LabelStyle}>
              Descripcion
            </label>

            <select
              id="descripcion"
              name="descripcion"
              disabled={modo == "Consultar" ? true : false}
              onChange={ValidarData}
              className={Global.InputStyle}
            >
              {tipoSalida.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.descripcion}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </ModalCrud>
  );
};

export default Modal;
