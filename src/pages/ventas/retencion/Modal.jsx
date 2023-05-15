import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import FiltroCliente from "../../../components/filtros/FiltroCliente";
import Mensajes from "../../../components/Mensajes";
import TableBasic from "../../../components/tablas/TableBasic";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Checkbox } from "primereact/checkbox";
import moment from "moment";
import { FaPlus, FaSearch, FaUndoAlt, FaPen, FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";
import * as Funciones from "../../../components/Funciones";

//#region Estilos
const TablaStyle = styled.div`
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
  & th:nth-child(8),
  & th:nth-child(9) {
    width: 130px;
    min-width: 130px;
    max-width: 130px;
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

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  //Data General
  const [data, setData] = useState(objeto);
  const [dataDetalle, setDataDetalle] = useState([]);
  const [dataGlobal] = useState(store.session.get("global"));
  //Data General
  //Tablas
  const [dataTipoDocumento, setDataTipoDocumento] = useState([]);
  const [dataTipoDoc, setDataTipoDoc] = useState([]);
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataTipoVenta, setDataTipoVenta] = useState([]);
  const [dataTipoCobro, setDataTipoCobro] = useState([]);
  //Tablas
  //Data Modales Ayuda
  const [dataCliente, setDataCliente] = useState([]);
  const [dataArt, setDataArt] = useState({
    tipoDocumento: "01",
    porcentaje: 3,
    abonado: true,
  });
  //Data Modales Ayuda

  //Modales de Ayuda
  const [modalCliente, setModalCliente] = useState(false);
  //Modales de Ayuda

  const [checkVarios, setCheckVarios] = useState(false);
  const [habilitarCampos, setDataHabilitarCampos] = useState(true);
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
      ActualizarImportesTotales();
      setRefrescar(false);
    }
  }, [refrescar]);
  useEffect(() => {
    if (modo == "Registrar") {
      GetPorIdTipoCambio(data.fechaEmision);
    } else {
      SepararDetalle(data.detalles);
    }
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
  //Data General
  const ValidarData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  const ClientesVarios = async ({ target }) => {
    if (target.checked) {
      setDataCliente((prevState) => ({
        ...prevState,
        clienteId: dataGlobal.cliente.id,
        clienteNumeroDocumentoIdentidad:
          dataGlobal.cliente.numeroDocumentoIdentidad,
        clienteNombre: dataGlobal.cliente.nombre,
        clienteDireccion: dataGlobal.cliente.direccionPrincipal,
        tipoVentaId: dataGlobal.cliente.tipoVentaId,
        tipoCobroId: dataGlobal.cliente.tipoCobroId,
      }));
    } else {
      setDataCliente((prevState) => ({
        ...prevState,
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
      setData((prevState) => ({
        ...prevState,
        numero: num,
      }));
    }
    if (e.target.name == "serie") {
      let num = e.target.value;
      if (num.length < 4) {
        num = ("0000000000" + num).slice(-4);
      }
      setData((prevState) => ({
        ...prevState,
        serie: num,
      }));
    }
  };
  const OcultarMensajes = async () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  //Data General

  //Artículos
  const ValidarDataArt = async ({ target }) => {
    setDataArt((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));

    if (target.name == "porcentaje" && target.value > 0) {
      if (dataArt.total != undefined) {
        await CalcularImporte(target.value);
      }
    }
  };
  const ValidarConsulta = async (origen) => {
    if (origen == "ConsultarDocumento") {
      if (dataArt.serie == undefined || dataArt.numero == undefined) {
        return [false, "La serie y número del documento son requeridos."];
      }
      if (dataArt.serie.length < 4) {
        return [false, "Formato de Serie incorrecto"];
      }
    } else {
      if (data.tipoCambio == 0) {
        return [
          false,
          "No es posible hacer la conversión si el tipo de cambio es cero (0.00)",
        ];
      }
    }
    return [true, ""];
  };
  const ConvertirPrecio = async (total, moneda) => {
    if (Object.entries(dataArt).length > 0) {
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
    let monto = dataArt.total * (porcentaje / 100);
    setDataArt((prevState) => ({
      ...prevState,
      monto: Funciones.RedondearNumero(monto, 2),
    }));
  };
  //Artículos
  //#endregion

  //#region Funciones Detalles
  const ValidarDetalle = async () => {
    if (Object.entries(dataArt).length == 0) {
      return [false, "Seleccione un documento"];
    }

    //valida total de venta
    if (dataArt.total == undefined) {
      return [false, "Seleccione un documento"];
    }
    return [true, ""];
  };
  const AgregarDetalleArticulo = async () => {
    //Obtiene resultado de Validación
    let resultado = await ValidarDetalle();

    if (resultado[0]) {
      //Si tiene detalleId entonces modifica registro
      if (dataArt.detalleId != undefined) {
        let dataDetalleMod = dataDetalle.map((map) => {
          if (map.documentoVentaId == dataArt.documentoVentaId) {
            return {
              detalleId: dataArt.detalleId,
              documentoVentaId: dataArt.documentoVentaId,
              tipoDocumento: dataArt.tipoDocumento,
              serie: dataArt.serie,
              numero: dataArt.numero,
              fechaEmision: dataArt.fechaEmision,
              porcentaje: dataArt.porcentaje,
              total: dataArt.total,
              monto: dataArt.monto,
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
          return map.documentoVentaId == dataArt.documentoVentaId;
        });
        if (model == undefined) {
          setDataDetalle((prevState) => [
            ...prevState,
            {
              detalleId: detalleId,
              documentoVentaId: dataArt.documentoVentaId,
              tipoDocumento: dataArt.tipoDocumento,
              serie: dataArt.serie,
              numero: dataArt.numero,
              fechaEmision: dataArt.fechaEmision,
              porcentaje: dataArt.porcentaje,
              total: dataArt.total,
              monto: dataArt.monto,
              abonar: true,
            },
          ]);
          setDetalleId(detalleId + 1);
          setDataHabilitarCampos(true);
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
            background: "#1a1a2e",
            confirmButtonColor: "#eea508",
            confirmButtonText: "Aceptar",
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
      setDataArt({
        tipoDocumento: "01",
        abonar: true,
        porcentaje: 3,
      });
      setDataHabilitarCampos(true);
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
  const CargarDetalle = async (id) => {
    setDataHabilitarCampos(false);
    setDataArt(dataDetalle.find((map) => map.documentoVentaId === id));
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
  const ActualizarImportesTotales = async () => {
    //Suma los importes de los detalles
    let importeTotal = dataDetalle.reduce((i, map) => {
      return i + map.monto;
    }, 0);

    setData((prevState) => ({
      ...prevState,
      total: Funciones.RedondearNumero(importeTotal, 2),
    }));
  };
  //Calculos
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(`api/Venta/Retencion/FormularioTablas`);
    setDataTipoDocumento([{ id: "RE", descripcion: "Retención" }]);
    setDataTipoVenta(result.data.data.tiposVenta);
    setDataTipoCobro(result.data.data.tiposCobro);
    setDataMoneda(result.data.data.monedas);
    setDataTipoDoc(result.data.data.tiposDocumento);
  };
  const GetPorIdTipoCambio = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/TipoCambio/${id}`);
    if (result.name == "AxiosError") {
      if (Object.entries(result.response.data).length > 0) {
        setTipoMensaje(result.response.data.messages[0].tipo);
        setMensaje(result.response.data.messages[0].textos);
      } else {
        setTipoMensaje(1);
        setMensaje([result.message]);
      }
      setData({
        ...data,
        tipoCambio: 0,
      });
    } else {
      setData({
        ...data,
        tipoCambio: result.data.data.precioCompra,
      });
      toast.info(
        "El tipo de cambio del día " +
          moment(data.fechaEmision).format("DD/MM/YYYY") +
          " es: " +
          result.data.data.precioCompra,
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          toastId: "toastTipoCambio",
        }
      );
      OcultarMensajes();
    }
  };
  const ConsultarDocumento = async () => {
    let respuesta = await ValidarConsulta("ConsultarDocumento");
    if (respuesta[0]) {
      const result = await ApiMasy.get(
        `api/Venta/DocumentoVenta/GetPorTipoDocumentoSerieNumero?tipoDocumentoId=${dataArt.tipoDocumento}&serie=${dataArt.serie}&numero=${dataArt.numero}&incluirReferencias=true`
      );
      if (result.name == "AxiosError") {
        toast.error(String(result.data.data.messages[0].textos), {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        let nuevoTotal = await ConvertirPrecio(
          result.data.data.total,
          result.data.data.monedaId
        );
        if (nuevoTotal != undefined) {
          let monto = nuevoTotal * (dataArt.porcentaje / 100);
          setDataArt({
            ...dataArt,
            documentoVentaId: result.data.data.id,
            numero: result.data.data.numero,
            fechaEmision: result.data.data.fechaEmision,
            total: Funciones.RedondearNumero(nuevoTotal, 2),
            monto: Funciones.RedondearNumero(monto, 2),
          });
        }
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
              <div className={Global.TablaBotonModificar}>
                <button
                  id="boton-modificar"
                  onClick={() => CargarDetalle(row.values.documentoVentaId)}
                  className="p-0 px-1"
                  title="Click para modificar registro"
                >
                  <FaPen></FaPen>
                </button>
              </div>

              <div className={Global.TablaBotonEliminar}>
                <button
                  id="boton-eliminar"
                  onClick={() => {
                    EliminarDetalle(row.values.documentoVentaId);
                  }}
                  className="p-0 px-1"
                  title="Click para eliminar registro"
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
        menu={["Venta", "Retencion"]}
        titulo="Retención"
        tamañoModal={[Global.ModalFull, Global.Form + " px-10 "]}
        cerrar={false}
      >
        {tipoMensaje > 0 && (
          <Mensajes
            tipoMensaje={tipoMensaje}
            mensaje={mensaje}
            Click={() => OcultarMensajes()}
          />
        )}
        {/* Cabecera */}
        <div
          className={
            Global.ContenedorBasico + " mb-2 " + Global.FondoContenedor
          }
        >
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputMitad}>
              <label htmlFor="tipoDocumentoId" className={Global.LabelStyle}>
                Tipo Doc.
              </label>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                onChange={ValidarData}
                value={data.tipoDocumento ?? ""}
                disabled={true}
                className={Global.InputStyle + Global.Disabled}
              >
                {dataTipoDocumento.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <div className={Global.InputTercio}>
              <label htmlFor="serie" className={Global.LabelStyle}>
                Serie
              </label>
              <input
                type="text"
                id="serie"
                name="serie"
                placeholder="Serie"
                maxLength="4"
                autoComplete="off"
                readOnly={modo == "Consultar" ? true : false}
                value={data.serie ?? ""}
                onChange={ValidarData}
                onBlur={(e) => Numeracion(e)}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.InputMitad}>
              <label htmlFor="numero" className={Global.LabelStyle}>
                Número
              </label>
              <input
                type="text"
                id="numero"
                name="numero"
                placeholder="Número"
                maxLength="10"
                value={data.numero ?? ""}
                onChange={ValidarData}
                onBlur={(e) => Numeracion(e)}
                autoComplete="off"
                readOnly={modo == "Consultar" ? true : false}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.InputMitad}>
              <label htmlFor="fechaEmision" className={Global.LabelStyle}>
                F. Emisión
              </label>
              <input
                type="date"
                id="fechaEmision"
                name="fechaEmision"
                autoComplete="off"
                readOnly={modo == "Consultar" ? true : false}
                value={moment(data.fechaEmision ?? "").format("yyyy-MM-DD")}
                onChange={ValidarData}
                onBlur={() => {
                  FechaEmision();
                }}
                className={Global.InputStyle}
              />
            </div>
          </div>

          <div className={Global.ContenedorInputs}>
            <div className={Global.InputMitad}>
              <label
                htmlFor="clienteNumeroDocumentoIdentidad"
                className={Global.LabelStyle}
              >
                RUC/DNI:
              </label>
              <input
                type="text"
                id="clienteNumeroDocumentoIdentidad"
                name="clienteNumeroDocumentoIdentidad"
                placeholder="N° Documento Identidad"
                autoComplete="off"
                readOnly={true}
                value={data.clienteNumeroDocumentoIdentidad ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle + Global.Disabled}
              />
            </div>
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
                readOnly={true}
                value={data.clienteNombre ?? ""}
                onChange={ValidarData}
                className={Global.InputBoton + Global.Disabled}
              />
              <button
                id="consultar"
                className={
                  Global.BotonBuscar + Global.BotonPrimary + " !rounded-none"
                }
                hidden={modo == "Consultar" ? true : false}
                disabled={checkVarios ? true : false}
                onClick={() => AbrirFiltroCliente()}
              >
                <FaSearch />
              </button>
              <div className={Global.Input + " w-20"}>
                <div className={Global.CheckStyle + Global.Anidado}>
                  <Checkbox
                    inputId="varios"
                    name="varios"
                    readOnly={modo == "Consultar" ? true : false}
                    onChange={(e) => {
                      setCheckVarios(e.checked);
                      ClientesVarios(e);
                    }}
                    checked={checkVarios ? true : ""}
                  />
                </div>
                <label htmlFor="varios" className={Global.LabelCheckStyle}>
                  Varios
                </label>
              </div>
            </div>
          </div>

          <div className={Global.InputFull}>
            <label htmlFor="clienteDireccion" className={Global.LabelStyle}>
              Dirección
            </label>
            <input
              type="text"
              id="clienteDireccion"
              name="clienteDireccion"
              placeholder="Dirección"
              autoComplete="off"
              readOnly={modo == "Consultar" ? true : false}
              value={data.clienteDireccion ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>

          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <label htmlFor="tipoVentaId" className={Global.LabelStyle}>
                Tipo Venta
              </label>
              <select
                id="tipoVentaId"
                name="tipoVentaId"
                value={data.tipoVentaId ?? ""}
                onChange={ValidarData}
                disabled={modo == "Consultar" ? true : false}
                className={Global.InputStyle}
              >
                {dataTipoVenta.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <div className={Global.InputFull}>
              <label htmlFor="tipoCobroId" className={Global.LabelStyle}>
                Tipo De Pago
              </label>
              <select
                id="tipoCobroId"
                name="tipoCobroId"
                value={data.tipoCobroId ?? ""}
                onChange={ValidarData}
                disabled={modo == "Consultar" ? true : false}
                className={Global.InputStyle}
              >
                {dataTipoCobro.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.descripcion}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <label htmlFor="monedaId" className={Global.LabelStyle}>
                Moneda
              </label>
              <select
                id="monedaId"
                name="monedaId"
                value={data.monedaId ?? ""}
                onChange={ValidarData}
                disabled={modo == "Consultar" ? true : false}
                className={Global.InputStyle}
              >
                {dataMoneda.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <div className={Global.InputFull}>
              <label htmlFor="tipoCambio" className={Global.LabelStyle}>
                T. Cambio
              </label>
              <input
                type="number"
                id="tipoCambio"
                name="tipoCambio"
                maxLength="8"
                placeholder="Tipo de Cambio"
                autoComplete="off"
                readOnly={modo == "Consultar" ? true : false}
                value={data.tipoCambio ?? ""}
                onChange={ValidarData}
                className={Global.InputBoton}
              />
              <button
                id="consultarTipoCambio"
                className={
                  Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                }
                hidden={modo == "Consultar" ? true : false}
                onClick={() => {
                  GetPorIdTipoCambio(data.fechaEmision);
                }}
              >
                <FaUndoAlt></FaUndoAlt>
              </button>
            </div>
          </div>

          <div className={Global.InputFull}>
            <label htmlFor="observacion" className={Global.LabelStyle}>
              Observación
            </label>
            <input
              type="text"
              id="observacion"
              name="observacion"
              placeholder="Observación"
              autoComplete="off"
              readOnly={modo == "Consultar" ? true : false}
              value={data.observacion ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
        {/* Cabecera */}

        {/* Detalles */}
        <div
          className={Global.ContenedorBasico + Global.FondoContenedor + " mb-2"}
        >
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <label htmlFor="tipoDocumento" className={Global.LabelStyle}>
                Tipo Doc.
              </label>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                onChange={ValidarDataArt}
                disabled={habilitarCampos ? false : true}
                value={dataArt.tipoDocumento ?? ""}
                className={
                  modo == "Registrar"
                    ? Global.InputStyle
                    : Global.InputStyle + Global.Disabled
                }
              >
                {dataTipoDoc.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <div className={Global.InputTercio}>
              <label htmlFor="serie" className={Global.LabelStyle}>
                Serie
              </label>
              <input
                type="text"
                id="serie"
                name="serie"
                placeholder="Serie"
                maxLength={4}
                autoComplete="off"
                readOnly={modo == "Consultar" ? true : false}
                disabled={habilitarCampos ? false : true}
                value={dataArt.serie ?? ""}
                onChange={ValidarDataArt}
                className={
                  habilitarCampos
                    ? Global.InputStyle
                    : Global.InputStyle + Global.Disabled
                }
              />
            </div>
            <div className={Global.InputMitad}>
              <label htmlFor="numero" className={Global.LabelStyle}>
                Número
              </label>
              <input
                type="number"
                id="numero"
                name="numero"
                placeholder="Número"
                maxLength={10}
                autoComplete="off"
                readOnly={modo == "Consultar" ? true : false}
                disabled={habilitarCampos ? false : true}
                value={dataArt.numero ?? ""}
                onChange={ValidarDataArt}
                className={
                  habilitarCampos
                    ? Global.InputBoton
                    : Global.InputBoton + Global.Disabled
                }
              />
              <button
                id="consultar"
                className={Global.BotonBuscar + Global.BotonPrimary}
                hidden={modo == "Consultar" ? true : false}
                onClick={async () => await ConsultarDocumento()}
              >
                <FaSearch></FaSearch>
              </button>
            </div>
          </div>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputTercio}>
              <label htmlFor="fechaEmision" className={Global.LabelStyle}>
                Emisión
              </label>
              <input
                type="date"
                id="fechaEmision"
                name="fechaEmision"
                autoComplete="off"
                readOnly={true}
                value={moment(dataArt.fechaEmision ?? "").format("yyyy-MM-DD")}
                onChange={ValidarDataArt}
                className={Global.InputStyle + Global.Disabled}
              />
            </div>
            <div className={Global.InputMitad}>
              <label htmlFor="total" className={Global.LabelStyle}>
                Total Vta.
              </label>
              <input
                type="text"
                id="total"
                name="total"
                placeholder="Total Venta"
                autoComplete="off"
                readOnly={true}
                value={dataArt.total ?? ""}
                onChange={ValidarDataArt}
                className={Global.InputStyle + Global.Disabled}
              />
            </div>
            <div className={Global.InputTercio}>
              <label htmlFor="porcentaje" className={Global.LabelStyle}>
                % Reten.
              </label>
              <input
                type="number"
                id="porcentaje"
                name="porcentaje"
                placeholder={"% Retención"}
                autoComplete="off"
                readOnly={modo == "Consultar" ? true : false}
                value={dataArt.porcentaje ?? ""}
                onChange={ValidarDataArt}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.InputMitad}>
              <label htmlFor="monto" className={Global.LabelStyle}>
                Retención
              </label>
              <input
                type="number"
                id="monto"
                name="monto"
                placeholder="Retención"
                autoComplete="off"
                readOnly={true}
                value={dataArt.monto ?? ""}
                onChange={ValidarDataArt}
                className={Global.InputBoton + Global.Disabled}
              />
              <button
                id="enviarDetalle"
                className={Global.BotonBuscar + Global.BotonPrimary}
                hidden={modo == "Consultar" ? true : false}
                onClick={() => AgregarDetalleArticulo()}
              >
                <FaPlus></FaPlus>
              </button>
            </div>
          </div>
        </div>
        {/* Detalles */}

        {/* Tabla Detalle */}
        <TablaStyle>
          <TableBasic
            columnas={columnas}
            datos={dataDetalle}
            estilos={["", "", "", "border ", "", "border border-b-0", "border"]}
          />
        </TablaStyle>
        {/* Tabla Detalle */}

        {/*Tabla Footer*/}
        <div className={Global.ContenedorFooter}>
          <div className="flex">
            <div className={Global.FilaVacia}></div>
            <div className={Global.FilaPrecio}>
              <p className={Global.FilaContenido}>Total</p>
            </div>
            <div className={Global.FilaImporte}>
              <p className={Global.FilaContenido}>{data.total ?? "0.00"}</p>
            </div>
            <div className={Global.UltimaFila}></div>
          </div>
        </div>
        {/*Tabla Footer*/}
      </ModalCrud>
      {modalCliente && (
        <FiltroCliente setModal={setModalCliente} setObjeto={setDataCliente} />
      )}
    </>
  );
  //#endregion
};

export default Modal;