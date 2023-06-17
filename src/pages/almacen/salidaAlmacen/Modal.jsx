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
import FiltroArticulo from "../../../components/filtro/FiltroArticulo";
import FiltroCliente from "../../../components/filtro/FiltroCliente";
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
    width: 40px;
    text-align: center;
  }

  & th:nth-child(4),
  & th:nth-child(5),
  & th:nth-child(6),
  & th:nth-child(7) {
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
  //GetTablas
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataVendedor, setDataVendedor] = useState([]);
  //GetTablas
  //Data Modales Ayuda
  const [dataCliente, setDataCliente] = useState([]);
  const [dataCabecera, setDataCabecera] = useState([]);
  //Data Modales Ayuda
  //Modales de Ayuda
  const [modalCliente, setModalCliente] = useState(false);
  const [modalArt, setModalArt] = useState(false);
  //Modales de Ayuda

  const [checkVarios, setCheckVarios] = useState(false);
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
      TipoCambio(data.fechaInicio);
    }
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
  //Data General
  const HandleData = async ({ target }) => {
    if (target.name == "incluyeIGV") {
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
  //Data General

  //Cabecera
  const HandleDataCabecera = async ({ target }) => {
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
        cantidad: Funciones.RedondearNumero(cantidad, 2),
        precioUnitario: Funciones.RedondearNumero(precio, 2),
        importe: Funciones.RedondearNumero(importe, 2),
        subTotal: subTotal,
        montoIGV: montoIGV,
      });
    }
  };
  //Cabecera
  //#endregion

  //#region Funciones Detalles
  const ValidarDetalle = async () => {
    if (Object.entries(dataCabecera).length == 0) {
      document.getElementById("consultarArticulo").focus();
      return [false, "Seleccione un Producto"];
    }

    //Valida Descripción
    if (dataCabecera.descripcion == undefined) {
      return [false, "La descripción no puede estar vacía"];
    }
    //Valida Descripción

    //Valida montos
    if (Funciones.IsNumeroValido(data.gastosIndirectos, false) != "") {
      document.getElementById("gastosIndirectos").focus();
      return [
        false,
        "Gastos Indirectos: " +
          Funciones.IsNumeroValido(data.gastosIndirectos, false),
      ];
    }
    if (Funciones.IsNumeroValido(data.cantidadSolicitada, false) != "") {
      document.getElementById("cantidadSolicitada").focus();
      return [
        false,
        "Cantidad Solicitada: " +
          Funciones.IsNumeroValido(data.cantidadSolicitada, false),
      ];
    }
    if (Funciones.IsNumeroValido(data.cantidadProducida, false) != "") {
      document.getElementById("cantidadProducida").focus();
      return [
        false,
        "Cantidad Producida: " +
          Funciones.IsNumeroValido(data.cantidadProducida, false),
      ];
    }
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
            background: "#171B23",
            confirmButtonColor: "#3B8407",
            confirmButtonText: "Confirmar",
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
      document.getElementById("consultarArticulo").focus();
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

    //Calculo Check IncluyeIGV
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
    //Calculo Check IncluyeIGV

    //Calculos
    totalGal = totalNeto / cantidadProducida;
    costoGal = totalGal * tipoCambio;
    costoGalGasIndirectos = costoGal * (gastosIndirectos / 100);
    costoGalIgv =
      (costoGal + costoGalGasIndirectos) * (porcentajeIgvSeleccionado / 100);
    //Calculos

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
  //Calculos
  //#endregion

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Almacen/SalidaAlmacen/FormularioTablas`
    );
    setDataVendedor(
      result.data.data.personal.map((res) => ({
        id: res.id,
        nombre:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
    setDataMoneda(result.data.data.monedas);

    if (modo == "Nuevo") {
      //Datos Iniciales
      let personal = result.data.data.personal.find((map) => map);
      let monedas = result.data.data.monedas.find((map) => map);
      //Datos Iniciales
      setData((prev) => ({
        ...prev,
        personalId: personal.id,
        monedaId: monedas.id,
      }));
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
              <div className={G.TablaBotonModificar}>
                <button
                  id="boton-modificar"
                  onClick={() => CargarDetalle(row.values.id)}
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
                    EliminarDetalle(row.values.id);
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

  //#region Render
  return (
    <>
      {Object.entries(dataMoneda).length > 0 && (
        <>
          <ModalCrud
            setModal={setModal}
            objeto={data}
            modo={modo}
            menu={"Almacen/SalidaAlmacen"}
            titulo="Salida de Almacén"
            cerrar={false}
            foco={document.getElementById("tablaSalidaAlmacen")}
            tamañoModal={[G.ModalFull, G.Form]}
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
            {/* Cabecera */}
            <div className={G.ContenedorBasico + " mb-2 " + G.FondoContenedor}>
              <div className={G.ContenedorInputs}>
                <div className={G.InputTercio}>
                  <label htmlFor="serie" className={G.LabelStyle}>
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
                    onChange={HandleData}
                    onBlur={(e) => Numeracion(e)}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputTercio}>
                  <label htmlFor="numero" className={G.LabelStyle}>
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
                    onChange={HandleData}
                    onBlur={(e) => Numeracion(e)}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputTercio}>
                  <label htmlFor="fechaEmision" className={G.LabelStyle}>
                    Fecha Emisión
                  </label>
                  <input
                    type="date"
                    id="fechaEmision"
                    name="fechaEmision"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={moment(data.fechaInicio ?? "").format("yyyy-MM-DD")}
                    onChange={HandleData}
                    onBlur={FechaEmision}
                    className={G.InputStyle}
                  />
                </div>
              </div>
              <div className={G.ContenedorInputs}>
                <div className={G.InputTercio}>
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
                      modo != "Consultar" ? G.InputBoton : G.InputStyle
                    }
                  />
                  <button
                    id="consultarTipoCambio"
                    className={G.BotonBuscar + G.Anidado + G.BotonPrimary}
                    hidden={modo == "Consultar"}
                    onKeyDown={(e) => Funciones.KeyClick(e)}
                    onClick={() => {
                      TipoCambio(data.fechaInicio);
                    }}
                  >
                    <FaUndoAlt></FaUndoAlt>
                  </button>
                </div>
                <div className={G.InputTercio}>
                  <label htmlFor="fechaTerminacion" className={G.LabelStyle}>
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
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
              </div>
              <div className={G.ContenedorInputs}>
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
                    id="consultar"
                    className={
                      G.BotonBuscar + G.BotonPrimary + " !rounded-none"
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

              <div className={G.ContenedorInputs}>
                <div className={G.InputMitad}>
                  <label htmlFor="lineaProduccion" className={G.LabelStyle}>
                    Línea de Producción
                  </label>
                  <input
                    type="text"
                    id="lineaProduccion"
                    name="lineaProduccion"
                    placeholder="Línea de Producción"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.lineaProduccion ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputMitad}>
                  <label htmlFor="envasado" className={G.LabelStyle}>
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
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
              </div>

              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <label htmlFor="numeroLote" className={G.LabelStyle}>
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
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputFull}>
                  <label htmlFor="guiaRemision" className={G.LabelStyle}>
                    Guía Remisión
                  </label>
                  <input
                    type="text"
                    id="guiaRemision"
                    name="guiaRemision"
                    placeholder="Guía Remisión"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.guiaRemision ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
              </div>
              <div className={G.ContenedorInputs}>
                <div className={G.InputMitad}>
                  <label htmlFor="porcentajeIGV" className={G.LabelStyle}>
                    % IGV
                  </label>
                  <input
                    type="number"
                    id="porcentajeIGV"
                    name="porcentajeIGV"
                    placeholder="% IGV"
                    autoComplete="off"
                    min={0}
                    disabled={modo == "Consultar"}
                    value={data.porcentajeIGV ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputMitad}>
                  <label htmlFor="gastosIndirectos" className={G.LabelStyle}>
                    Gastos Indirectos
                  </label>
                  <input
                    type="number"
                    id="gastosIndirectos"
                    name="gastosIndirectos"
                    placeholder="Gastos Indirectos"
                    autoComplete="off"
                    min={0}
                    disabled={modo == "Consultar"}
                    value={data.gastosIndirectos ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
              </div>
              <div className={G.ContenedorInputs}>
                <div className={G.InputMitad}>
                  <label htmlFor="cantidadSolicitada" className={G.LabelStyle}>
                    Cant. Solicitada
                  </label>
                  <input
                    type="number"
                    id="cantidadSolicitada"
                    name="cantidadSolicitada"
                    placeholder="Cantidad Solicitada"
                    autoComplete="off"
                    min={0}
                    disabled={modo == "Consultar"}
                    value={data.cantidadSolicitada ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputMitad}>
                  <label htmlFor="cantidadProducida" className={G.LabelStyle}>
                    Cant. Producida
                  </label>
                  <input
                    type="number"
                    id="cantidadProducida"
                    name="cantidadProducida"
                    placeholder="Cantidad Producida"
                    autoComplete="off"
                    min={0}
                    disabled={modo == "Consultar"}
                    value={data.cantidadProducida ?? ""}
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
                    className={G.InputBoton}
                  />
                  <div className={G.Input36}>
                    <div className={G.CheckStyle + G.Anidado}>
                      <Checkbox
                        inputId="incluyeIGV"
                        name="incluyeIGV"
                        onChange={(e) => {
                          HandleData(e);
                        }}
                        checked={data.incluyeIGV}
                        disabled={modo == "Consultar"}
                      ></Checkbox>
                    </div>
                    <label htmlFor="incluyeIGV" className={G.LabelCheckStyle}>
                      Incluye IGV
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {/* Cabecera */}

            {/* Detalles */}
            {modo != "Consultar" && (
              <div className={G.ContenedorBasico + G.FondoContenedor + " mb-2"}>
                <div className={G.ContenedorInputs}>
                  <div className={G.InputFull}>
                    <label htmlFor="descripcion" className={G.LabelStyle}>
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
                      onChange={HandleDataCabecera}
                      className={
                        modo == "Consultar" ? G.InputStyle : G.InputBoton
                      }
                    />
                    <button
                      id="consultarArticulo"
                      className={G.BotonBuscar + G.BotonPrimary}
                      hidden={modo == "Consultar"}
                      onKeyDown={(e) => Funciones.KeyClick(e)}
                      onClick={() => {
                        setDataCabecera([]);
                        AbrirFiltroArticulo();
                      }}
                    >
                      <FaSearch></FaSearch>
                    </button>
                  </div>
                  <div className={G.Input25pct}>
                    <label htmlFor="stock" className={G.LabelStyle}>
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
                      onChange={HandleDataCabecera}
                      className={G.InputStyle}
                    />
                  </div>
                </div>
                <div className={G.ContenedorInputs}>
                  <div className={G.Input25pct}>
                    <label
                      htmlFor="unidadMedidaDescripcion"
                      className={G.LabelStyle}
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
                      onChange={HandleDataCabecera}
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.Input25pct}>
                    <label htmlFor="cantidad" className={G.LabelStyle}>
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
                        HandleDataCabecera(e);
                        CalcularImporte(e.target.name);
                      }}
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.Input25pct}>
                    <label htmlFor="precioUnitario" className={G.LabelStyle}>
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
                        HandleDataCabecera(e);
                        CalcularImporte(e.target.name);
                      }}
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.Input25pct}>
                    <label htmlFor="importe" className={G.LabelStyle}>
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
                        HandleDataCabecera(e);
                        CalcularImporte(e.target.name);
                      }}
                      className={
                        modo != "Consultar" ? G.InputBoton : G.InputStyle
                      }
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
              <div className="flex">
                <div className={G.FilaFooter + G.FilaVacia}></div>
                <div className={G.FilaFooter + G.FilaPrecio}>
                  <p className={G.FilaContenido}>Total Galones</p>
                </div>
                <div className={G.FilaFooter + G.FilaImporte}>
                  <p className={G.FilaContenido}>
                    {data.totalGalones ?? "0.00"}
                  </p>
                </div>
                <div className={G.FilaFooter + G.UltimaFila}></div>
              </div>
              <div className="flex">
                <div className={G.FilaFooter + G.FilaVacia}>
                  <p className={G.FilaContenido}>COSTO DE GALON X 1 EN SOLES</p>
                </div>
                <div className={G.FilaFooter + G.FilaImporte}>
                  <p className={G.FilaContenido}>{data.costoGalon ?? "0.00"}</p>
                </div>
                <div className={G.FilaFooter + G.UltimaFila}></div>
              </div>
              <div className="flex">
                <div className={G.FilaFooter + G.FilaVacia}>
                  <p className={G.FilaContenido}>
                    COSTO DE GALON X 1 EN SOLES + GASTOS INDIRECTOS (0.00%)
                  </p>
                </div>
                <div className={G.FilaFooter + G.FilaImporte}>
                  <p className={G.FilaContenido}>
                    {data.costoGalonMasGastoIndirectos ?? "0.00"}
                  </p>
                </div>
                <div className={G.FilaFooter + G.UltimaFila}></div>
              </div>
              <div className="flex">
                <div className={G.FilaFooter + G.FilaVacia}>
                  <p className={G.FilaContenido}>
                    COSTO DE GALON X 1 EN SOLES + IGV (18.00%)
                  </p>
                </div>
                <div className={G.FilaFooter + G.FilaImporte}>
                  <p className={G.FilaContenido}>
                    {data.costoGalonMasIGV ?? "0.00"}
                  </p>
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
              foco={document.getElementById("personalId")}
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
  //#endregion
};

export default Modal;
