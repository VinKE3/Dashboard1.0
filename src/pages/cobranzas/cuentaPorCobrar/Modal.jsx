import React, { useState } from "react";
import styled from "styled-components";
import ModalCrud from "../../../components/ModalCrud";
import * as Global from "../../../components/Global";
import { useEffect } from "react";
import moment from "moment";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaPlus, FaUndoAlt, FaPen, FaTrashAlt } from "react-icons/fa";
import Mensajes from "../../../components/Mensajes";
import ApiMasy from "../../../api/ApiMasy";
import TableBasic from "../../../components/tablas/TableBasic";
import { toast } from "react-toastify";
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
    width: 75px;
    min-width: 90px;
    max-width: 90px;
    text-align: center;
  }
`;
//#endregion
const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataDetalle, setDetalle] = useState(objeto.abonos);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  const [abonoId, setabonoId] = useState(dataDetalle.length + 1);
  const [refrescar, setRefrescar] = useState(false);
  //#endregion

  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  //#region Columnas
  const columnas = [
    {
      Header: "id",
      accessor: "abonoId",
    },
    {
      Header: "Fecha",
      accessor: "fecha",
      Cell: ({ value }) => {
        return moment(value).format("DD/MM/YYYY");
      },
    },
    {
      Header: "Tipo de Pago",
      accessor: "tipoCobroDescripcion",
    },
    {
      Header: "Concepto",
      accessor: "concepto",
    },
    {
      Header: "Moneda",
      accessor: "monedaId",
    },
    {
      Header: "Tipo Cambio",
      accessor: "tipoCambio",
    },
    {
      Header: "Monto",
      accessor: "monto",
    },
  ];
  //#endregion

  return (
    <ModalCrud
      setModal={setModal}
      objeto={data}
      modo={modo}
      menu={["Finanzas", "CuentaPorCobrar"]}
      titulo="Cuentas Por Cobrar"
      tamañoModal={[Global.ModalMediano, Global.Form]}
    >
      {tipoMensaje > 0 && (
        <Mensajes
          tipoMensaje={tipoMensaje}
          mensaje={mensaje}
          Click={() => OcultarMensajes()}
        />
      )}
      <div className={Global.ContenedorBasico}>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="tipoDocumento" className={Global.LabelStyle}>
              Tipo Documento
            </label>
            <input
              type="text"
              id="tipoDocumento"
              name="tipoDocumento"
              autoComplete="off"
              placeholder="00"
              readOnly={true}
              value={data.tipoDocumento.descripcion ?? ""}
              className={Global.InputStyle + Global.Disabled}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="serie" className={Global.LabelStyle}>
              Serie
            </label>
            <input
              type="text"
              id="serie"
              name="serie"
              autoComplete="off"
              placeholder="Serie"
              readOnly={true}
              value={data.serie ?? ""}
              className={Global.InputStyle + Global.Disabled}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="numero" className={Global.LabelStyle}>
              Número
            </label>
            <input
              type="text"
              id="numero"
              name="numero"
              autoComplete="off"
              placeholder="numero"
              readOnly={true}
              value={data.numero ?? ""}
              className={Global.InputStyle + Global.Disabled}
            />
          </div>
        </div>
      </div>
      <div className={Global.ContenedorBasico}>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="fechaContable" className={Global.LabelStyle}>
              Fecha
            </label>
            <input
              type="text"
              id="fechaContable"
              name="fechaContable"
              autoComplete="off"
              placeholder="fechaContable"
              readOnly={true}
              value={moment(data.fechaContable).format("DD/MM/YYYY") ?? ""}
              className={Global.InputStyle + Global.Disabled}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="monedaId" className={Global.LabelStyle}>
              Moneda
            </label>
            <input
              type="text"
              id="monedaId"
              name="monedaId"
              autoComplete="off"
              placeholder="monedaId"
              readOnly={true}
              value={data.monedaId ?? ""}
              className={Global.InputStyle + Global.Disabled}
            />
          </div>
        </div>

        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="total" className={Global.LabelStyle}>
              Total a Pagar
            </label>
            <input
              type="text"
              id="total"
              name="total"
              autoComplete="off"
              placeholder="total"
              readOnly={true}
              value={data.total ?? ""}
              className={Global.InputStyle + Global.Disabled}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="abonado" className={Global.LabelStyle}>
              Abonado
            </label>
            <input
              type="text"
              id="abonado"
              name="abonado"
              autoComplete="off"
              placeholder="abonado"
              readOnly={true}
              value={data.abonado ?? ""}
              className={Global.InputStyle + Global.Disabled}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="saldo" className={Global.LabelStyle}>
              Saldo Total
            </label>
            <input
              type="text"
              id="saldo"
              name="saldo"
              autoComplete="off"
              placeholder="saldo"
              readOnly={true}
              value={data.saldo ?? ""}
              className={Global.InputStyle + Global.Disabled}
            />
          </div>
        </div>
        <div className={Global.InputFull}>
          <label htmlFor="observacion" className={Global.LabelStyle}>
            Observación
          </label>
          <input
            type="text"
            id="observacion"
            name="observacion"
            autoComplete="off"
            placeholder="observacion"
            readOnly={true}
            value={data.observacion ?? ""}
            className={Global.InputStyle + Global.Disabled}
          />
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
