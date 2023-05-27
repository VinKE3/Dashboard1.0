import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/funciones/GetPermisos";
import BotonBasico from "../../../components/boton/BotonBasico";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import { Checkbox } from "primereact/checkbox";
import Table from "../../../components/tabla/Table";
import Modal from "./Modal";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import { FaSearch, FaCheck } from "react-icons/fa";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";
import * as Funciones from "../../../components/funciones/Validaciones";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    width: 80px;
  }
  & th:nth-child(4) {
    text-align: center;
    width: 60px;
  }
  & th:nth-child(5) {
    text-align: right;
    width: 40px;
  }
  & th:nth-child(6) {
    text-align: center;
    width: 40px;
  }
  & th:nth-child(7),
  & th:nth-child(8) {
    text-align: right;
    width: 90px;
  }
  & th:nth-child(9),
  & th:nth-child(10),
  & th:nth-child(11) {
    text-align: center;
    width: 35px;
  }
  & th:last-child {
    text-align: center;
    width: 100px;
    max-width: 100px;
  }
`;

const Articulo = () => {
  //#region useState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    codigoBarras: "",
    descripcion: "",
  });
  const [cadena, setCadena] = useState(
    `&codigoBarras=${filtro.codigoBarras}&descripcion=${filtro.descripcion}`
  );
  //Modal
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Nuevo");
  const [objeto, setObjeto] = useState([]);
  const [eliminar, setEliminar] = useState(false);
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
    if (visible) {
      if (!modal) {
        Listar(cadena, index + 1);
      }
    }
  }, [modal]);
  useEffect(() => {
    if (eliminar) {
      Listar(cadena, index + 1);
    }
  }, [eliminar]);

  useEffect(() => {
    if (Object.entries(permisos).length > 0) {
      if (
        !permisos[0] &&
        !permisos[1] &&
        !permisos[2] &&
        !permisos[3] &&
        !permisos[4]
      ) {
        setVisible(false);
      } else {
        setVisible(true);
        Listar(cadena, 1);
      }
    }
  }, [permisos]);
  useEffect(() => {
    GetPermisos("Articulo", setPermisos);
  }, []);
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Articulo/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/Articulo/${id}`);
    setObjeto(result.data.data);
  };
  //#endregion

  //#region Funciones Filtrado
  const ValidarData = async ({ target }) => {
    setFiltro((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));
  };
  const Filtro = async () => {
    clearTimeout(timer);
    setIndex(0);
    const newTimer = setTimeout(() => {
      Listar(cadena, 1);
    }, 200);
    setTimer(newTimer);
  };
  const FiltradoPaginado = (e) => {
    setIndex(e.selected);
    Listar(cadena, e.selected + 1);
  };
  //#endregion

  //#region Funciones Modal
  const AccionModal = async (id, modo = "Nuevo") => {
    setModo(modo);
    if (modo == "Nuevo") {
      setObjeto({
        lineaId: "00",
        subLineaId: "",
        articuloId: "",
        tipoExistenciaId: "01",
        unidadMedidaId: "1",
        marcaId: "36",
        descripcion: "",
        observacion: "",
        codigoBarras: "",
        peso: 0,
        monedaId: "S",
        precioCompra: 0,
        precioCompraDescuento: 0,
        precioVenta1: 0,
        precioVenta2: 0,
        precioVenta3: 0,
        precioVenta4: 0,
        porcentajeUtilidad1: 0,
        porcentajeUtilidad2: 0,
        porcentajeUtilidad3: 0,
        porcentajeUtilidad4: 0,
        stock: 0,
        stockMinimo: 0,
        precioIncluyeIGV: true,
        activarCostoDescuento: false,
        isActivo: true,
        controlarStock: true,
        actualizarPrecioCompra: true,
      });
    } else {
      await GetPorId(id);
    }
    setModal(true);
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
        Header: "C. Barra",
        accessor: "codigoBarras",
      },
      {
        Header: "Descripción",
        accessor: "descripcion",
      },
      {
        Header: "UM",
        accessor: "unidadMedidaAbreviatura",
        Cell: ({ value }) => {
          return <p className="text-center">{value}</p>;
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
                  ? "text-right font-bold text-red-400"
                  : "text-right font-bold text-green-500"
              }
            >
              {value}
            </p>
          );
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
            <p className="text-right font-bold text-yellow-400">
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
            <p className="text-right font-bold text-orange-400">
              {Funciones.RedondearNumero(value, 4)}
            </p>
          );
        },
      },
      {
        Header: "S",
        accessor: "controlarStock",
        Cell: ({ value }) => {
          return (
            <div className="flex justify-center">
              <Checkbox checked={value} />
            </div>
          );
        },
      },
      {
        Header: "A.P",
        accessor: "actualizarPrecio",
        Cell: ({ value }) => {
          return (
            <div className="flex justify-center">
              <Checkbox checked={value} />
            </div>
          );
        },
      },
      {
        Header: "A",
        accessor: "isActivo",
        Cell: ({ value }) => {
          return (
            <div className="flex justify-center">
              <Checkbox checked={value} />
            </div>
          );
        },
      },

      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <BotonCRUD
            setEliminar={setEliminar}
            permisos={permisos}
            menu={["Mantenimiento", "Articulo"]}
            id={row.values.id}
            ClickConsultar={() => AccionModal(row.values.id, "Consultar")}
            ClickModificar={() => AccionModal(row.values.id, "Modificar")}
          />
        ),
      },
    ],
    [permisos]
  );
  //#endregion

  //#region Render
  return (
    <>
      <div className="px-2">
        <h2 className={Global.TituloH2}>Artículos</h2>

        {/* Filtro*/}
        <div className={Global.ContenedorInputs + "mb-2"}>
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
              autoFocus
              value={filtro.codigoBarras}
              onChange={ValidarData}
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
              value={filtro.descripcion}
              onChange={ValidarData}
              className={Global.InputBoton}
            />
            <button
              id="consultar"
              onClick={Filtro}
              className={
                Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
              }
            >
              <FaSearch></FaSearch>
            </button>
          </div>
        </div>
        {/* Filtro*/}

        {/* Boton */}
        {permisos[0] && (
          <BotonBasico
            botonText="Nuevo"
            botonClass={Global.BotonRegistrar}
            botonIcon={faPlus}
            click={() => AccionModal()}
          />
        )}
        {/* Boton */}

        {/* Tabla */}
        <TablaStyle>
          <Table
            columnas={columnas}
            datos={datos}
            total={total}
            index={index}
            Click={(e) => FiltradoPaginado(e)}
          />
        </TablaStyle>
        {/* Tabla */}
      </div>

      {modal && <Modal setModal={setModal} modo={modo} objeto={objeto} />}
      <ToastContainer />
    </>
  );
  //#endregion
};

export default Articulo;
