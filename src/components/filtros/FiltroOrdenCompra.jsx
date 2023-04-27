import React, { useState, useEffect } from "react";
import ApiMasy from "../../api/ApiMasy";
import ModalBasic from "../ModalBasic";
import TableBasic from "../tablas/TableBasic";
import moment from "moment";
import { FaSearch, FaTrash, FaCheck } from "react-icons/fa";
import styled from "styled-components";
import * as Global from "../Global";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
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
const TablaDetalle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:last-child {
    width: 40px;
    text-align: center;
    color: transparent;
  }
`;
//#endregion

const FiltroOrdenCompra = ({ setModal, id, setObjeto, objeto }) => {
  //#region useState
  const [data, setData] = useState([]);
  const [dataSeleccion, setDataSeleccion] = useState(objeto);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [refrescar, setRefrescar] = useState(false);
  //#endregion

  //#region useEffect;
  useEffect(() => {
    if (refrescar) {
      dataSeleccion;
      setRefrescar(false);
    }
  }, [refrescar]);
  useEffect(() => {
    Listar("", 1);
  }, []);
  //#endregion

  //#region Funciones Filtrado
  const FiltradoDocumento = async (e) => {
    let nombre = document.getElementById("nombre").value || "";
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
    let documento = document.getElementById("documento").value || "";
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

  //#region Funciones
  const GetDatos = async (e, id = "") => {
    e.preventDefault();
    const result = await ApiMasy.get(`api/Compra/OrdenCompra/${id}`);
    if (Object.entries(dataSeleccion).length > 0) {
      let index = dataSeleccion.findIndex(
        (map) => map.id === result.data.data.id
      );
      if (index > -1) {
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
    } else {
      dataSeleccion.push(result.data.data);
      setRefrescar(true);
    }
  };
  const EliminarFila = async (e, id) => {
    e.preventDefault();
    let model = dataSeleccion.filter((model) => model.id !== id);
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
        setDataSeleccion(model);
      }
    });
  };
  const Guardar = async () => {
    setObjeto({
      ordenesCompraRelacionadas: dataSeleccion,
    });
    setModal(false);
  };
  //#endregion

  //#region API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Compra/OrdenCompra/ListarPendientes?pagina=${pagina}&proveedorId=${id}${filtro}`
    );
    setData(result.data.data.data);
  };
  //#endregion

  //#region Columnas
  const columnas = [
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
          onClick={(e) => GetDatos(e, row.values.id)}
          className={Global.BotonBasic + Global.BotonAgregar + " !px-3 !py-2"}
        >
          <FaCheck></FaCheck>
        </button>
      ),
    },
  ];
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
          onClick={(e) => EliminarFila(e, row.values.id)}
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
                Global.BotonOkModal + " flex items-center justify-center"
              }
              type="button"
            >
              <FaCheck></FaCheck>
              <p className="pl-2">Guardar Selección</p>
            </button>
            <button
              className={Global.BotonCancelarModal}
              type="button"
              onClick={() => setModal(false)}
            >
              CERRAR
            </button>
          </>
        }
      >
        {
          <div className="grid gap-5">
            <div className={Global.ContenedorBasico}>
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputMitad}>
                  <label htmlFor="fechaInicio" className={Global.LabelStyle}>
                    Desde
                  </label>
                  <input
                    type="date"
                    id="fechaInicio"
                    name="fechaInicio"
                    autoComplete="off"
                    defaultValue={moment()
                      .subtract(2, "years")
                      .startOf("year")
                      .format("yyyy-MM-DD")}
                    onChange={FiltradoDocumento}
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
                    defaultValue={moment(new Date()).format("yyyy-MM-DD")}
                    onChange={FiltradoNombre}
                    className={Global.InputBoton}
                  />
                  <button
                    id="consultar"
                    onClick={FiltradoButton}
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
            {dataSeleccion.length > 0 && (
              <div className={Global.ContenedorBasico}>
                <h4 className="text-xl text-light font-bold">
                  Documentos Seleccionados
                </h4>
                {/* Tabla */}
                <TablaDetalle>
                  <TableBasic
                    columnas={columnSeleccion}
                    datos={dataSeleccion}
                  />
                </TablaDetalle>
                {/* Tabla */}
              </div>
            )}
          </div>
        }
      </ModalBasic>
      <ToastContainer />
    </>
  );
  //#endregion
};

export default FiltroOrdenCompra;
