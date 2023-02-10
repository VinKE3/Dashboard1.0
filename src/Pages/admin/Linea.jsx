import React from "react";
import Usuario from "../../Components/Usuario.json";
import BarraBotonesCRUD from "../../Components/BarraBotonesCRUD";
import Table from "../../Components/Table";
import { format } from "date-fns";

import Icon from "../../components/Icon";
import {
  faPenToSquare,
  faTrash,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";

const Linea = () => {
  //Configuración de columnas
  const columnas = [
    {
      Header: "Id",
      accessor: "id",
      Cell: ({ value }) => <strong>{value}</strong>,
      // disableFilters: true
    },
    {
      Header: "Nombres",
      accessor: "first_name",
      disableFilters: true,
    },
    {
      Header: "Email",
      accessor: "email",
      disableFilters: true,
    },
    {
      Header: "Género",
      accessor: "gender",
      Cell: ({ value }) => <strong className="text-green-700">{value}</strong>,
      disableFilters: true,
    },
    {
      Header: "Fecha",
      accessor: "fecha",
      Cell: ({ value }) => {
        return format(new Date(value), "dd/MM/yyyy");
      },
      disableFilters: true,
    },
    {
      Header: "Acciones",
      accessor: "editar",
      Cell: ({ row }) => (
        <div>
          <button
            onClick={() => console.log("Modificar: " + row.values.id)}
            className="btn p-0 px-1 bg-green-700 text-white"
          >
            <Icon css={"w-30"} icon={faPenToSquare} />
          </button>

          <button
            onClick={() => console.log("Eliminar: " + row.values.id)}
            className="btn p-0 px-1 bg-red-600 text-white"
          >
            <Icon css={"w-30"} icon={faTrash} />
          </button>
        </div>
      ),
      disableFilters: true,
    },
  ];

  const propsFiltro = {
    textLabel: "Descripción",
    inputPlaceHolder: "Descripción",
    inputId: "descripcion",
    inputName: "descripcion",
    inputMax: "60",
    botonId: "buscar-lineas",
  };

  return (
    <div>
      <h2>Linea</h2>

      {/* Barra de Botones */}
      <BarraBotonesCRUD />
      {/* Tabla */}
      <Table columnas={columnas} datos={Usuario} propsFiltro={propsFiltro} />
    </div>
  );
};

export default Linea;
