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
  const [lineas, setLineas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const getLista = async () => {
    const lista = await ApiMasy.get(`api/Mantenimiento/Linea/Listar`);
    setLineas(lista.data.data.data);
  };

  useEffect(() => {
    getLista();
  }, []);

  //*Función para Filtrado de Tabla local sin consultar a la API
  const Mostrar = (e) => {
    setFiltro(e.target.value);
  };
  let resultados = [];
  if (!filtro) {
    resultados = lineas;
  } else {
    resultados = lineas.filter((dato) =>
      dato.descripcion.toLowerCase().includes(filtro.toLowerCase())
    ); //& .title hace referencia a la propiedad en base a la cuál se va a filtrar
  }

  // //*Función para Boton Registrar
  const AbrirModal = () => {
    setShowModallineas(!showModallineas);
    console.log(showModallineas);
  };

  //*Configuración de columnas
  const columnas = [
    {
      Header: "Codigo",
      accessor: "id",
      disableFilters: true,
    },
    {
      Header: "Descripcion",
      accessor: "descripcion",
      disableFilters: true,
    },
    {
      Header: "Acciones",
      Cell: ({ row }) => <BotonCRUD row={row.values.id} />, //&Aquí va el nombre de la propiedad Id
      disableFilters: true,
    },
  ];

  //* Props para filtro básico
  const propsFiltro = {
    textLabel: "Descripción",
    inputPlaceHolder: "Descripción",
    inputId: "descripcion",
    inputName: "descripcion",
    inputMax: "200",
    botonId: "buscar-sub-lineas",
  };

  return (
    <>
      {showModallineas && <ModalLineas setShowModallineas={true} />}
      <div className="px-2">
        <h2 className="mb-4 py-2 text-lg">Líneas</h2>

        {/* Filtro*/}
        <FiltroBasico
          textLabel={propsFiltro.textLabel}
          inputPlaceHolder={propsFiltro.inputPlaceHolder}
          inputId={propsFiltro.inputId}
          inputName={propsFiltro.inputName}
          inputMax={propsFiltro.inputMax}
          botonId={propsFiltro.botonId}
          // botonClick={Buscar}
          filter={filtro}
          setFilter={Mostrar}
        />
        {/* Filtro*/}

        {/* Boton */}
        <BotonBasico
          botonText="Registrar"
          botonClass="boton-crud-registrar"
          botonIcon={faPlus}
          click={AbrirModal}
        />
        {/* Boton */}

        {/* Tabla */}
        <TablaStyle>
          <Table columnas={columnas} datos={resultados} />
        </TablaStyle>
        {/* Tabla */}
      </div>
    </>
  );
};

export default Lineas;
