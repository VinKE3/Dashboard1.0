import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import FiltroCliente from "../../../components/filtro/FiltroCliente";
import FiltroArticulo from "../../../components/filtro/FiltroArticulo";
import Mensajes from "../../../components/funciones/Mensajes";
import TableBasic from "../../../components/tabla/TableBasic";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import moment from "moment";
import {
  FaPlus,
  FaSearch,
  FaUndoAlt,
  FaPen,
  FaTrashAlt,
  FaPaste,
} from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import * as Global from "../../../components/Global";
import * as Funciones from "../../../components/funciones/Validaciones";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    width: 40px;
    text-align: center;
  }
  & th:nth-child(4),
  & th:nth-child(5) {
    width: 90px;
    text-align: center;
  }

  & th:nth-child(6),
  & th:nth-child(7) {
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
  const [dataDetalle, setDataDetalle] = useState(objeto.detalles);
  const [dataGlobal] = useState(store.session.get("global"));
  //Data General
  //Tablas
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataVendedor, setDataVendedor] = useState([]);
  //Tablas
  //Data Modales Ayuda
  const [dataCliente, setDataCliente] = useState([]);
  const [dataCabecera, setDataCabecera] = useState([]);
  //Data Modales Ayuda
  //Modales de Ayuda
  const [modalCliente, setModalCliente] = useState(false);
  const [modalArt, setModalArt] = useState(false);
  //Modales de Ayuda

  const [checkVarios, setCheckVarios] = useState(false);
  const [checkFiltro, setCheckFiltro] = useState("productos");
  const [habilitarFiltro, setHabilitarFiltro] = useState(false);
  const [detalleId, setDetalleId] = useState(dataDetalle.length + 1);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (Object.keys(dataCliente).length > 0) {
      Cliente();
    }
  }, [dataCliente]);

  useEffect(() => {
    setData({ ...data, detalles: dataDetalle });
  }, [dataDetalle]);

  useEffect(() => {
    if (Object.entries(dataCabecera).length > 0) {
      CalcularImporte();
    }
  }, [dataCabecera.precioUnitario]);

  useEffect(() => {
    if (!modalArt) {
      ConvertirPrecio();
    }
  }, [modalArt]);

  useEffect(() => {
    if (refrescar) {
      ActualizarTotales();
      setRefrescar(false);
    }
  }, [refrescar]);

  useEffect(() => {
    if (modo == "Nuevo") {
      GetPorIdTipoCambio(data.fechaInicio);
    }
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
  //?Data General
  const ValidarData = async ({ target }) => {
    if (
      target.name == "incluyeIGV" ||
      target.name == "afectarStock" ||
      target.name == "abonar"
    ) {
      if (target.name == "incluyeIGV") {
        setRefrescar(true);
      }
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
    if (target.name == "lugarEntrega") {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value,
      }));
    }
    if (target.name == "tipoDocumentoId") {
      if (target.value == "03") {
        setData((prevState) => ({
          ...prevState,
          incluyeIGV: true,
        }));
        return;
      }
      if (target.value != "03") {
        setData((prevState) => ({
          ...prevState,
          incluyeIGV: false,
        }));
      }
      if (target.value != "07" || target.value != "08") {
        setData((prevState) => ({
          ...prevState,
          documentoReferenciaId: "",
          motivoNotaId: "",
          motivoSustento: "",
        }));
      }
    }
    if (
      target.name == "porcentajeIGV" ||
      target.name == "porcentajeRetencion" ||
      target.name == "porcentajePercepcion"
    ) {
      setRefrescar(true);
    }
  };
  const ClientesVarios = async ({ target }) => {
    if (target.checked) {
      setDataCliente((prevState) => ({
        ...prevState,
        clienteId: dataGlobal.cliente.id,
        clienteNumeroDocumentoIdentidad:
          dataGlobal.cliente.numeroDocumentoIdentidad,
        clienteNombre: dataGlobal.cliente.nombre,
      }));
    } else {
      setDataCliente((prevState) => ({
        ...prevState,
        clienteId: "",
        clienteNumeroDocumentoIdentidad: "",
        clienteNombre: "",
      }));
    }
  };
  const Cliente = async () => {
    setData({
      ...data,
      clienteId: dataCliente.clienteId,
      clienteNumeroDocumentoIdentidad:
        dataCliente.clienteNumeroDocumentoIdentidad,
      clienteNombre: dataCliente.clienteNombre,
    });
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

  //?Artículos
  const ValidarDataArt = async ({ target }) => {
    setDataCabecera((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  const ConvertirPrecio = async () => {
    if (Object.entries(dataCabecera).length > 0) {
      if (
        data.monedaId != dataCabecera.monedaId &&
        dataCabecera.Id != "000000"
      ) {
        const model = await Funciones.ConvertirPreciosAMoneda(
          "compra",
          dataCabecera,
          data.monedaId,
          data.tipoCambio
        );
        if (model != null) {
          setDataCabecera({
            ...dataCabecera,
            precioCompra: model.precioCompra,
            precioVenta1: model.precioVenta1,
            precioVenta2: model.precioVenta2,
            precioVenta3: model.precioVenta3,
            precioVenta4: model.precioVenta4,
            precioUnitario: model.precioCompra,
          });
        }
      } else {
        setDataCabecera({
          ...dataCabecera,
          precioUnitario: dataCabecera.precioCompra,
        });
      }
    }
  };
  const CalcularImporte = async (name = "precioUnitario") => {
    let cantidad = document.getElementById("cantidad").value;
    let precio = document.getElementById("precioUnitario").value;
    let importe = document.getElementById("importe").value;
    let foco = name;

    if (foco == "cantidad" || foco == "precioUnitario") {
      if (!isNaN(cantidad) && !isNaN(precio)) {
        importe = Funciones.RedondearNumero(cantidad * precio, 2);
      }
    } else {
      if (!isNaN(precio)) {
        precio =
          cantidad != 0 ? Funciones.RedondearNumero(importe / cantidad, 4) : 0;
      }
    }
    if (!isNaN(precio)) {
      let subTotal = Funciones.RedondearNumero(importe / 1.18, 2);
      let montoIGV = Funciones.RedondearNumero(importe - subTotal, 2);
      setDataCabecera({
        ...dataCabecera,
        cantidad: cantidad,
        precioUnitario: precio,
        importe: importe,
        subTotal: subTotal,
        montoIGV: montoIGV,
      });
    }
  };
  //#endregion

  //#region Funciones Detalles
  const ValidarDetalle = async () => {
    if (Object.entries(dataCabecera).length == 0) {
      return [false, "Seleccione un Producto"];
    }
    //Valida Descripción
    if (dataCabecera.descripcion == undefined) {
      return [false, "La descripción no puede estar vacía"];
    }
    if (data.gastosIndirectos == 0) {
      document.getElementById("gastosIndirectos").focus();
      return [false, "Se tiene que seleccionar un gasto indirecto"];
    }
    if (data.cantidadSolicitada == 0) {
      document.getElementById("cantidadSolicitada").focus();
      return [false, "Se tiene que seleccionar una cantidad solicitada"];
    }
    if (data.cantidadProducida == 0) {
      document.getElementById("cantidadProducida").focus();
      return [false, "Se tiene que seleccionar una cantidad producida "];
    }
    //Valida montos
    if (Funciones.IsNumeroValido(dataCabecera.cantidad, false) != "") {
      document.getElementById("cantidad").focus();
      return [
        false,
        "Cantidad: " + Funciones.IsNumeroValido(dataCabecera.cantidad, false),
      ];
    }
    if (Funciones.IsNumeroValido(dataCabecera.precioUnitario, false) != "") {
      document.getElementById("precioUnitario").focus();
      return [
        false,
        "Precio Unitario: " +
          Funciones.IsNumeroValido(dataCabecera.precioUnitario, false),
      ];
    }
    if (Funciones.IsNumeroValido(dataCabecera.importe, false) != "") {
      document.getElementById("importe").focus();
      return [
        false,
        "Importe: " + Funciones.IsNumeroValido(dataCabecera.importe, false),
      ];
    }
    //Valida montos

    return [true, ""];
  };
  const AgregarDetalle = async () => {
    //Obtiene resultado de Validación
    let resultado = await ValidarDetalle();

    if (resultado[0]) {
      //Si tiene detalleId entonces modifica registro
      if (dataCabecera.detalleId != undefined) {
        let dataDetalleMod = dataDetalle.map((map) => {
          if (map.id == dataCabecera.id) {
            return {
              detalleId: dataCabecera.detalleId,
              id: dataCabecera.id,
              lineaId: dataCabecera.lineaId,
              subLineaId: dataCabecera.subLineaId,
              articuloId: dataCabecera.articuloId,
              marcaId: dataCabecera.marcaId,
              codigoBarras: dataCabecera.codigoBarras,
              descripcion: dataCabecera.descripcion,
              stock: dataCabecera.stock,
              unidadMedidaDescripcion: dataCabecera.unidadMedidaDescripcion,
              unidadMedidaId: dataCabecera.unidadMedidaId,
              cantidad: dataCabecera.cantidad,
              precioUnitario: dataCabecera.precioUnitario,
              montoIGV: dataCabecera.montoIGV,
              subTotal: dataCabecera.subTotal,
              importe: dataCabecera.importe,
            };
          } else {
            return map;
          }
        });
        setDataDetalle(dataDetalleMod);
        setRefrescar(true);
      } else {
        let model = [];
        //Valida Artículos Varios
        if (dataCabecera.id == "00000000") {
          //Valida por id y descripción de artículo
          model = dataDetalle.find((map) => {
            return (
              map.id == dataCabecera.id &&
              map.descripcion == dataCabecera.descripcion
            );
          });
        } else {
          //Valida solo por id
          model = dataDetalle.find((map) => {
            return map.id == dataCabecera.id;
          });
        }

        if (model == undefined) {
          setDataDetalle((prev) => [
            ...prev,
            {
              detalleId: detalleId,
              id: dataCabecera.id,
              lineaId: dataCabecera.lineaId,
              subLineaId: dataCabecera.subLineaId,
              articuloId: dataCabecera.articuloId,
              marcaId: dataCabecera.marcaId,
              codigoBarras: dataCabecera.codigoBarras,
              descripcion: dataCabecera.descripcion,
              stock: dataCabecera.stock,
              unidadMedidaDescripcion: dataCabecera.unidadMedidaDescripcion,
              unidadMedidaId: dataCabecera.unidadMedidaId,
              cantidad: dataCabecera.cantidad,
              precioUnitario: dataCabecera.precioUnitario,
              montoIGV: dataCabecera.montoIGV,
              subTotal: dataCabecera.subTotal,
              importe: dataCabecera.importe,
            },
          ]);
          setDetalleId(detalleId + 1);
          setRefrescar(true);
        } else {
          Swal.fire({
            title: "Aviso del sistema",
            text:
              "El artículo " +
              model.descripcion +
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
              CargarDetalle(model.id);
            }
          });
        }
      }
      //Luego de añadir el artículo se limpia
      setDataCabecera([]);
      if (document.getElementById("productos")) {
        document.getElementById("productos").checked = true;
        document
          .getElementById("productos")
          .dispatchEvent(new Event("click", { bubbles: true }));
      }
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
    document.getElementById("consultarArticulo").focus();
  };
  const CargarDetalle = async (value, click = false) => {
    if (modo != "Consultar") {
      if (click) {
        let row = value.target.closest("tr");
        let id = row.firstChild.innerText;
        setDataCabecera(dataDetalle.find((map) => map.id === id));
      } else {
        setDataCabecera(dataDetalle.find((map) => map.id === value));
      }
      document.getElementById("cantidad").focus();
    }
  };
  const EliminarDetalle = async (id) => {
    let i = 1;
    let nuevoDetalle = dataDetalle.filter((map) => map.id !== id);
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
      return i + map.importe;
    }, 0);

    //Porcentajes
    let porcentajeIgvSeleccionado = data.porcentajeIGV;
    let incluyeIgv = data.incluyeIGV;
    let cantidadProducida = data.cantidadProducida;
    let gastosIndirectos = data.gastosIndirectos;
    let tipoCambio = data.tipoCambio;
    //Porcentajes
    //Montos
    let totalNeto = 0,
      subTotal = 0,
      montoIGV = 0,
      totalGal = 0,
      costoGal = 0,
      costoGalGasIndirectos = 0,
      costoGalIgv = 0;
    //Montos

    //?Calculo Check IncluyeIGV
    if (incluyeIgv) {
      totalNeto = Funciones.RedondearNumero(importeTotal, 2);
      subTotal = Funciones.RedondearNumero(
        totalNeto / (1 + porcentajeIgvSeleccionado / 100),
        2
      );
      montoIGV = Funciones.RedondearNumero(totalNeto - subTotal, 2);
    } else {
      subTotal = Funciones.RedondearNumero(importeTotal, 2);
      montoIGV = Funciones.RedondearNumero(
        subTotal * (porcentajeIgvSeleccionado / 100),
        2
      );
      totalNeto = Funciones.RedondearNumero(subTotal + montoIGV, 2);
    }
    //?Calculos
    totalGal = totalNeto / cantidadProducida;
    costoGal = totalGal * tipoCambio;
    costoGalGasIndirectos = costoGal * (gastosIndirectos / 100);
    costoGalIgv =
      (costoGal + costoGalGasIndirectos) * (porcentajeIgvSeleccionado / 100);

    setData((prevState) => ({
      ...prevState,
      total: Funciones.RedondearNumero(totalNeto, 2),
      totalGalones: Funciones.RedondearNumero(totalGal, 2),
      costoGalon: Funciones.RedondearNumero(costoGal, 2),
      costoGalonMasGastoIndirectos: Funciones.RedondearNumero(
        costoGalGasIndirectos,
        2
      ),
      costoGalonMasIGV: Funciones.RedondearNumero(costoGalIgv, 2),
    }));
  };

  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Venta/DocumentoVenta/FormularioTablas`
    );
    setDataVendedor(
      result.data.data.vendedores.map((res) => ({
        id: res.id,
        nombre:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
    setDataMoneda(result.data.data.monedas);
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
        tipoCambio: result.data.data.precioVenta,
      });
      toast.info(
        "El tipo de cambio del día " +
          moment(data.fechaEmision).format("DD/MM/YYYY") +
          " es: " +
          result.data.data.precioVenta,
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
  //#endregion

  //#region Funciones Modal
  const AbrirFiltroCliente = async () => {
    setModalCliente(true);
  };
  const AbrirFiltroArticulo = async () => {
    setModalArt(true);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Item",
      accessor: "detalleId",
      Cell: ({ value }) => {
        return <p className="text-center">{value}</p>;
      },
    },
    {
      Header: "Descripción",
      accessor: "descripcion",
    },
    {
      Header: "Unidad",
      accessor: "unidadMedidaDescripcion",
      Cell: ({ value }) => {
        return <p className="text-center font-semibold">{value}</p>;
      },
    },
    {
      Header: "Cantidad",
      accessor: "cantidad",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-1.5">
            {Funciones.RedondearNumero(value, 4)}
          </p>
        );
      },
    },
    {
      Header: "Precio",
      accessor: "precioUnitario",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-2.5">
            {Funciones.RedondearNumero(value, 4)}
          </p>
        );
      },
    },
    {
      Header: "Importe",
      accessor: "importe",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-5">
            {Funciones.RedondearNumero(value, 4)}
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
                  onClick={() => CargarDetalle(row.values.id)}
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
                    EliminarDetalle(row.values.id);
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
  return (
    <>
      {Object.entries(dataMoneda).length > 0 && (
        <>
          <ModalCrud
            setModal={setModal}
            objeto={data}
            modo={modo}
            menu={["Almacen", "SalidaAlmacen"]}
            titulo="Salida de Articulos"
            cerrar={false}
            foco={document.getElementById("tablaSalidaAlmacen")}
            tamañoModal={[Global.ModalFull, Global.Form + " px-10 "]}
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
                Global.ContenedorBasico + " mb-4 " + Global.FondoContenedor
              }
            >
              <div className={Global.ContenedorInputs}>
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
                    autoFocus
                    disabled={modo == "Nuevo" ? false : true}
                    value={data.serie ?? ""}
                    onChange={ValidarData}
                    onBlur={(e) => Numeracion(e)}
                    className={
                      modo == "Nuevo" ? Global.InputStyle : Global.InputStyle
                    }
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
                    autoComplete="off"
                    disabled={modo == "Nuevo" ? false : true}
                    value={data.numero ?? ""}
                    onChange={ValidarData}
                    onBlur={(e) => Numeracion(e)}
                    className={
                      modo == "Nuevo" ? Global.InputStyle : Global.InputStyle
                    }
                  />
                </div>
                <div className={Global.InputTercio}>
                  <label htmlFor="fechaEmision" className={Global.LabelStyle}>
                    F. Emisión
                  </label>
                  <input
                    type="date"
                    id="fechaEmision"
                    name="fechaEmision"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={moment(data.fechaInicio ?? "").format("yyyy-MM-DD")}
                    onChange={ValidarData}
                    onBlur={FechaEmision}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputTercio}>
                  <label
                    htmlFor="fechaTerminacion"
                    className={Global.LabelStyle}
                  >
                    F. Terminación
                  </label>
                  <input
                    type="date"
                    id="fechaTerminacion"
                    name="fechaTerminacion"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={moment(data.fechaTerminacion ?? "").format(
                      "yyyy-MM-DD"
                    )}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
              </div>
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label htmlFor="clienteNombre" className={Global.LabelStyle}>
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
                    onChange={ValidarData}
                    className={Global.InputBoton}
                  />
                  <button
                    id="consultar"
                    className={
                      Global.BotonBuscar +
                      Global.BotonPrimary +
                      " !rounded-none"
                    }
                    hidden={modo == "Consultar"}
                    disabled={checkVarios}
                    onClick={() => AbrirFiltroCliente()}
                  >
                    <FaSearch></FaSearch>
                  </button>
                  <div className={Global.Input + " w-20"}>
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <Checkbox
                        inputId="varios"
                        name="varios"
                        disabled={modo == "Consultar"}
                        onChange={(e) => {
                          setCheckVarios(e.checked);
                          ClientesVarios(e);
                        }}
                        checked={checkVarios}
                      ></Checkbox>
                    </div>
                    <label htmlFor="varios" className={Global.LabelCheckStyle}>
                      Varios
                    </label>
                  </div>
                </div>
                <div className={Global.InputTercio}>
                  <label htmlFor="monedaId" className={Global.LabelStyle}>
                    Moneda
                  </label>
                  <select
                    id="monedaId"
                    name="monedaId"
                    value={data.monedaId ?? ""}
                    onChange={ValidarData}
                    disabled={modo == "Consultar"}
                    className={Global.InputStyle}
                  >
                    {dataMoneda.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={Global.InputTercio}>
                  <label htmlFor="tipoCambio" className={Global.LabelStyle}>
                    T. Cambio
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
                    onChange={ValidarData}
                    className={
                      modo != "Consultar"
                        ? Global.InputBoton
                        : Global.InputStyle
                    }
                  />
                  <button
                    id="consultarTipoCambio"
                    className={
                      Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                    }
                    hidden={modo == "Consultar"}
                    onClick={() => {
                      GetPorIdTipoCambio(data.fechaInicio);
                    }}
                  >
                    <FaUndoAlt></FaUndoAlt>
                  </button>
                </div>
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="personalId" className={Global.LabelStyle}>
                  Responsable
                </label>
                <select
                  id="personalId"
                  name="personalId"
                  value={data.personalId ?? ""}
                  onChange={ValidarData}
                  disabled={modo == "Consultar"}
                  className={Global.InputStyle}
                >
                  {dataVendedor.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="lineaProduccion" className={Global.LabelStyle}>
                  Linea de Producción
                </label>
                <input
                  type="text"
                  id="lineaProduccion"
                  name="lineaProduccion"
                  placeholder="Linea de Producción"
                  autoComplete="off"
                  disabled={modo == "Consultar"}
                  value={data.lineaProduccion ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="envasado" className={Global.LabelStyle}>
                  Envasado
                </label>
                <input
                  type="text"
                  id="envasado"
                  name="envasado"
                  placeholder="Envasado"
                  autoComplete="off"
                  disabled={modo == "Consultar"}
                  value={data.envasado ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label htmlFor="numeroLote" className={Global.LabelStyle}>
                    N° Lote
                  </label>
                  <input
                    type="text"
                    id="numeroLote"
                    name="numeroLote"
                    placeholder="N° Lote"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.numeroLote ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputFull}>
                  <label htmlFor="guiaRemision" className={Global.LabelStyle}>
                    Guia Remision
                  </label>
                  <input
                    type="text"
                    id="guiaRemision"
                    name="guiaRemision"
                    placeholder="Guia Remision"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.guiaRemision ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
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
                  disabled={modo == "Consultar"}
                  value={data.observacion ?? ""}
                  onChange={ValidarData}
                  className={Global.InputBoton}
                />
                <div className={Global.Input36}>
                  <div className={Global.CheckStyle + Global.Anidado}>
                    <Checkbox
                      inputId="incluyeIGV"
                      name="incluyeIGV"
                      onChange={(e) => {
                        ValidarData(e);
                      }}
                      checked={data.incluyeIGV ? true : ""}
                      disabled={
                        data.tipoDocumentoId == "03" || modo == "Consultar"
                          ? true
                          : false
                      }
                    ></Checkbox>
                  </div>
                  <label
                    htmlFor="incluyeIGV"
                    className={Global.LabelCheckStyle}
                  >
                    Incluye IGV
                  </label>
                </div>
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label htmlFor="porcentajeIGV" className={Global.LabelStyle}>
                    IGV 18%
                  </label>
                  <input
                    type="number"
                    id="porcentajeIGV"
                    name="porcentajeIGV"
                    placeholder="Observación"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.porcentajeIGV ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputFull}>
                  <label
                    htmlFor="gastosIndirectos"
                    className={Global.LabelStyle}
                  >
                    Gastos Indirectos
                  </label>
                  <input
                    type="number"
                    id="gastosIndirectos"
                    name="gastosIndirectos"
                    placeholder="Observación"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.gastosIndirectos ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputFull}>
                  <label
                    htmlFor="cantidadSolicitada"
                    className={Global.LabelStyle}
                  >
                    Cant. Solicitada
                  </label>
                  <input
                    type="number"
                    id="cantidadSolicitada"
                    name="cantidadSolicitada"
                    placeholder="cantidad"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.cantidadSolicitada ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputFull}>
                  <label
                    htmlFor="cantidadProducida"
                    className={Global.LabelStyle}
                  >
                    Cant. Producida
                  </label>
                  <input
                    type="number"
                    id="cantidadProducida"
                    name="cantidadProducida"
                    placeholder="cantidad"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.cantidadProducida ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
              </div>
            </div>
            {/* Cabecera */}
            {/* Detalles */}
            {modo != "Consultar" && (
              <div
                className={
                  Global.ContenedorBasico + Global.FondoContenedor + " mb-2"
                }
              >
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label htmlFor="descripcion" className={Global.LabelStyle}>
                      Descripción
                    </label>
                    <input
                      type="text"
                      id="descripcion"
                      name="descripcion"
                      placeholder="Descripción"
                      autoComplete="off"
                      disabled={true}
                      value={dataCabecera.descripcion ?? ""}
                      onChange={ValidarDataArt}
                      className={
                        modo == "Consultar"
                          ? Global.InputStyle
                          : Global.InputBoton
                      }
                    />
                    <button
                      id="consultarArticulo"
                      className={Global.BotonBuscar + Global.BotonPrimary}
                      hidden={modo == "Consultar"}
                      onClick={() => {
                        setDataCabecera([]);
                        AbrirFiltroArticulo();
                      }}
                    >
                      <FaSearch></FaSearch>
                    </button>
                  </div>
                  <div className={Global.Input25pct}>
                    <label htmlFor="stock" className={Global.LabelStyle}>
                      Stock
                    </label>
                    <input
                      type="stock"
                      id="stock"
                      name="stock"
                      placeholder="Stock"
                      autoComplete="off"
                      disabled={true}
                      value={dataCabecera.stock ?? ""}
                      onChange={ValidarDataArt}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.Input25pct}>
                    <label
                      htmlFor="unidadMedidaDescripcion"
                      className={Global.LabelStyle}
                    >
                      Unidad
                    </label>
                    <input
                      type="text"
                      id="unidadMedidaDescripcion"
                      name="unidadMedidaDescripcion"
                      placeholder="Unidad Medida"
                      autoComplete="off"
                      disabled={true}
                      value={dataCabecera.unidadMedidaDescripcion ?? ""}
                      onChange={ValidarDataArt}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.Input25pct}>
                    <label htmlFor="cantidad" className={Global.LabelStyle}>
                      Cantidad
                    </label>
                    <input
                      type="number"
                      id="cantidad"
                      name="cantidad"
                      placeholder="Cantidad"
                      autoComplete="off"
                      min={0}
                      disabled={modo == "Consultar"}
                      value={dataCabecera.cantidad ?? ""}
                      onChange={(e) => {
                        ValidarDataArt(e);
                        CalcularImporte(e.target.name);
                      }}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.Input25pct}>
                    <label
                      htmlFor="precioUnitario"
                      className={Global.LabelStyle}
                    >
                      Precio
                    </label>
                    <input
                      type="number"
                      id="precioUnitario"
                      name="precioUnitario"
                      placeholder="Precio "
                      autoComplete="off"
                      min={0}
                      disabled={modo == "Consultar"}
                      value={dataCabecera.precioUnitario ?? ""}
                      onChange={(e) => {
                        ValidarDataArt(e);
                        CalcularImporte(e.target.name);
                      }}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.Input25pct}>
                    <label htmlFor="importe" className={Global.LabelStyle}>
                      Importe
                    </label>
                    <input
                      type="number"
                      id="importe"
                      name="importe"
                      autoComplete="off"
                      placeholder="Importe"
                      min={0}
                      disabled={modo == "Consultar"}
                      value={dataCabecera.importe ?? ""}
                      onChange={(e) => {
                        ValidarDataArt(e);
                        CalcularImporte(e.target.name);
                      }}
                      className={
                        modo != "Consultar"
                          ? Global.InputBoton
                          : Global.InputStyle
                      }
                    />
                    <button
                      id="enviarDetalle"
                      className={Global.BotonBuscar + Global.BotonPrimary}
                      hidden={modo == "Consultar"}
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
            <TablaStyle>
              <TableBasic
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
                DobleClick={(e) => CargarDetalle(e, true)}
              />
            </TablaStyle>
            {/* Tabla Detalle */}

            {/*Tabla Footer*/}
            <div className={Global.ContenedorFooter}>
              <div className="flex">
                <div className={Global.FilaVacia}></div>
                <div className={Global.FilaPrecio}>
                  <p className={Global.FilaContenido}>Total a Pagar</p>
                </div>
                <div className={Global.FilaImporte}>
                  <p className={Global.FilaContenido}>{data.total ?? "0.00"}</p>
                </div>
                <div className={Global.UltimaFila}></div>
              </div>
              <div className="flex">
                <div className={Global.FilaVacia}></div>
                <div className={Global.FilaPrecio}>
                  <p className={Global.FilaContenido}>Total Galones</p>
                </div>
                <div className={Global.FilaImporte}>
                  <p className={Global.FilaContenido}>
                    {data.totalGalones ?? "0.00"}
                  </p>
                </div>
                <div className={Global.UltimaFila}></div>
              </div>
            </div>
            <div className={Global.ContenedorFooter}>
              <div className="flex">
                <div className={Global.FilaVacia + " flex justify-end"}>
                  <p className={Global.FilaContenido}>
                    COSTO DE GALON X 1 EN SOLES
                  </p>
                </div>
                <div className={Global.FilaImporte}>
                  <p className={Global.FilaContenido}>
                    {data.costoGalon ?? "0.00"}
                  </p>
                </div>
                <div className={Global.UltimaFila}></div>
              </div>
              <div className="flex">
                <div className={Global.FilaVacia + " flex justify-end"}>
                  <p className={Global.FilaContenido}>
                    COSTO DE GALON X 1 EN SOLES + GASTOS INDIRECTOS (0.00%)
                  </p>
                </div>
                <div className={Global.FilaImporte}>
                  <p className={Global.FilaContenido}>
                    {data.costoGalonMasGastoIndirectos ?? "0.00"}
                  </p>
                </div>
                <div className={Global.UltimaFila}></div>
              </div>
              <div className="flex">
                <div className={Global.FilaVacia + " flex justify-end"}>
                  <p className={Global.FilaContenido}>
                    COSTO DE GALON X 1 EN SOLES + IGV (18.00%)
                  </p>
                </div>
                <div className={Global.FilaImporte}>
                  <p className={Global.FilaContenido}>
                    {data.costoGalonMasIGV ?? "0.00"}
                  </p>
                </div>
                <div className={Global.UltimaFila}></div>
              </div>
            </div>

            {/*Tabla Footer*/}
          </ModalCrud>
          {modalCliente && (
            <FiltroCliente
              setModal={setModalCliente}
              setObjeto={setDataCliente}
              foco={document.getElementById("monedaId")}
            />
          )}
          {modalArt && (
            <FiltroArticulo
              setModal={setModalArt}
              setObjeto={setDataCabecera}
              foco={document.getElementById("cantidad")}
            />
          )}
        </>
      )}
    </>
  );
};

export default Modal;
