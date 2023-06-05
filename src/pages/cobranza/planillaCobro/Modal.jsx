import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import FiltroCliente from "../../../components/filtro/FiltroCliente";
import FiltroConcepto from "../../../components/filtro/FiltroConcepto";
import Mensajes from "../../../components/funciones/Mensajes";
import TableBasic from "../../../components/tabla/TableBasic";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Checkbox } from "primereact/checkbox";
import moment from "moment";
import { FaPlus, FaSearch, FaUndoAlt, FaPen, FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import "react-toastify/dist/ReactToastify.css";
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
    min-width: 40px;
    width: 40px;
    text-align: center;
  }
  & th:nth-child(3) {
    min-width: 70px;
    width: 70px;
    text-align: center;
  }
  & th:nth-child(4) {
    min-width: 140px;
    width: 140px;
  }
  & th:nth-child(5) {
    min-width: 190px;
    width: 100%;
  }
  & th:nth-child(6) {
    min-width: 120px;
    width: 120px;
  }
  & th:nth-child(7) {
    min-width: 90px;
    width: 90px;
    text-align: center;
  }
  & th:nth-child(8) {
    background: linear-gradient(198deg, #19506a 0%, #0a2e4b 100%);
    min-width: 40px;
    width: 40px;
    text-align: center;
  }
  & th:nth-child(9) {
    background: linear-gradient(198deg, #19506a 0%, #0a2e4b 100%);
    min-width: 75px;
    width: 75px;
    text-align: center;
  }
  & th:nth-child(11),
  & th:nth-child(12) {
    background: linear-gradient(198deg, #196a24 0%, #19461d 100%);
    min-width: 90px;
    width: 90px;
    text-align: center;
  }
  & th:nth-child(10) {
    background: linear-gradient(198deg, #196a24 0%, #19461d 100%);
    min-width: 40px;
    width: 40px;
    text-align: center;
  }
  & th:nth-child(13),
  & th:nth-child(14) {
    background: linear-gradient(198deg, #302579 0%, #222246 100%);
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
  const [dataDetalle, setDataDetalle] = useState(objeto.detalles);
  const [dataGlobal] = useState(store.session.get("global"));
  //Data General
  //Tablas
  const [dataVendedor, setDataVendedor] = useState([]);
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataTipoCobro, setDataTipoCobro] = useState([]);
  const [dataCtacte, setDataCtacte] = useState([]);
  const [dataCabecera, setDataCabecera] = useState([]);
  //Tablas
  //Data Modales Ayuda
  const [dataCliente, setDataCliente] = useState([]);
  const [dataConcepto, setDataConcepto] = useState([]);
  //Data Modales Ayuda
  //Modales de Ayuda
  const [modalCliente, setModalCliente] = useState(false);
  const [modalConcepto, setModalConcepto] = useState(false);
  //Modales de Ayuda
  const [checkVarios, setCheckVarios] = useState(false);
  const [checkInteres, setCheckInteres] = useState(false);
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
    if (Object.entries(dataConcepto).length > 0) {
      //Cabecera
      setDataCabecera({
        ...dataCabecera,
        documentoReferenciaId: dataConcepto.id,
        fechaEmision: dataConcepto.fechaEmision,
        fechaVencimiento: dataConcepto.fechaVencimiento,
        numeroDocumento: dataConcepto.numeroDocumento,
        clienteId: dataConcepto.clienteId,
        clienteNombre: dataConcepto.clienteNombre,
        monedaId: dataConcepto.monedaId,
        total: dataConcepto.total,
        saldo: dataConcepto.saldo,
      });
      GetPorIdTipoCambio(dataCabecera.fechaAbono, "cabecera");
      //Cabecera
    }
  }, [dataConcepto]);
  useEffect(() => {
    setData({ ...data, detalles: dataDetalle });
  }, [dataDetalle]);
  useEffect(() => {
    if (!modalConcepto) {
      // ConvertirPrecio();
    }
  }, [modalConcepto]);
  useEffect(() => {
    if (refrescar) {
      ActualizarTotales();
      setRefrescar(false);
    }
  }, [refrescar]);
  useEffect(() => {
    if (Object.keys(dataMoneda).length > 0) {
      Cabecera();
    }
  }, [dataMoneda]);
  useEffect(() => {
    if (modo == "Nuevo") {
      GetPorIdTipoCambio(data.fechaRegistro);
    }
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
  //Data General
  const HandleData = async ({ target }) => {
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
      }));
    } else {
      setDataCliente((prevState) => ({
        ...prevState,
        clienteId: "",
        clienteNumeroDocumentoIdentidad: "",
        clienteNombre: "",
        clienteDireccion: "",
      }));
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
  const Cliente = async () => {
    setData({
      ...data,
      clienteId: dataCliente.clienteId,
      clienteNombre: dataCliente.clienteNombre,
      clienteNumeroDocumentoIdentidad:
        dataCliente.clienteNumeroDocumentoIdentidad,
      clienteDireccion: dataCliente.clienteDireccion,
    });
  };
  const OcultarMensajes = async () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  //Data General

  //Artículos
  const ValidarDataCabecera = async ({ target }) => {
    if (target.name == "interes") {
      setCheckInteres(target.checked);
      if (!target.checked) {
        setDataCabecera((prevState) => ({
          ...prevState,
          porcentajeInteres: 0,
          montoInteres: 0,
        }));
        ActualizarTotales();
      }
      return;
    }

    setDataCabecera((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  const Cabecera = async () => {
    //Valores iniciales
    let moneda = dataMoneda.find((map) => {
      return map;
    });
    let tipoCobro = dataTipoCobro.find((map) => {
      return map;
    });
    let banco = dataCtacte.find((map) => {
      return map;
    });
    let vendedor = dataVendedor.find((map) => {
      return map;
    });
    //Valores iniciales

    setData((prev) => ({
      ...prev,
      monedaId: moneda.id,
      tipoCobroId: tipoCobro.id,
      personalId: vendedor.id,
    }));

    setDataCabecera({
      monedaId: moneda.id,
      monedaAbonoId: moneda.id,
      fechaEmision: moment().format("YYYY-MM-DD"),
      fechaVencimiento: moment().format("YYYY-MM-DD"),
      fechaAbono: moment().format("YYYY-MM-DD"),
      tipoCobroId: tipoCobro.id,
      cuentaCorrienteId: banco.id,
      cuentaCorrienteDescripcion: banco.numero + " + " + banco.descripcion,
      porcentajeInteres: 0,
      montoInteres: 0,
    });
    setCheckInteres(false);
  };
  const Banco = async ({ target }) => {
    let banco = dataCtacte.find((map) => map.id == target.value);
    setDataCabecera((prevState) => ({
      ...prevState,
      cuentaCorrienteId: target.value,
      cuentaCorrienteDescripcion:
        banco.numero + " / " + banco.entidadBancariaNombre,
    }));

    setData((prevState) => ({
      ...prevState,
      monedaId: banco.monedaId,
      nombreBanco: banco.entidadBancariaNombre,
    }));
  };
  const MontoAbonado = async ({ target }) => {
    //Valores
    //Cabecera
    let saldoCabecera = Number(document.getElementById("saldo").value);
    let monedaCabecera = document.getElementById("monedaIdDocumento").value;
    //Cabecera

    let tipoCambio = Number(
      document.getElementById("tipoCambioCabecera").value
    );
    let monedaAbono = document.getElementById("monedaAbonoId").value;
    let montoAbonado = Number(document.getElementById("montoAbonado").value);
    let abono = Number(document.getElementById("abono").value);
    let nuevoSaldo = Number(document.getElementById("nuevoSaldo").value);
    //Valores

    //Valida el target
    if (target.name == "monedaAbonoId") {
      monedaAbono = target.value;
    }
    if (target.name == "montoAbonado") {
      montoAbonado = Number(target.value);
    }
    if (target.name == "tipoCambio") {
      tipoCambio = Number(target.value);
    }
    //Valida el target

    //Conversion
    if (monedaCabecera != monedaAbono) {
      const model = await Funciones.ConvertirPreciosAMoneda(
        "compra",
        {
          precioCompra: montoAbonado,
          precioVenta1: montoAbonado,
          precioVenta2: montoAbonado,
          precioVenta3: montoAbonado,
          precioVenta4: montoAbonado,
        },
        monedaCabecera,
        tipoCambio
      );

      if (model != null) {
        abono = Funciones.RedondearNumero(model.precioCompra, 2);
      }
    } else {
      abono = montoAbonado;
    }
    //Conversion

    nuevoSaldo = Funciones.RedondearNumero(saldoCabecera - abono, 2);

    setDataCabecera((prevState) => ({
      ...prevState,
      monedaAbonoId: monedaAbono,
      tipoCambio: Funciones.RedondearNumero(tipoCambio, 2),
      montoAbonado: Funciones.RedondearNumero(montoAbonado, 2),
      abono: Funciones.RedondearNumero(abono, 2),
      nuevoSaldo: Funciones.RedondearNumero(nuevoSaldo, 2),
    }));
  };
  const Interes = async ({ target }) => {
    let abono = Number(document.getElementById("abono").value);
    if (abono > 0) {
      if (target.name == "porcentajeInteres") {
        //Calcula el monto
        let porcentaje = Number(target.value);
        let montoInteres = Number(
          document.getElementById("montoInteres").value
        );
        montoInteres = Funciones.RedondearNumero(abono * (porcentaje / 100), 2);
        setDataCabecera((prevState) => ({
          ...prevState,
          porcentajeInteres: Funciones.RedondearNumero(porcentaje, 2),
          montoInteres: Funciones.RedondearNumero(montoInteres, 2),
        }));
        //Calcula el monto
      } else {
        //Calcula el porcentaje
        let porcentaje = Number(
          document.getElementById("porcentajeInteres").value
        );
        let montoInteres = Number(target.value);

        porcentaje = Funciones.RedondearNumero(montoInteres / abono, 2);
        setDataCabecera((prevState) => ({
          ...prevState,
          porcentajeInteres: Funciones.RedondearNumero(porcentaje, 2),
          montoInteres: Funciones.RedondearNumero(montoInteres, 2),
        }));
        //Calcula el porcentaje
      }
    } else {
      toast.error("Se requiere el Importe Abonado.", {
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
  //Artículos
  //#endregion

  //#region Funciones Detalles
  const ValidarDetalle = async () => {
    //Valida Documento
    if (dataCabecera.numeroDocumento == undefined) {
      document.getElementById("consultarDocumentoModal").focus();
      return [false, "Seleccione un documento"];
    }

    //Segundo Bloque
    if (Funciones.IsNumeroValido(dataCabecera.tipoCambio, false) != "") {
      document.getElementById("tipoCambioCabecera").focus();
      return [
        false,
        "Tipo de cambio: " +
          Funciones.IsNumeroValido(dataCabecera.tipoCambio, false),
      ];
    }
    if (dataCabecera.numeroOperacion == undefined) {
      document.getElementById("numeroOperacion").focus();

      return [false, "El número de operación es requerido"];
    }
    if (checkInteres) {
      if (
        Funciones.IsNumeroValido(dataCabecera.porcentajeInteres, false) != ""
      ) {
        document.getElementById("porcentajeInteres").focus();
        return [
          false,
          "% Interés: " +
            Funciones.IsNumeroValido(dataCabecera.porcentajeInteres, false),
        ];
      }
      if (Funciones.IsNumeroValido(dataCabecera.montoInteres, false) != "") {
        document.getElementById("montoInteres").focus();
        return [
          false,
          "Monto Interés: " +
            Funciones.IsNumeroValido(dataCabecera.montoInteres, false),
        ];
      }
    }
    if (Funciones.IsNumeroValido(dataCabecera.montoAbonado, false) != "") {
      document.getElementById("montoAbonado").focus();
      return [
        false,
        "Monto Abonado: " +
          Funciones.IsNumeroValido(dataCabecera.montoAbonado, false),
      ];
    }
    //Valia precio Venta debe ser mayor a precio Compra
    if (dataCabecera.abono != undefined) {
      if (dataCabecera.abono > dataCabecera.saldo) {
        document.getElementById("montoAbonado").focus();
        return [false, "El importe abonado es mayor al saldo"];
      }
    }
    //Segundo Bloque

    return [true, ""];
  };
  const AgregarDetalle = async () => {
    //Obtiene resultado de Validación
    let resultado = await ValidarDetalle();

    if (resultado[0]) {
      //Si tiene detalleId entonces modifica registro
      if (dataCabecera.detalleId != undefined) {
        let dataDetalleMod = dataDetalle.map((map) => {
          if (map.documentoReferenciaId == dataCabecera.documentoReferenciaId) {
            return {
              detalleId: dataCabecera.detalleId,
              fechaAbono: dataCabecera.fechaAbono,
              fechaEmision: dataCabecera.fechaEmision,
              fechaVencimiento: dataCabecera.fechaVencimiento,
              tipoCobroId: dataCabecera.tipoCobroId,
              numeroOperacion: dataCabecera.numeroOperacion,
              cuentaCorrienteId: dataCabecera.cuentaCorrienteId,
              cuentaCorrienteDescripcion:
                dataCabecera.cuentaCorrienteDescripcion,
              numeroDocumento: dataCabecera.numeroDocumento,
              documentoReferenciaId: dataCabecera.documentoReferenciaId,
              clienteId: dataCabecera.clienteId,
              clienteNombre: dataCabecera.clienteNombre,
              saldo: dataCabecera.saldo,
              abono: dataCabecera.abono,
              nuevoSaldo: dataCabecera.nuevoSaldo,
              porcentajeInteres: dataCabecera.porcentajeInteres,
              montoInteres: dataCabecera.montoInteres,
              total: dataCabecera.total,
              monedaId: dataCabecera.monedaId,
              tipoCambio: dataCabecera.tipoCambio,
              montoAbonado: dataCabecera.montoAbonado,
              monedaAbonoId: dataCabecera.monedaAbonoId,
            };
          } else {
            return map;
          }
        });
        setDataDetalle(dataDetalleMod);
        setRefrescar(true);
      } else {
        let model = dataDetalle.find((map) => {
          return (
            map.documentoReferenciaId == dataCabecera.documentoReferenciaId
          );
        });

        if (model == undefined) {
          setDataDetalle((prev) => [
            ...prev,
            {
              detalleId: detalleId,
              fechaAbono: dataCabecera.fechaAbono,
              fechaEmision: dataCabecera.fechaEmision,
              fechaVencimiento: dataCabecera.fechaVencimiento,
              tipoCobroId: dataCabecera.tipoCobroId,
              numeroOperacion: dataCabecera.numeroOperacion,
              cuentaCorrienteId: dataCabecera.cuentaCorrienteId,
              cuentaCorrienteDescripcion:
                dataCabecera.cuentaCorrienteDescripcion,
              numeroDocumento: dataCabecera.numeroDocumento,
              documentoReferenciaId: dataCabecera.documentoReferenciaId,
              clienteId: dataCabecera.clienteId,
              clienteNombre: dataCabecera.clienteNombre,
              saldo: dataCabecera.saldo,
              abono: dataCabecera.abono,
              nuevoSaldo: dataCabecera.nuevoSaldo,
              porcentajeInteres: dataCabecera.porcentajeInteres,
              montoInteres: dataCabecera.montoInteres,
              total: dataCabecera.total,
              monedaId: dataCabecera.monedaId,
              tipoCambio: dataCabecera.tipoCambio,
              montoAbonado: dataCabecera.montoAbonado,
              monedaAbonoId: dataCabecera.monedaAbonoId,
            },
          ]);

          //Anidar Documento de referencia
          let documentos = "";
          //Valida si contiene datos para mapearlo
          if (data.documentosReferencia == "") {
            documentos = [
              ...data.documentosReferencia,
              dataCabecera.numeroDocumento,
            ];
          } else {
            documentos = [
              ...[data.documentosReferencia],
              dataCabecera.numeroDocumento,
            ];
          }
          setData((prevState) => ({
            ...prevState,
            documentosReferencia: documentos.toString(),
          }));
          //Anidar Documento de referencia

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
      Cabecera();
      //Luego de añadir el artículo se limpia

      document.getElementById("consultarDocumentoModal").focus();
    } else {
      //NO cumple validación
      if (resultado[1] != "consultarDocumento") {
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
  const CargarDetalle = async (value, click = false) => {
    if (modo != "Consultar") {
      if (click) {
        let row = value.target.closest("tr");
        let id = row.firstChild.innerText;
        let model = dataDetalle.find((map) => map.documentoReferenciaId === id);
        setDataCabecera(model);
        if (model.porcentajeInteres > 0) {
          setCheckInteres(true);
        }
      } else {
        let model = dataDetalle.find(
          (map) => map.documentoReferenciaId === value
        );
        setDataCabecera(model);
        if (model.porcentajeInteres > 0) {
          setCheckInteres(true);
        }
      }
      document.getElementById("fechaAbono").focus();
    }
  };
  const EliminarDetalle = async (id) => {
    let i = 1;
    let nuevoDetalle = dataDetalle.filter(
      (map) => map.documentoReferenciaId !== id
    );
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

      let nuevoDocumentoReferencia = nuevoDetalle.map((map) => {
        return map.numeroDocumento;
      });
      setData((prevState) => ({
        ...prevState,
        documentosReferencia: nuevoDocumentoReferencia.toString(),
      }));
    } else {
      //Asgina directamente a 1
      setDetalleId(nuevoDetalle.length + 1);
      setDataDetalle(nuevoDetalle);

      setData((prevState) => ({
        ...prevState,
        documentosReferencia: "",
      }));
    }
    setRefrescar(true);
  };

  //Calculos
  const ActualizarTotales = async () => {
    //Suma los montoAbonado de los detalles
    let montoAbonado = dataDetalle.reduce((i, map) => {
      return i + map.montoAbonado;
    }, 0);

    //Suma los montoInteres de los detalles
    let montoInteres = dataDetalle.reduce((i, map) => {
      return i + map.montoInteres;
    }, 0);

    setData((prevState) => ({
      ...prevState,
      total: Funciones.RedondearNumero(montoAbonado + montoInteres, 2),
    }));
  };
  //Calculos
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Finanzas/PlanillaCobro/FormularioTablas`
    );
    setDataVendedor(
      result.data.data.vendedores.map((res) => ({
        id: res.id,
        nombre:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
    setDataMoneda(result.data.data.monedas);
    setDataTipoCobro(result.data.data.tiposCobro);
    setDataCtacte(
      result.data.data.cuentasCorrientes.map((res) => ({
        ...res,
        id: res.cuentaCorrienteId,
        descripcion:
          res.monedaId == "D"
            ? res.numero + " | " + res.entidadBancariaNombre + " |  [US$]"
            : res.numero + " | " + res.entidadBancariaNombre + " |  [S/.]",
      }))
    );
  };
  const GetPorIdTipoCambio = async (id, origen = "data") => {
    const result = await ApiMasy.get(`api/Mantenimiento/TipoCambio/${id}`);
    if (result.name == "AxiosError") {
      if (Object.entries(result.response.data).length > 0) {
        setTipoMensaje(result.response.data.messages[0].tipo);
        setMensaje(result.response.data.messages[0].textos);
      } else {
        setTipoMensaje(1);
        setMensaje([result.message]);
      }
      if (origen == "data") {
        setData({
          ...data,
          tipoCambio: 0,
        });
      } else {
        setDataCabecera((prevState) => ({ ...prevState, tipoCambio: 0 }));
        //Recalculamos el tipo de cambio
        MontoAbonado({ target: { name: "tipoCambio", value: 0 } });
        //Recalculamos el tipo de cambio
      }
    } else {
      if (origen == "data") {
        setData({
          ...data,
          tipoCambio: result.data.data.precioVenta,
        });
      } else {
        setDataCabecera((prevState) => ({
          ...prevState,
          tipoCambio: result.data.data.precioVenta,
        }));

        //Recalculamos el tipo de cambio
        MontoAbonado({
          target: { name: "tipoCambio", value: result.data.data.precioVenta },
        });
        //Recalculamos el tipo de cambio
      }
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
  const AbrirFiltroConcepto = async () => {
    setModalConcepto(true);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "documentoReferenciaId",
      accessor: "documentoReferenciaId",
    },
    {
      Header: "Item",
      accessor: "detalleId",
      Cell: ({ value }) => {
        return <p className="text-center">{value}</p>;
      },
    },
    {
      Header: "Fecha",
      accessor: "fechaAbono",
      Cell: ({ value }) => {
        return (
          <p className="text-center">{moment(value).format("DD/MM/YY")}</p>
        );
      },
    },
    {
      Header: "Documento",
      accessor: "numeroDocumento",
    },
    {
      Header: "Banco",
      accessor: "cuentaCorrienteDescripcion",
    },
    {
      Header: "N° Operación",
      accessor: "numeroOperacion",
    },
    {
      Header: "T. Abono",
      accessor: "tipoCobroId",
      Cell: ({ value }) => {
        let model = dataTipoCobro.find((map) => map.id == value);
        return <p>{model.descripcion}</p>;
      },
    },
    {
      Header: "M",
      accessor: "monedaId",
      Cell: ({ value }) => {
        return <p className="text-center">{value == "S" ? "S/." : "US$"}</p>;
      },
    },
    {
      Header: "Monto",
      accessor: "abono",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-1.5">
            {Funciones.RedondearNumero(value, 4)}
          </p>
        );
      },
    },
    {
      Header: "M",
      accessor: "monedaAbonoId",
      Cell: ({ value }) => {
        return <p className="text-center">{value == "S" ? "S/." : "US$"}</p>;
      },
    },
    {
      Header: "M. Abonado",
      accessor: "montoAbonado",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-1.5">
            {Funciones.RedondearNumero(value, 4)}
          </p>
        );
      },
    },
    {
      Header: "N. Saldo",
      accessor: "nuevoSaldo",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-2.5">
            {Funciones.RedondearNumero(value, 4)}
          </p>
        );
      },
    },
    {
      Header: "% Interes",
      accessor: "porcentajeInteres",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-2.5">
            {Funciones.RedondearNumero(value, 4)}
          </p>
        );
      },
    },
    {
      Header: "Monto Interes",
      accessor: "montoInteres",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-2.5">
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
              <div className={G.TablaBotonModificar}>
                <button
                  id="boton"
                  onClick={() =>
                    CargarDetalle(row.values.documentoReferenciaId)
                  }
                  className="p-0 px-1"
                  title="Click para modificar registro"
                >
                  <FaPen></FaPen>
                </button>
              </div>

              <div className={G.TablaBotonEliminar}>
                <button
                  id="boton-eliminar"
                  onClick={() => {
                    EliminarDetalle(row.values.documentoReferenciaId);
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

  //#region Render
  return (
    <>
      {Object.entries(dataMoneda).length > 0 && (
        <>
          <ModalCrud
            setModal={setModal}
            objeto={data}
            modo={modo}
            menu={["Finanzas", "PlanillaCobro"]}
            titulo="Planilla de Cobro"
            cerrar={false}
            foco={document.getElementById("tablaPlanillaCobro")}
            tamañoModal={[G.ModalFull, G.Form + " px-10 "]}
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
                G.ContenedorBasico + " mb-4 " + G.FondoContenedor
              }
            >
              <div className={G.ContenedorInputs}>
                <div className={G.InputTercio}>
                  <label htmlFor="numero" className={G.LabelStyle}>
                    Planilla N°
                  </label>
                  <input
                    type="text"
                    id="numero"
                    name="numero"
                    placeholder="Planilla N°"
                    autoComplete="off"
                    autoFocus
                    disabled={modo == "Nuevo" ? false : true}
                    value={data.numero ?? ""}
                    onChange={HandleData}
                    onBlur={(e) => Numeracion(e)}
                    className={
                      G.InputStyle
                    }
                  />
                </div>
                <div className={G.InputTercio}>
                  <label htmlFor="fechaRegistro" className={G.LabelStyle}>
                    F. Registro
                  </label>
                  <input
                    type="date"
                    id="fechaRegistro"
                    name="fechaRegistro"
                    autoComplete="off"
                    autoFocus={modo == "Modificar"}
                    disabled={modo == "Consultar"}
                    value={moment(data.fechaRegistro ?? "").format(
                      "yyyy-MM-DD"
                    )}
                    onChange={HandleData}
                    onBlur={() => {
                      FechaEmision();
                    }}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputTercio}>
                  <label htmlFor="fechaVenta" className={G.LabelStyle}>
                    F. Venta
                  </label>
                  <input
                    type="date"
                    id="fechaVenta"
                    name="fechaVenta"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={moment(data.fechaVenta ?? "").format("yyyy-MM-DD")}
                    onChange={HandleData}
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
                    className={
                      G.BotonBuscar +
                      G.BotonPrimary +
                      " !rounded-none"
                    }
                    hidden={modo == "Consultar"}
                    disabled={checkVarios}
                    onKeyDown={(e) => Funciones.KeyClick(e)}
                    onClick={() => AbrirFiltroCliente()}
                  >
                    <FaSearch></FaSearch>
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
                      ></Checkbox>
                    </div>
                    <label htmlFor="varios" className={G.LabelCheckStyle}>
                      Varios
                    </label>
                  </div>
                </div>
              </div>

              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <label
                    htmlFor="clienteDireccion"
                    className={G.LabelStyle}
                  >
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="clienteDireccion"
                    name="clienteDireccion"
                    placeholder="Dirección"
                    autoComplete="off"
                    disabled={true}
                    value={data.clienteDireccion ?? ""}
                    className={G.InputStyle}
                  />
                </div>
              </div>

              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <label htmlFor="personalId" className={G.LabelStyle}>
                    Responsable
                  </label>
                  <select
                    id="personalId"
                    name="personalId"
                    value={data.personalId ?? ""}
                    onChange={HandleData}
                    disabled={modo == "Consultar"}
                    className={G.InputStyle}
                  >
                    {dataVendedor.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={G.InputFull}>
                  <label htmlFor="nombreBanco" className={G.LabelStyle}>
                    Banco
                  </label>
                  <input
                    type="text"
                    id="nombreBanco"
                    name="nombreBanco"
                    placeholder="Banco"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.nombreBanco ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
              </div>

              <div className={G.ContenedorInputs}>
                <div className={G.InputTercio}>
                  <label
                    htmlFor="monedaIdCabecera"
                    className={G.LabelStyle}
                  >
                    Moneda
                  </label>
                  <select
                    id="monedaIdCabecera"
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
                    disabled={modo == "Consultar"}
                    value={data.tipoCambio ?? ""}
                    onChange={HandleData}
                    className={
                      modo != "Consultar"
                        ? G.InputBoton
                        : G.InputStyle
                    }
                  />
                  <button
                    id="consultarTipoCambio"
                    className={
                      G.BotonBuscar + G.Anidado + G.BotonPrimary
                    }
                    hidden={modo == "Consultar"}
                    onKeyDown={(e) => Funciones.KeyClick(e)}
                    onClick={() => {
                      GetPorIdTipoCambio(data.fechaEmision);
                    }}
                  >
                    <FaUndoAlt></FaUndoAlt>
                  </button>
                </div>
                <div className={G.InputTercio}>
                  <label htmlFor="tipoCobroId" className={G.LabelStyle}>
                    Tipo Cobro
                  </label>
                  <select
                    id="tipoCobroId"
                    name="tipoCobroId"
                    value={data.tipoCobroId ?? ""}
                    onChange={HandleData}
                    disabled={modo == "Consultar"}
                    className={G.InputStyle}
                  >
                    {dataTipoCobro
                      .filter((model) => model.tipoVentaCompraId == "CO")
                      .map((map) => (
                        <option key={map.id} value={map.id}>
                          {map.descripcion}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <label
                    htmlFor="documentosReferencia"
                    className={G.LabelStyle}
                  >
                    Doc. Referencia
                  </label>
                  <input
                    type="text"
                    id="documentosReferencia"
                    name="documentosReferencia"
                    placeholder="Documentos de Referencia"
                    autoComplete="off"
                    disabled={true}
                    value={data.documentosReferencia ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
              </div>
              <div className={G.ContenedorInputs}>
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
            </div>
            {/* Cabecera */}

            {/* Detalles */}
            {modo != "Consultar" && (
              <div
                className={
                  G.ContenedorBasico + G.FondoContenedor + " mb-2"
                }
              >
                <div className={G.ContenedorInputs}>
                  <div className={G.InputFull}>
                    <label
                      htmlFor="numeroDocumento"
                      className={G.LabelStyle}
                    >
                      Documento
                    </label>
                    <input
                      type="text"
                      id="numeroDocumento"
                      name="numeroDocumento"
                      placeholder="Buscar Documento"
                      autoComplete="off"
                      disabled={true}
                      value={dataCabecera.numeroDocumento ?? ""}
                      onChange={ValidarDataCabecera}
                      className={G.InputBoton}
                    />
                    <button
                      id="consultarDocumentoModal"
                      className={G.BotonBuscar + G.BotonPrimary}
                      hidden={modo == "Consultar"}
                      onKeyDown={(e) => Funciones.KeyClick(e)}
                      onClick={(e) => {
                        setDataConcepto([]);
                        AbrirFiltroConcepto(e);
                      }}
                    >
                      <FaSearch></FaSearch>
                    </button>
                  </div>
                  <div className={G.InputMitad}>
                    <label
                      htmlFor="monedaIdDocumento"
                      className={G.LabelStyle}
                    >
                      Moneda
                    </label>
                    <select
                      id="monedaIdDocumento"
                      name="monedaId"
                      value={dataCabecera.monedaId ?? ""}
                      disabled={true}
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
                      disabled={true}
                      value={moment(
                        dataCabecera.fechaEmision ?? moment()
                      ).format("yyyy-MM-DD")}
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.InputMitad}>
                    <label
                      htmlFor="fechaVencimiento"
                      className={G.LabelStyle}
                    >
                      Fecha Vencimiento
                    </label>
                    <input
                      type="date"
                      id="fechaVencimiento"
                      name="fechaVencimiento"
                      autoComplete="off"
                      disabled={true}
                      value={moment(
                        dataCabecera.fechaVencimiento ?? moment()
                      ).format("yyyy-MM-DD")}
                      className={G.InputStyle}
                    />
                  </div>
                </div>
                <div className={G.ContenedorInputs}>
                  <div className={G.InputMitad}>
                    <label htmlFor="total" className={G.LabelStyle}>
                      Total Documento
                    </label>
                    <input
                      type="number"
                      id="total"
                      name="total"
                      placeholder="Total Documento"
                      autoComplete="off"
                      min={0}
                      disabled={true}
                      value={dataCabecera.total ?? ""}
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.InputMitad}>
                    <label htmlFor="saldo" className={G.LabelStyle}>
                      Saldo por Cobrar
                    </label>
                    <input
                      type="number"
                      id="saldo"
                      name="saldo"
                      placeholder="Saldo"
                      autoComplete="off"
                      min={0}
                      disabled={true}
                      value={dataCabecera.saldo ?? ""}
                      className={G.InputStyle}
                    />
                  </div>
                </div>

                <div
                  className={G.ContenedorBasico + G.FondoContenedor}
                >
                  <div className={G.ContenedorInputs}>
                    <div className={G.InputTercio}>
                      <label htmlFor="fechaAbono" className={G.LabelStyle}>
                        F. Abono
                      </label>
                      <input
                        type="date"
                        id="fechaAbono"
                        name="fechaAbono"
                        autoComplete="off"
                        disabled={
                          modo == "Consultar" || dataCabecera.saldo == undefined
                            ? true
                            : false
                        }
                        value={moment(
                          dataCabecera.fechaAbono ?? moment()
                        ).format("yyyy-MM-DD")}
                        onChange={ValidarDataCabecera}
                        className={G.InputStyle}
                      />
                    </div>
                    <div className={G.InputTercio}>
                      <label
                        htmlFor="monedaAbonoId"
                        className={G.LabelStyle}
                      >
                        Moneda
                      </label>
                      <select
                        id="monedaAbonoId"
                        name="monedaAbonoId"
                        value={dataCabecera.monedaAbonoId ?? ""}
                        onChange={MontoAbonado}
                        disabled={
                          modo == "Consultar" || dataCabecera.saldo == undefined
                            ? true
                            : false
                        }
                        className={G.InputStyle}
                      >
                        {dataMoneda.map((map) => (
                          <option key={map.id} value={map.id}>
                            {map.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={G.InputTercio}>
                      <label
                        htmlFor="tipoCambioCabecera"
                        className={G.LabelStyle}
                      >
                        Tipo Cambio
                      </label>
                      <input
                        type="number"
                        id="tipoCambioCabecera"
                        name="tipoCambio"
                        placeholder="Tipo de Cambio"
                        autoComplete="off"
                        min={0}
                        disabled={
                          modo == "Consultar" || dataCabecera.saldo == undefined
                            ? true
                            : false
                        }
                        value={dataCabecera.tipoCambio ?? ""}
                        onChange={MontoAbonado}
                        className={
                          modo == "Consultar" || dataCabecera.saldo == undefined
                            ? G.InputStyle
                            : G.InputBoton
                        }
                      />
                      <button
                        id="consultarTipoCambio"
                        className={
                          G.BotonBuscar +
                          G.Anidado +
                          G.BotonPrimary
                        }
                        hidden={
                          modo == "Consultar" || dataCabecera.saldo == undefined
                            ? true
                            : false
                        }
                        onKeyDown={(e) => Funciones.KeyClick(e)}
                        onClick={() =>
                          GetPorIdTipoCambio(
                            dataCabecera.fechaAbono,
                            "cabecera"
                          )
                        }
                      >
                        <FaUndoAlt></FaUndoAlt>
                      </button>
                    </div>
                  </div>

                  <div className={G.ContenedorInputs}>
                    <div className={G.InputMitad}>
                      <label
                        htmlFor="tipoCobroId"
                        className={G.LabelStyle}
                      >
                        Tipo Abono
                      </label>
                      <select
                        id="tipoCobroId"
                        name="tipoCobroId"
                        value={dataCabecera.tipoCobroId ?? ""}
                        onChange={ValidarDataCabecera}
                        disabled={
                          modo == "Consultar" || dataCabecera.saldo == undefined
                            ? true
                            : false
                        }
                        className={G.InputStyle}
                      >
                        {dataTipoCobro
                          .filter((model) => model.tipoVentaCompraId == "CO")
                          .map((map) => (
                            <option key={map.id} value={map.id}>
                              {map.descripcion}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className={G.InputFull}>
                      <label
                        htmlFor="cuentaCorrienteId"
                        className={G.LabelStyle}
                      >
                        Banco
                      </label>
                      <select
                        id="cuentaCorrienteId"
                        name="cuentaCorrienteId"
                        value={dataCabecera.cuentaCorrienteId ?? ""}
                        onChange={Banco}
                        disabled={
                          modo == "Consultar" || dataCabecera.saldo == undefined
                            ? true
                            : false
                        }
                        className={G.InputStyle}
                      >
                        {dataCtacte.map((map) => (
                          <option key={map.id} value={map.id}>
                            {map.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={G.ContenedorInputs}>
                    <div className={G.InputMitad}>
                      <label
                        htmlFor="numeroOperacion"
                        className={G.LabelStyle}
                      >
                        N° Operación
                      </label>
                      <input
                        type="numeroOperacion"
                        id="numeroOperacion"
                        name="numeroOperacion"
                        placeholder="N° Operación"
                        autoComplete="off"
                        min={0}
                        disabled={
                          modo == "Consultar" || dataCabecera.saldo == undefined
                            ? true
                            : false
                        }
                        value={dataCabecera.numeroOperacion ?? ""}
                        onChange={ValidarDataCabecera}
                        className={G.InputStyle}
                      />
                    </div>

                    <div className={G.InputTercio}>
                      <div className={G.Input + "w-28"}>
                        <div className={G.CheckStyle}>
                          <Checkbox
                            inputId="interes"
                            name="interes"
                            disabled={
                              modo == "Consultar" ||
                              dataCabecera.saldo == undefined
                                ? true
                                : false
                            }
                            onChange={ValidarDataCabecera}
                            checked={checkInteres ? true : ""}
                          ></Checkbox>
                        </div>
                        <label
                          htmlFor="interes"
                          className={G.LabelCheckStyle + "rounded-r-none"}
                        >
                          % Interes
                        </label>
                      </div>
                      <input
                        type="number"
                        id="porcentajeInteres"
                        name="porcentajeInteres"
                        placeholder="% Interés"
                        autoComplete="off"
                        min={0}
                        value={dataCabecera.porcentajeInteres ?? ""}
                        onChange={Interes}
                        disabled={
                          modo == "Consultar" || !checkInteres ? true : false
                        }
                        className={G.InputStyle}
                      />
                    </div>
                    <div className={G.InputTercio}>
                      <label
                        htmlFor="montoInteres"
                        className={G.LabelStyle}
                      >
                        Monto Interés
                      </label>
                      <input
                        type="number"
                        id="montoInteres"
                        name="montoInteres"
                        placeholder="Monto Interés"
                        autoComplete="off"
                        min={0}
                        value={dataCabecera.montoInteres ?? ""}
                        onChange={Interes}
                        disabled={
                          modo == "Consultar" || !checkInteres ? true : false
                        }
                        className={G.InputStyle}
                      />
                    </div>
                  </div>

                  <div className={G.ContenedorInputs}>
                    <div className={G.InputTercio}>
                      <label
                        htmlFor="montoAbonado"
                        className={G.LabelStyle}
                      >
                        Monto Abonado
                      </label>
                      <input
                        type="number"
                        id="montoAbonado"
                        name="montoAbonado"
                        placeholder="Monto Abonado"
                        autoComplete="off"
                        min={0}
                        disabled={
                          modo == "Consultar" || dataCabecera.saldo == undefined
                            ? true
                            : false
                        }
                        value={dataCabecera.montoAbonado ?? ""}
                        onChange={MontoAbonado}
                        className={G.InputStyle}
                      />
                    </div>
                    <div className={G.InputTercio}>
                      <label htmlFor="abono" className={G.LabelStyle}>
                        Importe Abonado
                      </label>
                      <input
                        type="number"
                        id="abono"
                        name="abono"
                        placeholder="Importe Abonado"
                        autoComplete="off"
                        min={0}
                        disabled={true}
                        value={dataCabecera.abono ?? ""}
                        onChange={ValidarDataCabecera}
                        className={G.InputStyle}
                      />
                    </div>
                    <div className={G.InputTercio}>
                      <label htmlFor="nuevoSaldo" className={G.LabelStyle}>
                        Nuevo Saldo
                      </label>
                      <input
                        type="number"
                        id="nuevoSaldo"
                        name="nuevoSaldo"
                        placeholder="Nuevo Saldo"
                        autoComplete="off"
                        min={0}
                        disabled={true}
                        value={dataCabecera.nuevoSaldo ?? ""}
                        onChange={ValidarDataCabecera}
                        className={
                          modo == "Consultar"
                            ? G.InputStyle
                            : G.InputBoton
                        }
                      />
                      <button
                        id="enviarDetalle"
                        className={G.BotonBuscar + G.BotonPrimary}
                        hidden={modo == "Consultar"}
                        onKeyDown={(e) => Funciones.KeyClick(e)}
                        onClick={(e) => AgregarDetalle(e)}
                      >
                        <FaPlus></FaPlus>
                      </button>
                    </div>
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
            </DivTabla>
            {/* Tabla Detalle */}

            {/*Tabla Footer*/}
            <div className={G.ContenedorFooter}>
              <div className="flex">
                <div className={G.FilaFooter + G.FilaVacia}></div>
                <div className={G.FilaFooter + G.FilaPrecio}>
                  <p className={G.FilaContenido}>Total a Pagar</p>
                </div>
                <div className={G.FilaFooter + G.FilaImporte}>
                  <p className={G.FilaContenido}>{data.total ?? "0.00"}</p>
                </div>
                <div className={G.FilaFooter + G.UltimaFila}></div>
              </div>
            </div>
            {/*Tabla Footer*/}
          </ModalCrud>
        </>
      )}
      {modalCliente && (
        <FiltroCliente
          setModal={setModalCliente}
          setObjeto={setDataCliente}
          foco={document.getElementById("personalId")}
        />
      )}
      {modalConcepto && (
        <FiltroConcepto
          setModal={setModalConcepto}
          setObjeto={setDataConcepto}
          modo="CO"
          foco={document.getElementById("fechaAbono")}
        />
      )}
    </>
  );
  //#endregion
};

export default Modal;
