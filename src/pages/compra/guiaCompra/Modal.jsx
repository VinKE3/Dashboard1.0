import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import GetTipoCambio from "../../../components/funciones/GetTipoCambio";
import ModalCrud from "../../../components/modal/ModalCrud";
import FiltroProveedor from "../../../components/filtro/FiltroProveedor";
import FiltroArticulo from "../../../components/filtro/FiltroArticulo";
import FiltroFacturaCompra from "../../../components/filtro/FiltroFacturaCompra";
import Mensajes from "../../../components/funciones/Mensajes";
import TableBasic from "../../../components/tabla/TableBasic";
import Ubigeo from "../../../components/filtro/Ubigeo";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Checkbox } from "primereact/checkbox";
import moment from "moment";
import { FaPlus, FaSearch, FaPen, FaTrashAlt, FaUndoAlt } from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import * as G from "../../../components/Global";
import * as Funciones from "../../../components/funciones/Validaciones";
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
  const [dataTipo, setDataTipo] = useState([]);
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataMotivoTraslado, setDataMotivoTraspado] = useState([]);
  const [dataConductor, setDataConductor] = useState([]);
  const [dataUbigeoPartida, setDataUbigeoPartida] = useState([]);
  const [dataUbigeoLlegada, setDataUbigeoLlegada] = useState([]);
  //GetTablas
  //Data Modales Ayuda
  const [dataProveedor, setDataProveedor] = useState([]);
  const [dataFactura, setDataFactura] = useState([]);
  const [dataCabecera, setDataCabecera] = useState([]);
  //Data Modales Ayuda
  //Modales de Ayuda
  const [modalProv, setModalProv] = useState(false);
  const [modalFactura, setModalFactura] = useState(false);
  const [modalArt, setModalArt] = useState(false);
  //Modales de Ayuda
  const [checkVarios, setCheckVarios] = useState(false);
  const [detalleId, setDetalleId] = useState(dataDetalle.length + 1);
  const [tipoCambio, setTipoCambio] = useState(0);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (Object.keys(dataUbigeoPartida).length > 0) {
      setData({
        ...data,
        departamentoPartidaId: dataUbigeoPartida.departamentoId,
        provinciaPartidaId: dataUbigeoPartida.provinciaId,
        distritoPartidaId: dataUbigeoPartida.distritoId,
        departamentoPartidaNombre: dataUbigeoPartida.departamento,
        provinciaPartidaNombre: dataUbigeoPartida.provincia,
        distritoPartidaNombre: dataUbigeoPartida.distrito,
      });
    }
  }, [dataUbigeoPartida]);
  useEffect(() => {
    if (Object.keys(dataUbigeoLlegada).length > 0) {
      setData({
        ...data,
        departamentoLlegadaId: dataUbigeoLlegada.departamentoId,
        provinciaLlegadaId: dataUbigeoLlegada.provinciaId,
        distritoLlegadaId: dataUbigeoLlegada.distritoId,
        departamentoLlegadaNombre: dataUbigeoLlegada.departamento,
        provinciaLlegadaNombre: dataUbigeoLlegada.provincia,
        distritoLlegadaNombre: dataUbigeoLlegada.distrito,
      });
    }
  }, [dataUbigeoLlegada]);
  useEffect(() => {
    if (Object.keys(dataProveedor).length > 0) {
      setData({
        ...data,
        proveedorId: dataProveedor.proveedorId,
        proveedorRUC: dataProveedor.proveedorNumeroDocumentoIdentidad,
        proveedorNombre: dataProveedor.proveedorNombre,
        direccionPartida: dataProveedor.proveedorDireccion ?? "",
        departamentoPartidaId: dataProveedor.departamentoId ?? "",
        provinciaPartidaId: dataProveedor.provinciaId ?? "",
        distritoPartidaId: dataProveedor.distritoId ?? "",
      });
    }
  }, [dataProveedor]);
  useEffect(() => {
    if (Object.keys(dataFactura).length > 0) {
      Factura();
      setDataDetalle(dataFactura.detalles);
      OcultarMensajes();
    }
  }, [dataFactura]);
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
    if (!modalArt) {
      //Calculos de precios según la moneda al cerrar el modal
      ConvertirPrecio();
    }
  }, [modalArt]);
  useEffect(() => {
    TipoCambio(data.fechaEmision);
    GetTablas();
  }, []);

  //#endregion

  //#region Funciones
  //Data General
  const HandleData = async ({ target }) => {
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
  const ProveedorVarios = async ({ target }) => {
    if (target.checked) {
      setDataProveedor((prevState) => ({
        ...prevState,
        proveedorId: dataGlobal.proveedor.id,
        proveedorNumeroDocumentoIdentidad:
          dataGlobal.proveedor.numeroDocumentoIdentidad,
        proveedorNombre: dataGlobal.proveedor.nombre,
        proveedorDireccion: dataGlobal.proveedor.direccionPrincipal,
        departamentoPartidaId: dataGlobal.proveedor.departamentoId,
        provinciaPartidaId: dataGlobal.proveedor.provinciaId,
        distritoPartidaId: dataGlobal.proveedor.distritoId,
      }));
    } else {
      setDataProveedor((prevState) => ({
        ...prevState,
        proveedorId: "",
        proveedorNumeroDocumentoIdentidad: "",
        proveedorNombre: "",
        proveedorDireccion: "",
        departamentoPartidaId: "",
        provinciaPartidaId: "",
        distritoPartidaId: "",
        ordenesCompraRelacionadas: [],
      }));
    }
  };
  const Transportista = (id) => {
    const model = dataConductor.find((map) => map.id === id);
    if (model != undefined) {
      setData({
        ...data,
        transportistaId: model.id,
        transportistaNumeroDocumentoIdentidad: model.numeroDocumentoIdentidad,
        transportistaLicenciaConducir: model.licenciaConducir,
      });
    } else {
      setData({
        ...data,
        transportistaId: "",
        transportistaNumeroDocumentoIdentidad: "",
        transportistaLicenciaConducir: "",
      });
    }
  };
  const Factura = async () => {
    setData({
      ...data,
      documentoReferenciaId: dataFactura.id,
      documentoReferencia: dataFactura.numeroDocumento,
      monedaId: dataFactura.monedaId,
      afectarStock: false,
    });
  };
  const OcultarMensajes = async () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  //Data General

  //Artículos
  const ValidarDataCabecera = async ({ target }) => {
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
          tipoCambio
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
  //Artículos
  //#endregion

  //#region Funciones Detalles
  const ValidarDetalle = async () => {
    if (Object.entries(dataCabecera).length == 0) {
      document.getElementById("consultarArticulo").focus();
      return [false, "Seleccione un Item"];
    }

    //Valida Descripción
    if (dataCabecera.descripcion == undefined) {
      return [false, "La descripción es requerida"];
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
      document.getElementById("consultarArticulo").focus();
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
    let porcentajeIgvSeleccionado = dataGlobal.porcentajeIGV;
    let incluyeIgv = true;
    //Porcentajes

    //Montos
    let total = 0,
      subTotal = 0,
      montoIGV = 0;
    //Montos

    //Calculo Check IncluyeIGV
    if (incluyeIgv) {
      total = Funciones.RedondearNumero(importeTotal, 2);
      subTotal = Funciones.RedondearNumero(
        total / (1 + porcentajeIgvSeleccionado / 100),
        2
      );
      montoIGV = Funciones.RedondearNumero(total - subTotal, 2);
    } else {
      subTotal = Funciones.RedondearNumero(importeTotal, 2);
      montoIGV = Funciones.RedondearNumero(
        subTotal * (porcentajeIgvSeleccionado / 100),
        2
      );
      total = Funciones.RedondearNumero(subTotal + montoIGV, 2);
    }
    //Calculo Check IncluyeIGV

    setData((prevState) => ({
      ...prevState,
      subTotal: Funciones.RedondearNumero(subTotal, 2),
      montoIGV: Funciones.RedondearNumero(montoIGV, 2),
      totalNeto: Funciones.RedondearNumero(total, 2),
      total: Funciones.RedondearNumero(total, 2),
    }));
  };
  //Calculos
  //#endregion

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(`api/Compra/GuiaCompra/FormularioTablas`);
    setDataMoneda(result.data.data.monedas);
    setDataMotivoTraspado(result.data.data.motivosTraslado);
    setDataTipo(result.data.data.tipos);
    setDataConductor(result.data.data.conductores);
  };
  const TipoCambio = async (fecha) => {
    let tipoCambio = await GetTipoCambio(
      fecha,
      "compra",
      setTipoMensaje,
      setMensaje
    );
    setTipoCambio(tipoCambio);
  };
  //#endregion

  //#region Funciones Modal
  const AbrirFiltroProveedor = async () => {
    setModalProv(true);
  };
  const AbrirFiltroArticulo = async () => {
    setModalArt(true);
  };
  const AbrirFiltroFactura = async () => {
    setModalFactura(true);
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

  //#region Render
  return (
    <>
      {Object.entries(dataTipo).length > 0 && (
        <>
          <ModalCrud
            setModal={setModal}
            objeto={data}
            modo={modo}
            menu={["Compra", "GuiaCompra"]}
            titulo="Guia de Compra"
            cerrar={false}
            foco={document.getElementById("tablaGuiaCompra")}
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
            <div className={G.ContenedorBasico + " mb-4 " + G.FondoContenedor}>
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
                <div className={G.InputMitad}>
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
                    value={moment(data.fechaEmision ?? "").format("yyyy-MM-DD")}
                    onChange={HandleData}
                    onBlur={FechaEmision}
                    className={G.InputStyle}
                  />
                </div>
              </div>

              <div className={G.ContenedorInputs}>
                <div className={G.InputMitad}>
                  <label htmlFor="proveedorRUC" className={G.LabelStyle}>
                    RUC/DNI:
                  </label>
                  <input
                    type="text"
                    id="proveedorRUC"
                    name="proveedorRUC"
                    placeholder="N° Documento Identidad"
                    autoComplete="off"
                    disabled={true}
                    value={data.proveedorRUC ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputFull}>
                  <label htmlFor="proveedorNombre" className={G.LabelStyle}>
                    Proveedor
                  </label>
                  <input
                    type="text"
                    id="proveedorNombre"
                    name="proveedorNombre"
                    placeholder="Proveedor"
                    autoComplete="off"
                    disabled={true}
                    value={data.proveedorNombre ?? ""}
                    onChange={HandleData}
                    className={G.InputBoton}
                  />
                  <button
                    id="consultarProveedor"
                    className={
                      G.BotonBuscar + G.BotonPrimary + " !rounded-none"
                    }
                    hidden={modo == "Consultar"}
                    disabled={checkVarios}
                    onKeyDown={(e) => Funciones.KeyClick(e)}
                    onClick={() => AbrirFiltroProveedor()}
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
                          ProveedorVarios(e);
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

              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <label
                    htmlFor="documentoReferencia "
                    className={G.LabelStyle}
                  >
                    Factura
                  </label>
                  <input
                    type="text"
                    id="documentoReferencia "
                    name="documentoReferencia "
                    placeholder="Buscar Factura"
                    autoComplete="off"
                    disabled={true}
                    value={data.documentoReferencia ?? ""}
                    onChange={HandleData}
                    className={
                      modo != "Consultar" ? G.InputBoton : G.InputStyle
                    }
                  />
                  <button
                    id="consultarFacturaModal"
                    className={G.BotonBuscar + G.Anidado + G.BotonPrimary}
                    hidden={modo == "Consultar"}
                    disabled={data.proveedorId.length == 0 ? true : false}
                    onKeyDown={(e) => Funciones.KeyClick(e)}
                    onClick={() => AbrirFiltroFactura()}
                  >
                    <FaSearch></FaSearch>
                  </button>
                </div>
              </div>
              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <label htmlFor="direccionPartida" className={G.LabelStyle}>
                    Dirección Partida
                  </label>
                  <input
                    type="text"
                    id="direccionPartida"
                    name="direccionPartida"
                    placeholder="Dirección Partida"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.direccionPartida ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
              </div>
              <Ubigeo
                modo={modo}
                setDataUbigeo={setDataUbigeoPartida}
                id={[
                  "departamentoPartidaId",
                  "provinciaPartidaId",
                  "distritoPartidaId",
                ]}
                dato={{
                  departamentoId: data.departamentoPartidaId,
                  provinciaId: data.provinciaPartidaId,
                  distritoId: data.distritoPartidaId,
                }}
              />
              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <label htmlFor="direccionLlegada" className={G.LabelStyle}>
                    Dirección Llegada
                  </label>
                  <input
                    type="text"
                    id="direccionLlegada"
                    name="direccionLlegada"
                    placeholder="Dirección Partida"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.direccionLlegada ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
              </div>
              <Ubigeo
                modo={modo}
                setDataUbigeo={setDataUbigeoLlegada}
                id={[
                  "departamentoLlegadaId",
                  "provinciaLlegadaId",
                  "distritoLlegadaId",
                ]}
                dato={{
                  departamentoId: data.departamentoLlegadaId,
                  provinciaId: data.provinciaLlegadaId,
                  distritoId: data.distritoLlegadaId,
                }}
              />

              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <label htmlFor="transportistaId" className={G.LabelStyle}>
                    Transportista
                  </label>
                  <select
                    id="transportistaId"
                    name="transportistaId"
                    value={data.transportistaId ?? ""}
                    onChange={(e) => {
                      Transportista(e.target.value);
                    }}
                    disabled={modo === "Consultar"}
                    className={G.InputStyle}
                  >
                    <option key="-1" value="">
                      --SELECCIONAR--
                    </option>
                    {dataConductor.map((conductor) => (
                      <option key={conductor.id} value={conductor.id}>
                        {conductor.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={G.InputMitad}>
                  <label
                    htmlFor="transportistaNumeroDocumentoIdentidad"
                    className={G.LabelStyle}
                  >
                    RUC/DNI:
                  </label>
                  <input
                    type="text"
                    id="transportistaNumeroDocumentoIdentidad"
                    name="transportistaNumeroDocumentoIdentidad"
                    placeholder="N° Documento Identidad"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.transportistaNumeroDocumentoIdentidad ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
              </div>

              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <label htmlFor="marcaPlaca" className={G.LabelStyle}>
                    Marca/Placa
                  </label>
                  <input
                    type="text"
                    id="marcaPlaca"
                    name="marcaPlaca"
                    placeholder="Marca/Placa"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.marcaPlaca ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputFull}>
                  <label
                    htmlFor="transportistaCertificadoInscripcion"
                    className={G.LabelStyle}
                  >
                    Certificado Inscripción
                  </label>
                  <input
                    type="text"
                    id="transportistaCertificadoInscripcion"
                    name="transportistaCertificadoInscripcion"
                    placeholder="Certificado Inscripción"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.transportistaCertificadoInscripcion ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
              </div>

              <div className={G.ContenedorInputs}>
                <div className={G.InputMitad}>
                  <label
                    htmlFor="transportistaLicenciaConducir"
                    className={G.LabelStyle}
                  >
                    Licencia Conducir
                  </label>
                  <input
                    type="text"
                    id="transportistaLicenciaConducir"
                    name="transportistaLicenciaConducir"
                    placeholder="Licencia Conducir"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.transportistaLicenciaConducir ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
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
                    disabled={true}
                    value={tipoCambio ?? ""}
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
                      TipoCambio(data.fechaEmision);
                    }}
                  >
                    <FaUndoAlt></FaUndoAlt>
                  </button>
                </div>
              </div>

              <div className={G.ContenedorInputs}>
                <div className={G.InputMitad}>
                  <label htmlFor="motivoTrasladoId" className={G.LabelStyle}>
                    Motivo
                  </label>
                  <select
                    id="motivoTrasladoId"
                    name="motivoTrasladoId"
                    value={data.motivoTrasladoId ?? ""}
                    onChange={HandleData}
                    disabled={modo == "Consultar"}
                    className={G.InputStyle}
                  >
                    {dataMotivoTraslado.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={G.InputMitad}>
                  <div className={G.InputFull}>
                    <input
                      type="text"
                      id="motivoSustento"
                      name="motivoSustento"
                      autoComplete="off"
                      placeholder="Sustento"
                      disabled={modo == "Consultar"}
                      value={data.motivoSustento ?? ""}
                      onChange={HandleData}
                      className={G.InputBoton + " rounded-l-md"}
                    />
                  </div>
                  <div className={G.Input + "w-24"}>
                    <select
                      id="ingresoEgresoStock"
                      name="ingresoEgresoStock"
                      value={data.ingresoEgresoStock ?? ""}
                      onChange={HandleData}
                      disabled={
                        modo == "Consultar" || data.motivoTrasladoId != "99"
                          ? true
                          : false
                      }
                      className={G.InputStyle + G.Anidado}
                    >
                      {dataTipo.map((map) => (
                        <option key={map.texto} value={map.texto}>
                          {map.texto}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
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
                  </div>
                  <div className={G.Input + " w-44"}>
                    <div className={G.CheckStyle + G.Anidado}>
                      <Checkbox
                        inputId="afectarStock"
                        name="afectarStock"
                        disabled={modo == "Consultar"}
                        onChange={(e) => {
                          HandleData(e);
                        }}
                        checked={data.afectarStock ? true : ""}
                      />
                    </div>
                    <label htmlFor="afectarStock" className={G.LabelCheckStyle}>
                      Afectar Stock
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
                      onChange={ValidarDataCabecera}
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
                      onChange={ValidarDataCabecera}
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
                      onChange={ValidarDataCabecera}
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
                        ValidarDataCabecera(e);
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
                        ValidarDataCabecera(e);
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
                        ValidarDataCabecera(e);
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
          </ModalCrud>
        </>
      )}

      {modalProv && (
        <FiltroProveedor
          setModal={setModalProv}
          setObjeto={setDataProveedor}
          foco={document.getElementById("consultarFacturaModal")}
        />
      )}
      {modalArt && (
        <FiltroArticulo
          setModal={setModalArt}
          setObjeto={setDataCabecera}
          foco={document.getElementById("cantidad")}
        />
      )}
      {modalFactura && (
        <FiltroFacturaCompra
          setModal={setModalFactura}
          setObjeto={setDataFactura}
          id={data.proveedorId}
          foco={document.getElementById("direccionPartida")}
        />
      )}
    </>
  );
  //#endregion
};

export default Modal;
