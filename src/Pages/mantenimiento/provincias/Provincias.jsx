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
  const [index, setIndex] = useState(1);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [botones, setBotones] = useState([true, true, true]);
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
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Provincia/Listar?pagina=${pagina}${filtro}`
    );
    let provincia = result.data.data.data.map((resultado) => ({
      Id: resultado.departamentoId + resultado.provinciaId,
      nombre: resultado.nombre,
      departamentoNombre: resultado.departamentoNombre,
    }));
    setDatos(provincia);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/Provincia/${id}`);
    setObjeto(result.data.data);
  };
  //#endregion

  //#region Funciones Filtrado
  const FiltradoPaginado = (e) => {
    let filtro = document.getElementById("nombre").value;
    let boton = e.selected + 1;
    setIndex(e.selected + 1);
    if (filtro == "") {
      Listar("", boton);
    } else {
      Listar(`&nombre=${filtro}`, boton);
    }
  };
  const FiltradoKeyPress = async (e) => {
    clearTimeout(timer);
    let f = e.target.value;
    setFiltro(`&nombre=${f}`);
    if (f != "") setIndex(1);
    const newTimer = setTimeout(() => {
      if (f == "") {
        Listar("", index);
      } else {
        Listar(`&nombre=${f}`, index);
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
      let provincia = {
        departamentoId: "01",
        provinciaId: "00",
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
          textLabel={"Provincia"}
          inputPlaceHolder={"Provincia"}
          inputId={"nombre"}
          inputName={"nombre"}
          inputMax={"200"}
          botonId={"buscar"}
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

export default Provincias;
