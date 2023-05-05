import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../api/ApiMasy";
import ModalBasic from "../ModalBasic";
import TableBasic from "../tablas/TableBasic";
import { toast } from "react-toastify";
import { FaSearch, FaTrash, FaCheck } from "react-icons/fa";
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
    width: 100px;
  }
  & th:nth-child(3) {
    width: 140px;
  }
  & th:nth-child(5) {
    width: 30px;
    text-align: center;
  }
  & th:nth-child(6) {
    width: 80px;
    text-align: center;
  }
  & th:nth-child(7) {
    color: transparent;
  }
  & th:last-child {
    width: 40px;
    text-align: center;
  }
`;
//#endregion

const FiltroOrdenCompra = ({ setModal, id, objeto, setObjeto }) => {
  //#region useState
  const [data, setData] = useState([]);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    fechaInicio: moment()
      .subtract(2, "years")
      .startOf("year")
      .format("yyyy-MM-DD"),
    fechaFin: moment(new Date()).format("yyyy-MM-DD"),
  });
  const [cadena, setCadena] = useState(
    `&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`
  );
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(`&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`);
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
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Compra/OrdenCompra/ListarPendientes?pagina=${pagina}&proveedorId=${id}${filtro}`
    );
    setData(result.data.data.data);
  };
  const GetPorId = async (id) => {
    console.log(objeto);
    const result = await ApiMasy.get(`api/Compra/OrdenCompra/${id}`);
    let existe = objeto.find((map) => map == result.data.data.numeroDocumento);
    console.log(existe);
    // setObjeto({
      // ordenesCompraRelacionadas: [result.data.data],
    // });
    // setModal(false);
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
        Header: "Fecha",
        accessor: "fechaContable",
        Cell: ({ value }) => {
          return moment(value).format("DD/MM/YYYY");
        },
      },
      {
        Header: "Documento",
        accessor: "numeroDocumento",
      },
      {
        Header: "Proveedor",
        accessor: "proveedorNombre",
      },
      {
        Header: "M",
        accessor: "monedaId",
        Cell: ({ value }) => {
          return <p className="text-center">{value}</p>;
        },
      },
      {
        Header: "Total",
        accessor: "total",
        Cell: ({ value }) => {
          return <p className="text-right">{value}</p>;
        },
      },
      {
        Header: "-",
        Cell: ({ row }) => (
          <button
            onClick={() => GetPorId(row.values.id)}
            className={
              Global.BotonBasic + Global.BotonAgregar + " !px-3 !py-1.5"
            }
          >
            <FaCheck></FaCheck>
          </button>
        ),
      },
    ],
    [data]
  );
  const columnSeleccion = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Documento",
      accessor: "numeroDocumento",
    },
    {
      Header: "-",
      Cell: ({ row }) => (
        <button
          onClick={() => EliminarFila(row.values.id)}
          className={
            Global.BotonBasic + Global.BotonCancelarModal + " !px-2 !py-1"
          }
        >
          <FaTrash></FaTrash>
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
        titulo="Consultar Ordenes de Compra"
        tamañoModal={[Global.ModalMediano, Global.Form]}
        childrenFooter={
          <>
            <button
              onClick={() => Guardar()}
              className={
                Global.BotonModalBase +
                Global.BotonOkModal +
                " flex items-center justify-center"
              }
              type="button"
            >
              <FaCheck></FaCheck>
              <p className="pl-2">Guardar Selección</p>
            </button>
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
          <div className={Global.ContenedorBasico + " mb-2"}>
            <div className={Global.ContenedorInputs + "mb-2"}>
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
              <TableBasic columnas={columnas} datos={data} />
            </TablaStyle>
            {/* Tabla */}
          </div>
        }
      </ModalBasic>
    </>
  );
  //#endregion
};

export default FiltroOrdenCompra;
