import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/funciones/GetPermisos";
import Delete from "../../../components/funciones/Delete";
import BotonBasico from "../../../components/boton/BotonBasico";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import Table from "../../../components/tabla/Table";
import Modal from "./Modal";
import { ToastContainer } from "react-toastify";
import moment from "moment";
import styled from "styled-components";
import { FaUndoAlt } from "react-icons/fa";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import * as G from "../../../components/Global";
//#region Estilos
const DivTabla = styled.div`
  & th:last-child {
    text-align: center;
    width: 100px;
    max-width: 100px;
  }
`;
//#endregion

const TipodeCambio = () => {
  //#region UseState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    anio: moment().format("YYYY"),
    mes: "",
  });
  const [cadena, setCadena] = useState(
    `&anio=${filtro.anio}&mes=${filtro.mes}`
  );
  //Modal
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Nuevo");
  const [objeto, setObjeto] = useState([]);
  const [listar, setListar] = useState(false);
  //Modal
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(`&anio=${filtro.anio}&mes=${filtro.mes}`);
  }, [filtro]);
  useEffect(() => {
    if (visible) {
      Filtro();
    }
  }, [cadena]);

  useEffect(() => {
    if (visible) {
      if (!modal) {
        Listar(cadena, index + 1);
      }
    }
  }, [modal]);
  useEffect(() => {
    if (listar) {
      setListar(false);
      Listar(cadena, index + 1);
    }
  }, [listar]);

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
    GetPermisos("TipoCambio", setPermisos);
  }, []);
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/TipoCambio/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/TipoCambio/${id}`);
    setObjeto(result.data.data);
  };
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
      setIndex(0);
      Listar(cadena, 1);
    }, 200);
    setTimer(newTimer);
  };
  const FiltroBoton = async () => {
    setFiltro({
      anio: moment().format("YYYY"),
      mes: "",
    });
    setIndex(0);
    document.getElementById("anio").focus();
  };
  const FiltradoPaginado = (e) => {
    setIndex(e.selected);
    Listar(cadena, e.selected + 1);
  };
  //#endregion

  //#region Funciones Modal
  const AccionModal = async (value, modo = "Nuevo", click = false) => {
    setModo(modo);
    if (click) {
      let row = value.target.closest("tr");
      let id = moment(row.firstChild.innerText, "DD/MM/YYYY").format(
        "YYYY-MM-DD"
      );
      await GetPorId(id);
    } else {
      if (modo == "Nuevo") {
        setObjeto({
          id: moment().format("YYYY-MM-DD"),
          precioCompra: "0",
          precioVenta: "0",
        });
      } else {
        await GetPorId(value);
      }
    }
    setModal(true);
  };
  const ModalKey = async (e) => {
    if (e.key === "n") {
      AccionModal();
    }
    if (e.key === "Enter") {
      let row = document
        .querySelector("#tablaTipoCambio")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = moment(row.firstChild.innerText, "DD/MM/YYYY").format(
          "YYYY-MM-DD"
        );
        AccionModal(id, "Modificar");
      }
    }
    if (e.key === "Delete") {
      let row = document
        .querySelector("#tablaTipoCambio")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = moment(row.firstChild.innerText, "DD/MM/YYYY").format(
          "YYYY-MM-DD"
        );
        Delete(["Mantenimiento", "TipoCambio"], id, setListar);
      }
    }
    if (e.key === "c") {
      let row = document
        .querySelector("#tablaTipoCambio")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = moment(row.firstChild.innerText, "DD/MM/YYYY").format(
          "YYYY-MM-DD"
        );
        AccionModal(id, "Consultar");
      }
    }
  };
  //#endregion

  //#region Columnas
  const columnas = useMemo(
    () => [
      {
        Header: "Fecha",
        accessor: "id",
        Cell: ({ value }) => {
          return (
            <p className="text center">{moment(value).format("DD/MM/YYYY")}</p>
          );
        },
      },
      {
        Header: "Precio Compra",
        accessor: "precioCompra",
      },
      {
        Header: "Precio Venta",
        accessor: "precioVenta",
      },
      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <BotonCRUD
            setListar={setListar}
            permisos={permisos}
            menu={["Mantenimiento", "TipoCambio"]}
            id={row.values.id}
            ClickConsultar={() => AccionModal(row.values.id, "Consultar")}
            ClickModificar={() => AccionModal(row.values.id, "Modificar")}
          />
        ),
      },
    ],
    [permisos]
  );
  const meses = [
    {
      numero: "",
      nombre: "TODOS",
    },
    {
      numero: 1,
      nombre: "ENERO",
    },
    {
      numero: 2,
      nombre: "FEBRERO",
    },
    {
      numero: 3,
      nombre: "MARZO",
    },
    {
      numero: 4,
      nombre: "ABRIL",
    },
    {
      numero: 5,
      nombre: "MAYO",
    },
    {
      numero: 6,
      nombre: "JUNIO",
    },
    {
      numero: 7,
      nombre: "JULIO",
    },
    {
      numero: 8,
      nombre: "AGOSTO",
    },
    {
      numero: 9,
      nombre: "SETIEMBRE",
    },
    {
      numero: 10,
      nombre: "OCTUBRE",
    },
    {
      numero: 11,
      nombre: "NOVIEMBRE",
    },
    {
      numero: 12,
      nombre: "DICIEMBRE",
    },
  ];

  //#endregion

  //#region Render
  return (
    <>
      {visible ? (
        <>
          <div className={G.ContenedorPadre}>
            <h2 className={G.TituloH2}>Tipo de Cambio</h2>

            {/* Filtro*/}
            <div className={G.ContenedorInputsFiltro}>
              <div className={G.InputsFiltro}>
                <label htmlFor="anio" className={G.LabelStyle}>
                  Año:
                </label>
                <input
                  type="number"
                  name="anio"
                  id="anio"
                  autoFocus
                  min={0}
                  value={filtro.anio}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>

              <div className={G.InputsFiltro}>
                <label id="mes" className={G.LabelStyle}>
                  Mes:
                </label>
                <select
                  id="mes"
                  name="mes"
                  value={filtro.mes}
                  onChange={HandleData}
                  className={G.InputBoton}
                >
                  {meses.map((map) => (
                    <option key={map.numero} value={map.numero}>
                      {map.nombre}
                    </option>
                  ))}
                </select>
                <button
                  id="buscar"
                  className={G.BotonBuscar + G.Anidado + G.BotonPrimary}
                  onClick={FiltroBoton}
                >
                  <FaUndoAlt />
                </button>
              </div>
            </div>
            {/* Filtro*/}

            {/* Boton */}
            {permisos[0] && (
              <BotonBasico
                botonText="Nuevo"
                botonClass={G.BotonRegistrar}
                botonIcon={faPlus}
                click={() => AccionModal()}
                contenedor=""
              />
            )}
            {/* Boton */}

            {/* Tabla */}
            <DivTabla>
              <Table
                id={"tablaTipoCambio"}
                columnas={columnas}
                datos={datos}
                total={total}
                index={index}
                Click={(e) => FiltradoPaginado(e)}
                DobleClick={(e) => AccionModal(e, "Consultar", true)}
                KeyDown={(e) => ModalKey(e)}
              />
            </DivTabla>
            {/* Tabla */}
          </div>
          {modal && <Modal setModal={setModal} modo={modo} objeto={objeto} />}
          <ToastContainer />
        </>
      ) : (
        <span></span>
      )}
    </>
  );
  //#endregion
};

export default TipodeCambio;
