import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../api/ApiMasy";
import ModalBasic from "../ModalBasic";
import TableBasic from "../tablas/TableBasic";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
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
    width: 70px;
    text-align: center;
  }
  & th:nth-child(3) {
    width: 140px;
  }
  & th:nth-child(5) {
    width: 140px;
    text-align: center;
  }
  & th:last-child {
    width: 90px;
    text-align: center;
  }
`;
const TablaDetalle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:last-child {
    width: 90px;
    text-align: center;
  }
`;
//#endregion

const FiltroSalidaCilindros = ({ setModal, id, objeto, setObjeto, foco }) => {
  //#region useState
  const [data, setData] = useState([]);
  const [dataGuiasSeleccionada] = useState(objeto);
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
      `api/Almacen/SalidaCilindros/ListarPendientes?pagina=${pagina}&personalId=${id}${filtro}`
    );
    setData(result.data.data.data);
  };
  const GetPorId = async (id) => {
    let existe;
    //Valida si hay un elemento que coincida por el id
    if (Object.entries(objeto).length > 0) {
      existe = objeto.find((map) => map.id == id);
    }
    //Si no existe entonces pasa los datos
    if (existe == undefined) {
      const result = await ApiMasy.get(
        `api/Almacen/SalidaCilindros/${id}?incluirReferencias=${true}`
      );
      setObjeto({
        ...result.data.data,
        guiasRelacionadas: {
          id: result.data.data.id,
          numeroDocumento: result.data.data.numeroGuia,
        },
        accion: "agregar",
      });
      foco.focus();
      setModal(false);
    } else {
      //Si existe manda la alerta
      toast.error("Ya existe el elemento seleccionado", {
        position: "bottom-right",
        autoClose: 1800,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };
  //#endregion

  //#region Funciones
  const EliminarFila = async (id) => {
    let model = dataGuiasSeleccionada.filter((map) => map.id != id);
    const res = await ApiMasy.get(`api/Almacen/SalidaCilindros/${id}`);
    Swal.fire({
      title: "Eliminar selección",
      icon: "warning",
      iconColor: "#F7BF3A",
      showCancelButton: true,
      color: "#fff",
      background: "#1a1a2e",
      confirmButtonColor: "#eea508",
      confirmButtonText: "Aceptar",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setObjeto({
          detalles: res.data.data.detalles,
          guiasRelacionadas: model,
          accion: "eliminar",
        });
        setModal(false);
      }
    });
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
        accessor: "fechaEmision",
        Cell: ({ value }) => {
          return <p className="text-center">{moment(value).format("DD/MM/YY")}</p>;

        },
      },
      {
        Header: "Documento",
        accessor: "numeroDocumento",
      },
      {
        Header: "Cliente",
        accessor: "clienteNombre",
      },
      {
        Header: "Total Cilindros",
        accessor: "totalCilindros",
        Cell: ({ value }) => {
          return <p className="text-center font-semibold">{value}</p>;
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
                Global.BotonModalBase + Global.BotonAgregar + " border-none "
              }
            >
              <FaCheck></FaCheck>
            </button>
          </div>
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
      Header: " ",
      Cell: ({ row }) => (
        <div className="flex justify-center">
          <button
            id="boton"
            onClick={() => EliminarFila(row.values.id)}
            className={
              Global.BotonModalBase + Global.BotonEliminar + "border-none"
            }
          >
            <FaTrash></FaTrash>
          </button>
        </div>
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
        titulo="Consultar Salida De Cilindros"
        tamañoModal={[Global.ModalMediano, Global.Form]}
        childrenFooter={
          <>
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
          <>
            <div
              className={
                Global.ContenedorBasico + Global.FondoContenedor + " mb-2"
              }
            >
              <div className={Global.ContenedorInputs + " mb-2"}>
                <div className={Global.InputMitad}>
                  <label htmlFor="fechaInicio" className={Global.LabelStyle}>
                    Desde
                  </label>
                  <input
                    type="date"
                    id="fechaInicio"
                    name="fechaInicio"
                    autoComplete="off"
                    autoFocus
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
              {Object.entries(dataGuiasSeleccionada).length > 0 && (
                <div
                  className={Global.ContenedorBasico + Global.FondoContenedor}
                >
                  <p className=" px-1 text-base text-light font-bold">
                    SELECCIONADOS
                  </p>
                  {/* Tabla */}
                  <TablaDetalle>
                    <TableBasic
                      columnas={columnSeleccion}
                      datos={dataGuiasSeleccionada}
                    />
                  </TablaDetalle>
                  {/* Tabla */}
                </div>
              )}
              {/* Tabla */}
              <TablaStyle>
                <TableBasic columnas={columnas} datos={data} />
              </TablaStyle>
              {/* Tabla */}
            </div>
          </>
        }
      </ModalBasic>
    </>
  );
  //#endregion
};

export default FiltroSalidaCilindros;
