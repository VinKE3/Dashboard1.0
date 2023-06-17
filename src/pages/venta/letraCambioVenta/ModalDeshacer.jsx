import moment from "moment";
import "primeicons/primeicons.css";
import { Checkbox } from "primereact/checkbox";
import React, { useEffect, useState } from "react";
import { FaSearch, FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import styled from "styled-components";
import Swal from "sweetalert2";
import ApiMasy from "../../../api/ApiMasy";
import * as G from "../../../components/Global";
import Mensajes from "../../../components/funciones/Mensajes";
import * as Funciones from "../../../components/funciones/Validaciones";
import ModalBasic from "../../../components/modal/ModalBasic";
import TableBasic from "../../../components/tabla/TableBasic";

//#region Estilos
const DivTabla = styled.div`
  max-width: 100%;
  overflow-x: auto;
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    width: 45px;
    text-align: center;
  }
  & th:last-child {
    width: 75px;
    min-width: 90px;
    max-width: 90px;
    text-align: center;
  }
`;
//#endregion

const ModalDeshacer = ({ setModal, modo, foco }) => {
  //#region useState
  //Data General
  const [dataDetalle, setDataDetalle] = useState([]);
  const [dataLetraDetalle, setDataLetraDetalle] = useState([]);
  //Data General
  //GetTablas
  const [dataTipoDoc, setDataTipoDoc] = useState([]);
  //GetTablas
  //Data Modales Ayuda
  const [filtro, setFiltro] = useState({
    fechaInicio: moment().format("YYYY-MM-DD"),
    fechaFin: moment().format("YYYY-MM-DD"),
    tipoDocumentoId: "",
    serie: "",
    numero: "",
    isDocumento: false,
  });
  const [cadena, setCadena] = useState(
    `fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}&estadoLetraId=E&tipoDocumentoId=${filtro.tipoDocumentoId}&serie=${filtro.serie}&numero=${filtro.numero}&estadoLetraId=E`
  );
  //Data Modales Ayuda
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    setCadena(
      `fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}&estadoLetraId=E&tipoDocumentoId=${filtro.tipoDocumentoId}&serie=${filtro.serie}&numero=${filtro.numero}`
    );
  }, [filtro]);
  useEffect(() => {
    RetornarMensaje();
  }, [tipoMensaje]);
  useEffect(() => {
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
  const Filtro = async ({ target }) => {
    setFiltro((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  const Limpiar = async () => {
    setDataDetalle([]);
    setDataLetraDetalle([]);
    document.getElementById("fechaInicioDeshacer").focus();
  };
  const ConsultarDocumento = async () => {
    const result = await ApiMasy.get(`api/Venta/ProcesoLetra/Listar?${cadena}`);
    if (result.data.data.total == 0) {
      document.getElementById("serie").focus();
      toast.warning("No se encontraron registros", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
    setDataDetalle(
      result.data.data.data.map((map, i = 0) => {
        return {
          ...map,
          detalleId: i++,
        };
      })
    );
  };
  const CargarDetalle = async (value) => {
    let row = value.target.closest("tr");
    let id = row.children[0].innerText;
    const result = await ApiMasy.get(
      `api/Venta/ProcesoLetra/ListarDetalles?id=${id}`
    );
    setDataLetraDetalle(
      result.data.data.map((map, i = 0) => {
        return {
          ...map,
          detalleId: i++,
        };
      })
    );
  };
  const RetornarMensaje = async () => {
    if (tipoMensaje == 0) {
      mensaje.map((map) => {
        toast.success(map, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
      foco.focus();
      setModal(false);
    }
  };
  const Key = async (e) => {
    if (e.key == "Escape") {
      if (modo != "Consultar") {
        Swal.fire({
          title: "Cerrar Formulario",
          text: "¿Desea cerrar el formulario?",
          icon: "warning",
          iconColor: "#3B8407",
          showCancelButton: true,
          color: "#fff",
          background: "#171B23",
          confirmButtonColor: "#3B8407",
          confirmButtonText: "Confirmar",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            foco.focus();
            setModal(false);
          }
        });
      } else {
        foco.focus();
        setModal(false);
      }
    }
  };
  //#endregion

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Venta/LetraCambioVenta/FormularioTablas`
    );
    setDataTipoDoc(result.data.data.tiposDocumento);
  };
  const Enviar = async () => {
    let row = document
      .querySelector("#tablaDocumento")
      .querySelector("tr.selected-row");
    if (row != null) {
      let id = row.children[0].innerHTML;
      const result = await ApiMasy.delete(
        `api/Venta/LetraCambioVenta/Deshacer/${id}`
      );
      if (result.tipo == 1) {
        setTipoMensaje(result.tipo);
        setMensaje(result.textos);
      } else {
        setTipoMensaje(result.data.messages[0].tipo);
        setMensaje(result.data.messages[0].textos);
      }
    } else {
      toast.info("Seleccione una Fila", {
        position: "bottom-right",
        autoClose: 3000,
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

  //#region Columnas
  const columnas = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "N°",
      accessor: "detalleId",
      Cell: ({ value }) => {
        return <p className="text-center">{value}</p>;
      },
    },
    {
      Header: "Documento",
      accessor: "documentoReferenciaNumeroDocumento",
    },
    {
      Header: "Reversión",
      accessor: "isReverción",
      Cell: ({ value }) => {
        return (
          <div className="flex justify-center">
            <Checkbox checked={value} />
          </div>
        );
      },
    },
  ];
  const columnasDetalle = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "N°",
      accessor: "detalleId",
      Cell: ({ value }) => {
        return <p className="text-center">{value}</p>;
      },
    },
    {
      Header: "Letra N°",
      accessor: "letraRelacionadaNumeroDocumento",
    },
    {
      Header: "Proceso",
      accessor: "estadoLetraId",
      Cell: ({ value }) => {
        return <p className="text-center">{value}</p>;
      },
    },
  ];
  //#endregion

  //#region Render
  return (
    <>
      {Object.entries(dataTipoDoc).length > 0 && (
        <>
          <ModalBasic
            setModal={setModal}
            cerrar={false}
            titulo="Deshacer Emisión de Letra"
            tamañoModal={[G.ModalMediano, G.Form]}
            childrenFooter={
              <div className={G.ModalFooter}>
                <button
                  type="button"
                  onClick={() => Enviar()}
                  onKeyDown={(e) => Key(e)}
                  className={G.BotonModalBase + G.BotonOkModal}
                >
                  Deshacer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    foco.focus();
                    setModal(false);
                  }}
                  onKeyDown={(e) => Key(e)}
                  className={G.BotonModalBase + G.BotonCerrarModal}
                >
                  CERRAR
                </button>
              </div>
            }
          >
            {tipoMensaje > 0 && (
              <Mensajes
                tipoMensaje={tipoMensaje}
                mensaje={mensaje}
                Click={() =>
                  Funciones.OcultarMensajes(setTipoMensaje, setMensaje)
                }
              />
            )}
            {/* Cabecera Documento */}
            <div className={G.ContenedorBasico + G.FondoContenedor + " mb-2"}>
              <div className={G.ContenedorInputs}>
                <div className={G.InputMitad}>
                  <label htmlFor="fechaInicio" className={G.LabelStyle}>
                    Desde
                  </label>
                  <input
                    type="date"
                    id="fechaInicioDeshacer"
                    name="fechaInicio"
                    value={filtro.fechaInicio ?? ""}
                    onChange={Filtro}
                    onKeyDown={(e) => Key(e)}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputMitad}>
                  <label htmlFor="fechaFin" className={G.LabelStyle}>
                    Hasta
                  </label>
                  <input
                    type="date"
                    id="fechaFin"
                    name="fechaFin"
                    value={filtro.fechaFin ?? ""}
                    onChange={Filtro}
                    onKeyDown={(e) => Key(e)}
                    className={G.InputStyle}
                  />
                </div>
              </div>
              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <label htmlFor="tipoDocumentoId" className={G.LabelStyle}>
                    Tipo Doc.
                  </label>
                  <select
                    id="tipoDocumentoId"
                    name="tipoDocumentoId"
                    autoFocus
                    value={filtro.tipoDocumentoId ?? ""}
                    onChange={Filtro}
                    onKeyDown={(e) => Key(e)}
                    disabled={modo == "Nuevo" ? false : true}
                    className={G.InputStyle}
                  >
                    <option key={-1} value={""}>
                      --TODOS--
                    </option>
                    {dataTipoDoc.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={G.InputTercio}>
                  <label htmlFor="serie" className={G.LabelStyle}>
                    Serie
                  </label>
                  <input
                    type="text"
                    id="serie"
                    name="serie"
                    placeholder="Serie"
                    autoComplete="off"
                    maxLength="4"
                    disabled={modo == "Nuevo" ? false : true}
                    value={filtro.serie ?? ""}
                    onChange={Filtro}
                    onKeyDown={(e) => Key(e)}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.Input66pct}>
                  <label htmlFor="numero" className={G.LabelStyle}>
                    Número
                  </label>
                  <input
                    type="number"
                    id="numero"
                    name="numero"
                    placeholder="Número"
                    autoComplete="off"
                    maxLength="10"
                    disabled={modo == "Nuevo" ? false : true}
                    value={filtro.numero ?? ""}
                    onChange={Filtro}
                    onKeyDown={(e) => Key(e)}
                    className={G.InputBoton}
                  />
                  <button
                    id="consultarDocumento"
                    className={
                      G.BotonBuscar +
                      G.Anidado +
                      G.BotonPrimary +
                      " rounded-r-none"
                    }
                    hidden={modo == "Consultar"}
                    onKeyDown={(e) => Funciones.KeyClick(e)}
                    onClick={() => ConsultarDocumento()}
                  >
                    <FaSearch></FaSearch>
                  </button>
                  <button
                    id="eliminarDocumentos"
                    className={G.BotonBuscar + G.Anidado + G.BotonRojo}
                    hidden={modo == "Consultar"}
                    onClick={() => Limpiar()}
                  >
                    <FaTrashAlt></FaTrashAlt>
                  </button>
                </div>
              </div>

              {/* Tabla Detalle */}
              <DivTabla>
                <TableBasic
                  id="tablaDocumento"
                  columnas={columnas}
                  datos={dataDetalle}
                  estilos={[
                    "",
                    "",
                    "",
                    "border ",
                    "",
                    "border border-b-0",
                    "border",
                  ]}
                  Click={(e) => CargarDetalle(e)}
                />
              </DivTabla>
              {/* Tabla Detalle */}
            </div>
            {/* Cabecera Documento */}

            {/* Cabecera Letra */}
            <div className={G.ContenedorBasico + G.FondoContenedor}>
              <p className={G.Subtitulo}>Detalle de Proceso</p>

              {/* Tabla Detalle */}
              <DivTabla>
                <TableBasic
                  id="tablaDetalle"
                  columnas={columnasDetalle}
                  datos={dataLetraDetalle}
                  estilos={[
                    "",
                    "",
                    "",
                    "border ",
                    "",
                    "border border-b-0",
                    "border",
                  ]}
                />
              </DivTabla>
              {/* Tabla Detalle */}
            </div>
            {/* Cabecera Letra */}
          </ModalBasic>
        </>
      )}
    </>
  );
  //#endregion
};

export default ModalDeshacer;
