import { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import Table from "../../../components/tablas/Table";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import FiltroBasico from "../../../components/filtros/FiltroBasico";
import ModalLineas from "./ModalLineas";

//?Estilos
const TablaStyle = styled.div`
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;

const Lineas = () => {
  const [showModallineas, setShowModallineas] = useState(false);
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [botones, setBotones] = useState([true, true, true]);
  const [timer, setTimer] = useState(null);

  const Listar = async (filtroApi = "") => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Linea/Listar?Cantidad=1000${filtroApi}`
    );
    return result;
  };

  useEffect(() => {
    Listar().then((result) => {
      setDatos(result.data.data.data);
      setTotal(result.data.data.total);
    });
  }, []);

  const FiltradoKeyPress = (e) => {
    let filtro = e.target.value;
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      if (filtro == "") {
        console.log(filtro);
        Listar();
      } else {
        Listar(`&descripcion=${filtro}`);
      }
    }, 500);
    setTimer(newTimer);
  };

  const FiltradoButton = () => {
    let filtro = document.getElementById("descripcion").value;
    console.log(filtro);
    if (filtro == "") {
      Listar();
    } else {
      Listar(`&descripcion=${filtro}`);
    }
  };

  // //*Función para abrir el modal Boton Registrar
  const AbrirModalRegistrar = () => {
    setShowModallineas(!showModallineas);
    console.log(showModallineas);
  };

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
      Cell: ({ row }) => <BotonCRUD id={row.values.id} mostrar={botones} />, //&Aquí va el nombre de la propiedad Id
    },
  ];

  return (
    <>
      {showModallineas && (
        <ModalLineas
          show={showModallineas}
          close={() => setShowModallineas(false)}
        />
      )}
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
          click={AbrirModalRegistrar}
        />
        {/* Boton */}

        {/* Tabla */}
        <TablaStyle>
          <Table columnas={columnas} datos={datos} total={total} />
        </TablaStyle>
        {/* Tabla */}
      </div>
    </>
  );
};

export default Lineas;
