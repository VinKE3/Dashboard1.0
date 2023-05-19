import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import FiltroProveedor from "../../../components/filtros/FiltroProveedor";
import FiltroArticulo from "../../../components/filtros/FiltroArticulo";
import FiltroFacturaCompra from "../../../components/filtros/FiltroFacturaCompra";
import Mensajes from "../../../components/Mensajes";
import TableBasic from "../../../components/tablas/TableBasic";
import Ubigeo from "../../../components/filtros/Ubigeo";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import moment from "moment";
import { FaPlus, FaSearch, FaPen, FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
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
  const [dataTipos, setDataTipos] = useState([]);
  const [dataMotivosTraslado, setDataMotivosTraslado] = useState([]);
  const [dataConductores, setDataConductores] = useState([]);
  //Tablas
  //Data Modales Ayuda
  const [dataProveedor, setDataProveedor] = useState([]);
  const [dataFacturaCompra, setDataFacturaCompra] = useState([]);
  const [dataArt, setDataArt] = useState([]);
  //Data Modales Ayuda
  //Modales de Ayuda
  const [modalProv, setModalProv] = useState(false);
  const [modalArt, setModalArt] = useState(false);
  const [modalFac, setModalFac] = useState(false);
  //Modales de Ayuda
  const [checkVarios, setCheckVarios] = useState(false);
  const [checkFiltro, setCheckFiltro] = useState("productos");
  const [habilitarFiltro, setHabilitarFiltro] = useState(false);
  const [detalleId, setDetalleId] = useState(dataDetalle.length + 1);
  const [detallesFacturaSeleccionada, setDetallesFacturaSeleccionada] =
    useState([]);
  const [tipoCambio, setTipoCambio] = useState(0);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  const [dataUbigeoDireccionPartida, setDataUbigeoDireccionPartida] = useState(
    []
  );
  const [dataUbigeoDireccionLlegada, setDataUbigeoDireccionLlegada] = useState(
    []
  );
  //#endregion

  //#region useEffect
  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

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
    if (Object.keys(dataFacturaCompra).length > 0) {
      FacturaCompra();
      // DetallesFacturaCompra(dataFacturaCompra.accion);
      setDataDetalle(dataFacturaCompra.detalles);
      OcultarMensajes();
    }
  }, [dataFacturaCompra]);

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
    if (Object.keys(dataUbigeoDireccionPartida).length > 0) {
      setData({
        ...data,
        departamentoPartidaId: dataUbigeoDireccionPartida.departamentoId,
        provinciaPartidaId: dataUbigeoDireccionPartida.provinciaId,
        distritoPartidaId: dataUbigeoDireccionPartida.distritoId,
      });
    }
  }, [dataUbigeoDireccionPartida]);

  useEffect(() => {
    if (Object.keys(dataUbigeoDireccionLlegada).length > 0) {
      setData({
        ...data,
        departamentoLlegadaId: dataUbigeoDireccionLlegada.departamentoId,
        provinciaLlegadaId: dataUbigeoDireccionLlegada.provinciaId,
        distritoLlegadaId: dataUbigeoDireccionLlegada.distritoId,
      });
    }
  }, [dataUbigeoDireccionLlegada]);

  useEffect(() => {
    if (!modalArt) {
      //Calculos de precios según la moneda al cerrar el modal
      ConvertirPrecio();
    }
  }, [modalArt]);

  useEffect(() => {
    if (modo == "Registrar") {
      GetPorIdTipoCambio(data.fechaEmision);
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
  };
  const FechaEmision = async () => {
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
  const handleTransportistaChange = (event) => {
    const selectedTransportistaId = event.target.value;
    const selectedTransportista = dataConductores.find(
      (conductor) => conductor.id === selectedTransportistaId
    );
    if (selectedTransportista) {
      setData({
        ...data,
        transportistaId: selectedTransportista.id,
        transportistaNumeroDocumentoIdentidad:
          selectedTransportista.numeroDocumentoIdentidad,
        transportistaLicenciaConducir: selectedTransportista.licenciaConducir,
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
  const FacturaCompra = async () => {
    setData({
      ...data,
      documentoReferenciaId: dataFacturaCompra.id,
      documentoReferencia: dataFacturaCompra.numeroDocumento,
      monedaId: dataFacturaCompra.monedaId,
      afectarStock: false,
    });
  };
  const OcultarMensajes = async () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };

  //?Artículos
  const ValidarDataArt = async ({ target }) => {
    //Valida Articulos Varios
    if (target.name == "productos") {
      setCheckFiltro(target.name);
      setHabilitarFiltro(false);
      setDataArt([]);
    } else {
      setDataArt((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  const ConvertirPrecio = async () => {
    if (Object.entries(dataArt).length > 0) {
      if (data.monedaId != dataArt.monedaId && dataArt.Id != "000000") {
        const model = await Funciones.ConvertirPreciosAMoneda(
          "compra",
          dataArt,
          data.monedaId,
          tipoCambio
        );
        if (model != null) {
          setDataArt({
            ...dataArt,
            precioCompra: model.precioCompra,
            precioVenta1: model.precioVenta1,
            precioVenta2: model.precioVenta2,
            precioVenta3: model.precioVenta3,
            precioVenta4: model.precioVenta4,
            precioUnitario: model.precioCompra,
          });
        }
      } else {
        setDataArt({
          ...dataArt,
          precioUnitario: dataArt.precioCompra,
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
      setDataArt({
        ...dataArt,
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
    if (Object.entries(dataArt).length == 0) {
      return [false, "Seleccione un Producto"];
    }

    //Valida Descripción
    if (dataArt.descripcion == undefined) {
      return [false, "La descripción no puede estar vacía"];
    }

    //Valida montos
    if (Funciones.IsNumeroValido(dataArt.cantidad, false) != "") {
      document.getElementById("cantidad").focus();
      return [
        false,
        "Cantidad: " + Funciones.IsNumeroValido(dataArt.cantidad, false),
      ];
    }
    if (Funciones.IsNumeroValido(dataArt.precioUnitario, false) != "") {
      document.getElementById("precioUnitario").focus();
      return [
        false,
        "Precio Unitario: " +
          Funciones.IsNumeroValido(dataArt.precioUnitario, false),
      ];
    }
    if (Funciones.IsNumeroValido(dataArt.importe, false) != "") {
      document.getElementById("importe").focus();
      return [
        false,
        "Importe: " + Funciones.IsNumeroValido(dataArt.importe, false),
      ];
    }
    //Valida montos

    return [true, ""];
  };
  const AgregarDetalleArticulo = async () => {
    //Obtiene resultado de Validación
    let resultado = await ValidarDetalle();

    if (resultado[0]) {
      //Si tiene detalleId entonces modifica registro
      if (dataArt.detalleId != undefined) {
        let dataDetalleMod = dataDetalle.map((map) => {
          if (map.id == dataArt.id) {
            return {
              detalleId: dataArt.detalleId,
              id: dataArt.id,
              lineaId: dataArt.lineaId,
              subLineaId: dataArt.subLineaId,
              articuloId: dataArt.articuloId,
              marcaId: dataArt.marcaId,
              codigoBarras: dataArt.codigoBarras,
              descripcion: dataArt.descripcion,
              stock: dataArt.stock,
              unidadMedidaDescripcion: dataArt.unidadMedidaDescripcion,
              unidadMedidaId: dataArt.unidadMedidaId,
              cantidad: dataArt.cantidad,
              precioUnitario: dataArt.precioUnitario,
              montoIGV: dataArt.montoIGV,
              subTotal: dataArt.subTotal,
              importe: dataArt.importe,
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
        if (dataArt.id == "00000000") {
          //Valida por id y descripción de artículo
          model = dataDetalle.find((map) => {
            return (
              map.id == dataArt.id && map.descripcion == dataArt.descripcion
            );
          });
        } else {
          //Valida solo por id
          model = dataDetalle.find((map) => {
            return map.id == dataArt.id;
          });
        }

        if (model == undefined) {
          setDataDetalle((prev) => [
            ...prev,
            {
              detalleId: detalleId,
              id: dataArt.id,
              lineaId: dataArt.lineaId,
              subLineaId: dataArt.subLineaId,
              articuloId: dataArt.articuloId,
              marcaId: dataArt.marcaId,
              codigoBarras: dataArt.codigoBarras,
              descripcion: dataArt.descripcion,
              stock: dataArt.stock,
              unidadMedidaDescripcion: dataArt.unidadMedidaDescripcion,
              unidadMedidaId: dataArt.unidadMedidaId,
              cantidad: dataArt.cantidad,
              precioUnitario: dataArt.precioUnitario,
              montoIGV: dataArt.montoIGV,
              subTotal: dataArt.subTotal,
              importe: dataArt.importe,
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
      setDataArt([]);
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
  const CargarDetalle = async (id) => {
    setDataArt(dataDetalle.find((map) => map.id === id));
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
  const DetallesFacturaCompra = async (accion) => {
    setDataDetalle([]);
    //? resetear contador
    //?Recorre los detalles que nos retorna el Filtro Orden de Compra
    let detalleEliminado = dataDetalle;
    let contador = dataDetalle.length;
    dataFacturaCompra.detalles.map((dataFCDetallemap) => {
      contador++;

      //?Valida si el detalle existe
      let dataDetalleExiste = dataDetalle.find((map) => {
        return map.id == dataFCDetallemap.id;
      });
      //? validamos si la accion es Agregar o Eliminar
      if (accion == "agregar") {
        if (dataDetalleExiste == undefined) {
          //?toma el valor actual de contador para asignarlo
          // let i = contador;
          setDataDetalle((prev) => [
            ...prev,
            {
              detalleId: contador,
              id: dataFCDetallemap.id,
              lineaId: dataFCDetallemap.lineaId,
              subLineaId: dataFCDetallemap.subLineaId,
              articuloId: dataFCDetallemap.articuloId,
              marcaId: dataFCDetallemap.marcaId,
              codigoBarras: dataFCDetallemap.codigoBarras,
              descripcion: dataFCDetallemap.descripcion,
              stock: dataFCDetallemap.stock,
              unidadMedidaDescripcion: dataFCDetallemap.unidadMedidaDescripcion,
              unidadMedidaId: dataFCDetallemap.unidadMedidaId,
              cantidad: dataFCDetallemap.cantidad,
              precioUnitario: dataFCDetallemap.precioUnitario,
              montoIGV: dataFCDetallemap.montoIGV,
              subTotal: dataFCDetallemap.subTotal,
              importe: dataFCDetallemap.importe,
            },
          ]);
          //?Asiganamos el valor final del contador y le agregamos 1
          setDetalleId(contador + 1);
        } else {
          //?modificar registro en base al ID
          let dataDetalleMod = dataDetalle.map((map) => {
            if (map.id == dataDetalleExiste.id) {
              //Calculos
              let cantidad =
                dataDetalleExiste.cantidad + dataFCDetallemap.cantidad;
              let importe = cantidad * dataFCDetallemap.precioUnitario;
              let subTotal = importe * (dataGlobal.porcentajeIGV / 100);
              let montoIGV = importe - subTotal;
              //Calculos
              return {
                detalleId: dataDetalleExiste.detalleId,
                id: dataFCDetallemap.id,
                lineaId: dataFCDetallemap.lineaId,
                subLineaId: dataFCDetallemap.subLineaId,
                articuloId: dataFCDetallemap.articuloId,
                unidadMedidaId: dataFCDetallemap.unidadMedidaId,
                marcaId: dataFCDetallemap.marcaId,
                descripcion: dataFCDetallemap.descripcion,
                codigoBarras: dataFCDetallemap.codigoBarras,
                cantidad: cantidad,
                stock: dataFCDetallemap.stock,
                precioUnitario: dataFCDetallemap.precioUnitario,
                subTotal: subTotal,
                montoIGV: montoIGV,
                importe: importe,
                presentacion: dataFCDetallemap.presentacion ?? "",
                unidadMedidaDescripcion:
                  dataFCDetallemap.unidadMedidaDescripcion,
              };
            } else {
              return map;
            }
          });
          setDataDetalle(dataDetalleMod);
        }
      } else {
        //?Eliminar
        if (dataDetalleExiste != undefined) {
          //?Validamos por la cantidad
          if (dataDetalleExiste.cantidad - dataFCDetallemap.cantidad == 0) {
            //?Si el resultado es 0 entonces se elimina por completo el registro
            detalleEliminado = detalleEliminado.filter(
              (map) => map.id !== dataDetalleExiste.id
            );
            //?Toma el valor actual de contador para asignarlo
            let i = 1;
            if (detalleEliminado.length > 0) {
              setDataDetalle(
                detalleEliminado.map((map) => {
                  return {
                    ...map,
                    detalleId: i++,
                  };
                })
              );
              setDetalleId(i);
            } else {
              //?Asgina directamente a 1
              setDetalleId(detalleEliminado.length + 1);
              setDataDetalle(detalleEliminado);
            }
            setRefrescar(true);
          } else {
            //?Si la resta es mayor a 0 entonces restamos al detalle encontrado
            let dataDetalleEliminar = dataDetalle.map((map) => {
              if (map.id == dataDetalleExiste.id) {
                let cantidad =
                  dataDetalleExiste.cantidad - dataFCDetallemap.cantidad;
                let importe = cantidad * dataDetalleExiste.precioUnitario;
                let subTotal = importe * (dataGlobal.porcentajeIGV / 100);
                return {
                  detalleId: dataDetalleExiste.detalleId,
                  id: dataFCDetallemap.id,
                  lineaId: dataFCDetallemap.lineaId,
                  subLineaId: dataFCDetallemap.subLineaId,
                  articuloId: dataFCDetallemap.articuloId,
                  unidadMedidaId: dataFCDetallemap.unidadMedidaId,
                  marcaId: dataFCDetallemap.marcaId,
                  descripcion: dataFCDetallemap.descripcion,
                  codigoBarras: dataFCDetallemap.codigoBarras,
                  cantidad: cantidad,
                  stock: dataFCDetallemap.stock,
                  precioUnitario: dataDetalleExiste.precioUnitario,
                  subTotal: subTotal,
                  montoIGV: montoIGV,
                  importe: importe,
                  presentacion: dataFCDetallemap.presentacion ?? "",
                  unidadMedidaDescripcion:
                    dataFCDetallemap.unidadMedidaDescripcion,
                };
              } else {
                return map;
              }
            });
            setDataDetalle(dataDetalleEliminar);
          }
        }
      }
      setRefrescar(true);
    });
  };
  //Calculos
  const ActualizarImportesTotales = async () => {
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
  const Tablas = async () => {
    const result = await ApiMasy.get(`api/Compra/GuiaCompra/FormularioTablas`);
    setDataMoneda(result.data.data.monedas);
    setDataMotivosTraslado(result.data.data.motivosTraslado);
    setDataTipos(result.data.data.tipos);
    setDataConductores(result.data.data.conductores);
  };
  const GetPorIdTipoCambio = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/TipoCambio/${id}`);
    if (result.name == "AxiosError") {
      if (Object.entries(result.response.data).length > 0) {
        setTipoMensaje(result.response.data.messages[0].tipo);
        setMensaje([
          result.response.data.messages[0].textos,
          ["No se podrán realizar las conversiones de precios."],
        ]);
      } else {
        setTipoMensaje(1);
        setMensaje([
          [result.message],
          ["No se podrán realizar las conversiones de precios."],
        ]);
      }
      setTipoCambio(0);
    } else {
      setTipoCambio(result.data.data.precioVenta);
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
  const AbrirFiltroProveedor = async () => {
    setModalProv(true);
  };
  const AbrirFiltroArticulo = async () => {
    setModalArt(true);
  };

  const AbrirFiltroFactura = async () => {
    setModalFac(true);
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
      <ModalCrud
        setModal={setModal}
        objeto={data}
        modo={modo}
        menu={["Compra", "GuiaCompra"]}
        titulo="Guia De Compra"
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
                disabled={modo == "Registrar" ? false : true}
                value={data.serie ?? ""}
                onChange={ValidarData}
                onBlur={(e) => Numeracion(e)}
                className={
                  modo == "Registrar"
                    ? Global.InputStyle
                    : Global.InputStyle
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
                disabled={modo == "Registrar" ? false : true}
                value={data.numero ?? ""}
                onChange={ValidarData}
                onBlur={(e) => Numeracion(e)}
                className={
                  modo == "Registrar"
                    ? Global.InputStyle
                    : Global.InputStyle
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
                disabled={modo == "Consultar" ? true : false}
                value={moment(data.fechaEmision ?? "").format("yyyy-MM-DD")}
                onChange={ValidarData}
                onBlur={FechaEmision}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.InputFull}>
              <label htmlFor="numeroFactura " className={Global.LabelStyle}>
                Factura
              </label>
              <input
                type="text"
                id="numeroFactura "
                name="numeroFactura "
                placeholder="Buscar Factura"
                autoComplete="off"
                disabled={true}
                value={data.numeroFactura ?? ""}
                onChange={ValidarData}
                className={
                  modo != "Consultar"
                    ? Global.InputBoton 
                    : Global.InputStyle
                }
              />
              <button
                id="consultarFactura"
                className={
                  Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                }
                hidden={modo == "Consultar" ? true : false}
                disabled={data.proveedorId.length == 0 ? true : false}
                onClick={() => AbrirFiltroFactura()}
              >
                <FaSearch></FaSearch>
              </button>
            </div>
          </div>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <label htmlFor="direccionPartida" className={Global.LabelStyle}>
                Dirección Partida
              </label>
              <input
                type="text"
                id="direccionPartida"
                name="direccionPartida"
                placeholder="Dirección Partida"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
                value={data.direccionPartida ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
          </div>
          <Ubigeo
            modo={modo}
            setDataUbigeo={setDataUbigeoDireccionPartida}
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
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <label htmlFor="direccionLlegada" className={Global.LabelStyle}>
                Dirección Llegada
              </label>
              <input
                type="text"
                id="direccionLlegada"
                name="direccionLlegada"
                placeholder="Dirección Partida"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
                value={data.direccionLlegada ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
          </div>
          <Ubigeo
            modo={modo}
            setDataUbigeo={setDataUbigeoDireccionLlegada}
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
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputMitad}>
              <label htmlFor="proveedorRUC" className={Global.LabelStyle}>
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
                className={Global.InputBoton }
              />
              <button
                id="consultar"
                className={
                  Global.BotonBuscar + Global.BotonPrimary + " !rounded-none"
                }
                hidden={modo == "Consultar" ? true : false}
                disabled={checkVarios ? true : false}
                onClick={() => AbrirFiltroProveedor()}
              >
                <FaSearch></FaSearch>
              </button>
              <div className={Global.Input + " w-20"}>
                <div className={Global.CheckStyle + Global.Anidado}>
                  <Checkbox
                    inputId="varios"
                    name="varios"
                    disabled={modo == "Consultar" ? true : false}
                    onChange={(e) => {
                      setCheckVarios(e.checked);
                      ProveedorVarios(e);
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
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <label htmlFor="transportistaId" className={Global.LabelStyle}>
                Transportista
              </label>
              <select
                id="transportistaId"
                name="transportistaId"
                value={data.transportistaId ?? ""}
                onChange={handleTransportistaChange}
                disabled={modo === "Consultar"}
                className={Global.InputStyle}
              >
                <option key="-1" value="">
                  --SELECCIONAR CONTACTO--
                </option>
                {dataConductores.map((conductor) => (
                  <option key={conductor.id} value={conductor.id}>
                    {conductor.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className={Global.InputFull}>
              <label
                htmlFor="transportistaNumeroDocumentoIdentidad"
                className={Global.LabelStyle}
              >
                RUC/DNI:
              </label>
              <input
                type="text"
                id="transportistaNumeroDocumentoIdentidad"
                name="transportistaNumeroDocumentoIdentidad"
                placeholder="N° Documento Identidad"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
                value={data.transportistaNumeroDocumentoIdentidad ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
          </div>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <label htmlFor="marcaPlaca" className={Global.LabelStyle}>
                Marca/Placa
              </label>
              <input
                type="text"
                id="marcaPlaca"
                name="marcaPlaca"
                placeholder="Marca/Placa"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
                value={data.marcaPlaca ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.InputFull}>
              <label
                htmlFor="transportistaCertificadoInscripcion"
                className={Global.LabelStyle}
              >
                Certificado Inscripción
              </label>
              <input
                type="text"
                id="transportistaCertificadoInscripcion"
                name="transportistaCertificadoInscripcion"
                placeholder="Certificado Inscripción"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
                value={data.transportistaCertificadoInscripcion ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.InputFull}>
              <label
                htmlFor="transportistaLicenciaConducir"
                className={Global.LabelStyle}
              >
                Licencia Conducir
              </label>
              <input
                type="text"
                id="transportistaLicenciaConducir"
                name="transportistaLicenciaConducir"
                placeholder="Licencia Conducir"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
                value={data.transportistaLicenciaConducir ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
          </div>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <label htmlFor="motivoTrasladoId" className={Global.LabelStyle}>
                Motivo Traslado
              </label>
              <select
                id="motivoTrasladoId"
                name="motivoTrasladoId"
                value={data.motivoTrasladoId ?? ""}
                onChange={ValidarData}
                disabled={modo === "Consultar"}
                className={Global.InputStyle}
              >
                {dataMotivosTraslado.map((motivo) => (
                  <option key={motivo.id} value={motivo.id}>
                    {motivo.descripcion}
                  </option>
                ))}
              </select>
            </div>
            {data.motivoTrasladoId == "99" ? (
              <div className={Global.InputFull}>
                <label
                  htmlFor="ingresoEgresoStock"
                  className={Global.LabelStyle}
                >
                  Tipo
                </label>
                <select
                  id="ingresoEgresoStock"
                  name="ingresoEgresoStock"
                  value={data.ingresoEgresoStock ?? ""}
                  onChange={ValidarData}
                  disabled={modo === "Consultar"}
                  className={Global.InputStyle}
                >
                  {dataTipos.map((tipo) => (
                    <option key={tipo.valor} value={tipo.valor}>
                      {tipo.texto}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <></>
            )}
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
                disabled={modo == "Consultar" ? true : false}
                value={data.observacion ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.Input20pct}>
              <label htmlFor="monedaId" className={Global.LabelStyle}>
                MonedaId
              </label>
              <select
                id="monedaId"
                name="monedaId"
                value={data.monedaId ?? ""}
                onChange={ValidarData}
                disabled={modo === "Consultar"}
                className={Global.InputStyle}
              >
                {dataMoneda.map((moneda) => (
                  <option key={moneda.id} value={moneda.id}>
                    {moneda.abreviatura}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <label
                htmlFor="documentoReferencia"
                className={Global.LabelStyle}
              >
                Documento Referencia
              </label>
              <input
                type="text"
                id="documentoReferencia"
                name="documentoReferencia"
                placeholder="Observación"
                autoComplete="off"
                disabled={modo == "Consultar" ? true : false}
                value={data.documentoReferencia ?? ""}
                onChange={ValidarData}
                className={Global.InputBoton}
              />
              <div className={Global.Input + " w-35"}>
                <div className={Global.CheckStyle + Global.Anidado}>
                  <Checkbox
                    inputId="afectarStock"
                    name="afectarStock"
                    disabled={modo == "Consultar" ? true : false}
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.afectarStock ? true : ""}
                  />
                </div>
                <label
                  htmlFor="afectarStock"
                  className={Global.LabelCheckStyle}
                >
                  Afectar Stock
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* Cabecera */}
        {/* Detalles */}
        <div
          className={Global.ContenedorBasico + Global.FondoContenedor + " mb-2"}
        >
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <div className={Global.Input + "w-32"}>
                <div className={Global.CheckStyle}>
                  <RadioButton
                    inputId="productos"
                    name="productos"
                    value="productos"
                    disabled={modo == "Consultar" ? true : false}
                    onChange={(e) => {
                      ValidarDataArt(e);
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
                value={dataArt.descripcion ?? ""}
                onChange={ValidarDataArt}
                className={
                  !habilitarFiltro
                    ? Global.InputBoton 
                    : Global.InputBoton
                }
              />
              <button
                id="consultar"
                className={Global.BotonBuscar + Global.BotonPrimary}
                disabled={!habilitarFiltro ? false : true}
                hidden={modo == "Consultar" ? true : false}
                onClick={() => {
                  setDataArt([]);
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
                value={dataArt.stock ?? ""}
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
                value={dataArt.unidadMedidaDescripcion ?? ""}
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
                disabled={modo == "Consultar" ? true : false}
                value={dataArt.cantidad ?? ""}
                onChange={(e) => {
                  ValidarDataArt(e);
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
                disabled={modo == "Consultar" ? true : false}
                value={dataArt.precioUnitario ?? ""}
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
                disabled={modo == "Consultar" ? true : false}
                value={dataArt.importe ?? ""}
                onChange={(e) => {
                  ValidarDataArt(e);
                  CalcularImporte(e.target.name);
                }}
                className={
                  modo != "Consultar" ? Global.InputBoton : Global.InputStyle
                }
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
              <p className={Global.FilaContenido}>SubTotal</p>
            </div>
            <div className={Global.FilaImporte}>
              <p className={Global.FilaContenido}>{data.subTotal ?? "0.00"}</p>
            </div>
            <div className={Global.UltimaFila}></div>
          </div>
          <div className="flex">
            <div className={Global.FilaVacia}></div>
            <div className={Global.FilaImporte}>
              <label
                htmlFor="porcentajeIGV"
                className={Global.FilaContenido + " !px-0"}
              >
                IGV %
              </label>
              <p className={Global.FilaContenido}>
                {dataGlobal.porcentajeIGV ?? "0.00"}
              </p>
            </div>
            <div className={Global.FilaImporte}>
              <p className={Global.FilaContenido}>{data.montoIGV ?? "0.00"}</p>
            </div>
            <div className={Global.UltimaFila}></div>
          </div>

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
      {modalProv && (
        <FiltroProveedor setModal={setModalProv} setObjeto={setDataProveedor} />
      )}
      {modalArt && (
        <FiltroArticulo setModal={setModalArt} setObjeto={setDataArt} />
      )}
      {modalFac && (
        <FiltroFacturaCompra
          setModal={setModalFac}
          setObjeto={setDataFacturaCompra}
          id={data.proveedorId}
        />
      )}
    </>
  );
};

export default Modal;
