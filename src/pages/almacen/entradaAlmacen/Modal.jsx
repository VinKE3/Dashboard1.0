import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import FiltroProveedor from "../../../components/filtro/FiltroProveedor";
import FiltroArticulo from "../../../components/filtro/FiltroArticulo";
import Mensajes from "../../../components/funciones/Mensajes";
import TableBasic from "../../../components/tabla/TableBasic";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import moment from "moment";
import { FaPlus, FaSearch, FaUndoAlt, FaPen, FaTrashAlt } from "react-icons/fa";
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
  const [dataPersonal, setDataPersonal] = useState([]);
  const [dataTipoDocumento, setDataTipoDocumento] = useState([]);
  //Tablas
  //Data Modales Ayuda
  const [dataProveedor, setDataProveedor] = useState([]);
  const [dataCabecera, setDataCabecera] = useState([]);
  //Data Modales Ayuda
  //Modales de Ayuda
  const [modalProv, setModalProv] = useState(false);
  const [modalArt, setModalArt] = useState(false);
  //Modales de Ayuda

  const [checkVarios, setCheckVarios] = useState(false);
  const [checkFiltro, setCheckFiltro] = useState("productos");
  const [habilitarFiltro, setHabilitarFiltro] = useState(false);
  const [detalleId, setDetalleId] = useState(dataDetalle.length + 1);
  const [total, setTotal] = useState(0);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (Object.keys(dataProveedor).length > 0) {
      setData({
        ...data,
        proveedorId: dataProveedor.proveedorId,
        proveedorNumeroDocumentoIdentidad:
          dataProveedor.proveedorNumeroDocumentoIdentidad,
        proveedorNombre: dataProveedor.proveedorNombre,
        proveedorDireccion: dataProveedor.proveedorDireccion ?? "",
      });
    }
  }, [dataProveedor]);

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
    if (modo == "Nuevo") {
      GetPorIdTipoCambio(data.fechaEmision);
    }
    ActualizarTotales();
    Tablas();
  }, []);

  //#endregion

  //#region Funciones
  //Data General
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
      }));
    } else {
      setDataProveedor((prevState) => ({
        ...prevState,
        proveedorId: "",
        proveedorNumeroDocumentoIdentidad: "",
        proveedorNombre: "",
        proveedorDireccion: "",
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
  const ValidarDataCabecera = async ({ target }) => {
    //Valida Articulos Varios
    if (target.name == "productos") {
      setCheckFiltro(target.name);
      setHabilitarFiltro(false);
      setDataCabecera([]);
    } else if (target.name == "variosFiltro") {
      setCheckFiltro(target.name);
      setHabilitarFiltro(true);
      setDataCabecera({
        id: dataGlobal.articulo.id,
        lineaId: dataGlobal.articulo.lineaId,
        subLineaId: dataGlobal.articulo.subLineaId,
        articuloId: dataGlobal.articulo.articuloId,
        unidadMedidaId: dataGlobal.articulo.unidadMedidaId,
        marcaId: dataGlobal.articulo.marcaId,
        descripcion: dataGlobal.articulo.descripcion,
        codigoBarras: dataGlobal.articulo.codigoBarras,
        precioUnitario: dataGlobal.articulo.precioCompra,
        stock: dataGlobal.articulo.stock,
        unidadMedidaDescripcion: dataGlobal.articulo.unidadMedidaDescripcion,
        //Calculo para Detalle
        cantidad: 0,
        importe: 0,
        //Calculo para Detalle
      });
    } else {
      setDataCabecera((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
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
  //Artículos
  //#endregion

  //#region Funciones Detalles
  const ValidarDetalle = async () => {
    if (Object.entries(dataCabecera).length == 0) {
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
          setData((prevState) => ({
            ...prevState,
            observacion: `${dataCabecera.descripcion} OP ${data.numeroOP}`,
          }));
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
    if (click) {
      let row = value.target.closest("tr");
      let id = row.firstChild.innerText;
      setDataCabecera(dataDetalle.find((map) => map.id === id));
    } else {
      setDataCabecera(dataDetalle.find((map) => map.id === value));
    }
    document.getElementById("cantidad").focus();
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
    setData((prevState) => ({
      ...prevState,
      observacion: "",
    }));
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

    setTotal(Funciones.RedondearNumero(total, 2));
  };
  //Calculos
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Almacen/EntradaAlmacen/FormularioTablas`
    );
    setDataMoneda(result.data.data.monedas);
    setDataPersonal(
      result.data.data.personal.map((res) => ({
        id: res.id,
        nombre:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
    setDataTipoDocumento([{ id: "EN", descripcion: "ENTRADA DE ALMACEN" }]);
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
        }
      );
      OcultarMensajes();
    }
  };
  //#endregion

  //#region Funciones Modal
  const AbrirFiltroProveedor = async () => {
    setModalProv(true);
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
                  className="p-0 px-1"
                  title="Click para modificar registro"
                  onClick={() => CargarDetalle(row.values.id)}
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

  //#region Render
  return (
    <>
      <ModalCrud
        setModal={setModal}
        objeto={data}
        modo={modo}
        menu={["Almacen", "EntradaAlmacen"]}
        titulo="Entrada de Almacén"
        foco={document.getElementById("tablaEntradaAlmacen")}
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
            Global.ContenedorBasico + " mb-4 " + Global.FondoContenedor
          }
        >
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <label htmlFor="id" className={Global.LabelStyle}>
                Tipo Doc.
              </label>
              <select
                id="tipoDocumentoId"
                name="tipoDocumentoId"
                value={data.tipoDocumentoId ?? ""}
                onChange={ValidarData}
                disabled={true}
                className={Global.InputStyle}
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
                autoFocus
                disabled={modo == "Nuevo" ? false : true}
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
                autoComplete="off"
                disabled={modo == "Nuevo" ? false : true}
                value={data.numero ?? ""}
                onChange={ValidarData}
                onBlur={(e) => Numeracion(e)}
                className={Global.InputStyle}
              />
            </div>
          </div>

          <div className={Global.ContenedorInputs}>
            <div className={Global.InputMitad}>
              <label
                htmlFor="proveedorNumeroDocumentoIdentidad"
                className={Global.LabelStyle}
              >
                RUC/DNI:
              </label>
              <input
                type="text"
                id="proveedorNumeroDocumentoIdentidad"
                name="proveedorNumeroDocumentoIdentidad"
                placeholder="N° Documento Identidad"
                autoComplete="off"
                disabled={true}
                value={data.proveedorNumeroDocumentoIdentidad ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.InputFull}>
              <label htmlFor="proveedorNombre" className={Global.LabelStyle}>
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
                onChange={ValidarData}
                className={Global.InputBoton}
              />
              <button
                id="consultarProveedor"
                className={
                  Global.BotonBuscar + Global.BotonPrimary + " !rounded-none"
                }
                hidden={modo == "Consultar"}
                disabled={checkVarios}
                onKeyDown={(e) => Funciones.KeyClick(e)}
                onClick={() => AbrirFiltroProveedor()}
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
                      ProveedorVarios(e);
                    }}
                    checked={checkVarios}
                  />
                </div>
                <label htmlFor="varios" className={Global.LabelCheckStyle}>
                  Varios
                </label>
              </div>
            </div>
          </div>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <label htmlFor="proveedorDireccion" className={Global.LabelStyle}>
                Dirección
              </label>
              <input
                type="text"
                id="proveedorDireccion"
                name="proveedorDireccion"
                placeholder="Dirección"
                autoComplete="off"
                disabled={true}
                value={data.proveedorDireccion ?? ""}
                className={Global.InputStyle}
              />
            </div>
          </div>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <label htmlFor="personalId" className={Global.LabelStyle}>
                Encargado
              </label>
              <select
                id="personalId"
                name="personalId"
                value={data.personalId ?? ""}
                onChange={ValidarData}
                disabled={modo == "Consultar"}
                className={Global.InputStyle}
              >
                {dataPersonal.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className={Global.InputMitad}>
              <label htmlFor="numeroOP" className={Global.LabelStyle}>
                N° Operación
              </label>
              <input
                type="text"
                id="numeroOP"
                name="numeroOP"
                placeholder="N° Operación"
                autoComplete="off"
                disabled={modo == "Consultar"}
                value={data.numeroOP ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
          </div>

          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <label htmlFor="fechaEmision" className={Global.LabelStyle}>
                F. Emisión
              </label>
              <input
                type="date"
                id="fechaEmision"
                name="fechaEmision"
                autoComplete="off"
                disabled={modo == "Consultar"}
                value={moment(data.fechaEmision ?? "").format("yyyy-MM-DD")}
                onChange={ValidarData}
                onBlur={FechaEmision}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.InputFull}>
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
                {dataMoneda.map((moneda) => (
                  <option key={moneda.id} value={moneda.id}>
                    {moneda.descripcion}
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
                placeholder="Tipo de Cambio"
                autoComplete="off"
                min={0}
                disabled={modo == "Consultar"}
                value={data.tipoCambio ?? ""}
                onChange={ValidarData}
                className={
                  modo == "Consultar" ? Global.InputStyle : Global.InputBoton
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
                  GetPorIdTipoCambio(data.fechaEmision);
                }}
              >
                <FaUndoAlt></FaUndoAlt>
              </button>
            </div>
          </div>
          <div className={Global.ContenedorInputs}>
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
                <div className={Global.Input + "w-32"}>
                  <div className={Global.CheckStyle}>
                    <RadioButton
                      inputId="productos"
                      name="productos"
                      value="productos"
                      disabled={modo == "Consultar"}
                      onChange={(e) => {
                        ValidarDataCabecera(e);
                      }}
                      checked={checkFiltro === "productos"}
                    ></RadioButton>
                  </div>
                  <label
                    htmlFor="productos"
                    className={Global.LabelCheckStyle + "rounded-r-none"}
                  >
                    Productos
                  </label>
                </div>
                <div className={Global.Input + "w-32"}>
                  <div className={Global.CheckStyle + Global.Anidado}>
                    <RadioButton
                      inputId="variosFiltro"
                      name="variosFiltro"
                      value="variosFiltro"
                      disabled={modo == "Consultar"}
                      onChange={(e) => {
                        ValidarDataCabecera(e);
                      }}
                      checked={checkFiltro === "variosFiltro"}
                    ></RadioButton>
                  </div>
                  <label
                    htmlFor="variosFiltro"
                    className={Global.LabelCheckStyle + " !py-1 "}
                  >
                    Varios
                  </label>
                </div>
              </div>
            </div>

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
                  disabled={!habilitarFiltro ? true : false}
                  value={dataCabecera.descripcion ?? ""}
                  onChange={ValidarDataCabecera}
                  className={Global.InputBoton}
                />
                <button
                  id="consultarArticulo"
                  className={Global.BotonBuscar + Global.BotonPrimary}
                  disabled={!habilitarFiltro ? false : true}
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
                  onChange={ValidarDataCabecera}
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
                  onChange={ValidarDataCabecera}
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
                  disabled={modo == "Consultar"}
                  value={dataCabecera.cantidad ?? ""}
                  onChange={(e) => {
                    ValidarDataCabecera(e);
                    CalcularImporte(e.target.name);
                  }}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.Input25pct}>
                <label htmlFor="precioUnitario" className={Global.LabelStyle}>
                  Precio
                </label>
                <input
                  type="number"
                  id="precioUnitario"
                  name="precioUnitario"
                  placeholder="Precio "
                  autoComplete="off"
                  disabled={modo == "Consultar"}
                  value={dataCabecera.precioUnitario ?? ""}
                  onChange={(e) => {
                    ValidarDataCabecera(e);
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
                  disabled={modo == "Consultar"}
                  value={dataCabecera.importe ?? ""}
                  onChange={(e) => {
                    ValidarDataCabecera(e);
                    CalcularImporte(e.target.name);
                  }}
                  className={
                    modo != "Consultar" ? Global.InputBoton : Global.InputStyle
                  }
                />
                <button
                  id="enviarDetalle"
                  className={Global.BotonBuscar + Global.BotonPrimary}
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
        <TablaStyle>
          <TableBasic
            columnas={columnas}
            datos={dataDetalle}
            estilos={["", "", "", "border ", "", "border border-b-0", "border"]}
            DobleClick={(e) => CargarDetalle(e, true)}
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
              <p className={Global.FilaContenido}>{total ?? "0.00"}</p>
            </div>
            <div className={Global.UltimaFila}></div>
          </div>
        </div>
        {/*Tabla Footer*/}
      </ModalCrud>
      {modalProv && (
        <FiltroProveedor
          setModal={setModalProv}
          setObjeto={setDataProveedor}
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
  );
  //#endregion
};

export default Modal;
