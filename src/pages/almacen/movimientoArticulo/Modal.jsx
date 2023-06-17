import moment from "moment";
import React, { useState } from "react";
import styled from "styled-components";
import * as G from "../../../components/Global";
import * as Funciones from "../../../components/funciones/Validaciones";
import ModalBasic from "../../../components/modal/ModalBasic";
import TableBasic from "../../../components/tabla/TableBasic";

//#region Estilos
const DivTabla = styled.div`
  max-width: 100%;
  overflow-x: auto;
  & th:nth-child(1) {
    width: 40px;
    text-align: center;
  }
  & th:nth-child(2) {
    width: 70px;
    text-align: center;
  }
  & th:nth-child(3) {
    min-width: 125px;
    text-align: left;
  }
  & th:nth-child(4) {
    width: 100%;
    text-align: left;
  }

  & th:nth-child(5),
  & th:nth-child(6),
  & th:nth-child(7),
  & th:nth-child(8),
  & th:nth-child(9),
  & th:nth-child(10),
  & th:nth-child(11),
  & th:nth-child(12),
  & th:nth-child(13) {
    min-width: 100px;
    max-width: 10px;
    width: 100px !important;
    text-align: center;
  }

  & tbody td:nth-child(5),
  & tbody td:nth-child(6),
  & tbody td:nth-child(7),
  & tbody td:nth-child(8),
  & tbody td:nth-child(9),
  & tbody td:nth-child(10),
  & tbody td:nth-child(11),
  & tbody td:nth-child(12),
  & tbody td:nth-child(13) {
    min-width: 100px;
    max-width: 100px;
    width: 100px;
    text-align: center;
  }
`;
const divStyle = {
  minWidth: "275px",
  maxWidth: "100%",
  width: "100%",
};
const tdStyle = {
  minWidth: "100px",
  maxWidth: "100px",
  width: "100px",
};
//#endregion

