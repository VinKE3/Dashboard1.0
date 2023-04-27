import React, { useState, useEffect } from "react";
import ApiMasy from "../../api/ApiMasy";
import ModalBasic from "../ModalBasic";
import TableBasic from "../tablas/TableBasic";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import * as Global from "../Global";
import * as Funciones from "../Funciones";
//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    width: 90px;
  }
  & th:nth-child(5),
  & th:nth-child(7) {
    width: 70px;
    text-align: right;
  }
  & th:nth-child(4),
  & th:nth-child(6) {
    width: 35px;
    text-align: center;
  }
  & th:last-child {
    width: 60px;
    text-align: center;
    color: transparent;
  }
`;
//#endregion

const FiltroArticulo = ({ setModal, setObjeto }) => {
  //#region useState
  const [datos, setDatos] = useState([]);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState("");
  //#endregion

  //#region useEffect;
  useEffect(() => {
    Listar("", 1);
  }, []);
  //#endregion

  //#region Funciones Filtrado
  const FiltradoCodigo = async (e) => {
    let descripcion = document.getElementById("descripcion").value;
    let codigo = e.target.value;
    clearTimeout(timer);
    setFiltro(`&codigoBarras=${codigo}&descripcion=${descripcion}`, 1);
    const newTimer = setTimeout(() => {
      if (codigo == "" && descripcion == "") {
        Listar("", 1);
      } else {
        Listar(`&codigoBarras=${codigo}&descripcion=${descripcion}`, 1);
      }
    }, 200);
    setTimer(newTimer);
  };
  const FiltradoDescripcion = async (e) => {
    let codigo = document.getElementById("codigoBarras").value;
    let descripcion = e.target.value;
    clearTimeout(timer);
    setFiltro(`&codigoBarras=${codigo}&descripcion=${descripcion}`, 1);
    const newTimer = setTimeout(() => {
      if (codigo == "" && descripcion == "") {
        Listar("", 1);
      } else {
        Listar(`&codigoBarras=${codigo}&descripcion=${descripcion}`, 1);
      }
    }, 200);
    setTimer(newTimer);
  };
  const FiltradoButton = () => {
    if (filtro == "") {
      Listar("", 1);
    } else {
      Listar(filtro, 1);
    }
  };
  //#endregion

  //#region API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Articulo/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
  };
  const GetPorId = async (id, e) => {
    e.preventDefault();
    const result = await ApiMasy.get(`api/Mantenimiento/Articulo/${id}`);
    setObjeto({
      id: result.data.data.id,
      lineaId: result.data.data.lineaId,
      subLineaId: result.data.data.subLineaId,
      articuloId: result.data.data.articuloId,
      marcaId: result.data.data.marcaId,
      descripcion: result.data.data.descripcion,
      codigoBarras: result.data.data.codigoBarras,
      precioUnitario: result.data.data.precioCompra,
      unidadMedidaId: result.data.data.unidadMedidaId,
      unidadMedidaDescripcion: result.data.data.unidadMedidaDescripcion || "",
      stock: result.data.data.stock,
      monedaId: result.data.data.monedaId,
    });
    setModal(false);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Cod Barra",
      accessor: "codigoBarras",
    },
    {
      Header: "Descripción",
      accessor: "descripcion",
    },
    {
      Header: "Unidad",
      accessor: "unidadMedidaAbreviatura",
      Cell: ({ value }) => {
        return <p className="text-center">{value}</p>;
      },
    },
    {
      Header: "Stock",
      accessor: "stock",
      Cell: ({ value }) => {
        return <p className="text-right">{value}</p>;
      },
    },
    {
      Header: "M",
      accessor: "monedaId",
      Cell: ({ value }) => {
        return <p className="text-center">{value == "S" ? "S/." : "US$"}</p>;
      },
    },
    {
      Header: "P. Venta",
      accessor: "precioVenta",
      Cell: ({ value }) => {
        return (
          <p className="text-right">{Funciones.RedondearNumero(value, 4)}</p>
        );
      },
    },
    {
      Header: "-",
      Cell: ({ row }) => (
        <div className="flex justify-center">
          <button
            onClick={(e) => GetPorId(row.values.id, e)}
            className={
              Global.BotonBasic + Global.BotonRegistrar + " !px-3 !py-1.5"
            }
          >
            <FaSearch></FaSearch>
          </button>
        </div>
      ),
    },
  ];
  //#endregion

  //#region Render
  return (
    <>
      <ModalBasic
        setModal={setModal}
        objeto={[]}
        modo={""}
        menu={["", ""]}
        titulo="Buscar Artículo"
        tamañoModal={[Global.ModalMediano, Global.Form]}
        childrenFooter={
          <>
            <button
              className={Global.BotonCancelarModal}
              type="button"
              onClick={() => setModal(false)}
            >
              CERRAR
            </button>
          </>
        }
      >
        {
          <div className={Global.ContenedorBasico}>
            <div className={Global.ContenedorInputs}>
              <div className={Global.Input60pct}>
                <label htmlFor="codigoBarras" className={Global.LabelStyle}>
                  Cod. Barras
                </label>
                <input
                  type="text"
                  id="codigoBarras"
                  name="codigoBarras"
                  placeholder="Código Barras"
                  autoComplete="off"
                  onChange={FiltradoCodigo}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="descripcion" className={Global.LabelStyle}>
                  Descripción
                </label>
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  placeholder="Descripción"
                  autoComplete="off"
                  onChange={FiltradoDescripcion}
                  className={Global.InputBoton}
                />
                <button
                  id="consultar"
                  onClick={FiltradoButton}
                  className={
                    Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                  }
                >
                  <FaSearch></FaSearch>
                </button>
              </div>
            </div>

            {/* Tabla */}
            <TablaStyle>
              <TableBasic columnas={columnas} datos={datos} />
            </TablaStyle>
            {/* Tabla */}
          </div>
        }
      </ModalBasic>
    </>
  );
  //#endregion
};

export default FiltroArticulo;
