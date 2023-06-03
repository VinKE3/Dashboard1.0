import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/funciones/GetPermisos";
import Delete from "../../../components/funciones/Delete";
import FiltroBasico from "../../../components/filtro/FiltroBasico";
import BotonBasico from "../../../components/boton/BotonBasico";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import Table from "../../../components/tabla/Table";
import Modal from "./Modal";
import ModalConfiguracion from "./ModalConfiguracion";
import ModalClave from "./ModalClave";
import { Checkbox } from "primereact/checkbox";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import styled from "styled-components";
import { faPlus, faKey, faGear } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import * as G from "../../../components/Global";

//#region Estilos
const DivTabla = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(3) {
    width: 120px;
  }
  & th:nth-child(4) {
    text-align: center;
  }
  & th:nth-child(5) {
    text-align: center;
  }
  & th:nth-child(6) {
    width: 40px;
    text-align: center;
  }
  & th:last-child {
    text-align: center;
    width: 100px;
    max-width: 100px;
  }
`;
//#endregion

import React from "react";

const Usuario = () => {
  //#region useState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    nickFiltro: "",
  });
  const [cadena, setCadena] = useState(`&nick=${filtro.nick}`);

  //Modal
  const [modal, setModal] = useState(false);
  const [modalConfig, setModalConfig] = useState(false);
  const [modalClave, setModalClave] = useState(false);
  const [modo, setModo] = useState("Nuevo");
  const [objeto, setObjeto] = useState([]);
  const [eliminar, setEliminar] = useState(false);
  //Modal
  //#endregion

  //#region useEffect
  useEffect(() => {
    setCadena(`&nick=${filtro.nickFiltro}`);
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
    if (visible) {
      if (!modalConfig) {
        Listar(cadena, index);
      }
    }
  }, [modalConfig]);
  useEffect(() => {
    if (visible) {
      if (!modalClave) {
        Listar(cadena, index);
      }
    }
  }, [modalClave]);
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
    GetPermisos("Usuario", setPermisos);
  }, []);
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Usuario/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/Usuario/${id}`);
    setObjeto(result.data.data);
  };
  const GetConfigId = async (id) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/UsuarioPermiso/Listar?usuarioId=${id}`
    );
    setObjeto(result.data.data);
  };
  const GetClaveId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/Usuario/${id}`);
    setObjeto({
      claveAnterior: result.data.data.clave,
      claveNueva: "",
      claveNuevaConfirmacion: "",
    });
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
  const FiltroBoton = async () => {
    setFiltro({
      nickFiltro: "",
    });
    setIndex(0);
    document.getElementById("nickFiltro").focus();
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
          id: "",
          nick: "",
          observacion: "",
          isActivo: true,
          habilitarAfectarStock: true,
          personalId: "",
          clave: "",
          claveConfirmacion: "",
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
        .querySelector("#tablaUsuario")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Modificar");
      }
    }
    if (e.key === "Delete") {
      let row = document
        .querySelector("#tablaUsuario")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        Delete(["Mantenimiento", "Usuario"], id, setEliminar);
      }
    }
    if (e.key === "c") {
      let row = document
        .querySelector("#tablaUsuario")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Consultar");
      }
    }
  };
  const AbrirModalConfigurar = async (modo = "Modificar") => {
    let tabla = document
      .querySelector("table > tbody")
      .querySelector("tr.selected-row");
    if (tabla != null) {
      if (tabla.classList.contains("selected-row")) {
        setModo(modo);
        await GetConfigId(
          document.querySelector("tr.selected-row").firstChild.innerHTML
        );
        setModalConfig(true);
      }
    } else {
      toast.info("Seleccione una Fila", {
        position: "bottom-right",
        autoClose: 300,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };
  const AbrirModalClave = async (modo = "Modificar") => {
    let tabla = document
      .querySelector("table > tbody")
      .querySelector("tr.selected-row");
    if (tabla != null) {
      if (tabla.classList.contains("selected-row")) {
        setModo(modo);
        await GetClaveId(
          document.querySelector("tr.selected-row").firstChild.innerHTML
        );
        setModalClave(true);
      }
    } else {
      toast.info("Seleccione una Fila", {
        position: "bottom-right",
        autoClose: 300,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };
  //#endregion

  //#region Columnas
  const columnas = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Nick",
        accessor: "nick",
      },
      {
        Header: "Tipo Usuario",
        accessor: "tipoUsuarioDescripcion",
      },
      {
        Header: "Fecha Inicio",
        accessor: "fechaInicio",
        Cell: ({ value }) => {
          return value == null ? (
            <p className="flex justify-center">--/--/--</p>
          ) : (
            <p className="flex justify-center">
              {moment(value).format("DD/MM/YY")}
            </p>
          );
        },
      },
      {
        Header: "F. Modificacion",
        accessor: "fechaModificacion",
        Cell: ({ value }) => {
          return value == null ? (
            <p className="flex justify-center">--/--/--</p>
          ) : (
            <p className="flex justify-center">
              {moment(value).format("DD/MM/YY")}
            </p>
          );
        },
      },

      {
        Header: "Activo",
        accessor: "isActivo",
        Cell: ({ value }) => {
          return value ? (
            <div className="flex justify-center">
              <Checkbox checked={true} />
            </div>
          ) : (
            <div className="flex justify-center">
              <Checkbox checked={false} />
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
            menu={["Mantenimiento", "Usuario"]}
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
      {visible ? (
        <>
           <div className={G.ContenedorPadre}>
            <h2 className={G.TituloH2}>Usuario</h2>

            {/* Filtro*/}
            <FiltroBasico
              textLabel={"Nick"}
              maxLength={"200"}
              name={"nickFiltro"}
              placeHolder={"Buscar por Nick"}
              value={filtro.nickFiltro}
              onChange={ValidarData}
              botonId={"buscar"}
              onClick={FiltroBoton}
            />
            {/* Filtro*/}

            {/* Boton */}
            <div className={G.ContenedorBotones}>
              {permisos[0] && (
                <BotonBasico
                  botonText="Nuevo"
                  botonClass={G.BotonRegistrar}
                  botonIcon={faPlus}
                  click={() => AccionModal()}
                  contenedor=""
                />
              )}
              {permisos[0] && (
                <BotonBasico
                  botonText="Configuracion"
                  botonClass={G.BotonConfigurar}
                  botonIcon={faGear}
                  click={() => AbrirModalConfigurar()}
                  contenedor=""
                />
              )}
              {permisos[0] && (
                <BotonBasico
                  botonText="Cambiar Contraseña"
                  botonClass={G.BotonAgregar}
                  botonIcon={faKey}
                  click={() => AbrirModalClave()}
                  contenedor=""
                />
              )}
            </div>
            {/* Boton */}

            {/* Tabla */}
            <DivTabla>
              <Table
                id={"tablaUsuario"}
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
          {modalConfig && (
            <ModalConfiguracion
              setModal={setModalConfig}
              modo={modo}
              objeto={objeto}
            />
          )}
          {modalClave && (
            <ModalClave setModal={setModalClave} modo={modo} objeto={objeto} />
          )}

          <ToastContainer />
        </>
      ) : (
        <span></span>
      )}
    </>
  );
  //#endregion
};

export default Usuario;
