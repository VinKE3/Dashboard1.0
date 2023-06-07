import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import GetTipoCambio from "../../../components/funciones/GetTipoCambio";
import ModalCrud from "../../../components/modal/ModalCrud";
import Mensajes from "../../../components/funciones/Mensajes";
import TableBasic from "../../../components/tabla/TableBasic";
import { toast } from "react-toastify";
import moment from "moment";
import { FaSearch, FaUndoAlt, FaPen, FaTrashAlt, FaPlus } from "react-icons/fa";
import { RadioButton } from "primereact/radiobutton";
import styled from "styled-components";
import "primeicons/primeicons.css";

import * as G from "../../../components/Global";
import * as Funciones from "../../../components/funciones/Validaciones";

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
    width: 115px;
    min-width: 115px;
    max-width: 115px;
  }
  & th:nth-child(3),
  & th:nth-child(4) {
    width: 45px;
    text-align: center;
  }
  & th:nth-child(5) {
    width: 100%;
    min-width: 250px;
  }
  & th:nth-child(6) {
    width: 50px;
    min-width: 50px;
    max-width: 50px;
    text-align: center;
  }
  & th:nth-child(7),
  & th:nth-child(9) {
    width: 100px;
    min-width: 100px;
    max-width: 100px;
    text-align: center;
  }
  & th:nth-child(8),
  & th:nth-child(10) {
    width: 80px;
    min-width: 80px;
    max-width: 80px;
    text-align: center;
  }
  & th:nth-child(11) {
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
const DivDetalle = styled.div`
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

const ModalRenovacion = ({ setModal, modo, objeto }) => {
  //#region useState
  //Data General
  const [data, setData] = useState(objeto);
  const [dataDetalle, setDataDetalle] = useState([]);
  //Data General
  //GetTablas
  const [dataMoneda, setDataMoneda] = useState([]);
  //GetTablas
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
      TipoCambio(moment().format("YYYY-MM-DD"));
    }
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
  //Data Cabecera
  const HandleDataCabecera = async ({ target }) => {
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
    if (result.tipo == 1) {
      return [false, result.textos[0]];
    } else {
      //Valida montos
      if (result.data.data.saldo <= 0) {
        document.getElementById("numero").focus();
        return [false, "El Documento se encuentra Cancelado."];
      }
      if (result.data.data.isAnulado) {
        document.getElementById("numero").focus();
        return [false, "El Documento se encuentra Anulado."];
      }
      if (result.data.data.isBloqueado) {
        document.getElementById("numero").focus();
        return [false, "El Documento se encuentra Bloqueado."];
      }
      let duplicado = dataDetalle.find((map) => map.id == result.data.data.id);
      if (duplicado != undefined) {
        document.getElementById("numero").focus();
        return [false, "El Documento se encuentra registrado en el detalle."];
      }
      let moneda = dataDetalle.find(
        (map) => map.monedaId != result.data.data.monedaId
      );
      if (moneda != undefined) {
        return [false, "El Documento tiene una moneda distinta a la añadida."];
      }
      //Valida montos
    }
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
  const HandleDataCabeceraLetra = async ({ target }) => {
    setDataLetra((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
    if (target.name == "fechaEmision") {
      await FechaVencimiento({ name: "fechaEmision" }, target.value);
    }
  };
  const ValidarDetalleLetra = async () => {
    let numeracion = 0;
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
      } else {
        //Correlativos
        let correlativo = await GetCorrelativo(
          dataDetalle[dataDetalle.length - 1].numeroDocumento.substring(3)
        );
        let ultimoDigito = Number(correlativo.slice(-1));
        numeracion = Number(correlativo.slice(-4));
        //9
        let cantidadPermitida = 9 - ultimoDigito;

        //Correlativos
        if (dataCabecera.numeroLetra > cantidadPermitida + 1) {
          document.getElementById("numeroLetra").focus();
          return [
            false,
            "El número de letras ha superado el máximo permitido.",
          ];
        }
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

    return [true, "", numeracion];
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
        let totales = await TotalDetalle(extras.total);
        let ultimoDigito = Number(resultado[2].toString().slice(-1));
        let correlativo = resultado[2];
        //Itera en base al n° de letras asignadas
        for (
          let index = ultimoDigito;
          index <= dataCabecera.numeroLetra;
          index++
        ) {
          if (dataCabecera.numeroLetra - index == 1) {
            dataDetalleMod.push({
              detalleId: item,
              id: "R" + ("000000000" + correlativo).slice(-9),
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
              id: "R" + ("000000000" + correlativo).slice(-9),
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
        Funciones.OcultarMensajes(setTipoMensaje, setMensaje);
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
    let moneda = dataDetalle[0].monedaId;
    let totalPEN,
      totalPENDividido,
      totalPENUltimaFila,
      totalUSD,
      totalUSDDividido,
      totalUSDUltimaFila;
    //Totales
    if (moneda == "S") {
      //Soles
      totalPEN = Funciones.RedondearNumero(total, 2);
      totalPENDividido = Funciones.RedondearNumero(
        totalPEN / dataCabecera.numeroLetra,
        2
      );
      totalPENUltimaFila = Funciones.RedondearNumero(
        totalPEN - totalPENDividido * (dataCabecera.numeroLetra - 1),
        2
      );
      //Soles

      //Dolares
      totalUSD = Funciones.RedondearNumero(total / data.tipoCambio, 2);
      totalUSDDividido = Funciones.RedondearNumero(
        totalUSD / dataCabecera.numeroLetra,
        2
      );
      totalUSDUltimaFila = Funciones.RedondearNumero(
        totalUSD - totalUSDDividido * (dataCabecera.numeroLetra - 1),
        2
      );
      //Dolares
    } else {
      //Soles
      totalPEN = Funciones.RedondearNumero(total * data.tipoCambio, 2);
      totalPENDividido = Funciones.RedondearNumero(
        totalPEN / dataCabecera.numeroLetra,
        2
      );
      totalPENUltimaFila = Funciones.RedondearNumero(
        totalPEN - totalPENDividido * (dataCabecera.numeroLetra - 1),
        2
      );
      //Soles

      //Dolares
      totalUSD = Funciones.RedondearNumero(total, 2);
      totalUSDDividido = Funciones.RedondearNumero(
        totalUSD / dataCabecera.numeroLetra,
        2
      );
      totalUSDUltimaFila = Funciones.RedondearNumero(
        totalUSD - totalUSDDividido * (dataCabecera.numeroLetra - 1),
        2
      );
      //Dolares
    }

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
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Venta/LetraCambioVenta/FormularioTablas`
    );
    setDataMoneda(result.data.data.monedas);

    if (modo == "Nuevo") {
      //Datos Iniciales
      let monedas = result.data.data.monedas.find((map) => map);
      //Datos Iniciales
      setData((prev) => ({
        ...prev,
        monedaId: monedas.id,
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
  const GetCorrelativo = async (numeroOrigen) => {
    const result = await ApiMasy.get(
      `api/Venta/LetraCambioVenta/GetNuevoNumero?isRenovacion=${true}&numeroOrigen=${numeroOrigen}`
    );
    return result.data.data;
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Número",
      accessor: "numeroDocumento",
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
          <div className={G.TablaBotonModificar}>
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
          <div className={G.TablaBotonEliminar}>
            <button
              id="botonEliminarFila"
              onClick={() => {
                EliminarDocumentoReferencia(row.values.id);
              }}
              className="p-0 px-1"
              title="Click para Eliminar registro"
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
              <div className={G.TablaBotonModificar}>
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
            menu={["Venta", "LetraCambioVenta/Renovacion"]}
            titulo="Renovación de Letra"
            cerrar={false}
            foco={document.getElementById("tablaLetraCambioVenta")}
            tamañoModal={[G.ModalFull, G.Form + " px-10 "]}
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
            <div
              className={
                G.ContenedorBasico +
                " mb-2 !gap-0 !overflow-x-auto" +
                G.FondoContenedor
              }
            >
              <div className={G.ContenedorInputs + " mb-2"}>
                <div className={G.InputMitad}>
                  <div className={G.InputFull}>
                    <div className={G.CheckStyle}>
                      <RadioButton
                        inputId="normal"
                        name="isRenovado"
                        autoFocus
                        value={false}
                        onChange={(e) => HandleDataCabecera(e)}
                        checked={dataCabecera.isRenovado === false}
                      />
                    </div>
                    <label
                      htmlFor="normal"
                      className={G.LabelCheckStyle + "rounded-r-none"}
                    >
                      Normal
                    </label>
                  </div>
                  <div className={G.InputFull}>
                    <div className={G.CheckStyle + G.Anidado}>
                      <RadioButton
                        inputId="renovado"
                        name="isRenovado"
                        value={true}
                        onChange={(e) => HandleDataCabecera(e)}
                        checked={dataCabecera.isRenovado === true}
                      />
                    </div>
                    <label htmlFor="renovado" className={G.LabelCheckStyle}>
                      Renovado
                    </label>
                  </div>
                </div>
                <div className={G.InputMitad}>
                  <label htmlFor="numero" className={G.LabelStyle}>
                    Número Letra
                  </label>
                  <input
                    type="number"
                    id="numero"
                    name="numero"
                    placeholder="Buscar número de letra"
                    autoComplete="off"
                    maxLength="10"
                    autoFocus
                    disabled={!extras.habilitar}
                    value={dataCabecera.numero ?? ""}
                    onChange={HandleDataCabecera}
                    className={G.InputBoton}
                  />
                  <button
                    id="consultarDocumento"
                    className={G.BotonBuscar + G.Anidado + G.BotonPrimary}
                    hidden={modo == "Consultar"}
                    disabled={!extras.habilitar}
                    onKeyDown={(e) => Funciones.KeyClick(e)}
                    onClick={() => AgregarDocumentoReferencia()}
                  >
                    <FaSearch></FaSearch>
                  </button>
                </div>
              </div>

              <div className={G.ContenedorBasico + " mb-2"}>
                <div className={G.ContenedorInputs}>
                  <div className={G.Input25pct}>
                    <label htmlFor="porcentajeInteres" className={G.LabelStyle}>
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
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.Input25pct}>
                    <label htmlFor="montoInteres" className={G.LabelStyle}>
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
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.Input25pct}>
                    <label htmlFor="porcentajePago" className={G.LabelStyle}>
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
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.InputMitad}>
                    <label htmlFor="montoPago" className={G.LabelStyle}>
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
                      className={G.InputBoton}
                    />
                    <button
                      id="enviarDocumento"
                      className={
                        G.BotonBuscar +
                        G.Anidado +
                        G.BotonPrimary +
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
                      className={G.BotonBuscar + G.Anidado + G.BotonEliminar}
                      hidden={modo == "Consultar"}
                      onClick={() => LimpiarCabecera(0)}
                    >
                      <FaTrashAlt></FaTrashAlt>
                    </button>
                  </div>
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
                  DobleClick={(e) => CargarDocumentoReferencia(e, true)}
                />
              </DivTabla>
              {/* Tabla Detalle */}

              {/*Tabla Footer*/}
              <div className={G.ContenedorFooter}>
                <div className="flex">
                  <div className={G.FilaFooter + G.FilaVacia}></div>
                  <div className={G.FilaFooter + G.FilaPrecio}>
                    <p className={G.FilaContenido}>Total Saldo</p>
                  </div>
                  <div className={G.FilaFooter + G.FilaImporte}>
                    <p className={G.FilaContenido}>
                      {extras.totalSaldo ?? "0.00"}
                    </p>
                  </div>
                  <div className={G.FilaFooter + G.UltimaFila}></div>
                </div>
                <div className="flex">
                  <div className={G.FilaFooter + G.FilaVacia}></div>
                  <div className={G.FilaFooter + G.FilaPrecio}>
                    <p className={G.FilaContenido}>Total Interés</p>
                  </div>
                  <div className={G.FilaFooter + G.FilaImporte}>
                    <p className={G.FilaContenido}>
                      {extras.totalInteres ?? "0.00"}
                    </p>
                  </div>
                  <div className={G.FilaFooter + G.UltimaFila}></div>
                </div>
                <div className="flex">
                  <div className={G.FilaFooter + G.FilaVacia}></div>
                  <div className={G.FilaFooter + G.FilaPrecio}>
                    <p className={G.FilaContenido}>Total Pago</p>
                  </div>
                  <div className={G.FilaFooter + G.FilaImporte}>
                    <p className={G.FilaContenido}>
                      {extras.totalPago ?? "0.00"}
                    </p>
                  </div>
                  <div className={G.FilaFooter + G.UltimaFila}></div>
                </div>
                <div className="flex">
                  <div className={G.FilaFooter + G.FilaVacia}></div>
                  <div className={G.FilaFooter + G.FilaPrecio}>
                    <p className={G.FilaContenido}>Total</p>
                  </div>
                  <div className={G.FilaFooter + G.FilaImporte}>
                    <p className={G.FilaContenido}>{extras.total ?? "0.00"}</p>
                  </div>
                  <div className={G.FilaFooter + G.UltimaFila}></div>
                </div>
              </div>
              {/*Tabla Footer*/}
            </div>
            {/* Cabecera Documento */}

            {/* Cabecera Letra */}
            <div
              className={G.ContenedorBasico + " !gap-0 " + G.FondoContenedor}
            >
              <p className={G.Subtitulo + " pb-1"}>Letras por Renovación</p>
              <div className={G.ContenedorInputs + " mb-1.5"}>
                <div className={G.InputTercio}>
                  <label htmlFor="numeroLetra" className={G.LabelStyle}>
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
                    onChange={HandleDataCabecera}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputTercio}>
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
                    disabled={true}
                    value={data.tipoCambio ?? ""}
                    onChange={HandleDataCabecera}
                    className={
                      modo != "Consultar" ? G.InputBoton : G.InputStyle
                    }
                  />
                  <button
                    id="consultarTipoCambio"
                    className={G.BotonBuscar + G.Anidado + G.BotonPrimary}
                    hidden={modo == "Consultar"}
                    onKeyDown={(e) => Funciones.KeyClick(e)}
                    onClick={() => {
                      TipoCambio(moment().format("YYYY-MM-DD"));
                    }}
                  >
                    <FaUndoAlt></FaUndoAlt>
                  </button>
                </div>
                <div className={G.InputTercio}>
                  <label htmlFor="monedaId" className={G.LabelStyle}>
                    Moneda
                  </label>
                  <select
                    id="monedaId"
                    name="monedaId"
                    value={data.monedaId ?? ""}
                    onChange={HandleDataCabecera}
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
              </div>

              <div className={G.ContenedorBasico + " mb-2"}>
                <div className={G.ContenedorInputs}>
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
                      value={moment(dataLetra.fechaEmision ?? "").format(
                        "yyyy-MM-DD"
                      )}
                      onChange={HandleDataCabeceraLetra}
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.InputTercio}>
                    <label htmlFor="dias" className={G.LabelStyle}>
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
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.InputMitad}>
                    <label htmlFor="fechaVencimiento" className={G.LabelStyle}>
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
                      className={G.InputStyle}
                    />
                  </div>
                </div>
                <div className={G.ContenedorInputs}>
                  <div className={G.InputFull}>
                    <label htmlFor="aval" className={G.LabelStyle}>
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
                      onChange={HandleDataCabeceraLetra}
                      className={G.InputBoton}
                    />
                    <button
                      id="enviarDetalleLetra"
                      className={
                        G.BotonBuscar +
                        G.Anidado +
                        G.BotonPrimary +
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
                      className={G.BotonBuscar + G.Anidado + G.BotonEliminar}
                      hidden={modo == "Consultar"}
                      onClick={() => LimpiarCabecera(1)}
                    >
                      <FaTrashAlt></FaTrashAlt>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabla Detalle */}
              <DivDetalle>
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
              </DivDetalle>
              {/* Tabla Detalle */}

              {/*Tabla Footer*/}
              <div className={G.ContenedorFooter}>
                <div className="flex">
                  <div className={G.FilaFooter + G.FilaVacia}></div>
                  <div className={G.FilaFooter + G.FilaPrecio}>
                    <p className={G.FilaContenido}>Total</p>
                  </div>
                  <div className={G.FilaFooter + G.FilaImporte}>
                    <p className={G.FilaContenido}>
                      {extras.totalDetalle ?? "0.00"}
                    </p>
                  </div>
                  <div className={G.FilaFooter + G.UltimaFila}></div>
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

export default ModalRenovacion;
