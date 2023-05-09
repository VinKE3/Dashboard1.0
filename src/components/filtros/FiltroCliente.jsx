import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../api/ApiMasy";
import ModalBasic from "../ModalBasic";
import TableBasic from "../tablas/TableBasic";
import { FaSearch, FaCheck } from "react-icons/fa";
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
  & th:nth-child(2) {
    width: 120px;
  }
  & th:last-child {
    color: transparent;
    width: 40px;
    text-align: center;
  }
`;
//#endregion

const FiltroCliente = ({ setModal, setObjeto }) => {
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
  const ValidarData = async ({ target }) => {
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
  //#endregion

  //#region API
  const Listar = async (f = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Cliente/Listar?pagina=${pagina}${f}`
    );
    setDatos(result.data.data.data.filter((res) => res.id !== "000000"));
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Cliente/${id}?incluirReferencias=${true}`
    );
    /*
    Validación de Personal:
    Primero busca el default de Cliente, en caso no exista, debe buscar el personal default del usuario.
    En caso no exista debe buscar el personal deafault de la empresa
    */
    let personal = [];

    //Busca el primer personal que contenga default true
    if (Object.entries(result.data.data.personal).length > 0) {
      personal = result.data.data.personal.find((map) => map.default == true);
    } else {
      //En caso no exista debe buscar el personal deafault del usuario
      personal.personalId = "<<NI>>01";
    }
    setObjeto({
      clienteId: result.data.data.id,
      clienteTipoDocumentoIdentidadId:
        result.data.data.tipoDocumentoIdentidadId,
      clienteNumeroDocumentoIdentidad: result.data.data.numeroDocumentoIdentidad,
      clienteNombre: result.data.data.nombre,
      clienteDireccionId: result.data.data.direccionPrincipalId,
      clienteDireccion: result.data.data.direccionPrincipal,
      direcciones: result.data.data.direcciones,
      personalId: personal == undefined ? "<<NI>>01" : personal.personalId,
      tipoVentaId: result.data.data.tipoVentaId,
      tipoCobroId: result.data.data.tipoCobroId,
      //Cotizacion
      clienteTelefono: result.data.data.telefono,
      contactos: result.data.data.contactos,
      //Cotizacion
      //Retencion
      
      //Retencion
    });
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
        Header: "-",
        Cell: ({ row }) => (
          <button
            onClick={() => GetPorId(row.values.id)}
            className={Global.BotonModalBase + Global.BotonAgregar + "border-none"}
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
        objeto={[]}
        modo={""}
        menu={["", ""]}
        titulo="Consultar Clientes"
        tamañoModal={[Global.ModalMediano, Global.Form]}
        childrenFooter={
          <>
            {/* <button
              className={
                Global.BotonOkModal + " flex items-center justify-center"
              }
              type="button"
            >
              <FaPlus></FaPlus>
              <p className="pl-2">Nuevo</p>
            </button> */}
            <button
              className={Global.BotonModalBase + Global.BotonCancelarModal}
              type="button"
              onClick={() => setModal(false)}
            >
              CERRAR
            </button>
          </>
        }
      >
        {
          <div className={Global.ContenedorBasico}>
            <div className={Global.ContenedorInputs + "mb-2"}>
              <div className={Global.Input60pct}>
                <label
                  htmlFor="numeroDocumentoIdentidad"
                  className={Global.LabelStyle}
                >
                  N° Documento
                </label>
                <input
                  type="text"
                  id="numeroDocumentoIdentidad"
                  name="numeroDocumentoIdentidad"
                  placeholder="N° Documento"
                  autoComplete="off"
                  value={filtro.numeroDocumentoIdentidad}
                  onChange={ValidarData}
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
                  value={filtro.nombre}
                  onChange={ValidarData}
                  className={Global.InputBoton}
                />
                <button
                  id="consultar"
                  onClick={Filtro}
                  className={
                    Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                  }
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

export default FiltroCliente;
