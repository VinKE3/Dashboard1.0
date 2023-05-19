import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../api/ApiMasy";
import ModalBasic from "../ModalBasic";
import TableBasic from "../tablas/TableBasic";
import { FaSearch, FaCheck } from "react-icons/fa";
import moment from "moment";
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
    width: 135px;
  }
  & th:nth-child(4) {
    width: 30px;
    text-align: center;
  }
  & th:nth-child(5) {
    width: 80px;
    text-align: right;
  }
  & th:last-child {
    width: 90px;
    text-align: center;
  }
`;
//#endregion

const FiltroCotizacion = ({ setModal, setObjeto, foco }) => {
  //#region useState
  const [datos, setDatos] = useState([]);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    fechaInicio: moment()
      .subtract(2, "years")
      .startOf("year")
      .format("yyyy-MM-DD"),
    fechaFin: moment(new Date()).format("yyyy-MM-DD"),
    clienteNombre: "",
  });
  const [cadena, setCadena] = useState(
    `&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}&clienteNombre=${filtro.clienteNombre}`
  );
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(
      `&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}&clienteNombre=${filtro.clienteNombre}`
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
      `api/Venta/Cotizacion/Listar?pagina=${pagina}${f}`
    );
    setDatos(result.data.data.data);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(
      `api/Venta/Cotizacion/${id}?incluirReferencias=${true}`
    );
    setObjeto({
      personalId: result.data.data.personalId,
      monedaId: result.data.data.monedaId,
      incluyeIGV: result.data.data.incluyeIGV,
      porcentajeIGV: result.data.data.porcentajeIGV,
      porcentajeRetencion: result.data.data.porcentajeRetencion,
      porcentajePercepcion: result.data.data.porcentajePercepcion,
      observacion: result.data.data.observacion ?? "",
      clienteId: result.data.data.clienteId,
      clienteTipoDocumentoIdentidadId:
        result.data.data.cliente.tipoDocumentoIdentidadId,
      clienteNumeroDocumentoIdentidad:
        result.data.data.clienteNumeroDocumentoIdentidad,
      clienteNombre: result.data.data.clienteNombre,
      clienteDireccionId: result.data.data.clienteDireccionId,
      cotizacionId: result.data.data.id,
      cotizacion: result.data.data.serie + "-" + result.data.data.numero,
      detalles: result.data.data.detalles,
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
        Header: "Cotización",
        accessor: "numeroDocumento",
      },
      {
        Header: "Razón Social",
        accessor: "clienteNombre",
      },
      {
        Header: "M",
        accessor: "monedaId",
        Cell: ({ value }) => {
          return <p className="text-center">{value == "S" ? "S/." : "US$"}</p>;
        },
      },
      {
        Header: "Total",
        accessor: "total",
        Cell: ({ value }) => {
          return <p className="text-right font-semibold">{value}</p>;
        },
      },
      {
        Header: " ",
        Cell: ({ row }) => (
          <div className="flex justify-center">
            <button
              id="boton"
              onClick={() => GetPorId(row.values.id)}
              className={
                Global.BotonModalBase + Global.BotonAgregar + "border-none"
              }
            >
              <FaCheck></FaCheck>
            </button>
          </div>
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
        titulo="Consultar Cotizaciones"
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
            <div className={Global.ContenedorInputs + " mb-2"}>
              <div className={Global.InputFull}>
                <label htmlFor="clienteNombre" className={Global.LabelStyle}>
                  Cliente
                </label>
                <input
                  type="text"
                  id="clienteNombre"
                  name="clienteNombre"
                  placeholder="Cliente"
                  autoComplete="off"
                  autoFocus
                  value={filtro.clienteNombre}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputMitad}>
                <label htmlFor="fechaInicio" className={Global.LabelStyle}>
                  Desde
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  autoComplete="off"
                  value={filtro.fechaInicio}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputMitad}>
                <label htmlFor="fechaFin" className={Global.LabelStyle}>
                  Hasta
                </label>
                <input
                  type="date"
                  id="fechaFin"
                  name="fechaFin"
                  autoComplete="off"
                  value={filtro.fechaFin}
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

export default FiltroCotizacion;
