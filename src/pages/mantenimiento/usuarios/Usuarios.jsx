import { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import FiltroBasico from "../../../components/filtros/FiltroBasico";
import Table from "../../../components/tablas/Table";
import { faPlus, faKey, faGear } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import Modal from "./Modal";
import ModalConfiguracion from "./ModalConfiguracion";
import ModalClave from "./ModalClave";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import { Checkbox } from "primereact/checkbox";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";

//#region Estilos
const TablaStyle = styled.div`
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
    width: 70px;
    text-align: center;
  }
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;
//#endregion

import React from "react";

const Usuarios = () => {
  //#region useState
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [permisos, setPermisos] = useState([true, true, true, true]);
  const [objeto, setObjeto] = useState([]);
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Registrar");
  const [respuestaModal, setRespuestaModal] = useState(false);
  const [respuestaAlert, setRespuestaAlert] = useState(false);
  const [showModalConfiguracion, setShowModalConfiguracion] = useState(false);
  const [showModalClave, setShowModalClave] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    filtro;
  }, [filtro]);

  useEffect(() => {
    total;
  }, [total]);
  useEffect(() => {
    index;
  }, [index]);

  useEffect(() => {
    modo;
  }, [modo]);

  useEffect(() => {
    if (!modal) {
      Listar(filtro, index);
    }
  }, [modal]);

  useEffect(() => {
    if (!showModalConfiguracion) {
      Listar(filtro, index);
    }
  }, [showModalConfiguracion]);

  useEffect(() => {
    if (!showModalClave) {
      Listar(filtro, index);
    }
  }, [showModalClave]);

  useEffect(() => {
    if (respuestaAlert) {
      Listar(filtro, index);
    }
  }, [respuestaAlert]);
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
    let model = {
      claveAnterior: result.data.data.clave,
      claveNueva: "",
      claveNuevaConfirmacion: "",
    };
    setObjeto(model);
  };
  //#endregion

  //#region Funciones Filtrado
  const FiltradoPaginado = (e) => {
    let filtro = document.getElementById("nick").value;
    let boton = e.selected + 1;
    setIndex(e.selected + 1);
    if (filtro == "") {
      Listar("", boton);
    } else {
      Listar(`&nick=${filtro}`, boton);
    }
  };
  const FiltradoKeyPress = async (e) => {
    clearTimeout(timer);
    let f = e.target.value;
    setFiltro(`&nick=${f}`);
    if (f != "") setIndex(0);
    const newTimer = setTimeout(() => {
      if (f == "") {
        Listar("", index + 1);
      } else {
        Listar(`&nick=${f}`, index + 1);
      }
    }, 200);
    setTimer(newTimer);
  };
  const FiltradoButton = () => {
    setIndex(0);
    if (filtro == "") {
      Listar("", 1);
    } else {
      Listar(filtro, 1);
    }
  };
  //#endregion

  //#region Funciones Modal
  const AbrirModal = async (id, modo = "Registrar") => {
    setModo(modo);
    if (modo == "Registrar") {
      setObjeto({
        id: "00",
        nick: "",
        observacion: "",
        isActivo: true,
        habilitarAfectarStock: true,
        personalId: "",
        clave: "",
        claveConfirmacion: "",
      });
    } else {
      await GetPorId(id);
    }
    setModal(true);
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
        setShowModalConfiguracion(true);
      }
    } else {
      toast.info("Seleccione una Fila", {
        position: "bottom-right",
        autoClose: 4000,
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
        setShowModalClave(true);
      }
    } else {
      toast.info("Seleccione una Fila", {
        position: "bottom-right",
        autoClose: 4000,
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
  const columnas = [
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
          <p className="flex justify-center">--/--/----</p>
        ) : (
          <p className="flex justify-center">
            {moment(value).format("DD/MM/YYYY")}
          </p>
        );
      },
    },
    {
      Header: "Fecha Modificacion",
      accessor: "fechaModificacion",
      Cell: ({ value }) => {
        return value == null ? (
          <p className="flex justify-center">--/--/----</p>
        ) : (
          <p className="flex justify-center">
            {moment(value).format("DD/MM/YYYY")}
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
          setRespuestaAlert={setRespuestaAlert}
          permisos={permisos}
          menu={["Mantenimiento", "Usuario"]}
          id={row.values.id}
          ClickConsultar={() => AbrirModal(row.values.id, "Consultar")}
          ClickModificar={() => AbrirModal(row.values.id, "Modificar")}
        />
      ),
    },
  ];
  //#endregion

  //#region Render
  return (
    <>
      <div className="px-2">
        <h2 className={Global.TituloH2}>Usuarios</h2>

        {/* Filtro*/}
        <FiltroBasico
          textLabel={"Nick"}
          inputPlaceHolder={"Nick"}
          inputId={"nick2"}
          inputName={"nick"}
          inputMax={"200"}
          botonId={"buscar"}
          FiltradoButton={FiltradoButton}
          FiltradoKeyPress={FiltradoKeyPress}
        />
        {/* Filtro*/}

        {/* Boton */}
        <div className="flex gap-1">
          {permisos[0] && (
            <BotonBasico
              botonText="Registrar"
              botonClass={Global.BotonRegistrar}
              botonIcon={faPlus}
              click={() => AbrirModal()}
            />
          )}
          {permisos[0] && (
            <BotonBasico
              botonText="Configuracion"
              botonClass={Global.BotonConfigurar}
              botonIcon={faGear}
              click={() => AbrirModalConfigurar()}
            />
          )}
          {permisos[0] && (
            <BotonBasico
              botonText="Cambiar Contraseña"
              botonClass={Global.BotonAgregar}
              botonIcon={faKey}
              click={() => AbrirModalClave()}
            />
          )}
        </div>
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

      {modal && (
        <Modal
          setModal={setModal}
          modo={modo}
          setRespuestaModal={setRespuestaModal}
          objeto={objeto}
        />
      )}
      {showModalConfiguracion && (
        <ModalConfiguracion
          setModal={setShowModalConfiguracion}
          modo={modo}
          setRespuestaModal={setRespuestaModal}
          objeto={objeto}
        />
      )}
      {showModalClave && (
        <ModalClave
          setModal={setShowModalClave}
          modo={modo}
          setRespuestaModal={setRespuestaModal}
          objeto={objeto}
        />
      )}
      <ToastContainer />
    </>
  );
  //#endregion
};

export default Usuarios;