const Modal = ({ setModal, objeto, foco }) => {
  //#region useState
  const [data] = useState(objeto);
  const [detalles] = useState(objeto.detalles);
  //#endregion

  //#region Funciones
  const CerrarModalKey = (e) => {
    if (e.key == "Escape" || e.key == "Enter") {
      foco.focus();
      setModal(false);
    }
  };
  //#endregion

  //#region Columnas
  const columnasDetalles = [
    {
      Header: "N°",
      accessor: "numero",
      Cell: ({ value }) => {
        return <p className="text-center font-bold">{value}</p>;
      },
    },
    {
      Header: "Emisión",
      accessor: "fechaEmision",
      Cell: ({ value }) => {
        return (
          <p className="text-center">{moment(value).format("DD/MM/YY")}</p>
        );
      },
    },
    {
      Header: "Documento",
      accessor: "numeroDocumento",
    },
    {
      Header: "Cliente",
      accessor: "clienteNombre",
    },
    {
      Header: "Entradas",
      accessor: "entradaCantidad",
      Cell: ({ value }) => {
        return (
          <p
            className="pr-5 text-right font-bold text-orange-400"
            style={tdStyle}
          >
            {Funciones.RedondearNumero(value, 2)}
          </p>
        );
      },
    },
    {
      Header: "Costo",
      accessor: "entradaCosto",
      Cell: ({ value }) => {
        return (
          <p
            className="pr-5 text-right font-bold text-orange-400"
            style={tdStyle}
          >
            {Funciones.RedondearNumero(value, 2)}
          </p>
        );
      },
    },
    {
      Header: "Total",
      accessor: "entradaImporte",
      Cell: ({ value }) => {
        return (
          <p
            className="pr-5 text-right font-bold text-orange-400"
            style={tdStyle}
          >
            {Funciones.RedondearNumero(value, 2)}
          </p>
        );
      },
    },
    {
      Header: "Salidas",
      accessor: "salidaCantidad",
      Cell: ({ value }) => {
        return (
          <p
            className="pr-5 text-right font-bold text-violet-400"
            style={tdStyle}
          >
            {Funciones.RedondearNumero(value, 2)}
          </p>
        );
      },
    },
    {
      Header: "Precio",
      accessor: "salidaCosto",
      Cell: ({ value }) => {
        return (
          <p
            className="pr-5 text-right font-bold text-violet-400"
            style={tdStyle}
          >
            {Funciones.RedondearNumero(value, 2)}
          </p>
        );
      },
    },
    {
      Header: "Total",
      accessor: "salidaImporte",
      Cell: ({ value }) => {
        return (
          <p
            className="pr-5 text-right font-bold text-violet-400"
            style={tdStyle}
          >
            {Funciones.RedondearNumero(value, 2)}
          </p>
        );
      },
    },
    {
      Header: "Saldo",
      accessor: "saldoCantidad",
      Cell: ({ value }) => {
        return (
          <p
            className="pr-5 text-right font-bold text-green-500"
            style={tdStyle}
          >
            {Funciones.RedondearNumero(value, 2)}
          </p>
        );
      },
    },
    {
      Header: "Costo",
      accessor: "saldoCosto",
      Cell: ({ value }) => {
        return (
          <p
            className="pr-5 text-right font-bold text-green-500"
            style={tdStyle}
          >
            {Funciones.RedondearNumero(value, 2)}
          </p>
        );
      },
    },
    {
      Header: "Total",
      accessor: "saldoImporte",
      Cell: ({ value }) => {
        return (
          <p
            className="pr-5 text-right font-bold text-green-500"
            style={tdStyle}
          >
            {Funciones.RedondearNumero(value, 2)}
          </p>
        );
      },
    },
  ];
  //#endregion

  //#region Render
  return (
    <ModalBasic
      setModal={setModal}
      titulo="Movimiento de Artículos"
      tamañoModal={[G.ModalFull, G.Form]}
      childrenFooter={
        <>
          <button
            className={G.BotonModalBase + G.BotonCerrarModal}
            type="button"
            autoFocus
            onClick={() => setModal(false)}
            onKeyDown={(e) => CerrarModalKey(e)}
          >
            CERRAR
          </button>
        </>
      }
    >
      {/*Tabla Detalle*/}
      <div className={G.ContenedorBasico + G.FondoContenedor + "!gap-0"}>
        <DivTabla>
          <TableBasic
            columnas={columnasDetalles}
            datos={detalles}
            estilos={["", "", "", "border ", "", "border border-b-0", "border"]}
            KeyDown={(e) => CerrarModalKey(e)}
          />
        </DivTabla>

        {/*Tabla Footer*/}
        <div className={G.ContenedorFooter + "overflow-auto"}>
          <div className="flex">
            <div className={G.FilaVacia} style={divStyle}></div>
            <div className={G.FilaMovArticulo}>
              <p className={G.FilaContenidoMovArt}>Entradas</p>
            </div>
            <div className={G.FilaMovArticulo}>
              <p className={G.FilaContenidoMovArt}>Costo</p>
            </div>
            <div className={G.FilaMovArticulo}>
              <p className={G.FilaContenidoMovArt}>Total</p>
            </div>
            <div className={G.FilaMovArticulo}>
              <p className={G.FilaContenidoMovArt}>Salidas</p>
            </div>
            <div className={G.FilaMovArticulo}>
              <p className={G.FilaContenidoMovArt}>Precio</p>
            </div>
            <div className={G.FilaMovArticulo}>
              <p className={G.FilaContenidoMovArt}>Total</p>
            </div>
            <div className={G.FilaMovArticulo}>
              <p className={G.FilaContenidoMovArt}>Saldo</p>
            </div>
            <div className={G.FilaMovArticulo}>
              <p className={G.FilaContenidoMovArt}>Costo</p>
            </div>
            <div className={G.FilaMovArticulo}>
              <p className={G.FilaContenidoMovArt}>Total</p>
            </div>
          </div>
          <div className="flex">
            <div className={G.FilaVacia} style={divStyle}></div>
            <div className={G.FilaMovArticulo}>
              <p className={G.FilaContenidoMovArt}>
                {Funciones.RedondearNumero(data.entradaCantidadTotal, 2) ??
                  "0.00"}
              </p>
            </div>
            <div className={G.FilaMovArticulo}>
              <p className={G.FilaContenidoMovArt}>
                {Funciones.RedondearNumero(data.entradaCostoTotal, 2) ?? "0.00"}
              </p>
            </div>
            <div className={G.FilaMovArticulo}>
              <p className={G.FilaContenidoMovArt}>
                {Funciones.RedondearNumero(data.entradaImporteTotal, 2) ??
                  "0.00"}
              </p>
            </div>
            <div className={G.FilaMovArticulo}>
              <p className={G.FilaContenidoMovArt}>
                {Funciones.RedondearNumero(data.salidaCantidadTotal, 2) ??
                  "0.00"}
              </p>
            </div>
            <div className={G.FilaMovArticulo}>
              <p className={G.FilaContenidoMovArt}>
                {Funciones.RedondearNumero(data.salidaCostoTotal, 2) ?? "0.00"}
              </p>
            </div>
            <div className={G.FilaMovArticulo}>
              <p className={G.FilaContenidoMovArt}>
                {Funciones.RedondearNumero(data.salidaImporteTotal, 2) ??
                  "0.00"}
              </p>
            </div>
            <div className={G.FilaMovArticulo}>
              <p className={G.FilaContenidoMovArt}>
                {Funciones.RedondearNumero(data.saldoCantidadTotal, 2) ??
                  "0.00"}
              </p>
            </div>
            <div className={G.FilaMovArticulo}>
              <p className={G.FilaContenidoMovArt}>
                {Funciones.RedondearNumero(data.saldoCostoTotal, 2) ?? "0.00"}
              </p>
            </div>
            <div className={G.FilaMovArticulo}>
              <p className={G.FilaContenidoMovArt}>
                {Funciones.RedondearNumero(data.saldoImporteTotal, 2) ?? "0.00"}
              </p>
            </div>
          </div>
        </div>
        {/*Tabla Footer*/}
      </div>
      {/*Tabla Detalle*/}
    </ModalBasic>
  );
  //#endregion
};

export default Modal;
