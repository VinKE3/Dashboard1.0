import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import FiltroProveedor from "../../../components/filtros/FiltroProveedor";
import moment from "moment";
import { Checkbox } from "primereact/checkbox";
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
import Mensajes from "../../../components/Mensajes";
import TableBasic from "../../../components/tablas/TableBasic";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import * as Funciones from "../../../components/Funciones";
import FiltroConcepto from "../../../components/filtros/FiltroConcepto";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
`;
//#endregion

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [plazos, setPlazos] = useState([]);
  const [tiposCompra, setTiposCompra] = useState([]);
  const [tiposPago, setTiposPago] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [dataDetalle, setDataDetalle] = useState(objeto.detalles);
  const [dataProveedor, setDataProveedor] = useState([]);
  const [checkVarios, setCheckVarios] = useState(false);
  const [modalProv, setModalProv] = useState(false);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  const [plazoSeleccionado, setPlazoSeleccionado] = useState(0);
  const [fechaVencimientoOriginal, setFechaVencimientoOriginal] = useState(
    moment(new Date()).format("yyyy-MM-DD")
  );
  const [modalConcepto, setModalConcepto] = useState(false);
  const [dataConcepto, setDataConcepto] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  const [detalleId, setDetalleId] = useState(dataDetalle.length + 1);
  //#endregion
  //#region useEffect
  useEffect(() => {
    data;
  }, [data]);

  useEffect(() => {
    detalleId;
  }, [detalleId]);

  useEffect(() => {
    if (Object.entries(plazos).length >= 0) {
      if (document.getElementById("plazosId"))
        document.getElementById("plazosId").value = data.plazo;
    }
  }, [plazos]);

  useEffect(() => {
    if (Object.entries(tiposCompra).length > 0) {
      document.getElementById("tipoCompraId").value = data.tipoCompraId;
    }
  }, [tiposCompra]);

  useEffect(() => {
    if (Object.entries(tiposPago).length > 0) {
      document.getElementById("tipoPagoId").value = data.tipoPagoId;
    }
  }, [tiposPago]);

  useEffect(() => {
    if (Object.entries(monedas).length > 0) {
      document.getElementById("monedaId").value = data.monedaId;
    }
  }, [monedas]);
  useEffect(() => {
    if (Object.keys(dataProveedor).length > 0) {
      setData({
        ...data,
        proveedorId: dataProveedor.proveedorId,
        proveedorNumeroDocumentoIdentidad:
          dataProveedor.proveedorNumeroDocumentoIdentidad,
        proveedorDireccion: dataProveedor.proveedorDireccion ?? "",
      });
    }
  }, [dataProveedor]);
  useEffect(() => {
    if (modo != "Registrar") {
      GetPorId(data.proveedorId);
    } else {
      GetPorIdTipoCambio(data.fechaEmision);
    }
    GetTablas();
  }, []);
  useEffect(() => {
    if (plazoSeleccionado > 0) {
      const fechaVencimientoNueva = moment(fechaVencimientoOriginal)
        .add(plazoSeleccionado, "days")
        .format("yyyy-MM-DD");
      setData({ ...data, fechaVencimiento: fechaVencimientoNueva });
    } else {
      setData({ ...data, fechaVencimiento: fechaVencimientoOriginal });
    }
  }, [plazoSeleccionado]);
  useEffect(() => {
    if (Object.entries(dataDetalle).length > 0) {
      setData({ ...data, detalles: dataDetalle });
    }
  }, [dataDetalle]);

  useEffect(() => {
    if (Object.entries(dataConcepto).length > 0) {
      setModalConcepto(false);
    }
  }, [dataConcepto]);

  useEffect(() => {
    if (refrescar) {
      dataDetalle;
      console.log(dataDetalle, "dataDetalle");
      setDataConcepto([]);
      setRefrescar(false);
    }
  }, [refrescar]);

  useEffect(() => {
    if (!modalConcepto) {
      if (Object.entries(dataConcepto).length > 0) {
        if (
          data.monedaId != dataConcepto.monedaId &&
          dataConcepto.Id != "000000"
        ) {
          ConvertirPreciosAMoneda(dataConcepto, data.monedaId, data.tipoCambio);
        }
      }
    }
  }, [modalConcepto]);

  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    if (target.name != "varios") {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    } else {
      if (target.checked) {
        setDataProveedor((prevState) => ({
          ...prevState,
          proveedorId: "000000",
          proveedorNumeroDocumentoIdentidad: "00000000000",
          proveedorDireccion: null,
          proveedorNombre: "CLIENTES VARIOS",
        }));
      } else {
        setDataProveedor((prevState) => ({
          ...prevState,
          proveedorId: "",
          proveedorNumeroDocumentoIdentidad: "",
          proveedorDireccion: "",
          proveedorNombre: "",
        }));
      }
    }
  };

  const ValidarDataConcepto = async ({ target }) => {
    setDataConcepto((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };

  const handlePlazoChange = (event) => {
    const plazo = parseInt(event.target.value);

    setData((prevData) => ({
      ...prevData,
      plazo: plazo,
    }));
    const today = moment().format("YYYY-MM-DD");
    const newFechaVencimiento = moment(today)
      .add(plazo, "days")
      .format("YYYY-MM-DD");
    setData((prevData) => ({
      ...prevData,
      fechaVencimiento: newFechaVencimiento,
    }));
  };

  const AbrirFiltroConcepto = async (e) => {
    e.preventDefault();
    setModalConcepto(true);
  };
  const ValidarDetalle = async () => {
    if (Object.entries(dataConcepto).length == 0) {
      return [false, "Seleccione un concepto"];
    } else {
      return [true, ""];
    }
  };
  const AgregarDetalle = async (e, id) => {
    e.preventDefault();
    let model = dataDetalle.find((map) => map.detalleId === id);
    setDataConcepto(model);
  };
  const EnviarDetalle = async (e) => {
    e.preventDefault();
    let resultado = await ValidarDetalle();
    if (resultado[0] > 0) {
      //Valida si tiene un dalleId
      if (dataConcepto.detalleId > -1) {
        //Si entra aquí es porque ya tiene un detalleID
        //El índice es 1 valor menos que el detalleId porque el índice inicia en 0 y el detalle en 1 por eso se le resta
        dataDetalle[dataConcepto.detalleId - 1] = {
          ...dataDetalle[dataConcepto.detalleId - 1],
          id: dataConcepto.id,
          concepto: dataConcepto.concepto,
          fechaEmision: dataConcepto.fechaEmision,
          abono: dataConcepto.abono,
          saldo: dataConcepto.saldo,
          ordenCompraRelacionada: dataConcepto.ordenCompraRelacionada,
        };
        //Refrescar para que actualice la tabla
        setRefrescar(true);
      } else {
        //Caso contrario, si no tiene Id es porque es un registro nuevo, hay que pushear al array

        //Valida si en caso no tiene detalleId, pero puede ser la misma descripción, hace el find para verificar
        let model = dataDetalle.find((map) => {
          return map.concepto === dataConcepto.concepto;
        });
        //Si model es undefined es que no encontró nada el find
        if (model == undefined) {
          //entonces hace el push directamente
          dataDetalle.push({
            detalleId: detalleId,
            id: dataConcepto.id,
            concepto: dataConcepto.concepto,
            fechaEmision: dataConcepto.fechaEmision,
            abono: dataConcepto.abono,
            saldo: dataConcepto.saldo,
            ordenCompraRelacionada: dataConcepto.ordenCompraRelacionada,
          });
          //Suma 1 al detalle para que continúe el correlativo
          setDetalleId(detalleId + 1);
          //refresca para que actualice la tabla
          setRefrescar(true);
        } else {
          toast.error("El detalle ya se encuentra agregado", {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
        }
      }
      //Aquí iría, independientemente de si actualiza o pushea el total a pagar va a cambiar
      setData({
        ...data,
        total: dataConcepto.abono,
      });
    } else {
      //Aquí entrará cuando falte completar algún campo en ValidarDetalle
      toast.error(resultado[1], {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  const EliminarDetalle = async (e, id) => {
    e.preventDefault();
    if (id != "") {
      let model = dataDetalle.filter((map) => map.detalleId !== id);
      setDataDetalle(model);
      setDetalleId(detalleId - 1);
      setRefrescar(true);
    }
  };

  const ConvertirPreciosAMoneda = async (
    data,
    monedaId,
    tipoCambio,
    precisionRedondeo = 2
  ) => {
    if (monedaId != "D" && monedaId != "S") {
      toast.error("No es posible hacer la conversión a la moneda ingresada", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return null;
    }
    if (tipoCambio == 0) {
      toast.error(
        "No es posible hacer la conversión si el tipo de cambio es cero (0.00)",
        {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      return null;
    }
    Swal.fire({
      title:
        "La deuda esta en una moneda distinta a la letra de cambio, El sistema calculara el monto de la deuda de acuerdo al tipo de cambio",
      icon: "warning",
    }).then(() => {
      let saldo = 0;
      let abono = 0;
      if (monedaId == "D") {
        saldo = Funciones.RedondearNumero(
          data.saldo / tipoCambio,
          precisionRedondeo
        );
        abono = Funciones.RedondearNumero(
          data.abono / tipoCambio,
          precisionRedondeo
        );
      } else {
        saldo = Funciones.RedondearNumero(
          data.saldo * tipoCambio,
          precisionRedondeo
        );
        abono = Funciones.RedondearNumero(
          data.abono * tipoCambio,
          precisionRedondeo
        );
      }
      setDataConcepto({ ...dataConcepto, saldo: saldo, abono: abono });
    });
  };

  const columnas = [
    {
      Header: "id",
      accessor: "detalleId",
    },
    {
      Header: "Emisión",
      accessor: "documentoCompraFechaEmision",
      Cell: ({ row }) =>
        moment(row.values.documentoCompraFechaEmision).format("DD/MM/YYYY"),
    },
    {
      Header: "Concepto",
      accessor: "concepto",
    },
    {
      Header: "Saldo",
      accessor: "saldo",
    },
    {
      Header: "Importe",
      accessor: "abono",
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
                  onClick={(e) => AgregarDetalle(e, row.values.detalleId)}
                  className="p-0 px-1"
                  title="Click para modificar registro"
                >
                  <FaPen></FaPen>
                </button>
              </div>

              <div className={Global.TablaBotonEliminar}>
                <button
                  id="boton-eliminar"
                  onClick={(e) => {
                    EliminarDetalle(e, row.values.detalleId);
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

  const GetTablas = async () => {
    const result = await ApiMasy(
      `/api/Compra/FacturaNegociable/FormularioTablas`
    );
    setPlazos(result.data.data.plazos);
    setTiposCompra(result.data.data.tiposCompra);
    setTiposPago(result.data.data.tiposPago);
    setMonedas(result.data.data.monedas);
  };

  const OcultarMensajes = () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };

  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/Proveedor/${id}`);
    setDataProveedor({
      proveedorId: result.data.data.id,
      proveedorNumeroDocumentoIdentidad:
        result.data.data.numeroDocumentoIdentidad,
      proveedorDireccion: result.data.data.direccionPrincipal,
      proveedorNombre: result.data.data.nombre,
    });
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
      setTipoMensaje(-1);
      setMensaje([]);
    }
  };
  //#endregion

  //#region Funciones Modal
  const AbrirFiltroProveedor = async (e) => {
    e.preventDefault();
    setModalProv(true);
  };

  //#endregion
  return (
    <>
      {Object.entries(monedas).length > 0 && (
        <>
          <ModalCrud
            setModal={setModal}
            objeto={data}
            modo={modo}
            menu={["Compra", "FacturaNegociable"]}
            titulo="Factura Negociable"
            tamañoModal={[Global.ModalFull, Global.Form]}
            cerrar={false}
          >
            {tipoMensaje > 0 && (
              <Mensajes
                tipoMensaje={tipoMensaje}
                mensaje={mensaje}
                Click={() => OcultarMensajes()}
              />
            )}
            <div className="gap-3 grid">
              <div className={Global.ContenedorBasico}>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.Input60pct}>
                    <label
                      htmlFor="numeroFactura"
                      className={Global.LabelStyle}
                    >
                      N° Factura
                    </label>
                    <input
                      type="text"
                      id="numeroFactura"
                      name="numeroFactura"
                      maxLength="2"
                      autoComplete="off"
                      placeholder="00"
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.numeroFactura ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.Input40pct}>
                    <label
                      htmlFor="fechaRegistro"
                      className={Global.LabelStyle}
                    >
                      Registro
                    </label>
                    <input
                      type="date"
                      id="fechaRegistro"
                      name="fechaRegistro"
                      maxLength="2"
                      autoComplete="off"
                      readOnly={modo == "Consultar" ? true : false}
                      value={
                        moment(data.fechaRegistro).format("yyyy-MM-DD") ?? ""
                      }
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.Input40pct}>
                    <label htmlFor="fechaEmision" className={Global.LabelStyle}>
                      Emisión
                    </label>
                    <input
                      type="date"
                      id="fechaEmision"
                      name="fechaEmision"
                      maxLength="2"
                      autoComplete="off"
                      readOnly={modo == "Consultar" ? true : false}
                      value={
                        moment(data.fechaEmision).format("yyyy-MM-DD") ?? ""
                      }
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.Input40pct}>
                    <label
                      htmlFor="fechaVencimiento"
                      className={Global.LabelStyle}
                    >
                      Vencimiento
                    </label>
                    <input
                      type="date"
                      id="fechaVencimiento"
                      name="fechaVencimiento"
                      maxLength="2"
                      autoComplete="off"
                      readOnly={modo == "Consultar" ? true : false}
                      value={
                        moment(data.fechaVencimiento).format("yyyy-MM-DD") ?? ""
                      }
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
              </div>
              <div className={Global.ContenedorBasico}>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="proveedorNombre"
                      className={Global.LabelStyle}
                    >
                      Proveedor
                    </label>
                    <input
                      type="text"
                      id="proveedorNombre"
                      name="proveedorNombre"
                      placeholder="Proveedor"
                      autoComplete="off"
                      readOnly={true}
                      value={dataProveedor.proveedorNombre ?? ""}
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
                      hidden={modo == "Consultar" ? true : false}
                      onClick={(e) => AbrirFiltroProveedor(e)}
                    >
                      <FaSearch></FaSearch>
                    </button>
                    <div className={Global.Input + " w-20"}>
                      <div className={Global.CheckStyle + Global.Anidado}>
                        <Checkbox
                          inputId="varios"
                          name="varios"
                          readOnly={modo == "Consultar" ? true : false}
                          onChange={(e) => {
                            setCheckVarios(e.checked);
                            ValidarData(e);
                          }}
                          checked={checkVarios ? true : ""}
                        ></Checkbox>
                      </div>
                      <label
                        htmlFor="varios"
                        className={Global.LabelCheckStyle}
                      >
                        Varios
                      </label>
                    </div>
                  </div>
                  <div className={Global.InputFull}>
                    <label htmlFor="plazoId" className={Global.LabelStyle}>
                      Plazo
                    </label>
                    <select
                      id="plazoId"
                      name="plazoId"
                      disabled={modo == "Consultar" ? true : false}
                      onChange={handlePlazoChange}
                      className={Global.InputStyle}
                    >
                      {plazos.map((item, index) => (
                        <option key={index} value={item.valor}>
                          {item.texto}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label htmlFor="lugarGiro" className={Global.LabelStyle}>
                      L. Giro
                    </label>
                    <input
                      type="text"
                      id="lugarGiro"
                      name="lugarGiro"
                      autoComplete="off"
                      value={data.lugarGiro ?? ""}
                      readOnly={modo == "Consultar" ? true : false}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputFull}>
                    <label htmlFor="tipoCompraId" className={Global.LabelStyle}>
                      T.Compra
                    </label>
                    <select
                      id="tipoCompraId"
                      name="tipoCompraId"
                      disabled={true}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    >
                      {tiposCompra.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label htmlFor="tipoPagoId" className={Global.LabelStyle}>
                      Tipo Pago
                    </label>
                    <select
                      id="tipoPagoId"
                      name="tipoPagoId"
                      disabled={true}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    >
                      {tiposPago.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={Global.InputFull}>
                    <label htmlFor="monedaId" className={Global.LabelStyle}>
                      Moneda
                    </label>
                    <select
                      id="monedaId"
                      name="monedaId"
                      disabled={modo == "Consultar" ? true : false}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    >
                      {monedas.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.descripcion}
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
                      autoComplete="off"
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.tipoCambio ?? ""}
                      onChange={ValidarData}
                      className={Global.InputBoton}
                    />
                    <button
                      id="consultarTipoCambio"
                      className={
                        Global.BotonBuscar +
                        Global.Anidado +
                        Global.BotonPrimary
                      }
                      hidden={modo == "Consultar" ? true : false}
                      onClick={(e) => {
                        e.preventDefault();
                        GetPorIdTipoCambio(data.fechaEmision);
                      }}
                    >
                      <FaUndoAlt></FaUndoAlt>
                    </button>
                  </div>
                  <div className={Global.InputFull}>
                    <label htmlFor="total" className={Global.LabelStyle}>
                      Total a Pagar
                    </label>
                    <input
                      type="text"
                      id="total"
                      name="total"
                      autoComplete="off"
                      value={data.total ?? ""}
                      readOnly={modo == "Consultar" ? true : false}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="documentoReferencia"
                      className={Global.LabelStyle}
                    >
                      D. Referencia
                    </label>
                    <input
                      type="text"
                      id="documentoReferencia"
                      name="documentoReferencia"
                      autoComplete="off"
                      value={data.documentoReferencia ?? ""}
                      readOnly={modo == "Consultar" ? true : false}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label htmlFor="concepto" className={Global.LabelStyle}>
                      Concepto
                    </label>
                    <input
                      type="text"
                      id="concepto"
                      onChange={ValidarDataConcepto}
                      name="concepto"
                      placeholder="Concepto"
                      autoComplete="off"
                      value={dataConcepto.concepto ?? ""}
                      className={Global.InputBoton}
                    />
                    <button
                      id="consultar"
                      className={Global.BotonBuscar + Global.BotonPrimary}
                      hidden={modo == "Consultar" ? true : false}
                      onClick={(e) => {
                        setDataConcepto([]);
                        AbrirFiltroConcepto(e);
                      }}
                    >
                      <FaSearch></FaSearch>
                    </button>
                  </div>
                  <div className={Global.Input25pct}>
                    <label htmlFor="saldo" className={Global.LabelStyle}>
                      Saldo
                    </label>
                    <input
                      type="number"
                      id="saldo"
                      name="saldo"
                      onChange={ValidarDataConcepto}
                      autoComplete="off"
                      readOnly={true}
                      value={dataConcepto.saldo ?? ""}
                      className={Global.InputStyle + Global.Disabled}
                    />
                  </div>
                  <div className={Global.Input25pct}>
                    <label htmlFor="abono" className={Global.LabelStyle}>
                      Abono
                    </label>
                    <input
                      type="number"
                      id="abono"
                      name="abono"
                      onChange={ValidarDataConcepto}
                      autoComplete="off"
                      readOnly={modo == "Consultar" ? true : false}
                      value={dataConcepto.abono ?? ""}
                      className={Global.InputStyle + Global.Disabled}
                    />
                    <button
                      id="enviarDetalle"
                      className={Global.BotonBuscar + Global.BotonPrimary}
                      hidden={modo == "Consultar" ? true : false}
                      onClick={(e) => EnviarDetalle(e)}
                    >
                      <FaPlus></FaPlus>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Tabla */}
            <TablaStyle>
              <TableBasic
                columnas={columnas}
                datos={dataDetalle}
                estilos={[
                  "",
                  "",
                  "",
                  "border",
                  "",
                  "border border-b-0",
                  "border",
                ]}
              />
            </TablaStyle>
            {/* Tabla */}
          </ModalCrud>
        </>
      )}
      {modalProv && (
        <FiltroProveedor setModal={setModalProv} setObjeto={setDataProveedor} />
      )}
      {modalConcepto && (
        <FiltroConcepto
          setModal={setModalConcepto}
          setObjeto={setDataConcepto}
        />
      )}
      <ToastContainer />
    </>
  );
};

export default Modal;
