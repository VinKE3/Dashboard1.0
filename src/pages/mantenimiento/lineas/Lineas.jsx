import { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import FiltroBasico from "../../../components/filtros/FiltroBasico";
import Table from "../../../components/tablas/Table";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import Modal from "./Modal";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../../../context/ContextAuth";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";
import store from "store2";
import GetUsuarioId from "../../../components/CRUD/GetUsuarioId";

//#region Estilos
const TablaStyle = styled.div`
  & th:nth-child(2) {
    width: 75px;
  }
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;
//#endregion

const Lineas = () => {
  //#region useState
  const { usuarioId } = useAuth();
  const [visible, setVisible] = useState(false);
  const [datos, setDatos] = useState([]);
  const [objeto, setObjeto] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Registrar");
  const [respuestaAlert, setRespuestaAlert] = useState(false);

  //#endregion

  //#region useEffect
  useEffect(() => {
    if (!modal) {
      Listar(filtro, index + 1);
    }
  }, [modal]);
  useEffect(() => {
    if (respuestaAlert) {
      Listar(filtro, index + 1);
    }
  }, [respuestaAlert]);

  useEffect(() => {
    if (store.session.get("usuario") == "AD") {
      setVisible(true);
      setPermisos([true, true, true, true, true]);
      Listar(filtro, 1);
    } else {
      //?Consulta a la Api para traer los permisos
      GetPermisos();
      console.log(!permisos[0]);
      if (!permisos[0]) {
        console.log("object");
        setVisible(false);
      } else {
        Listar(filtro, 1);
      }
    }
  }, []);
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Linea/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/Linea/${id}`);
    setObjeto(result.data.data);
  };
  const GetPermisos = async () => {
    const permiso = await GetUsuarioId(usuarioId, "Linea");
    setPermisos([
      permiso.registrar,
      permiso.modificar,
      permiso.eliminar,
      permiso.consultar,
      permiso.anular,
    ]);
  };
  //#endregion

  //#region Funciones Filtrado
  const FiltradoPaginado = (e) => {
    let filtro = document.getElementById("descripcion").value;
    let boton = e.selected + 1;
    setIndex(e.selected);
    if (filtro == "") {
      Listar("", boton);
    } else {
      Listar(`&descripcion=${filtro}`, boton);
    }
  };
  const FiltradoKeyPress = async (e) => {
    clearTimeout(timer);
    let f = e.target.value;
    setFiltro(`&descripcion=${f}`);
    if (f != "") setIndex(0);
    const newTimer = setTimeout(() => {
      if (f == "") {
        Listar("", index + 1);
      } else {
        Listar(`&descripcion=${f}`, index + 1);
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
      let model = {
        id: "00",
        descripcion: "",
      };
      setObjeto(model);
    } else {
      await GetPorId(id);
    }
    setModal(true);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "Descripción",
      accessor: "descripcion",
    },
    {
      Header: "Código",
      accessor: "id",
      Cell: ({ value }) => <span className="w-2/12">{value}</span>,
    },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <BotonCRUD
          setRespuestaAlert={setRespuestaAlert}
          permisos={permisos}
          menu={["Mantenimiento", "Linea"]}
          id={row.values.id}
          ClickConsultar={() => AbrirModal(row.values.id, "Consultar")}
          ClickModificar={() => AbrirModal(row.values.id, "Modificar")}
        /> //?Se envia el id de la fila
      ),
    },
  ];
  //#endregion

  //#region Render
  return (
    <>
      (visible ?
      <>
        <div className="px-2">
          <h2 className={Global.TituloH2}>Líneas</h2>

          {/* Filtro*/}
          <FiltroBasico
            textLabel={"Descripción"}
            inputPlaceHolder={"Descripción"}
            inputId={"descripcion"}
            inputName={"descripcion"}
            inputMax={"200"}
            botonId={"buscar"}
            FiltradoButton={FiltradoButton}
            FiltradoKeyPress={FiltradoKeyPress}
          />
          {/* Filtro*/}

          {/* Boton */}
          {permisos[0] && (
            <BotonBasico
              botonText="Registrar"
              botonClass={Global.BotonRegistrar}
              botonIcon={faPlus}
              click={() => AbrirModal()}
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
      :
      <div>
        <span>{"NO TIENES ACCESO"}</span>
      </div>
      )
    </>
  );
  //#endregion
};

export default Lineas;
