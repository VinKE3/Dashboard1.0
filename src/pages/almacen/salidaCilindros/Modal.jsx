import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import TableBasic from "../../../components/tablas/TableBasic";
import moment from "moment";
import styled from "styled-components";
import "primeicons/primeicons.css";
import * as Global from "../../../components/Global";
import * as Funciones from "../../../components/Funciones";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    width: 40px;
    text-align: center;
  }
  & th:nth-child(4),
  & th:nth-child(5) {
    width: 130px;
    min-width: 130px;
    max-width: 130px;
    text-align: center;
  }
  & th:last-child {
    width: 75px;
    min-width: 90px;
    max-width: 90px;
    text-align: center;
  }
`;
//#endregion

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  //Data General
  const [data, setData] = useState(objeto);
  const [dataDetalle] = useState(objeto.detalles);
  //Data General
  //Tablas
  const [dataPersonal, setDataPersonal] = useState([]);
  const [dataTipoSalida, setDataTipoSalida] = useState([]);
  //Tablas
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
    const result = await ApiMasy(
      `/api/almacen/SalidaCilindros/FormularioTablas`
    );
    setDataPersonal(
      result.data.data.personal.map((res) => ({
        personalId: res.apellidoPaterno + res.apellidoMaterno + res.nombres,
        ...res,
      }))
    );
    setDataTipoSalida(result.data.data.tiposSalida);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Item",
      accessor: "detalleId",
      Cell: ({ value }) => {
        return <p className="text-center">{value}</p>;
      },
    },
    {
      Header: "Descripción",
      accessor: "descripcion",
    },
    {
      Header: "Unidad",
      accessor: "unidadMedidaDescripcion",
      Cell: ({ value }) => {
        return <p className="text-center font-semibold">{value}</p>;
      },
    },
    {
      Header: "Cantidad",
      accessor: "cantidad",
      Cell: ({ value }) => {
        return (
          <p className="text-center font-semibold pr-1.5">
            {Funciones.RedondearNumero(value, 4)}
          </p>
        );
      },
    },
    {
      Header: " ",
      Cell: () => {
        return "";
      },
    },
  ];
  //#endregion

  //#region Render
  return (
    <ModalCrud
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Almacen", "SalidaCilindros"]}
      titulo="Salida de Cilindros"
      tamañoModal={[Global.ModalFull, Global.Form]}
      cerrar={false}
    >
      <div
        className={Global.ContenedorBasico + Global.FondoContenedor + " mb-2"}
      >
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputTercio}>
            <label htmlFor="serie" className={Global.LabelStyle}>
              Serie
            </label>
            <input
              type="text"
              id="serie"
              name="serie"
              placeholder="0000"
              autoComplete="off"
              disabled={true}
              value={data.serie ?? ""}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputTercio}>
            <label htmlFor="numero" className={Global.LabelStyle}>
              Número
            </label>
            <input
              type="text"
              id="numero"
              placeholder="Número"
              name="numero"
              autoComplete="off"
              disabled={true}
              value={data.numero ?? ""}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputTercio}>
            <label htmlFor="fechaEmision" className={Global.LabelStyle}>
              Fecha
            </label>
            <input
              type="date"
              id="fechaEmision"
              name="fechaEmision"
              autoComplete="off"
              disabled={true}
              value={moment(data.fechaEmision).format("yyyy-MM-DD") ?? ""}
              className={Global.InputStyle}
            />
          </div>
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="numeroFactura" className={Global.LabelStyle}>
              N° Factura
            </label>
            <input
              type="text"
              id="numeroFactura"
              name="numeroFactura"
              autoComplete="off"
              disabled={true}
              value={data.numeroFactura ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
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
              disabled={true}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>

          <div className={Global.InputFull}>
            <label htmlFor="tipoSalidaId" className={Global.LabelStyle}>
              Tipo Salida
            </label>
            <select
              id="tipoSalidaId"
              name="tipoSalidaId"
              disabled={modo == "Consultar" ? true : false}
              onChange={ValidarData}
              value={data.tipoSalidaId ?? ""}
              className={
                modo == "Consultar"
                  ? Global.InputStyle + Global.Disabled
                  : Global.InputStyle
              }
            >
              {dataTipoSalida.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.descripcion}
                </option>
              ))}
            </select>
          </div>
        </div>
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
              disabled={true}
              value={data.clienteId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="personalId" className={Global.LabelStyle}>
              Personal
            </label>
            <select
              id="personalId"
              name="personalId"
              disabled={true}
              value={data.personalId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            >
              {dataPersonal.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.personalId}
                </option>
              ))}
            </select>
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
              placeholder="Observación"
              disabled={modo == "Consultar" ? true : false}
              value={data.observacion ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
      </div>
      {/* Tabla Detalle */}
      <TablaStyle>
        <TableBasic
          columnas={columnas}
          datos={dataDetalle}
          estilos={["", "", "", "border ", "", "border border-b-0", "border"]}
        />
      </TablaStyle>
      {/* Tabla Detalle */}
    </ModalCrud>
  );
  //#endregion
};

export default Modal;
