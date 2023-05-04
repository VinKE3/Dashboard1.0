import React from "react";
import ModalCrud from "../../../components/ModalCrud";
import * as Global from "../../../components/Global";
import TableBasic from "../../../components/tablas/TableBasic";
import ApiMasy from "../../../api/ApiMasy";
import { useState, useEffect } from "react";
import styled from "styled-components";

//#region Estilos
const TablaStyle = styled.div`
  & tbody td:first-child {
    width: 20px;
  }
  & th:nth-child(2) {
    width: 150px;
  }
  & th:nth-child(3) {
    width: 150px;
  }
  & th:nth-child(4) {
    width: 250px;
  }
  & th:nth-child(5) {
    width: 200px;
  }
  & th:nth-child(6) {
    width: 150px;
  }
  & th:nth-child(7) {
    width: 150px;
  }
  & th:nth-child(8) {
    width: 100px;
  }
  & th:nth-child(9) {
    width: 100px;
  }
  & th:nth-child(10) {
    width: 100px;
  }
  & th:nth-child(11) {
    width: 100px;
  }
  & th:nth-child(12) {
    width: 100px;
  }
  & th:last-child {
    width: 130px;
  }
`;

const TablaStyleOculto = styled.div`
  & thead th:first-child {
    visibility: hidden;
  }
  & tbody td:first-child {
    width: 20px;
  }
  & thead th:nth-child(2) {
    visibility: hidden;
  }
  & th:nth-child(2) {
    width: 150px;
  }
  & thead th:nth-child(3) {
    visibility: hidden;
  }
  & th:nth-child(3) {
    width: 150px;
  }
  & thead th:nth-child(4) {
    visibility: hidden;
  }
  & th:nth-child(4) {
    width: 250px;
  }
  & th:nth-child(5) {
    width: 200px;
  }
  & th:nth-child(6) {
    width: 150px;
  }
  & th:nth-child(7) {
    width: 150px;
  }
  & th:nth-child(8) {
    width: 100px;
  }
  & th:nth-child(9) {
    width: 100px;
  }
  & th:nth-child(10) {
    width: 100px;
  }
  & th:nth-child(11) {
    width: 100px;
  }
  & th:nth-child(12) {
    width: 100px;
  }
  & th:last-child {
    width: 130px;
  }
`;

const Modal = ({ setModal, objeto }) => {
  const [data, setData] = useState(objeto);
  const [articulos, setArticulos] = useState([]);
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    data;
  }, [data]);

  useEffect(() => {
    detalles;
  }, [detalles]);

  useEffect(() => {
    articulos;
    console.log(articulos);
  }, [articulos]);

  useEffect(() => {
    ListarArticulos();
  }, []);

  const ListarArticulos = async () => {
    const result = await ApiMasy.get(
      `api/Almacen/MovimientoArticulo/GetKardexArticulo?id=${data.Id}`
    );
    setArticulos([result.data.data]);
    setDetalles(result.data.data.detalles);
  };

  const colArticulos = [
    {
      Header: "N°",
      accessor: "numero",
    },
    {
      Header: "Fecha",
      accessor: "fechaEmision",
    },
    {
      Header: "Documento",
      accessor: "numeroDocumento",
    },
    {
      Header: "Razon Social",
      accessor: "clienteNombre",
    },
    {
      Header: "Entradas",
      accessor: "entradaCantidad",
    },
    {
      Header: "Costo",
      accessor: "entradaCosto",
    },
    {
      Header: "Total",
      accessor: "entradaImporte",
    },
    {
      Header: "Salidas",
      accessor: "salidaCantidad",
    },
    {
      Header: "Precio",
      accessor: "salidaCosto",
    },
    {
      Header: "Total",
      accessor: "salidaImporte",
    },
    {
      Header: "Saldo",
      accessor: "saldoCantidad",
    },
    {
      Header: "Costo",
      accessor: "saldoCosto",
    },
    {
      Header: "Total",
      accessor: "saldoImporte",
    },
  ];
  const colArticulosTotal = [
    {
      Header: "N°",
      accessor: "",
    },
    {
      Header: "Fecha",
      accessor: "",
    },
    {
      Header: "Documento",
      accessor: "",
    },
    {
      Header: "Razon Social",
      accessor: "",
    },
    {
      Header: "Entradas",
      accessor: "entradaCantidadTotal",
    },
    {
      Header: "Costo",
      accessor: "entradaCostoTotal",
    },
    {
      Header: "Total",
      accessor: "entradaImporteTotal",
    },
    {
      Header: "Salidas",
      accessor: "salidaCantidadTotal",
    },
    {
      Header: "Precio",
      accessor: "salidaCostoTotal",
    },
    {
      Header: "Total",
      accessor: "salidaImporteTotal",
    },
    {
      Header: "Saldo",
      accessor: "saldoCantidadTotal",
    },
    {
      Header: "Costo",
      accessor: "saldoCostoTotal",
    },
    {
      Header: "Total",
      accessor: "saldoImporteTotal",
    },
  ];

  return (
    <ModalCrud
      setModal={setModal}
      objeto={objeto}
      modo={""}
      menu={["Almacen", "MovimientoArticulos"]}
      tamañoModal={[Global.ModalFull, Global.Form]}
      titulo={["Movimiento de Articulos"]}
    >
      <TablaStyle>
        <TableBasic columnas={colArticulos} datos={detalles} />
      </TablaStyle>
      <TablaStyleOculto>
        <TableBasic columnas={colArticulosTotal} datos={articulos} />
      </TablaStyleOculto>
    </ModalCrud>
  );
};

export default Modal;
