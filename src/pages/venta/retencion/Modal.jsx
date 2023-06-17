import moment from "moment";
import "primeicons/primeicons.css";
import { Checkbox } from "primereact/checkbox";
import React, { useEffect, useState } from "react";
import { FaPen, FaPlus, FaSearch, FaTrashAlt, FaUndoAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import store from "store2";
import styled from "styled-components";
import Swal from "sweetalert2";
import ApiMasy from "../../../api/ApiMasy";
import * as G from "../../../components/Global";
import FiltroCliente from "../../../components/filtro/FiltroCliente";
import Get from "../../../components/funciones/Get";
import GetTipoCambio from "../../../components/funciones/GetTipoCambio";
import Mensajes from "../../../components/funciones/Mensajes";
import * as Funciones from "../../../components/funciones/Validaciones";
import ModalCrud from "../../../components/modal/ModalCrud";
import TableBasic from "../../../components/tabla/TableBasic";

//#region Estilos
const DivTabla = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    display: none;
  }
  & tbody td:nth-child(2) {
    display: none;
  }
  & th:nth-child(4) {
    text-align: center;
    width: 80px;
  }
  & th:nth-child(5) {
    width: 120px;
  }
  & th:nth-child(6) {
    width: 90px;
    text-align: center;
  }
  & th:nth-child(7) {
    width: 100px;
    text-align: center;
  }
  & th:nth-child(6),
  & th:nth-child(7),
  & th:nth-child(8),
  & th:nth-child(9) {
    width: 90px;
    min-width: 90px;
    max-width: 90px;
    text-align: center;
  }
  & th:last-child {
    width: 75px;
    min-width: 75px;
    max-width: 75px;
    text-align: center;
  }
