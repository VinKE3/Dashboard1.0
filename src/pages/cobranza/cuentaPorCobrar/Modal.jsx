import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import Mensajes from "../../../components/funciones/Mensajes";
import TableBasic from "../../../components/tabla/TableBasic";
import BotonBasico from "../../../components/boton/BotonBasico";
import { toast } from "react-toastify";
import moment from "moment";
import { FaPlus, FaUndoAlt, FaTrashAlt, FaEye } from "react-icons/fa";
import styled from "styled-components";
import { faPlus, faCancel } from "@fortawesome/free-solid-svg-icons";
import "primeicons/primeicons.css";
import "react-toastify/dist/ReactToastify.css";
import * as G from "../../../components/Global";
import * as Funciones from "../../../components/funciones/Validaciones";

//#region Estilos
const DivTabla = styled.div`
  & th:nth-child(1) {
    width: 40px;
    text-align: center;
  }
  & th:nth-child(2) {
    width: 60px;
    text-align: center;
  }
  & th:nth-child(3) {
    width: 120px;
  }
  & th:nth-child(5) {
    width: 40px;
    text-align: center;
  }

  & th:nth-child(6) {
    width: 100px;
    min-width: 100px;
    max-width: 100px;
    text-align: center;
  }
  & th:nth-child(7) {
    width: 90px;
    min-width: 90px;
    max-width: 90px;
    text-align: center;
  }
  & th:last-child {
    width: 75px;
    min-width: 75px;
    max-width: 75px;
    text-align: center;
  }
`;
//#endregion

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  //Data General
  const [data] = useState(objeto);
  const [dataDetalle] = useState(objeto.abonos);
  //Data General
  //Tablas
  const [dataTipoDoc] = useState([objeto.tipoDocumento]);
  const [dataMoneda] = useState([objeto.moneda]);
  //Tablas
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "Item",
      accessor: "abonoId",
      Cell: ({ value }) => {
        return <p className="text-center">{value}</p>;
      },
    },
    {
      Header: "Fecha",
      accessor: "fecha",
      Cell: ({ value }) => {
        return moment(value).format("DD/MM/YYYY");
      },
    },
    {
      Header: "Tipo de Cobro",
      accessor: "tipoCobroDescripcion",
      Cell: ({ value }) => {
        let comprobante = "";
        switch (value) {
          case "EF":
            comprobante = "EFECTIVO";
            break;
          case "DE":
            comprobante = "DEPÓSITO";
            break;
          case "TR":
            comprobante = "TRANSFERENCIA";
          default:
            comprobante = value;
        }
        return <p>{comprobante}</p>;
      },
    },
    {
      Header: "Concepto",
      accessor: "concepto",
    },
    {
      Header: "M",
      accessor: "monedaId",
      Cell: ({ value }) => {
        return <p className="text-center">{value == "S" ? "S/." : "US$"}</p>;
      },
    },
    {
      Header: "T.C",
      accessor: "tipoCambio",

      Cell: ({ value }) => {
        return <p className="text-right font-semibold pr-5">{value}</p>;
      },
    },
    {
      Header: "Monto",
      accessor: "monto",
      Cell: ({ value }) => {
        return <p className="text-right font-semibold pr-5">{value}</p>;
      },
    },
    {
      Header: " ",
      Cell: () => (
        <div className="flex item-center justify-center">
          <></>
        </div>
      ),
    },
  ];
  //#endregion

  //#region  Render
  return (
    <>
      {Object.entries(dataTipoDoc).length > 0 && (
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={["Finanzas", "CuentaPorCobrar"]}
          titulo="Cuentas Por Cobrar"
          cerrar={false}
          foco={document.getElementById("tablaCuentaPorCobrar")}
          tamañoModal={[G.ModalFull, G.Form + " px-10 "]}
        >
          {/*Cabecera*/}
          <div className={G.ContenedorBasico + G.FondoContenedor + " mb-2"}>
            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label htmlFor="tipoDocumentoId" className={G.LabelStyle}>
                  Tipo Doc.
                </label>
                <select
                  id="tipoDocumentoId"
                  name="tipoDocumentoId"
                  autoFocus
                  value={data.tipoDocumentoId ?? ""}
                  disabled={modo == "Nuevo" ? false : true}
                  className={G.InputStyle}
                >
                  {dataTipoDoc.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className={G.InputTercio}>
                <label htmlFor="serie" className={G.LabelStyle}>
                  Serie
                </label>
                <input
                  type="text"
                  id="serie"
                  name="serie"
                  placeholder="Número"
                  autoComplete="off"
                  maxLength="4"
                  disabled={true}
                  value={data.serie ?? ""}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputMitad}>
                <label htmlFor="numero" className={G.LabelStyle}>
                  Número
                </label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  placeholder="Número"
                  autoComplete="off"
                  maxLength="10"
                  disabled={true}
                  value={data.numero ?? ""}
                  className={G.InputStyle}
                />
              </div>
            </div>
            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label htmlFor="fechaContable" className={G.LabelStyle}>
                  Fecha
                </label>
                <input
                  type="text"
                  id="fechaContable"
                  name="fechaContable"
                  autoComplete="off"
                  placeholder="fechaContable"
                  disabled={true}
                  value={moment(data.fechaContable).format("DD/MM/YYYY") ?? ""}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputFull}>
                <label htmlFor="monedaId" className={G.LabelStyle}>
                  Moneda
                </label>
                <select
                  id="monedaId"
                  name="monedaId"
                  className={G.InputStyle}
                  disabled={true}
                  value={data.monedaId ?? ""}
                >
                  {dataMoneda.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label htmlFor="total" className={G.LabelStyle}>
                  Total a Pagar
                </label>
                <input
                  type="text"
                  id="total"
                  name="total"
                  autoComplete="off"
                  placeholder="Total a Pagar"
                  disabled={true}
                  value={data.total ?? ""}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputFull}>
                <label htmlFor="abonado" className={G.LabelStyle}>
                  Abonado
                </label>
                <input
                  type="text"
                  id="abonado"
                  name="abonado"
                  autoComplete="off"
                  placeholder="Abonado"
                  disabled={true}
                  value={data.abonado ?? ""}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputFull}>
                <label htmlFor="saldo" className={G.LabelStyle}>
                  Saldo Total
                </label>
                <input
                  type="text"
                  id="saldo"
                  name="saldo"
                  autoComplete="off"
                  placeholder="Saldo Total"
                  disabled={true}
                  value={data.saldo ?? ""}
                  className={G.InputStyle}
                />
              </div>
            </div>
            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label htmlFor="observacion" className={G.LabelStyle}>
                  Observación
                </label>
                <input
                  type="text"
                  id="observacion"
                  name="observacion"
                  autoComplete="off"
                  placeholder="Observación"
                  disabled={true}
                  value={data.observacion ?? ""}
                  className={G.InputStyle}
                />
              </div>
            </div>
          </div>
          {/*Cabecera*/}

          {/* Tabla Detalle */}
          <DivTabla>
            <TableBasic
              columnas={columnas}
              datos={dataDetalle}
              estilos={[
                "",
                "",
                "",
                "border ",
                "",
                "border border-b-0",
                "border",
              ]}
            />
          </DivTabla>
          {/* Tabla Detalle */}
        </ModalCrud>
      )}
    </>
  );
  //#endregion
};

export default Modal;
