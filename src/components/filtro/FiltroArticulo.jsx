import { useEffect, useMemo, useState } from "react";
import { FaCheck } from "react-icons/fa";
import styled from "styled-components";
import ApiMasy from "../../api/ApiMasy";
import * as G from "../Global";
import * as Funciones from "../funciones/Validaciones";
import ModalBasic from "../modal/ModalBasic";
import TableBasic from "../tabla/TableBasic";


//#region Estilos
const DivTabla = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    width: 90px;
  }
  & th:nth-child(4),
  & th:nth-child(5) {
    width: 35px;
    text-align: center;
  }
  & th:nth-child(6),
  & th:nth-child(7),
  & th:nth-child(8) {
    width: 85px;
    text-align: right;
  }
  & th:last-child {
    width: 60px;
    text-align: center;
    color: transparent;
  }
`;
//#endregion

const FiltroArticulo = ({ setModal, setObjeto, foco }) => {
  //#region useState
  const [datos, setDatos] = useState([]);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    codigoBarras: "",
    descripcion: "",
  });
  const [cadena, setCadena] = useState(
    `&codigoBarras=${filtro.codigoBarras}&descripcion=${filtro.descripcion}`
  );
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(
      `&codigoBarras=${filtro.codigoBarras}&descripcion=${filtro.descripcion}`
    );
  }, [filtro]);
  useEffect(() => {
    Filtro();
  }, [cadena]);
  useEffect(() => {
    Listar(cadena, 1);
  }, []);
  //#endregion

  //#region Funciones Filtrado
  const HandleData = async ({ target }) => {
    setFiltro((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));
  };
  const Filtro = async () => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      Listar(cadena, 1);
    }, 200);
    setTimer(newTimer);
  };
  const KeyTabla = async (e, click = false) => {
    if (e.key === "Enter") {
      let row = document
        .querySelector("#tablaFiltroArticulo")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        await GetPorId(id);
      }
    }
    if (e.key == "Escape") {
      foco.focus();
      setModal(false);
    }
    if (click) {
      let row = e.target.closest("tr");
      let id = row.firstChild.innerText;
      await GetPorId(id);
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
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/Articulo/${id}`);
    setObjeto({
      id: result.data.data.id,
      lineaId: result.data.data.lineaId,
      subLineaId: result.data.data.subLineaId,
      articuloId: result.data.data.articuloId,
      marcaId: result.data.data.marcaId,
      descripcion: result.data.data.descripcion,
      codigoBarras: result.data.data.codigoBarras,
      precioCompra: result.data.data.precioCompra,
      precioVenta1: result.data.data.precioVenta1,
      precioVenta2: result.data.data.precioVenta2,
      precioVenta3: result.data.data.precioVenta3,
      precioVenta4: result.data.data.precioVenta4,
      unidadMedidaId: result.data.data.unidadMedidaId,
      unidadMedidaDescripcion: result.data.data.unidadMedidaDescripcion ?? "",
      stock: result.data.data.stock,
      monedaId: result.data.data.monedaId,
      presentacion: result.data.data.presentacion ?? "",
    });
    foco.focus();
    setModal(false);
  };
  //#endregion

  //#region Columnas
  const columnas = useMemo(
    () => [
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
        Header: "M",
        accessor: "monedaId",
        Cell: ({ value }) => {
          return <p className="text-center">{value == "S" ? "S/." : "US$"}</p>;
        },
      },
      {
        Header: "P. Compra",
        accessor: "precioCompra",
        Cell: ({ value }) => {
          return (
            <p className="text-right font-bold text-emerald-400">
              {Funciones.RedondearNumero(value, 4)}
            </p>
          );
        },
      },
      {
        Header: "P. Venta",
        accessor: "precioVenta",
        Cell: ({ value }) => {
          return (
            <p className="text-right font-bold text-pink-400">
              {Funciones.RedondearNumero(value, 4)}
            </p>
          );
        },
      },
      {
        Header: "Stock",
        accessor: "stock",
        Cell: ({ value }) => {
          return (
            <p
              className={
                value <= 0
                  ? "text-right font-bold text-red-500"
                  : "text-right font-bold text-green-500"
              }
            >
              {value}
            </p>
          );
        },
      },
      {
        Header: " ",
        Cell: ({ row }) => (
          <div className="flex justify-center">
            <button
              id="boton"
              onClick={(e) => GetPorId(row.values.id, e)}
              className={G.BotonModalBase + G.BotonVerde + "border-none"}
            >
              <FaCheck></FaCheck>
            </button>
          </div>
        ),
      },
    ],
    [datos]
  );
  //#endregion

  //#region Render
  return (
    <>
      <ModalBasic
        setModal={setModal}
        titulo="Consultar Artículos"
        foco={foco}
        tamañoModal={[G.ModalMediano, G.Form]}
        childrenFooter={
          <>
            <button
              type="button"
              onClick={() => setModal(false)}
              className={G.BotonModalBase + G.BotonCerrarModal}
            >
              CERRAR
            </button>
          </>
        }
      >
        {
          <>
            <div className={G.ContenedorBasico}>
              <div className={G.ContenedorInputs + "mb-2"}>
                <div className={G.Input60pct}>
                  <label htmlFor="codigoBarras" className={G.LabelStyle}>
                    Cod. Barras
                  </label>
                  <input
                    type="text"
                    id="codigoBarras"
                    name="codigoBarras"
                    placeholder="Código Barras"
                    autoComplete="off"
                    autoFocus
                    value={filtro.codigoBarras}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputFull}>
                  <label htmlFor="descripcion" className={G.LabelStyle}>
                    Descripción
                  </label>
                  <input
                    type="text"
                    id="descripcion"
                    name="descripcion"
                    placeholder="Descripción"
                    autoComplete="off"
                    value={filtro.descripcion}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                  {/* <button
                    id="consultarArticuloFiltro"
                    onClick={Filtro}
                    className={
                      G.BotonBuscar + G.Anidado + G.BotonPrimary
                    }
                  >
                    <FaUndoAlt></FaUndoAlt>
                  </button> */}
                </div>
              </div>

              {/* Tabla */}
              <DivTabla>
                <TableBasic
                  id={"tablaFiltroArticulo"}
                  columnas={columnas}
                  datos={datos}
                  DobleClick={(e) => KeyTabla(e, true)}
                  KeyDown={(e) => KeyTabla(e)}
                />
              </DivTabla>
              {/* Tabla */}
            </div>
          </>
        }
      </ModalBasic>
    </>
  );
  //#endregion
};

export default FiltroArticulo;
