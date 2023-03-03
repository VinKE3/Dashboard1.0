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
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;
//#endregion

const SubLineas = () => {
  //#region useState
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [timer, setTimer] = useState(null);
  const [botones, setBotones] = useState([true, true, true]);
  const [objeto, setObjeto] = useState([]);
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Registrar");
  const [respuestaModal, setRespuestaModal] = useState(false);
  const [respuestaAlert, setRespuestaAlert] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    modo && console.log(modo);
  }, [modo]);
  useEffect(() => {
    if (!modal) {
      Listar();
    }
  }, [modal]);
  useEffect(() => {
    if (respuestaAlert) {
      Listar();
    }
  }, [respuestaAlert]);
  useEffect(() => {
    total && console.log(total);
  }, [total]);
  //#endregion

  //#region Funciones API
  const Listar = async (filtroApi = "") => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/SubLinea/Listar${filtroApi}`
    );
    let subLinea = result.data.data.data.map((resultado) => ({
      Id: resultado.lineaId + resultado.subLineaId,
      descripcion: resultado.descripcion,
      subLineaDescripcion: resultado.subLineaDescripcion,
    }));
    setDatos(subLinea);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/SubLinea/${id}`);
    setObjeto(result.data.data);
  };
  //#endregion

  //#region Funciones Filtrado
  const FiltradoKeyPress = (e) => {
    let filtro = e.target.value;
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (filtro == "") {
        Listar();
      } else {
        Listar(`?descripcion=${filtro}`);
      }
    }, 1000);
    setTimer(newTimer);
  };
  const FiltradoButton = () => {
    let filtro = document.getElementById("descripcion").value;
    if (filtro == "") {
      Listar();
    } else {
      Listar(`?descripcion=${filtro}`);
    }
  };
  //#endregion

  //#region Funciones Modal
  const AbrirModal = async (id, modo = "Registrar") => {
    setModo(modo);
    if (modo == "Registrar") {
      let subLinea = {
        lineaId: "00",
        subLineaId: "00",
        descripcion: "",
      };
      setObjeto(subLinea);
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
      Header: "Línea",
      accessor: "subLineaDescripcion",
    },
    {
      Header: "Código",
      accessor: "Id",
    },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <BotonCRUD
          id={row.values.Id}
          mostrar={botones}
          Click1={() => AbrirModal(row.values.Id, "Consultar")}
          Click2={() => AbrirModal(row.values.Id, "Modificar")}
          menu={"SubLinea"}
          setRespuestaAlert={setRespuestaAlert}
        />
      ),
    },
  ];
  //#endregion

  //#region Render
  return (
    <>
      <div className="px-2">
        <h2 className="mb-4 py-2 text-xl font-bold">SubLineas</h2>

        {/* Filtro*/}
        <FiltroBasico
          textLabel={"Descripción"}
          inputPlaceHolder={"Descripción"}
          inputId={"descripcion"}
          inputName={"descripcion"}
          inputMax={"200"}
          botonId={"buscar-lineas"}
          FiltradoButton={FiltradoButton}
          FiltradoKeyPress={FiltradoKeyPress}
        />
        {/* Filtro*/}

        {/* Boton */}
        <BotonBasico
          botonText="Registrar"
          botonClass="boton-crud-registrar"
          botonIcon={faPlus}
          click={() => AbrirModal()}
        />
        {/* Boton */}

        {/* Tabla */}
        <TablaStyle>
          <Table columnas={columnas} datos={datos} total={total} />
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

export default SubLineas;
