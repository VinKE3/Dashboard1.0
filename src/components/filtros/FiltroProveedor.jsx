import React, { useState, useEffect } from "react";
import ApiMasy from "../../api/ApiMasy";
import ModalBasic from "../ModalBasic";
import TableBasic from "../tablas/TableBasic";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import * as Global from "../Global";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:last-child {
    width: 40px;
    text-align: center;
  }
`;
//#endregion

const FiltroProveedor = ({ setModal, setObjeto }) => {
  //#region useState
  const [datos, setDatos] = useState([]);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState("");
  //#endregion

  //#region useEffect;
  useEffect(() => {
    Listar("", 1);
  }, []);
  //#endregion

  //#region Funciones Filtrado
  const FiltradoDocumento = async (e) => {
    let nombre = document.getElementById("nombre");
    let documento = e.target.value;
    clearTimeout(timer);
    setFiltro(`&numeroDocumentoIdentidad=${documento}&nombre=${nombre}`, 1);
    const newTimer = setTimeout(() => {
      if (documento == "" && nombre == "") {
        Listar("", 1);
      } else {
        Listar(`&numeroDocumentoIdentidad=${documento}&nombre=${nombre}`, 1);
      }
    }, 200);
    setTimer(newTimer);
  };
  const FiltradoNombre = async (e) => {
    let documento = document.getElementById("documento").value;
    let nombre = e.target.value;
    clearTimeout(timer);
    setFiltro(`&numeroDocumentoIdentidad=${documento}&nombre=${nombre}`, 1);
    const newTimer = setTimeout(() => {
      if (documento == "" && nombre == "") {
        Listar("", 1);
      } else {
        Listar(`&numeroDocumentoIdentidad=${documento}&nombre=${nombre}`, 1);
      }
    }, 200);
    setTimer(newTimer);
  };
  const FiltradoButton = () => {
    if (filtro == "") {
      Listar("", 1);
    } else {
      Listar(filtro, 1);
    }
  };
  //#endregion

  //#region API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Proveedor/Listar?pagina=${pagina}${filtro}`
    );
    let model = result.data.data.data;
    model.shift();
    console.log(model);
    setDatos(model);
  };
  const GetPorId = async (id, e) => {
    e.preventDefault();
    const result = await ApiMasy.get(`api/Mantenimiento/Proveedor/${id}`);
    setObjeto({
      proveedorId: result.data.data.id,
      proveedorNumeroDocumentoIdentidad:
        result.data.data.numeroDocumentoIdentidad,
      proveedorDireccion: result.data.data.direccionPrincipal,
      proveedorNombre: result.data.data.nombre,
    });
    setModal(false);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Número Doc",
      accessor: "numeroDocumentoIdentidad",
    },
    {
      Header: "Nombre",
      accessor: "nombre",
    },
    {
      Header: "-",
      Cell: ({ row }) => (
        <button onClick={(e) => GetPorId(row.values.id, e)}>
          <FaSearch></FaSearch>
        </button>
      ),
    },
  ];
  //#endregion

  //#region Render
  return (
    <>
      <ModalBasic
        setModal={setModal}
        objeto={[]}
        modo={""}
        menu={["", ""]}
        titulo="Consultar Proveedores"
        tamañoModal={[Global.ModalMediano, Global.Form]}
        childrenFooter={
          <div className={""}>
            <span>Hola</span>
          </div>
        }
      >
        {
          <div className={Global.ContenedorBasico}>
            <div className={Global.ContenedorInputs}>
              <div className={Global.ContenedorInputMitad}>
                <label htmlFor="documento" className={Global.LabelStyle}>
                  N° Documento
                </label>
                <input
                  type="text"
                  id="documento"
                  name="documento"
                  placeholder="N° Documento"
                  autoComplete="off"
                  onChange={FiltradoDocumento}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="nombre" className={Global.LabelStyle}>
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre"
                  autoComplete="off"
                  onChange={FiltradoNombre}
                  className={Global.InputBoton}
                />
                <button
                  id="consultar"
                  onClick={FiltradoButton}
                  className={Global.BotonBuscar}
                >
                  <FaSearch></FaSearch>
                </button>
              </div>
            </div>

            {/* Tabla */}
            <TablaStyle>
              <TableBasic columnas={columnas} datos={datos} />
            </TablaStyle>
            {/* Tabla */}
          </div>
        }
      </ModalBasic>
    </>
  );
  //#endregion
};

export default FiltroProveedor;
