import { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import FiltroBasico from "../../../Components/filtros/FiltroBasico";
import Table from "../../../components/tablas/Table";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import Modal from "./Modal";
import ModalConfiguracion from "./ModalConfiguracion";
import ModalClave from "./ModalClave";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import * as Global from "../../../Components/Global";
import { Checkbox } from "primereact/checkbox";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    width: 100px;
  }
  & th:nth-child(3) {
    width: 250px;
  }
  & th:nth-child(4) {
    width: 250px;
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
  const ObtenerUsuarios = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/UsuarioPermiso/ObtenerUsuarios`
    );
    setObjeto(result.data.data);
    ObtenerUsuarios();
    console.log(result.data.data);
  };

  const ObtenerClaves = async () => {
    const result = await ApiMasy.put(`api/Mantenimiento/Usuario/CambiarClave`);
    setObjeto(result.data.data);
    ObtenerClaves();
    console.log(result.data.data);
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
    if (f != "") setIndex(1);
    const newTimer = setTimeout(() => {
      if (f == "") {
        Listar("", index);
      } else {
        Listar(`&nick=${f}`, index);
      }
    }, 200);
    setTimer(newTimer);
  };
  const FiltradoButton = () => {
    setIndex(1);
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
      let model = {
        id: "00",
        nick: "",
        observacion: "",
        isActivo: true,
        habilitarAfectarStock: true,
        personalId: "",
        clave: "",
        claveConfirmacion: "",
      };
      setObjeto(model);
    } else {
      await GetPorId(id);
    }
    setModal(true);
  };

  const AbrirModalConfigurar = async (modo = "Configurar") => {
    let a = document.querySelector("tr.selected-row").firstChild.innerHTML;
    setModo(modo);
    if (modo == "Configurar") {
      let model = {
        usuarioId: "",
        tipoUsuarioId: "",
        permisos: [
          {
            usuarioId: "",
            menuId: "",
            registrar: true,
            modificar: true,
            eliminar: true,
            consultar: true,
            anular: true,
          },
        ],
      };
      setObjeto(model);
    } else {
      await GetPorId(a);
    }
    setShowModalConfiguracion(true);
  };

  const AbrirModalClave = async (modo = "Clave") => {
    let a = document.querySelector("tr.selected-row").firstChild.innerHTML;
    setModo(modo);
    if (modo == "Clave") {
      let model = {
        claveAnterior: "",
        claveNueva: "",
        claveNuevaConfirmacion: "",
      };
      setObjeto(model);
    } else {
      await GetPorId(a);
      ObtenerClaves(a);
    }
    setShowModalClave(true);
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
        return moment(value).format("DD/MM/YYYY");
      },
    },
    {
      Header: "Fecha Modificacion",
      accessor: "fechaModificacion",
      Cell: ({ value }) => {
        return moment(value).format("DD/MM/YYYY");
      },
    },

    {
      Header: "Activo",
      accessor: "isActivo",
      Cell: ({ value }) => {
        return value ? (
          <Checkbox checked={true} />
        ) : (
          <Checkbox checked={false} />
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
              botonIcon={faPlus}
              click={() => AbrirModalConfigurar()}
            />
          )}
          {permisos[0] && (
            <BotonBasico
              botonText="Cambiar Contraseña"
              botonClass={Global.BotonCambiarContraseña}
              botonIcon={faPlus}
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
