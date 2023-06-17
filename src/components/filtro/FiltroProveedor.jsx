import { useEffect, useMemo, useState } from "react";
import { FaCheck } from "react-icons/fa";
import styled from "styled-components";
import ApiMasy from "../../api/ApiMasy";
import * as G from "../Global";
import ModalBasic from "../modal/ModalBasic";
import TableBasic from "../tabla/TableBasic";

//#region Estilos
const DivTabla = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    width: 120px;
  }
  & th:last-child {
    width: 40px;
    text-align: center;
  }
`;
//#endregion

const FiltroProveedor = ({ setModal, setObjeto, foco }) => {
  //#region useState
  const [datos, setDatos] = useState([]);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    numeroDocumentoIdentidad: "",
    nombre: "",
  });
  const [cadena, setCadena] = useState(
    `&numeroDocumentoIdentidad=${filtro.numeroDocumentoIdentidad}&nombre=${filtro.nombre}`
  );
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(
      `&numeroDocumentoIdentidad=${filtro.numeroDocumentoIdentidad}&nombre=${filtro.nombre}`
    );
  }, [filtro]);
  useEffect(() => {
    Filtro();
  }, [cadena]);
  useEffect(() => {
    Listar(cadena, 1);
  }, []);
  //#endregion

  //#region Funciones Filtrado
  const HandleData = async ({ target }) => {
    setFiltro((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));
  };
  const Filtro = async () => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      Listar(cadena, 1);
    }, 200);
    setTimer(newTimer);
  };
  const KeyTabla = async (e, click = false) => {
    if (e.key === "Enter") {
      let row = document
        .querySelector("#tablaFiltroProveedor")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        await GetPorId(id);
      }
    }
    if (e.key == "Escape") {
      foco.focus();
      setModal(false);
    }
    if (click) {
      let row = e.target.closest("tr");
      let id = row.firstChild.innerText;
      await GetPorId(id);
    }
  };
  //#endregion

  //#region API
  const Listar = async (f = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Proveedor/Listar?pagina=${pagina}${f}`
    );
    setDatos(result.data.data.data.filter((res) => res.id !== "000000"));
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Proveedor/${id}?incluirReferencias=true`
    );
    setObjeto({
      proveedorId: result.data.data.id,
      proveedorNumeroDocumentoIdentidad:
        result.data.data.numeroDocumentoIdentidad,
      proveedorNombre: result.data.data.nombre,
      proveedorDireccion: result.data.data.direccionPrincipal,
      //Guía de Compra
      departamentoId: result.data.data.departamentoId,
      provinciaId: result.data.data.provinciaId,
      distritoId: result.data.data.distritoId,
      //Guía de Compra

      //Orden de Compra
      contactos: result.data.data.contactos,
      cuentasCorrientes: result.data.data.cuentasCorrientes,
      //Orden de Compra
    });
    foco.focus();
    setModal(false);
  };
  //#endregion

  //#region Columnas
  const columnas = useMemo(
    () => [
      {
        Header: "id",
        accessor: "id",
      },
      {
        Header: "N° Documento",
        accessor: "numeroDocumentoIdentidad",
      },
      {
        Header: "Nombre",
        accessor: "nombre",
      },
      {
        Header: " ",
        Cell: ({ row }) => (
          <button
            id="boton"
            onClick={() => GetPorId(row.values.id)}
            className={G.BotonModalBase + G.BotonVerde + "border-none"}
          >
            <FaCheck></FaCheck>
          </button>
        ),
      },
    ],
    [datos]
  );
  //#endregion

  //#region Render
  return (
    <>
      <ModalBasic
        setModal={setModal}
        titulo="Consultar Proveedores"
        foco={foco}
        tamañoModal={[G.ModalMediano, G.Form]}
        childrenFooter={
          <>
            {/* <button
              className={
                G.BotonOkModal + " flex items-center justify-center"
              }
              type="button"
            >
              <FaPlus></FaPlus>
              <p className="pl-2">Nuevo</p>
            </button> */}
            <button
              className={G.BotonModalBase + G.BotonCerrarModal}
              type="button"
              onClick={() => setModal(false)}
            >
              CERRAR
            </button>
          </>
        }
      >
        {
          <div className={G.ContenedorBasico}>
            <div className={G.ContenedorInputs}>
              <div className={G.Input60pct}>
                <label
                  htmlFor="numeroDocumentoIdentidad"
                  className={G.LabelStyle}
                >
                  N° Documento
                </label>
                <input
                  type="text"
                  id="numeroDocumentoIdentidad"
                  name="numeroDocumentoIdentidad"
                  placeholder="N° Documento"
                  autoComplete="off"
                  autoFocus
                  value={filtro.numeroDocumentoIdentidad}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputFull}>
                <label htmlFor="nombre" className={G.LabelStyle}>
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre"
                  autoComplete="off"
                  value={filtro.nombre}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
                {/* <button
                  id="consultar"
                  onClick={Filtro}
                  className={
                    G.BotonBuscar + G.Anidado + G.BotonPrimary
                  }
                >
                  <FaSearch></FaSearch>
                </button> */}
              </div>
            </div>

            {/* Tabla */}
            <DivTabla>
              <TableBasic
                id={"tablaFiltroProveedor"}
                columnas={columnas}
                datos={datos}
                DobleClick={(e) => KeyTabla(e, true)}
                KeyDown={(e) => KeyTabla(e)}
              />
            </DivTabla>
            {/* Tabla */}
          </div>
        }
      </ModalBasic>
    </>
  );
  //#endregion
};

export default FiltroProveedor;
