import { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import FiltroBasico from "../../../Components/filtros/FiltroBasico";
import Table from "../../../components/tablas/Table";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import Modal from "./Modal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;
//#endregion

const Conductor = () => {
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
    if (respuestaAlert) {
      Listar(filtro, index);
    }
  }, [respuestaAlert]);

  // useEffect(() => {
  //   if (usuario == "AD") {
  //     Listar(filtro, index);
  //   } else {
  //     setPermisos([true, true, true, true]);
  //   }
  // }, [usuario]);
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Conductor/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/Conductor/${id}`);
    setObjeto(result.data.data);
  };
  //#endregion

  //#region Funciones Filtrado
  const FiltradoPaginado = (e) => {
    let filtro = document.getElementById("descripcion").value;
    let boton = e.selected + 1;
    setIndex(e.selected + 1);
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
    if (f != "") setIndex(1);
    const newTimer = setTimeout(() => {
      if (f == "") {
        Listar("", index);
      } else {
        Listar(`&descripcion=${f}`, index);
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
      let conductor = {
        id: "00",
        nombre: "",
        numeroDocumentoIdentidad: "",
        licenciaConducir: "",
        empresaTransporteNombre: "",
      };
      setObjeto(conductor);
    } else {
      await GetPorId(id);
    }
    setModal(true);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Nombre",
      accessor: "nombre",
    },
    {
      Header: "DNI",
      accessor: "numeroDocumentoIdentidad",
    },
    {
      Header: "Licensia de Conducir",
      accessor: "licenciaConducir",
    },
    {
      Header: "Empresa de Transporte",
      accessor: "empresaTransporteNombre",
    },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <BotonCRUD
          setRespuestaAlert={setRespuestaAlert}
          permisos={permisos}
          menu={["Mantenimiento", "Conductor"]}
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
        <h2 className="mb-4 py-2 text-xl font-bold">Conductor</h2>

        {/* Filtro*/}
        <FiltroBasico
          textLabel={"Nombre"}
          inputPlaceHolder={"Nombre"}
          inputId={"nombre"}
          inputName={"nombre"}
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
            botonClass="boton-crud-registrar"
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

      {modal && (
        <Modal
          setModal={setModal}
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

export default Conductor;