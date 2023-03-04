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

const Provincias = () => {
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
      `api/Mantenimiento/Provincia/Listar${filtroApi}`
    );
    let provincia = result.data.data.data.map((resultado) => ({
      Id: resultado.departamentoId + resultado.provinciaId,
      nombre: resultado.nombre,
      departamentoNombre: resultado.departamentoNombre,
    }));
    setDatos(provincia);
    setTotal(result.data.data.total);
    console.log(result.data.data.data);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/Provincia/${id}`);
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
        Listar(`?nombre=${filtro}`);
      }
    }, 1000);
    setTimer(newTimer);
  };
  const FiltradoButton = () => {
    let filtro = document.getElementById("nombre").value;
    if (filtro == "") {
      Listar();
    } else {
      Listar(`?nombre=${filtro}`);
    }
  };
  //#endregion

  //#region Funciones Modal
  const AbrirModal = async (id, modo = "Registrar") => {
    setModo(modo);
    if (modo == "Registrar") {
      let provincia = {
        departamentoId: "00",
        provinciaId: "0000",
        nombre: "",
      };
      setObjeto(provincia);
    } else {
      await GetPorId(id);
    }
    setModal(true);
  };
  //#endregion

  //#region Columnas
  const columnas = [
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
      accessor: "nombre",
    },

    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <BotonCRUD
          id={row.values.Id}
          mostrar={botones}
          Click1={() => AbrirModal(row.values.Id, "Consultar")}
          Click2={() => AbrirModal(row.values.Id, "Modificar")}
          menu={"Provincia"}
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
        <h2 className="mb-4 py-2 text-xl font-bold">Provincias</h2>

        {/* Filtro*/}
        <FiltroBasico
          textLabel={"Nombre"}
          inputPlaceHolder={"Nombre"}
          inputId={"nombre"}
          inputName={"nombre"}
          inputMax={"200"}
          botonId={"buscar-provincias"}
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

export default Provincias;
