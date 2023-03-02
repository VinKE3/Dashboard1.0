import { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import Table from "../../../components/tablas/Table";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import FiltroBasico from "../../../components/filtros/FiltroBasico";
import ModalLineas from "./ModalLineas";

//#region Estilos
//?Estilos
const TablaStyle = styled.div`
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;
//#endregion

const Lineas = () => {
  //#region UseState
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

  //#region UseEffect
  useEffect(() => {
    Listar();
  }, []);

  useEffect(() => {
    modo;
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

  //#endregion

  //#region Funciones API
  const Listar = async (filtroApi = "") => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Linea/Listar?Cantidad=1000${filtroApi}`
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
  const FiltradoKeyPress = (e) => {
    let filtro = e.target.value;
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (filtro == "") {
        Listar();
      } else {
        Listar(`&descripcion=${filtro}`);
      }
    }, 500);
    setTimer(newTimer);
  };

  const FiltradoButton = () => {
    let filtro = document.getElementById("descripcion").value;
    if (filtro == "") {
      Listar();
    } else {
      Listar(`&descripcion=${filtro}`);
    }
  };
  //#endregion

  //#region Funciones Modal
  const AbrirModal = async (id, modo = "Registrar") => {
    setModo(modo);
    if (modo == "Registrar") {
      let linea = {
        id: "00",
        descripcion: "",
      };
      setObjeto(linea);
    } else {
      await GetPorId(id);
    }
    setModal(true);
  };
  //#endregion

  //*Configuración de columnas
  const columnas = [
    {
      Header: "Codigo",
      accessor: "id",
    },
    {
      Header: "Descripcion",
      accessor: "descripcion",
    },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <BotonCRUD
          id={row.values.id}
          mostrar={botones}
          Click1={() => AbrirModal(row.values.id, "Consultar")}
          Click2={() => AbrirModal(row.values.id, "Modificar")}
          menu={"Linea"}
          setRespuestaAlert={setRespuestaAlert}
        />
      ), //&Aquí va el nombre de la propiedad Id
    },
  ];

  return (
    <>
      <div className="px-2">
        <h2 className="mb-4 py-2 text-lg">Líneas</h2>

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
        <ModalLineas
          setModal={setModal}
          modo={modo}
          setRespuestaModal={setRespuestaModal}
          objeto={objeto}
        />
      )}
    </>
  );
};

export default Lineas;