`;
//#endregion

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  //Data General
  const [data, setData] = useState(objeto);
  const [dataDetalle, setDataDetalle] = useState([]);
  const [dataGlobal] = useState(store.session.get("global"));
  //Data General
  //GetTablas
  const [dataTipoDocumento, setDataTipoDocumento] = useState([]);
  const [dataTipoDoc, setDataTipoDoc] = useState([]);
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataTipoVenta, setDataTipoVenta] = useState([]);
  const [dataTipoCobro, setDataTipoCobro] = useState([]);
  //GetTablas
  //Data Modales Ayuda
  const [dataCliente, setDataCliente] = useState([]);
  const [dataCabecera, setDataCabecera] = useState({
    tipoDocumento: "01",
    porcentaje: 3,
    abonado: true,
    fechaEmision: moment().format("YYYY-MM-DD"),
  });
  //Data Modales Ayuda

  //Modales de Ayuda
  const [modalCliente, setModalCliente] = useState(false);
  //Modales de Ayuda

  const [checkVarios, setCheckVarios] = useState(false);
  const [habilitarCampos, setHabilitarCampos] = useState(true);
  const [detalleId, setDetalleId] = useState(dataDetalle.length + 1);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (Object.keys(dataCliente).length > 0) {
      setData({
        ...data,
        clienteId: dataCliente.clienteId,
        clienteNumeroDocumentoIdentidad:
          dataCliente.clienteNumeroDocumentoIdentidad,
        clienteNombre: dataCliente.clienteNombre,
        clienteDireccion: dataCliente.clienteDireccion,
        tipoVentaId: dataCliente.tipoVentaId,
        tipoCobroId: dataCliente.tipoCobroId,
      });
      setRefrescar(true);
    }
  }, [dataCliente]);
  useEffect(() => {
    setData({ ...data, detalles: dataDetalle });
  }, [dataDetalle]);
  useEffect(() => {
    if (refrescar) {
      ActualizarTotales();
      setRefrescar(false);
    }
  }, [refrescar]);
  useEffect(() => {
    if (modo == "Nuevo") {
      TipoCambio(data.fechaEmision);
    } else {
      SepararDetalle(data.detalles);
      setHabilitarCampos(false);
    }
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
  //Data General
  const HandleData = async ({ target }) => {
    setData((prev) => ({
      ...prev,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  const ClientesVarios = async ({ target }) => {
    if (target.checked) {
      setDataCliente((prev) => ({
        ...prev,
        clienteId: dataGlobal.cliente.id,
        clienteNumeroDocumentoIdentidad:
          dataGlobal.cliente.numeroDocumentoIdentidad,
        clienteNombre: dataGlobal.cliente.nombre,
        clienteDireccion: dataGlobal.cliente.direccionPrincipal,
        tipoVentaId: dataGlobal.cliente.tipoVentaId,
        tipoCobroId: dataGlobal.cliente.tipoCobroId,
      }));
    } else {
      setDataCliente((prev) => ({
        ...prev,
        clienteId: "",
        clienteNumeroDocumentoIdentidad: "",
        clienteNombre: "",
        direccionPrincipal: "",
      }));
    }
  };
  const FechaEmision = async () => {
    if (modo != "Consultar") {
      toast(
        "Si la fecha de emisión ha sido cambiada, no olvide consultar el tipo de cambio.",
        {
          position: "bottom-left",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    }
  };
  const Numeracion = async (e) => {
    if (e.target.name == "numero") {
      let num = e.target.value;
      if (num.length < 10) {
        num = ("0000000000" + num).slice(-10);
      }
      setData((prev) => ({
        ...prev,
        numero: num,
      }));
    }
    if (e.target.name == "serie") {
      let num = e.target.value;
      if (num.length < 4) {
        num = ("0000000000" + num).slice(-4);
      }
      setData((prev) => ({
        ...prev,
        serie: num,
      }));
    }
  };
  //Data General

  //Artículos
  const HandleDataCabecera = async ({ target }) => {
    setDataCabecera((prev) => ({
      ...prev,
      [target.name]: target.value.toUpperCase(),
    }));

    if (target.name == "porcentaje" && target.value > 0) {
      if (dataCabecera.total != undefined) {
        await CalcularImporte(target.value);
      }
    }
  };
  const ValidarConsulta = async (origen) => {
    if (origen == "ConsultarDocumento") {
      if (dataCabecera.serie == undefined || dataCabecera.numero == undefined) {
        return [false, "La serie y número del documento son requeridos."];
      }
      if (dataCabecera.serie.length < 4) {
        return [false, "Formato de Serie incorrecto"];
      }
    } else {
      if (data.tipoCambio == 0) {
        document.getElementById("tipoCambio").focus();
        return [
          false,
          "No es posible hacer la conversión si el tipo de cambio es cero (0.00)",
        ];
      }
    }
    return [true, ""];
  };
  const ConvertirPrecio = async (total, moneda) => {
    if (Object.entries(dataCabecera).length > 0) {
      let respuesta = await ValidarConsulta("precio");
      if (respuesta[0]) {
        if (data.monedaId != moneda) {
          toast.info("Se realizó la conversión al tipo de cambio actual", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          if (moneda == "D") {
            total = Funciones.RedondearNumero(total / data.tipoCambio, 2);
          } else {
            total = Funciones.RedondearNumero(total * data.tipoCambio, 2);
          }
          return total;
        } else {
          toast.info("Documento consultado exitósamente", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return total;
        }
      } else {
        toast.error(respuesta[1], {
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
    }
  };
  const CalcularImporte = async (porcentaje) => {
    let monto = dataCabecera.total * (porcentaje / 100);
    setDataCabecera((prev) => ({
      ...prev,
      monto: Funciones.RedondearNumero(monto, 2),
    }));
  };
  //Artículos
  //#endregion

  //#region Funciones Detalles
  const ValidarDetalle = async () => {
    if (Object.entries(dataCabecera).length == 0) {
      return [false, "Seleccione un documento"];
    }

    //valida total de venta
    if (dataCabecera.total == undefined) {
      return [false, "Seleccione un documento"];
    }
    return [true, ""];
  };
  const AgregarDetalle = async () => {
    //Obtiene resultado de Validación
    let resultado = await ValidarDetalle();

    if (resultado[0]) {
      //Si tiene detalleId entonces modifica registro
      if (dataCabecera.detalleId != undefined) {
        let dataDetalleMod = dataDetalle.map((map) => {
          if (map.documentoVentaId == dataCabecera.documentoVentaId) {
            return {
              detalleId: dataCabecera.detalleId,
              documentoVentaId: dataCabecera.documentoVentaId,
              tipoDocumento: dataCabecera.tipoDocumento,
              serie: dataCabecera.serie,
              numero: dataCabecera.numero,
              fechaEmision: dataCabecera.fechaEmision,
              porcentaje: dataCabecera.porcentaje,
              total: dataCabecera.total,
              monto: dataCabecera.monto,
              abonar: true,
            };
          } else {
            return map;
          }
        });
        setDataDetalle(dataDetalleMod);
        setRefrescar(true);
      } else {
        let model = dataDetalle.find((map) => {
          return map.documentoVentaId == dataCabecera.documentoVentaId;
        });
        if (model == undefined) {
          setDataDetalle((prev) => [
            ...prev,
            {
              detalleId: detalleId,
              documentoVentaId: dataCabecera.documentoVentaId,
              tipoDocumento: dataCabecera.tipoDocumento,
              serie: dataCabecera.serie,
              numero: dataCabecera.numero,
              fechaEmision: dataCabecera.fechaEmision,
              porcentaje: dataCabecera.porcentaje,
              total: dataCabecera.total,
              monto: dataCabecera.monto,
              abonar: true,
            },
          ]);
          setDetalleId(detalleId + 1);
          setHabilitarCampos(true);
          setRefrescar(true);
        } else {
          Swal.fire({
            title: "Aviso del sistema",
            text:
              "El Documento " +
              model.serie +
              "-" +
              model.numero +
              " ya está registrado en el detalle, ¿Desea modificar los datos de venta del artículo?",
            icon: "error",
            iconColor: "#F7BF3A",
            showCancelButton: true,
            color: "#fff",
            background: "#171B23",
            confirmButtonColor: "#3B8407",
            confirmButtonText: "Confirmar",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
          }).then((res) => {
            if (res.isConfirmed) {
              CargarDetalle(model.documentoVentaId);
            }
          });
        }
      }
      //Luego de añadir el artículo se limpia
      setDataCabecera({
        tipoDocumento: "01",
        abonar: true,
        porcentaje: 3,
      });
      setHabilitarCampos(true);
      document.getElementById("consultarDocumento").focus();
    } else {
      //NO cumple validación
      if (resultado[1] != "") {
        toast.error(resultado[1], {
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
    }
  };
  const SepararDetalle = async (detalle) => {
    const SepararDocumentoVentaId = detalle.map((detalle) => {
      return {
        ...detalle,
        empresaId: detalle.documentoVentaId.substr(0, 2),
        tipoDocumento: detalle.documentoVentaId.substr(2, 2),
        serie: detalle.documentoVentaId.substr(4, 4),
        numero: detalle.documentoVentaId.substr(8),
      };
    });
    setDataDetalle(SepararDocumentoVentaId);
  };
  const CargarDetalle = async (value, click = false) => {
    if (modo != "Consultar") {
      if (click) {
        let row = value.target.closest("tr");
        let id = row.children[1].innerText;
        setHabilitarCampos(false);
        setDataCabecera(dataDetalle.find((map) => map.documentoVentaId === id));
      } else {
        setHabilitarCampos(false);
        setDataCabecera(
          dataDetalle.find((map) => map.documentoVentaId === value)
        );
      }
      document.getElementById("porcentaje").focus();
    }
  };
  const EliminarDetalle = async (id) => {
    let i = 1;
    let nuevoDetalle = dataDetalle.filter((map) => map.documentoVentaId !== id);
    if (nuevoDetalle.length > 0) {
      setDataDetalle(
        nuevoDetalle.map((map) => {
          return {
            ...map,
            detalleId: i++,
          };
        })
      );
      setDetalleId(i);
    } else {
      //Asgina directamente a 1
      setDetalleId(nuevoDetalle.length + 1);
      setDataDetalle(nuevoDetalle);
    }
    setRefrescar(true);
  };
  //Calculos
  const ActualizarTotales = async () => {
    //Suma los importes de los detalles
    let importeTotal = dataDetalle.reduce((i, map) => {
      return i + map.monto;
    }, 0);

    setData((prev) => ({
      ...prev,
      total: Funciones.RedondearNumero(importeTotal, 2),
    }));
  };
  //Calculos
  //#endregion

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(`api/Venta/Retencion/FormularioTablas`);
    setDataTipoDocumento([{ id: "RE", descripcion: "Retención" }]);
    setDataTipoVenta(result.data.data.tiposVenta);
    setDataTipoCobro(result.data.data.tiposCobro);
    setDataMoneda(result.data.data.monedas);
    setDataTipoDoc(result.data.data.tiposDocumento);

    if (modo == "Nuevo") {
      //Datos Iniciales
      let tiposVenta = result.data.data.tiposVenta.find((map) => map);
      let tiposCobro = result.data.data.tiposCobro.find((map) => map);
      let monedas = result.data.data.monedas.find((map) => map);
      let tiposDocumento = result.data.data.tiposDocumento.find((map) => map);
      //Datos Iniciales
      setData((prev) => ({
        ...prev,
        tipoVentaId: tiposVenta.id,
        tipoCobroId: tiposCobro.id,
        monedaId: monedas.id,
      }));

      setDataCabecera((prev) => ({
        ...prev,
        tipoDocumentoId: tiposDocumento.id,
      }));
    }
  };
  const TipoCambio = async (fecha) => {
    let tipoCambio = await GetTipoCambio(
      fecha,
      "venta",
      setTipoMensaje,
      setMensaje
    );
    setData((prev) => ({
      ...prev,
      tipoCambio: tipoCambio,
    }));
  };
  const ConsultarDocumento = async () => {
    let respuesta = await ValidarConsulta("ConsultarDocumento");
    if (respuesta[0]) {
      const result = await Get(
        `Venta/DocumentoVenta/GetPorTipoDocumentoSerieNumero?tipoDocumentoId=${dataCabecera.tipoDocumento}&serie=${dataCabecera.serie}&numero=${dataCabecera.numero}&incluirReferencias=true`,
        "Documento: Consultado exitosamente"
      );
      if (result == undefined) {
        document.getElementById("serieCabecera").focus();
      } else {
        let nuevoTotal = await ConvertirPrecio(result.total, result.monedaId);
        if (nuevoTotal != undefined) {
          let monto = nuevoTotal * (dataCabecera.porcentaje / 100);
          setDataCabecera({
            ...dataCabecera,
            documentoVentaId: result.id,
            numero: result.numero,
            fechaEmision: result.fechaEmision,
            total: Funciones.RedondearNumero(nuevoTotal, 2),
            monto: Funciones.RedondearNumero(monto, 2),
          });
        }
        document.getElementById("porcentaje").focus();
      }
    } else {
      if (respuesta[1] != "") {
        toast.error(respuesta[1], {
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
    }
  };
  //#endregion

  //#region Funciones Modal
  const AbrirFiltroCliente = async () => {
    setModalCliente(true);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "id",
      accessor: "detalleId",
    },
    {
      Header: "Documento de venta",
      accessor: "documentoVentaId",
    },
    {
      Header: "Tipo Documento",
      accessor: "tipoDocumento",
      Cell: ({ value }) => {
        let comprobante = "";
        switch (value) {
          case "01":
            comprobante = "FACTURA";
            break;
          case "03":
            comprobante = "BOLETA";
            break;
          case "07":
            comprobante = "NOTA DE CREDITO";
            break;
          case "08":
            comprobante = "NOTA DE DEBITO";
            break;
          case "12":
            comprobante = "TICKET O CINTA EMITIDA POR MÁQUINA";
            break;
          case "NV":
            comprobante = "NOTA DE VENTA";
            break;
          default:
            comprobante = value;
        }
        return <p>{comprobante}</p>;
      },
    },
    {
      Header: "Serie",
      accessor: "serie",
      Cell: ({ value }) => {
        return <p className="text-center">{value}</p>;
      },
    },
    {
      Header: "Número",
      accessor: "numero",
    },
    {
      Header: "Emisión",
      accessor: "fechaEmision",
      Cell: ({ value }) => {
        return (
          <p className="text-center">{moment(value).format("DD/MM/YY")}</p>
        );
      },
    },
    {
      Header: "P. Venta",
      accessor: "total",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-2.5">
            {Funciones.RedondearNumero(value, 2)}
          </p>
        );
      },
    },
    {
      Header: "% Retencion",
      accessor: "porcentaje",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-2.5">
            {Funciones.RedondearNumero(value, 2) + "%"}
          </p>
        );
      },
    },
    {
      Header: "Importe Ret.",
      accessor: "monto",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-5">
            {Funciones.RedondearNumero(value, 2)}
          </p>
        );
      },
    },

    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <div className="flex item-center justify-center">
          {modo == "Consultar" ? (
            ""
          ) : (
            <>
              <div className={G.TablaBotonModificar}>
                <button
                  id="boton"
                  onClick={() => CargarDetalle(row.values.documentoVentaId)}
                  className="p-0 px-1"
                  title="Click para modificar registro"
                >
                  <FaPen></FaPen>
                </button>
              </div>

              <div className={G.TablaBotonEliminar}>
                <button
                  id="botonEliminarFila"
                  onClick={() => {
                    EliminarDetalle(row.values.documentoVentaId);
                  }}
                  className="p-0 px-1"
                  title="Click para Eliminar registro"
                >
                  <FaTrashAlt></FaTrashAlt>
                </button>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];
  //#endregion

  //#region  Render
  return (
    <>
      <ModalCrud
        setModal={setModal}
        objeto={data}
        modo={modo}
        menu={"Venta/Retencion"}
        titulo="Retención"
        cerrar={false}
        foco={document.getElementById("tablaRetencion")}
        tamañoModal={[G.ModalFull, G.Form]}
      >
        {tipoMensaje > 0 && (
          <Mensajes
            tipoMensaje={tipoMensaje}
            mensaje={mensaje}
            Click={() => Funciones.OcultarMensajes(setTipoMensaje, setMensaje)}
          />
        )}
        {/* Cabecera */}
        <div className={G.ContenedorBasico + " mb-2 " + G.FondoContenedor}>
          <div className={G.ContenedorInputs}>
            <div className={G.InputMitad}>
              <label htmlFor="tipoDocumentoId" className={G.LabelStyle}>
                Tipo Doc.
              </label>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                onChange={HandleData}
                value={data.tipoDocumento ?? ""}
                disabled={true}
                className={G.InputStyle}
              >
                {dataTipoDocumento.map((map) => (
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
                autoFocus
                disabled={modo == "Nuevo" ? false : true}
                value={data.serie ?? ""}
                onChange={HandleData}
                onBlur={(e) => Numeracion(e)}
                className={G.InputStyle}
              />
            </div>
            <div className={G.InputMitad}>
              <label htmlFor="numero" className={G.LabelStyle}>
                Número
              </label>
              <input
                type="text"
                id="numero"
                name="numero"
                placeholder="Número"
                autoComplete="off"
                maxLength="10"
                value={data.numero ?? ""}
                onChange={HandleData}
                onBlur={(e) => Numeracion(e)}
                disabled={modo == "Nuevo" ? false : true}
                className={G.InputStyle}
              />
            </div>
            <div className={G.InputMitad}>
              <label htmlFor="fechaEmision" className={G.LabelStyle}>
                Fecha Emisión
              </label>
              <input
                type="date"
                id="fechaEmision"
                name="fechaEmision"
                autoComplete="off"
                autoFocus={modo == "Modificar"}
                disabled={modo == "Consultar"}
                value={moment(data.fechaEmision ?? "").format("yyyy-MM-DD")}
                onChange={HandleData}
                onBlur={() => {
                  FechaEmision();
                }}
                className={G.InputStyle}
              />
            </div>
          </div>

          <div className={G.ContenedorInputs}>
            <div className={G.InputMitad}>
              <label
                htmlFor="clienteNumeroDocumentoIdentidad"
                className={G.LabelStyle}
              >
                RUC/DNI:
              </label>
              <input
                type="text"
                id="clienteNumeroDocumentoIdentidad"
                name="clienteNumeroDocumentoIdentidad"
                placeholder="N° Documento Identidad"
                autoComplete="off"
                disabled={true}
                value={data.clienteNumeroDocumentoIdentidad ?? ""}
                onChange={HandleData}
                className={G.InputStyle}
              />
            </div>
            <div className={G.InputFull}>
              <label htmlFor="clienteNombre" className={G.LabelStyle}>
                Cliente
              </label>
              <input
                type="text"
                id="clienteNombre"
                name="clienteNombre"
                placeholder="Buscar Cliente"
                autoComplete="off"
                disabled={true}
                value={data.clienteNombre ?? ""}
                onChange={HandleData}
                className={G.InputBoton}
              />
              <button
                id="consultarCliente"
                className={G.BotonBuscar + G.BotonPrimary + " !rounded-none"}
                hidden={modo == "Consultar"}
                disabled={checkVarios}
                onKeyDown={(e) => Funciones.KeyClick(e)}
                onClick={() => AbrirFiltroCliente()}
              >
                <FaSearch />
              </button>
              <div className={G.Input + " w-20"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <Checkbox
                    inputId="varios"
                    name="varios"
                    disabled={modo == "Consultar"}
                    onChange={(e) => {
                      setCheckVarios(e.checked);
                      ClientesVarios(e);
                    }}
                    checked={checkVarios}
                  />
                </div>
                <label htmlFor="varios" className={G.LabelCheckStyle}>
                  Varios
                </label>
              </div>
            </div>
          </div>

          <div className={G.InputFull}>
            <label htmlFor="clienteDireccion" className={G.LabelStyle}>
              Dirección
            </label>
            <input
              type="text"
              id="clienteDireccion"
              name="clienteDireccion"
              placeholder="Dirección"
              autoComplete="off"
              disabled={modo == "Consultar"}
              value={data.clienteDireccion ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>

          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <label htmlFor="tipoVentaId" className={G.LabelStyle}>
                Tipo Venta
              </label>
              <select
                id="tipoVentaId"
                name="tipoVentaId"
                value={data.tipoVentaId ?? ""}
                onChange={HandleData}
                disabled={modo == "Consultar"}
                className={G.InputStyle}
              >
                {dataTipoVenta.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <div className={G.InputFull}>
              <label htmlFor="tipoCobroId" className={G.LabelStyle}>
                Tipo De Pago
              </label>
              <select
                id="tipoCobroId"
                name="tipoCobroId"
                value={data.tipoCobroId ?? ""}
                onChange={HandleData}
                disabled={modo == "Consultar"}
                className={G.InputStyle}
              >
                {dataTipoCobro.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.descripcion}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <label htmlFor="monedaId" className={G.LabelStyle}>
                Moneda
              </label>
              <select
                id="monedaId"
                name="monedaId"
                value={data.monedaId ?? ""}
                onChange={HandleData}
                disabled={modo == "Consultar"}
                className={G.InputStyle}
              >
                {dataMoneda.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <div className={G.InputFull}>
              <label htmlFor="tipoCambio" className={G.LabelStyle}>
                Tipo Cambio
              </label>
              <input
                type="number"
                id="tipoCambio"
                name="tipoCambio"
                placeholder="Tipo de Cambio"
                autoComplete="off"
                min={0}
                disabled={modo == "Consultar"}
                value={data.tipoCambio ?? ""}
                onChange={HandleData}
                className={modo != "Consultar" ? G.InputBoton : G.InputStyle}
              />
              <button
                id="consultarTipoCambio"
                className={G.BotonBuscar + G.Anidado + G.BotonPrimary}
                hidden={modo == "Consultar"}
                onKeyDown={(e) => Funciones.KeyClick(e)}
                onClick={() => {
                  TipoCambio(data.fechaEmision);
                }}
              >
                <FaUndoAlt></FaUndoAlt>
              </button>
            </div>
          </div>

          <div className={G.InputFull}>
            <label htmlFor="observacion" className={G.LabelStyle}>
              Observación
            </label>
            <input
              type="text"
              id="observacion"
              name="observacion"
              placeholder="Observación"
              autoComplete="off"
              disabled={modo == "Consultar"}
              value={data.observacion ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
        </div>
        {/* Cabecera */}

        {/* Detalles */}
        {modo != "Consultar" && (
          <div className={G.ContenedorBasico + G.FondoContenedor + " mb-2"}>
            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label htmlFor="tipoDocumento" className={G.LabelStyle}>
                  Tipo Doc.
                </label>
                <select
                  id="tipoDocumento"
                  name="tipoDocumento"
                  onChange={HandleDataCabecera}
                  disabled={habilitarCampos ? false : true}
                  value={dataCabecera.tipoDocumento ?? ""}
                  className={G.InputStyle}
                >
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
                  id="serieCabecera"
                  name="serie"
                  placeholder="Serie"
                  autoComplete="off"
                  maxLength={4}
                  disabled={
                    !habilitarCampos || modo == "Consultar" ? true : false
                  }
                  value={dataCabecera.serie ?? ""}
                  onChange={HandleDataCabecera}
                  className={habilitarCampos ? G.InputStyle : G.InputStyle}
                />
              </div>
              <div className={G.InputMitad}>
                <label htmlFor="numero" className={G.LabelStyle}>
                  Número
                </label>
                <input
                  type="number"
                  id="numero"
                  name="numero"
                  placeholder="Número"
                  autoComplete="off"
                  maxLength={10}
                  min={0}
                  disabled={
                    !habilitarCampos || modo == "Consultar" ? true : false
                  }
                  value={dataCabecera.numero ?? ""}
                  onChange={HandleDataCabecera}
                  className={habilitarCampos ? G.InputBoton : G.InputBoton}
                />
                <button
                  id="consultarDocumentoCabecera"
                  className={G.BotonBuscar + G.BotonPrimary}
                  hidden={modo == "Consultar"}
                  onKeyDown={(e) => Funciones.KeyClick(e)}
                  onClick={async () => await ConsultarDocumento()}
                >
                  <FaSearch></FaSearch>
                </button>
              </div>
            </div>
            <div className={G.ContenedorInputs}>
              <div className={G.InputTercio}>
                <label htmlFor="fechaEmision" className={G.LabelStyle}>
                  Emisión
                </label>
                <input
                  type="date"
                  id="fechaEmision"
                  name="fechaEmision"
                  autoComplete="off"
                  disabled={true}
                  value={moment(dataCabecera.fechaEmision ?? "").format(
                    "yyyy-MM-DD"
                  )}
                  onChange={HandleDataCabecera}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputMitad}>
                <label htmlFor="total" className={G.LabelStyle}>
                  Total Vta.
                </label>
                <input
                  type="text"
                  id="total"
                  name="total"
                  placeholder="Total Venta"
                  autoComplete="off"
                  disabled={true}
                  value={dataCabecera.total ?? ""}
                  onChange={HandleDataCabecera}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputTercio}>
                <label htmlFor="porcentaje" className={G.LabelStyle}>
                  % Reten.
                </label>
                <input
                  type="number"
                  id="porcentaje"
                  name="porcentaje"
                  placeholder={"% Retención"}
                  autoComplete="off"
                  min={0}
                  disabled={modo == "Consultar"}
                  value={dataCabecera.porcentaje ?? ""}
                  onChange={HandleDataCabecera}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputMitad}>
                <label htmlFor="monto" className={G.LabelStyle}>
                  Retención
                </label>
                <input
                  type="number"
                  id="monto"
                  name="monto"
                  placeholder="Retención"
                  autoComplete="off"
                  min={0}
                  disabled={true}
                  value={dataCabecera.monto ?? ""}
                  onChange={HandleDataCabecera}
                  className={modo != "Consultar" ? G.InputBoton : G.InputStyle}
                />
                <button
                  id="enviarDetalle"
                  className={G.BotonBuscar + G.BotonPrimary}
                  hidden={modo == "Consultar"}
                  onKeyDown={(e) => Funciones.KeyClick(e)}
                  onClick={() => AgregarDetalle()}
                >
                  <FaPlus></FaPlus>
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Detalles */}

        {/* Tabla Detalle */}
        <DivTabla>
          <TableBasic
            columnas={columnas}
            datos={dataDetalle}
            estilos={["", "", "", "border ", "", "border border-b-0", "border"]}
            DobleClick={(e) => CargarDetalle(e, true)}
          />
        </DivTabla>
        {/* Tabla Detalle */}

        {/*Tabla Footer*/}
        <div className={G.ContenedorFooter}>
          <div className="flex">
            <div className={G.FilaFooter + G.FilaVacia}></div>
            <div className={G.FilaFooter + G.FilaPrecio}>
              <p className={G.FilaContenido}>Total</p>
            </div>
            <div className={G.FilaFooter + G.FilaImporte}>
              <p className={G.FilaContenido}>{data.total ?? "0.00"}</p>
            </div>
            <div className={G.FilaFooter + G.UltimaFila}></div>
          </div>
        </div>
        {/*Tabla Footer*/}
      </ModalCrud>
      {modalCliente && (
        <FiltroCliente
          setModal={setModalCliente}
          setObjeto={setDataCliente}
          foco={document.getElementById("clienteDireccion")}
        />
      )}
    </>
  );
  //#endregion
};

export default Modal;
