import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import FiltroSalidaCilindros from "../../../components/filtros/FiltroSalidaCilindros";
import Mensajes from "../../../components/Mensajes";
import TableBasic from "../../../components/tablas/TableBasic";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Checkbox } from "primereact/checkbox";
import moment from "moment";
import { FaPlus, FaSearch, FaPen, FaTrashAlt } from "react-icons/fa";
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
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;
//#endregion

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  //?Data General
  const [data, setData] = useState(objeto);
  const [dataDetalle, setDataDetalle] = useState(objeto.detalles);
  //?Tablas
  const [personal, setPersonal] = useState([]);
  const [tipoSalida, setTipoSalida] = useState([]);
  //?Data Ayuda
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [detalleId, setDetalleId] = useState(dataDetalle.length + 1);
  const [mensaje, setMensaje] = useState([]);
  const [refrescar, setRefrescar] = useState(false);

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
  ];
  //#endregion
  return (
    <ModalCrud
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Almacen", "SalidaCilindros"]}
      titulo="Salida de Cilindros"
      tamañoModal={[Global.ModalGrande, Global.Form]}
    >
      <div
        className={Global.ContenedorBasico + Global.FondoContenedor + " mb-2"}
      >
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
              readOnly={true}
              value={data.serie ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle + Global.Disabled}
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
              readOnly={true}
              value={data.numero ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle + Global.Disabled}
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
              readOnly={true}
              value={moment(data.fechaEmision).format("yyyy-MM-DD") ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle + Global.Disabled}
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
              readOnly={true}
              value={data.clienteId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle + Global.Disabled}
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
              readOnly={true}
              value={data.numeroFactura ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle + Global.Disabled}
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
              disabled={true}
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
              readOnly={true}
              onChange={ValidarData}
              className={Global.InputStyle + Global.Disabled}
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
              readOnly={modo == "Consultar" ? true : false}
              value={data.observacion ?? ""}
              onChange={ValidarData}
              className={
                modo == "Consultar"
                  ? Global.InputStyle + Global.Disabled
                  : Global.InputStyle
              }
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
              {tipoSalida.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.descripcion}
                </option>
              ))}
            </select>
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
};

export default Modal;
