import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import Mensajes from "../../../components/funciones/Mensajes";
import TableBasic from "../../../components/tabla/TableBasic";
import { toast } from "react-toastify";
import moment from "moment";
import { FaSearch, FaUndoAlt, FaPen, FaTrashAlt, FaPlus } from "react-icons/fa";
import { RadioButton } from "primereact/radiobutton";
import styled from "styled-components";
import "primeicons/primeicons.css";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";
import * as Funciones from "../../../components/funciones/Validaciones";

//#region Estilos
const TablaStyle = styled.div`
  max-width: 100%;
  overflow-x: auto;
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2),
  & th:nth-child(3) {
    width: 45px;
    text-align: center;
  }
  & th:nth-child(4) {
    width: 100%;
    min-width: 250px;
  }

  & th:nth-child(5) {
    width: 50px;
    min-width: 50px;
    max-width: 50px;
    text-align: center;
  }
  & th:nth-child(6),
  & th:nth-child(8) {
    width: 100px;
    min-width: 100px;
    max-width: 100px;
    text-align: center;
  }
  & th:nth-child(7),
  & th:nth-child(9) {
    width: 80px;
    min-width: 80px;
    max-width: 80px;
    text-align: center;
  }
  & th:nth-child(10) {
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
const TablaDetalleStyle = styled.div`
  & th:nth-child(2) {
    width: 100px;
    min-width: 100px;
    max-width: 100px;
  }
  & th:nth-child(1),
  & th:nth-child(4) {
    width: 40px;
    text-align: center;
  }
  & th:nth-child(3),
  & th:nth-child(5) {
    width: 45px;
    text-align: center;
  }
  & th:nth-child(6) {
    width: 100%;
  }
  & th:nth-child(7) {
    width: 50px;
    min-width: 50px;
    max-width: 50px;
    text-align: center;
  }

  & th:nth-child(8) {
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

const ModalRefinanciamiento = ({ setModal, modo, objeto }) => {
  
  //#region useState
  //Data General
  const [data, setData] = useState(objeto);
  const [dataDetalle, setDataDetalle] = useState([]);
  //Data General
  //Tablas
  const [dataMoneda, setDataMoneda] = useState([]);
  //Tablas
  //Data Modales Ayuda
  const [dataCabecera, setDataCabecera] = useState({
    isRenovado: false,
    numero: "",
    numeroLetra: "",
  });
  const [dataLetra, setDataLetra] = useState({
    fechaEmision: moment().format("YYYY-MM-DD"),
    fechaVencimiento: moment().format("YYYY-MM-DD"),
    dias: "",
    aval: "",
  });
  const [dataLetraDetalle, setDataLetraDetalle] = useState([]);
  //Data Modales Ayuda
  const [extras, setExtras] = useState({
    totalSaldo: 0,
    totalInteres: 0,
    totalPago: 0,
    totalDetalle: 0,
    total: 0,
    detalleCabeceraId: dataDetalle.length + 1,
    detalleLetraId: dataLetraDetalle.length + 1,
    habilitar: true,
    habilitarDetalle: true,
  });
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    setData({ ...data, documentosReferencia: dataDetalle });
  }, [dataDetalle]);
  useEffect(() => {
    let model = dataLetraDetalle.map((map) => {
      return {
        id: map.id,
        fechaEmision: map.fechaEmision,
        fechaVencimiento: map.fechaVencimiento,
        tipoCambio: map.tipoCambio,
        monedaId: map.monedaId,
        totalPEN: map.totalPEN,
        totalUSD: map.totalUSD,
        aval: map.aval,
      };
    });
    setData({ ...data, detalles: model });
  }, [dataLetraDetalle]);
  useEffect(() => {
    if (refrescar) {
      ActualizarTotales();
      setRefrescar(false);
    }
  }, [refrescar]);
  useEffect(() => {
    if (modo == "Nuevo") {
      GetPorIdTipoCambio(moment().format("YYYY-MM-DD"));
    }
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
  //Data Cabecera
  const DataCabecera = async ({ target }) => {
    if (target.name == "monedaId" || target.name == "tipoCambio") {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    } else {
      setDataCabecera((prevState) => ({
        ...prevState,
        [target.name]: target.value,
      }));
    }
  };
  const LimpiarCabecera = async (accion) => {
    switch (accion) {
      case 0: {
        //Reinicia todo
        setDataDetalle([]);
        setDataLetraDetalle([]);
        setDataCabecera({
          isRenovado: false,
          numero: "",
        });
        setExtras((prev) => ({ ...prev, habilitarDetalle: true }));
        document.getElementById("numero").focus();
      }
      case 1: {
        //Reinicia las letras
        setDataLetra({
          fechaEmision: moment().format("YYYY-MM-DD"),
          fechaVencimiento: moment().format("YYYY-MM-DD"),
          dias: "",
          aval: "",
        });
        setDataCabecera((prev) => ({ ...prev, numeroLetra: "" }));
        setDataLetraDetalle([]);
        setExtras((prev) => ({ ...prev, habilitarDetalle: true }));
        document.getElementById("numeroLetra").focus();
      }
      case 2: {
        //Limpia la cabecera
        setDataCabecera({
          isRenovado: false,
          numero: "",
        });
      }
      case 3: {
        //Limpia las letras
        setDataLetra({
          fechaEmision: moment().format("YYYY-MM-DD"),
          fechaVencimiento: moment().format("YYYY-MM-DD"),
          dias: "",
          aval: "",
        });
        setDataCabecera((prev) => ({ ...prev, numeroLetra: "" }));
      }
      default: {
        break;
      }
    }
  };
  const ValidarConsultaDocumentoReferencia = async () => {
    //Valida Serie y Número
    if (dataCabecera.numero == "") {
      document.getElementById("numero").focus();
      return [false, "El número de documento es requerido"];
    }
    //Valida Serie y Número
    const result = await ApiMasy.get(
      `api/Venta/LetraCambioVenta/GetSimplificado?isRenovado=${dataCabecera.isRenovado}&numero=${dataCabecera.numero}`
    );
    //Valida montos
    if (result.data.data.saldo <= 0) {
      document.getElementById("numero").focus();
      return [false, "El Documento de Venta se encuentra Cancelado."];
    }
    if (result.data.data.isAnulado) {
      document.getElementById("numero").focus();
      return [false, "El Documento de Venta se encuentra Anulado."];
    }
    if (result.data.data.isBloqueado) {
      document.getElementById("numero").focus();
      return [false, "El Documento de Venta se encuentra Bloqueado."];
    }
    if (!result.data.data.existeNotaDebitoRelacionada) {
      document.getElementById("numero").focus();
      return [
        false,
        "El Documento de Venta no cuenta con una Nota de Débito relacionada.",
      ];
    }
    let duplicado = dataDetalle.find((map) => map.id == result.data.data.id);
    if (duplicado != undefined) {
      document.getElementById("numero").focus();
      return [
        false,
        "El Documento de Venta se encuentra registrado en el detalle.",
      ];
    }
    //Valida montos
    return [true, "", result.data.data];
  };
  const ValidarDocumentoReferencia = async () => {
    if (dataCabecera.id == "" || dataCabecera.id == undefined) {
      document.getElementById("consultarDocumento").focus();
      return [false, "Seleccione un documento a modificar"];
    }
    return [true, ""];
  };
  const AgregarDocumentoReferencia = async () => {
    let resultado = await ValidarConsultaDocumentoReferencia();
    if (resultado[0]) {
      setDataDetalle((prevState) => [
        ...prevState,
        {
          id: resultado[2].id,
          fechaEmision: resultado[2].fechaEmision,
          fechaVencimiento: resultado[2].fechaVencimiento,
          clienteNombre: resultado[2].clienteNombre,
          tipoDocumentoAbreviatura: resultado[2].tipoDocumentoAbreviatura,
          numeroDocumento: resultado[2].numeroDocumento,
          monedaId: resultado[2].monedaId,
          total: resultado[2].total,
          saldo: resultado[2].saldo,
          isAnulado: resultado[2].isAnulado,
          isBloqueado: resultado[2].isBloqueado,
          clienteId: resultado[2].clienteId,
          clienteDireccion: resultado[2].clienteDireccion,
          tipoVentaId: resultado[2].tipoVentaId,
          existeNotaDebitoRelacionada: resultado[2].existeNotaDebitoRelacionada,
          porcentajePago: 0,
          montoPago: 0,
          porcentajeInteres: 0,
          montoInteres: 0,
        },
      ]);

      if (Object.entries(dataLetraDetalle).length > 0) {
        setMensaje([
          "Para reflejar el nuevo saldo, vuelva a generar las letras.",
        ]);
        setTipoMensaje(2);
      }
      await LimpiarCabecera(2);
      setRefrescar(true);
      document.getElementById("numeroLetra").focus();
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
  const ModificarDocumentoReferencia = async () => {
    let resultado = await ValidarDocumentoReferencia();
    if (resultado[0]) {
      let dataDetalleMod = dataDetalle.map((map) => {
        if (map.id == dataCabecera.id) {
          return {
            id: dataCabecera.id,
            fechaEmision: dataCabecera.fechaEmision,
            fechaVencimiento: dataCabecera.fechaVencimiento,
            clienteNombre: dataCabecera.clienteNombre,
            tipoDocumentoAbreviatura: dataCabecera.tipoDocumentoAbreviatura,
            numeroDocumento: dataCabecera.numeroDocumento,
            monedaId: dataCabecera.monedaId,
            total: dataCabecera.total,
            saldo: dataCabecera.saldo,
            isAnulado: dataCabecera.isAnulado,
            isBloqueado: dataCabecera.isBloqueado,
            clienteId: dataCabecera.clienteId,
            clienteDireccion: dataCabecera.clienteDireccion,
            tipoVentaId: dataCabecera.tipoVentaId,
            existeNotaDebitoRelacionada:
              dataCabecera.existeNotaDebitoRelacionada,
            porcentajePago: dataCabecera.porcentajePago,
            montoPago: dataCabecera.montoPago,
            porcentajeInteres: dataCabecera.porcentajeInteres,
            montoInteres: dataCabecera.montoInteres,
          };
        } else {
          return map;
        }
      });
      setDataDetalle(dataDetalleMod);

      if (Object.entries(dataLetraDetalle).length > 0) {
        setMensaje([
          "Para reflejar el nuevo saldo, vuelva a generar las letras.",
        ]);
        setTipoMensaje(2);
      }
      setExtras((prev) => ({ ...prev, habilitar: true }));
      await LimpiarCabecera(2);
      setRefrescar(true);
      document.getElementById("numeroLetra").focus();
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
  const CargarDocumentoReferencia = async (value, click = false) => {
    if (modo != "Consultar") {
      if (click) {
        let row = value.target.closest("tr");
        let id = row.children[0].innerText;
        setDataCabecera(dataDetalle.find((map) => map.id === id));
      } else {
        setDataCabecera(dataDetalle.find((map) => map.id === value));
      }
      setExtras((prev) => ({ ...prev, habilitar: false }));
      document.getElementById("porcentajeInteres").focus();
    }
  };
  const EliminarDocumentoReferencia = async (id) => {
    let nuevoDetalle = dataDetalle.filter((map) => map.id !== id);
    if (nuevoDetalle.length > 0) {
      setDataDetalle(nuevoDetalle);
    } else {
      setDataDetalle(nuevoDetalle);
      //Limpia las letras
      setDataLetraDetalle([]);
      //Limpia las letras
    }
    setRefrescar(true);
  };
  const OcultarMensajes = async () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  //Data Cabecera

  //Calculos
  const PorcentajesCabecera = async ({ target }) => {
    if (dataCabecera.saldo > 0) {
      if (target.name == "porcentajeInteres") {
        //Calcula el monto interés y pago
        let porcentajeInteres = Number(target.value);
        let porcentajePago = Number(
          document.getElementById("porcentajePago").value
        );
        let montoInteres = Number(
          document.getElementById("montoInteres").value
        );

        //Calcula el monto interés
        montoInteres = Funciones.RedondearNumero(
          dataCabecera.saldo * (porcentajeInteres / 100),
          2
        );
        //Calcula el monto interés

        //Recalcula el Monto Pago
        let montoPago =
          (dataCabecera.saldo + montoInteres) * (porcentajePago / 100);
        //Recalcula el Monto Pago
        setDataCabecera((prevState) => ({
          ...prevState,
          porcentajeInteres: Funciones.RedondearNumero(porcentajeInteres, 2),
          montoInteres: Funciones.RedondearNumero(montoInteres, 2),
          montoPago: Funciones.RedondearNumero(montoPago, 2),
        }));
        //Calcula el monto interés y pago
      } else if (target.name == "montoInteres") {
        //Calcula el porcentaje
        let porcentajeInteres = Number(
          document.getElementById("porcentajeInteres").value
        );
        let porcentajePago = Number(
          document.getElementById("porcentajePago").value
        );
        let montoInteres = Number(target.value);
        //Calcula el porcentaje
        porcentajeInteres = Funciones.RedondearNumero(
          montoInteres / dataCabecera.saldo,
          2
        );
        //Calcula el porcentaje
        let montoPago =
          (dataCabecera.saldo + montoInteres) * (porcentajePago / 100);
        //Calcula el monto pago

        //Calcula el monto pago
        setDataCabecera((prevState) => ({
          ...prevState,
          porcentajeInteres: Funciones.RedondearNumero(porcentajeInteres, 2),
          montoInteres: Funciones.RedondearNumero(montoInteres, 2),
          montoPago: Funciones.RedondearNumero(montoPago / 2),
        }));
        //Calcula el porcentaje
      } else {
        //Calcula el monto
        let porcentajePago = Number(target.value);
        let montoPago = Number(document.getElementById("montoPago").value);
        let montoInteres = Number(
          document.getElementById("montoInteres").value
        );
        //Calcula Monto pago
        montoPago = Funciones.RedondearNumero(
          (dataCabecera.saldo + montoInteres) * (porcentajePago / 100),
          2
        );
        //Calcula Monto pago
        setDataCabecera((prevState) => ({
          ...prevState,
          porcentajePago: Funciones.RedondearNumero(porcentajePago, 2),
          montoPago: Funciones.RedondearNumero(montoPago, 2),
        }));
        //Calcula el monto
      }
    } else {
      document.getElementById("numero").focus();
      toast.error("Se requiere el Saldo.", {
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
  const ActualizarTotales = async () => {
    let totalSaldo = dataDetalle.reduce((i, map) => {
      return i + map.saldo;
    }, 0);
    let totalInteres = dataDetalle.reduce((i, map) => {
      return i + map.montoInteres;
    }, 0);
    let totalPago = dataDetalle.reduce((i, map) => {
      return i + map.montoPago;
    }, 0);
    let total = totalSaldo + totalInteres - totalPago;
    let totalDetalle = dataLetraDetalle.reduce((i, map) => {
      return i + map.importe;
    }, 0);
    setExtras((prev) => ({
      ...prev,
      totalSaldo: Funciones.RedondearNumero(totalSaldo, 2),
      totalInteres: Funciones.RedondearNumero(totalInteres, 2),
      totalPago: Funciones.RedondearNumero(totalPago, 2),
      total: Funciones.RedondearNumero(total, 2),
      totalDetalle: Funciones.RedondearNumero(totalDetalle, 2),
    }));
  };
  //Calculos
  //#endregion

  //#region Funciones Detalles
  const DataCabeceraLetra = async ({ target }) => {
    setDataLetra((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
    if (target.name == "fechaEmision") {
      await FechaVencimiento({ name: "fechaEmision" }, target.value);
    }
  };
  const ValidarDetalleLetra = async () => {
    //Valida que hayan documentos
    if (Object.entries(dataDetalle).length <= 0) {
      document.getElementById("numero").focus();
      return [false, "Ingrese un Documento"];
    }

    //Valida N° Letras
    if (extras.habilitarDetalle) {
      if (dataCabecera.numeroLetra == "") {
        document.getElementById("numeroLetra").focus();
        return [false, "El número de letras es requerido"];
      }
    }
    //Valida N° Letras

    //Valida Tipo Cambio
    if (Funciones.IsNumeroValido(data.tipoCambio, false) != "") {
      document.getElementById("consultarTipoCambio").focus();
      return [
        false,
        "Tipo de Cambio: " + Funciones.IsNumeroValido(data.tipoCambio, false),
      ];
    }
    //Valida Tipo Cambio

    return [true, ""];
  };
  const AgregarDetalleLetra = async () => {
    //Obtiene resultado de Validación
    let resultado = await ValidarDetalleLetra();
    //Obtiene resultado de Validación

    if (resultado[0]) {
      if (dataLetra.detalleId != undefined) {
        let dataDetalleMod = dataLetraDetalle.map((map) => {
          if (map.id == dataLetra.id) {
            return {
              detalleId: dataLetra.detalleId,
              id: dataLetra.id,
              fechaEmision: dataLetra.fechaEmision,
              dias: dataLetra.dias,
              fechaVencimiento: dataLetra.fechaVencimiento,
              aval: dataLetra.aval,
              monedaId: dataLetra.monedaId,
              tipoCambio: dataLetra.tipoCambio,
              totalPEN: dataLetra.totalPEN,
              totalUSD: dataLetra.totalUSD,
              importe: dataLetra.importe,
            };
          } else {
            return map;
          }
        });
        setDataLetraDetalle(dataDetalleMod);
        setExtras((prev) => ({ ...prev, habilitarDetalle: true }));
      } else {
        let dataDetalleMod = [];
        let item = extras.detalleLetraId;
        let correlativo = await GetCorrelativo();
        let totales = await TotalDetalle(extras.total);
        //Itera en base al n° de letras asignadas
        for (let index = 0; index < dataCabecera.numeroLetra; index++) {
          if (dataCabecera.numeroLetra - index == 1) {
            dataDetalleMod.push({
              detalleId: item,
              id: ("0000000000" + correlativo).slice(-10),
              fechaEmision: dataLetra.fechaEmision,
              dias: dataLetra.dias,
              fechaVencimiento: dataLetra.fechaVencimiento,
              aval: dataLetra.aval,
              monedaId: data.monedaId,
              tipoCambio: data.tipoCambio,
              totalPEN: Funciones.RedondearNumero(
                totales.totalPENUltimaFila,
                2
              ),
              totalUSD: Funciones.RedondearNumero(
                totales.totalUSDUltimaFila,
                2
              ),
              importe:
                data.monedaId == "S"
                  ? Funciones.RedondearNumero(totales.totalPENUltimaFila, 2)
                  : Funciones.RedondearNumero(totales.totalUSDUltimaFila, 2),
            });
          } else {
            dataDetalleMod.push({
              detalleId: item,
              id: ("0000000000" + correlativo).slice(-10),
              fechaEmision: dataLetra.fechaEmision,
              dias: dataLetra.dias,
              fechaVencimiento: dataLetra.fechaVencimiento,
              aval: dataLetra.aval,
              monedaId: data.monedaId,
              tipoCambio: data.tipoCambio,
              totalPEN: Funciones.RedondearNumero(totales.totalPENDividido, 2),
              totalUSD: Funciones.RedondearNumero(totales.totalUSDDividido, 2),
              importe:
                data.monedaId == "S"
                  ? Funciones.RedondearNumero(totales.totalPENDividido, 2)
                  : Funciones.RedondearNumero(totales.totalUSDDividido, 2),
            });
          }
          item++;
          correlativo++;
        }
        //Itera en base al n° de letras asignadas
        OcultarMensajes();
        setDataLetraDetalle(dataDetalleMod);
      }

      await LimpiarCabecera(3);
      setRefrescar(true);
      document.getElementById("numeroLetra").focus();
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
  const CargarDetalleLetra = async (value, click = false) => {
    if (modo != "Consultar") {
      if (click) {
        let row = value.target.closest("tr");
        let id = row.children[1].innerText;
        setDataLetra(dataLetraDetalle.find((map) => map.id === id));
      } else {
        setDataLetra(dataLetraDetalle.find((map) => map.id === value));
      }
      setExtras((prev) => ({ ...prev, habilitarDetalle: false }));
      document.getElementById("fechaEmision").focus();
    }
  };
  const FechaVencimiento = async ({ target }, emision = null) => {
    let fechaHoy = moment().format("YYYY-MM-DD");
    let fechaRetorno, fecha;
    if (target != undefined) {
      fecha = moment(dataLetra.fechaEmision)
        .add(target.value, "days")
        .format("YYYY-MM-DD");
      fechaRetorno = fecha == undefined ? fechaHoy : fecha;
      setDataLetra((prev) => ({
        ...prev,
        dias: target.value,
        fechaVencimiento: fechaRetorno,
      }));
      return;
    }
    if (emision != null) {
      fecha = moment(emision).add(dataLetra.dias, "days").format("YYYY-MM-DD");
      fechaRetorno = fecha == undefined ? fechaHoy : fecha;
      setDataLetra((prev) => ({
        ...prev,
        dias: dataLetra.dias,
        fechaVencimiento: fechaRetorno,
        fechaEmision: emision,
      }));
      return;
    }
  };
  //Calculos
  const TotalDetalle = async (total) => {
    //Totales
    //Soles
    let totalPEN = Funciones.RedondearNumero(total, 2);
    let totalPENDividido = Funciones.RedondearNumero(
      totalPEN / dataCabecera.numeroLetra,
      2
    );
    let totalPENUltimaFila = Funciones.RedondearNumero(
      totalPEN - totalPENDividido * (dataCabecera.numeroLetra - 1),
      2
    );
    //Soles
    //Dolares
    let totalUSD = Funciones.RedondearNumero(total / data.tipoCambio, 2);
    let totalUSDDividido = Funciones.RedondearNumero(
      totalUSD / dataCabecera.numeroLetra,
      2
    );
    let totalUSDUltimaFila = Funciones.RedondearNumero(
      totalUSD - totalUSDDividido * (dataCabecera.numeroLetra - 1),
      2
    );
    //Dolares
    //Totales

    return {
      totalPENDividido: totalPENDividido,
      totalPENUltimaFila: totalPENUltimaFila,
      totalUSDDividido: totalUSDDividido,
      totalUSDUltimaFila: totalUSDUltimaFila,
    };
  };
  //Calculos
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Venta/LetraCambioVenta/FormularioTablas`
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
  const GetCorrelativo = async () => {
    const result = await ApiMasy.get(
      `api/Venta/LetraCambioVenta/GetNuevoNumero`
    );
    return Number(result.data.data);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "id",
      accessor: "id",
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
      Header: "Vcmto.",
      accessor: "fechaVencimiento",
      Cell: ({ value }) => {
        return (
          <p className="text-center">{moment(value).format("DD/MM/YY")}</p>
        );
      },
    },
    {
      Header: "Cliente",
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
      Header: "Saldo",
      accessor: "saldo",
      Cell: ({ value }) => {
        return <p className="text-right font-semibold pr-5">{value}</p>;
      },
    },
    {
      Header: "% Interés",
      accessor: "porcentajeInteres",
      Cell: ({ value }) => {
        return <p className="text-right font-semibold pr-2.5">{value}</p>;
      },
    },
    {
      Header: "M. Interés",
      accessor: "montoInteres",
      Cell: ({ value }) => {
        return <p className="text-right font-semibold pr-2.5">{value}</p>;
      },
    },
    {
      Header: "% Pago",
      accessor: "porcentajePago",
      Cell: ({ value }) => {
        return <p className="text-right font-semibold pr-2.5">{value}</p>;
      },
    },
    {
      Header: "Monto Pago",
      accessor: "montoPago",
      Cell: ({ value }) => {
        return <p className="text-right font-semibold pr-2.5">{value}</p>;
      },
    },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <div className="flex item-center justify-center">
          <div className={Global.TablaBotonModificar}>
            <button
              id="boton-modificar"
              onClick={() => {
                CargarDocumentoReferencia(row.values.id);
              }}
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
                EliminarDocumentoReferencia(row.values.id);
              }}
              className="p-0 px-1"
              title="Click para eliminar registro"
            >
              <FaTrashAlt></FaTrashAlt>
            </button>
          </div>
        </div>
      ),
    },
  ];
  const columnasDetalle = [
    {
      Header: "N°",
      accessor: "detalleId",
      Cell: ({ value }) => {
        return <p className="text-center">{value}</p>;
      },
    },
    {
      Header: "N° Letra",
      accessor: "id",
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
      Header: "Días",
      accessor: "dias",
      Cell: ({ value }) => {
        return <p className="text-center">{value}</p>;
      },
    },
    {
      Header: "Vcmto.",
      accessor: "fechaVencimiento",
      Cell: ({ value }) => {
        return (
          <p className="text-center">{moment(value).format("DD/MM/YY")}</p>
        );
      },
    },
    {
      Header: "Avales",
      accessor: "aval",
    },
    {
      Header: "M",
      accessor: "monedaId",
      Cell: ({ value }) => {
        return <p className="text-center">{value == "S" ? "S/." : "US$"}</p>;
      },
    },
    {
      Header: "Importe",
      accessor: "importe",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-2.5">
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
                  id="boton"
                  onClick={() => CargarDetalleLetra(row.values.id)}
                  className="p-0 px-1"
                  title="Click para modificar registro"
                >
                  <FaPen></FaPen>
                </button>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];
  //#endregion

  //#region Render
  return (
    <>
      {Object.entries(dataMoneda).length > 0 && (
        <>
          <ModalCrud
            setModal={setModal}
            objeto={data}
            modo={modo}
            menu={["Venta", "LetraCambioVenta/Refinanciacion"]}
            titulo="Refinanciamiento de Letra"
            cerrar={false}
            foco={document.getElementById("tablaLetraCambioVenta")}
            tamañoModal={[Global.ModalFull, Global.Form + " px-10 "]}
          >
            {tipoMensaje > 0 && (
              <Mensajes
                tipoMensaje={tipoMensaje}
                mensaje={mensaje}
                Click={() => OcultarMensajes()}
              />
            )}
            {/* Cabecera Documento */}
            <div
              className={
                Global.ContenedorBasico +
                " mb-2 !gap-0 !overflow-x-auto" +
                Global.FondoContenedor
              }
            >
              <div className={Global.ContenedorInputs + " mb-2"}>
                <div className={Global.InputMitad}>
                  <div className={Global.InputFull}>
                    <div className={Global.CheckStyle}>
                      <RadioButton
                        inputId="normal"
                        name="isRenovado"
                        autoFocus
                        value={false}
                        onChange={(e) => DataCabecera(e)}
                        checked={dataCabecera.isRenovado === false}
                      />
                    </div>
                    <label
                      htmlFor="normal"
                      className={Global.LabelCheckStyle + "rounded-r-none"}
                    >
                      Normal
                    </label>
                  </div>
                  <div className={Global.InputFull}>
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <RadioButton
                        inputId="renovado"
                        name="isRenovado"
                        value={true}
                        onChange={(e) => DataCabecera(e)}
                        checked={dataCabecera.isRenovado === true}
                      />
                    </div>
                    <label
                      htmlFor="renovado"
                      className={Global.LabelCheckStyle}
                    >
                      Renovado
                    </label>
                  </div>
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
                    autoComplete="off"
                    maxLength="10"
                    autoFocus
                    disabled={!extras.habilitar}
                    value={dataCabecera.numero ?? ""}
                    onChange={DataCabecera}
                    className={Global.InputBoton}
                  />
                  <button
                    id="consultarDocumento"
                    className={
                      Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                    }
                    hidden={modo == "Consultar"}
                    disabled={!extras.habilitar}
                    onKeyDown={(e) => Funciones.KeyClick(e)}
                    onClick={() => AgregarDocumentoReferencia()}
                  >
                    <FaSearch></FaSearch>
                  </button>
                </div>
              </div>

              <div className={Global.ContenedorBasico + " mb-2"}>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.Input25pct}>
                    <label
                      htmlFor="porcentajeInteres"
                      className={Global.LabelStyle}
                    >
                      % Interés
                    </label>
                    <input
                      type="number"
                      id="porcentajeInteres"
                      name="porcentajeInteres"
                      placeholder="% Interés"
                      autoComplete="off"
                      min={0}
                      disabled={modo == "Consultar"}
                      value={dataCabecera.porcentajeInteres ?? ""}
                      onChange={PorcentajesCabecera}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.Input25pct}>
                    <label htmlFor="montoInteres" className={Global.LabelStyle}>
                      Monto Interés
                    </label>
                    <input
                      type="number"
                      id="montoInteres"
                      name="montoInteres"
                      placeholder="Monto Interés"
                      autoComplete="off"
                      min={0}
                      disabled={modo == "Consultar"}
                      value={dataCabecera.montoInteres ?? ""}
                      onChange={PorcentajesCabecera}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.Input25pct}>
                    <label
                      htmlFor="porcentajePago"
                      className={Global.LabelStyle}
                    >
                      % Pago
                    </label>
                    <input
                      type="number"
                      id="porcentajePago"
                      name="porcentajePago"
                      placeholder="% Pago"
                      autoComplete="off"
                      min={0}
                      disabled={modo == "Consultar"}
                      value={dataCabecera.porcentajePago ?? ""}
                      onChange={PorcentajesCabecera}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputMitad}>
                    <label htmlFor="montoPago" className={Global.LabelStyle}>
                      Monto Pago
                    </label>
                    <input
                      type="number"
                      id="montoPago"
                      name="montoPago"
                      placeholder="Monto Pago"
                      autoComplete="off"
                      min={0}
                      disabled={true}
                      value={dataCabecera.montoPago ?? ""}
                      className={Global.InputBoton}
                    />
                    <button
                      id="enviarDocumento"
                      className={
                        Global.BotonBuscar +
                        Global.Anidado +
                        Global.BotonPrimary +
                        " rounded-r-none"
                      }
                      hidden={modo == "Consultar"}
                      onKeyDown={(e) => Funciones.KeyClick(e)}
                      onClick={() => ModificarDocumentoReferencia()}
                    >
                      <FaPlus></FaPlus>
                    </button>
                    <button
                      id="eliminarDocumentos"
                      className={
                        Global.BotonBuscar +
                        Global.Anidado +
                        Global.BotonEliminar
                      }
                      hidden={modo == "Consultar"}
                      onClick={() => LimpiarCabecera(0)}
                    >
                      <FaTrashAlt></FaTrashAlt>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabla Detalle */}
              <TablaStyle>
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
                  DobleClick={(e) => CargarDocumentoReferencia(e, true)}
                />
              </TablaStyle>
              {/* Tabla Detalle */}

              {/*Tabla Footer*/}
              <div className={Global.ContenedorFooter}>
                <div className="flex">
                  <div className={Global.FilaVacia}></div>
                  <div className={Global.FilaPrecio}>
                    <p className={Global.FilaContenido}>Total Saldo</p>
                  </div>
                  <div className={Global.FilaImporte}>
                    <p className={Global.FilaContenido}>
                      {extras.totalSaldo ?? "0.00"}
                    </p>
                  </div>
                  <div className={Global.UltimaFila}></div>
                </div>
                <div className="flex">
                  <div className={Global.FilaVacia}></div>
                  <div className={Global.FilaPrecio}>
                    <p className={Global.FilaContenido}>Total Interés</p>
                  </div>
                  <div className={Global.FilaImporte}>
                    <p className={Global.FilaContenido}>
                      {extras.totalInteres ?? "0.00"}
                    </p>
                  </div>
                  <div className={Global.UltimaFila}></div>
                </div>
                <div className="flex">
                  <div className={Global.FilaVacia}></div>
                  <div className={Global.FilaPrecio}>
                    <p className={Global.FilaContenido}>Total Pago</p>
                  </div>
                  <div className={Global.FilaImporte}>
                    <p className={Global.FilaContenido}>
                      {extras.totalPago ?? "0.00"}
                    </p>
                  </div>
                  <div className={Global.UltimaFila}></div>
                </div>
                <div className="flex">
                  <div className={Global.FilaVacia}></div>
                  <div className={Global.FilaPrecio}>
                    <p className={Global.FilaContenido}>Total</p>
                  </div>
                  <div className={Global.FilaImporte}>
                    <p className={Global.FilaContenido}>
                      {extras.total ?? "0.00"}
                    </p>
                  </div>
                  <div className={Global.UltimaFila}></div>
                </div>
              </div>
              {/*Tabla Footer*/}
            </div>
            {/* Cabecera Documento */}

            {/* Cabecera Letra */}
            <div
              className={
                Global.ContenedorBasico + " !gap-0 " + Global.FondoContenedor
              }
            >
              <p className={Global.Subtitulo + " pb-1"}>Letras por Renovación</p>
              <div className={Global.ContenedorInputs + " mb-1.5"}>
                <div className={Global.InputTercio}>
                  <label htmlFor="numeroLetra" className={Global.LabelStyle}>
                    N° Letras
                  </label>
                  <input
                    type="number"
                    id="numeroLetra"
                    name="numeroLetra"
                    placeholder="N° Letras"
                    autoComplete="off"
                    min={0}
                    disabled={modo == "Consultar" || !extras.habilitarDetalle}
                    value={dataCabecera.numeroLetra ?? ""}
                    onChange={DataCabecera}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputTercio}>
                  <label htmlFor="tipoCambio" className={Global.LabelStyle}>
                    Tipo Cambio
                  </label>
                  <input
                    type="number"
                    id="tipoCambio"
                    name="tipoCambio"
                    placeholder="Tipo de Cambio"
                    autoComplete="off"
                    min={0}
                    disabled={true}
                    value={data.tipoCambio ?? ""}
                    onChange={DataCabecera}
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
                    onKeyDown={(e) => Funciones.KeyClick(e)}
                    onClick={() => {
                      GetPorIdTipoCambio(moment().format("YYYY-MM-DD"));
                    }}
                  >
                    <FaUndoAlt></FaUndoAlt>
                  </button>
                </div>
                <div className={Global.InputTercio}>
                  <label htmlFor="monedaId" className={Global.LabelStyle}>
                    Moneda
                  </label>
                  <select
                    id="monedaId"
                    name="monedaId"
                    value={data.monedaId ?? ""}
                    onChange={DataCabecera}
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
              </div>

              <div className={Global.ContenedorBasico + " mb-2"}>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputMitad}>
                    <label htmlFor="fechaEmision" className={Global.LabelStyle}>
                      Fecha Emisión
                    </label>
                    <input
                      type="date"
                      id="fechaEmision"
                      name="fechaEmision"
                      autoComplete="off"
                      autoFocus={modo == "Modificar"}
                      disabled={modo == "Consultar"}
                      value={moment(dataLetra.fechaEmision ?? "").format(
                        "yyyy-MM-DD"
                      )}
                      onChange={DataCabeceraLetra}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputTercio}>
                    <label htmlFor="dias" className={Global.LabelStyle}>
                      Días
                    </label>
                    <input
                      type="number"
                      id="dias"
                      name="dias"
                      placeholder="Días"
                      autoComplete="off"
                      min={0}
                      disabled={modo == "Consultar"}
                      value={dataLetra.dias ?? ""}
                      onChange={FechaVencimiento}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputMitad}>
                    <label
                      htmlFor="fechaVencimiento"
                      className={Global.LabelStyle}
                    >
                      Fecha Vencimiento
                    </label>
                    <input
                      type="date"
                      id="fechaVencimiento"
                      name="fechaVencimiento"
                      autoComplete="off"
                      disabled={true}
                      value={moment(dataLetra.fechaVencimiento ?? "").format(
                        "yyyy-MM-DD"
                      )}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label htmlFor="aval" className={Global.LabelStyle}>
                      Aval
                    </label>
                    <input
                      type="text"
                      id="aval"
                      name="aval"
                      placeholder="Aval"
                      autoComplete="aval"
                      min={0}
                      disabled={modo == "Consultar"}
                      value={dataLetra.aval ?? ""}
                      onChange={DataCabeceraLetra}
                      className={Global.InputBoton}
                    />
                    <button
                      id="enviarDetalleLetra"
                      className={
                        Global.BotonBuscar +
                        Global.Anidado +
                        Global.BotonPrimary +
                        " rounded-r-none"
                      }
                      hidden={modo == "Consultar"}
                      onKeyDown={(e) => Funciones.KeyClick(e)}
                      onClick={() => AgregarDetalleLetra()}
                    >
                      <FaPlus></FaPlus>
                    </button>
                    <button
                      id="eliminarDetalleLetra"
                      className={
                        Global.BotonBuscar +
                        Global.Anidado +
                        Global.BotonEliminar
                      }
                      hidden={modo == "Consultar"}
                      onClick={() => LimpiarCabecera(1)}
                    >
                      <FaTrashAlt></FaTrashAlt>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabla Detalle */}
              <TablaDetalleStyle>
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
                  DobleClick={(e) => CargarDetalleLetra(e, true)}
                />
              </TablaDetalleStyle>
              {/* Tabla Detalle */}

              {/*Tabla Footer*/}
              <div className={Global.ContenedorFooter}>
                <div className="flex">
                  <div className={Global.FilaVacia}></div>
                  <div className={Global.FilaPrecio}>
                    <p className={Global.FilaContenido}>Total</p>
                  </div>
                  <div className={Global.FilaImporte}>
                    <p className={Global.FilaContenido}>
                      {extras.totalDetalle ?? "0.00"}
                    </p>
                  </div>
                  <div className={Global.UltimaFila}></div>
                </div>
              </div>
              {/*Tabla Footer*/}
            </div>
            {/* Cabecera Letra */}
          </ModalCrud>
        </>
      )}
    </>
  );
  //#endregion
};

export default ModalRefinanciamiento;
