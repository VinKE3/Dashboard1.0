import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/funciones/GetPermisos";
import Delete from "../../../components/funciones/Delete";
import FiltroBasico from "../../../components/filtro/FiltroBasico";
import BotonBasico from "../../../components/boton/BotonBasico";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import Table from "../../../components/tabla/Table";
import Modal from "./Modal";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
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

const Distrito = () => {
  //#region useState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    nombre: "",
  });
  const [cadena, setCadena] = useState(`&nombre=${filtro.nombre}`);
  //Modal
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Nuevo");
  const [objeto, setObjeto] = useState([]);
  const [listar, setListar] = useState(false);
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(`&nombre=${filtro.nombre}`);
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
    GetPermisos("Distrito", setPermisos);
  }, []);
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Distrito/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(
      result.data.data.data.map((res) => ({
        Id: res.departamentoId + res.provinciaId + res.distritoId,
        ...res,
      }))
    );
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/Distrito/${id}`);
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
    setIndex(0);
    const newTimer = setTimeout(() => {
      Listar(cadena, 1);
    }, 200);
    setTimer(newTimer);
  };
  const FiltroBoton = async () => {
    setFiltro({
      nombre: "",
    });
    setIndex(0);
    document.getElementById("nombre").focus();
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
      let id = row.firstChild.innerText;
      await GetPorId(id);
    } else {
      if (modo == "Nuevo") {
        setObjeto({
          departamentoId: "",
          provinciaId: "",
          distritoId: "",
          nombre: "",
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
        .querySelector("#tablaDistrito")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Modificar");
      }
    }
    if (e.key === "Delete") {
      let row = document
        .querySelector("#tablaDistrito")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        Delete("Mantenimiento/Distrito", id, setListar);
      }
    }
    if (e.key === "c") {
      let row = document
        .querySelector("#tablaDistrito")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Consultar");
      }
    }
  };
  //#endregion

  //#region Columnas
  const columnas = useMemo(
    () => [
      {
        Header: "Código",
        accessor: "Id",
      },
      {
        Header: "Departamento",
        accessor: "departamentoNombre",
      },
      {
        Header: "Provincia",
        accessor: "provinciaNombre",
      },
      {
        Header: "Distrito",
        accessor: "nombre",
      },

      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <BotonCRUD
            setListar={setListar}
            permisos={permisos}
            menu={"Mantenimiento/Distrito"}
            id={row.values.Id}
            ClickConsultar={() => AccionModal(row.values.Id, "Consultar")}
            ClickModificar={() => AccionModal(row.values.Id, "Modificar")}
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
      {visible ? (
        <>
          <div className={G.ContenedorPadre}>
            <h2 className={G.TituloH2}>Distritos</h2>

            {/* Filtro*/}
            <FiltroBasico
              textLabel={"Distrito"}
              placeHolder={"Distrito"}
              name={"nombre"}
              maxLength={"200"}
              value={filtro.nombre}
              onChange={HandleData}
              botonId={"buscar"}
              onClick={FiltroBoton}
            />
            {/* Filtro*/}

            {/* Boton */}
            {permisos[0] && (
              <BotonBasico
                botonText="Nuevo"
                botonClass={G.BotonAzul}
                botonIcon={faPlus}
                click={() => AccionModal()}
                contenedor=""
              />
            )}
            {/* Boton */}

            {/* Tabla */}
            <DivTabla>
              <Table
                id={"tablaDistrito"}
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

export default Distrito;
