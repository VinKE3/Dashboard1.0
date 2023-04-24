import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import FiltroProveedor from "../../../components/filtros/FiltroProveedor";
import FiltroOrdenCompra from "../../../components/filtros/FiltroOrdenCompra";
import Mensajes from "../../../components/Mensajes";
import TableBasic from "../../../components/tablas/TableBasic";
import moment from "moment";
import { Checkbox } from "primereact/checkbox";
import { FaPlus, FaSearch, FaUndoAlt } from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import * as Global from "../../../components/Global";

//#region Estilos

const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(3) {
    width: 90px;
  }
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;
//#endregion

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataDetalle, setDataDetalle] = useState(objeto.detalles);
  const [dataProveedor, setDataProveedor] = useState([]);
  const [dataOC, setDataOC] = useState([]);
  const [checkVarios, setCheckVarios] = useState(false);
  const [checkIgv, setCheckIgv] = useState(false);
  const [checkStock, setCheckStock] = useState(false);
  const [dataTipoDoc, setDataTipoDoc] = useState([]);
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataTipoComp, setDataTipoComp] = useState([]);
  const [dataTipoPag, setDataTipoPag] = useState([]);
  const [modalProv, setModalProv] = useState(false);
  const [modalOC, setModalOC] = useState(false);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (document.getElementById("tipoDocumentoIdentidadId")) {
      document.getElementById("tipoDocumentoIdentidadId").value =
        data.tipoDocumentoIdentidadId;
    }
  }, [dataTipoDoc]);

  useEffect(() => {
    if (document.getElementById("monedaId")) {
      document.getElementById("monedaId").value = data.monedaId;
    }
  }, [dataMoneda]);

  useEffect(() => {
    if (document.getElementById("tipoCompraId")) {
      document.getElementById("tipoCompraId").value = data.tipoCompraId;
    }
  }, [dataTipoComp]);

  useEffect(() => {
    if (document.getElementById("tipoPagoId")) {
      document.getElementById("tipoPagoId").value = data.tipoPagoId;
    }
  }, [dataTipoPag]);

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
    if (Object.keys(dataOC).length > 0) {
      setData({
        ...data,
        ordenesCompraRelacionadas: dataOC.ordenesCompraRelacionadas,
      });
    }
  }, [dataOC]);

  useEffect(() => {
    console.log(data.ordenesCompraRelacionadas);
    if (modo != "Registrar") {
      GetPorId(data.proveedorId);
    } else {
      GetPorIdTipoCambio(data.fechaEmision);
    }
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    if (target.name != "varios") {
      if (target.name == "incluyeIGV" || target.name == "afectarStock") {
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
  const OcultarMensajes = () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Compra/DocumentoCompra/FormularioTablas`
    );
    setDataTipoDoc(result.data.data.tiposDocumento);
    setDataMoneda(result.data.data.monedas);
    setDataTipoComp(result.data.data.tiposCompra);
    setDataTipoPag(result.data.data.tiposPago);
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
  const AbrirFiltroOC = async (e) => {
    e.preventDefault();
    if (data.proveedorId != "") {
      setModalOC(true);
    }
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Código",
      accessor: "codigoBarras",
    },
    {
      Header: "Descripción",
      accessor: "descripcion",
    },
    {
      Header: "Unidad",
      accessor: "unidadMedidaDescripcion",
    },
    {
      Header: "Cantidad",
      accessor: "cantidad",
    },
    {
      Header: "Precio",
      accessor: "precioUnitario",
    },
    {
      Header: "Importe",
      accessor: "importe",
    },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <button
          onClick={(e) => GetPorId(row.values.id, e)}
          className={Global.BotonBasic + Global.BotonRegistrar + " !px-3 !py-1"}
        >
          <FaSearch></FaSearch>
        </button>
      ),
    },
  ];
  //#endregion

  //#region Render
  return (
    <>
      {Object.entries(dataTipoDoc).length > 0 && (
        <>
          <ModalCrud
            setModal={setModal}
            objeto={data}
            modo={modo}
            menu={["Compra", "DocumentoCompra"]}
            titulo="Documentos de Compra"
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
            <div className="grid gap-3">
              <div className={Global.ContenedorBasico + Global.FondoContenedor}>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label htmlFor="id" className={Global.LabelStyle}>
                      Tipo Doc.
                    </label>
                    <select
                      id="tipoDocumentoId"
                      name="tipoDocumentoId"
                      onChange={ValidarData}
                      disabled={modo == "Consultar" ? true : false}
                      className={Global.InputStyle}
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
                      maxLength="4"
                      autoComplete="off"
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.serie ?? ""}
                      onChange={ValidarData}
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
                      placeholder="numero"
                      maxLength="10"
                      autoComplete="off"
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.numero ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputTercio}>
                    <label htmlFor="fechaEmision" className={Global.LabelStyle}>
                      F. Emisión
                    </label>
                    <input
                      type="date"
                      id="fechaEmision"
                      name="fechaEmision"
                      autoComplete="off"
                      readOnly={modo == "Consultar" ? true : false}
                      value={moment(data.fechaEmision ?? "").format(
                        "yyyy-MM-DD"
                      )}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputTercio}>
                    <label
                      htmlFor="fechaContable"
                      className={Global.LabelStyle}
                    >
                      F. Contable
                    </label>
                    <input
                      type="date"
                      id="fechaContable"
                      name="fechaContable"
                      autoComplete="off"
                      readOnly={modo == "Consultar" ? true : false}
                      value={moment(data.fechaContable ?? "").format(
                        "yyyy-MM-DD"
                      )}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputTercio}>
                    <label
                      htmlFor="fechaVencimiento"
                      className={Global.LabelStyle}
                    >
                      F. Vcmto
                    </label>
                    <input
                      type="date"
                      id="fechaVencimiento"
                      name="fechaVencimiento"
                      autoComplete="off"
                      readOnly={modo == "Consultar" ? true : false}
                      value={moment(data.fechaVencimiento ?? "").format(
                        "yyyy-MM-DD"
                      )}
                      onChange={ValidarData}
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
                      readOnly={true}
                      value={data.proveedorNumeroDocumentoIdentidad ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
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
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="proveedorDireccion"
                      className={Global.LabelStyle}
                    >
                      Dirección
                    </label>
                    <input
                      type="text"
                      id="proveedorDireccion"
                      name="proveedorDireccion"
                      autoComplete="off"
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.proveedorDireccion}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputTercio}>
                    <label htmlFor="monedaId" className={Global.LabelStyle}>
                      Moneda
                    </label>
                    <select
                      id="monedaId"
                      name="monedaId"
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
                  <div className={Global.InputTercio}>
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
                  <div className={Global.InputTercio}>
                    <label htmlFor="tipoCompraId" className={Global.LabelStyle}>
                      T. Compra
                    </label>
                    <select
                      id="tipoCompraId"
                      name="tipoCompraId"
                      onChange={ValidarData}
                      disabled={modo == "Consultar" ? true : false}
                      className={Global.InputStyle}
                    >
                      {dataTipoComp.map((map) => (
                        <option key={map.id} value={map.id}>
                          {map.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputMitad}>
                    <label htmlFor="tipoPagoId" className={Global.LabelStyle}>
                      T. Pago
                    </label>
                    <select
                      id="tipoPagoId"
                      name="tipoPagoId"
                      onChange={ValidarData}
                      disabled={modo == "Consultar" ? true : false}
                      className={Global.InputStyle}
                    >
                      {dataTipoPag.map((map) => (
                        <option key={map.id} value={map.id}>
                          {map.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={Global.InputMitad}>
                    <label htmlFor="guiaRemision" className={Global.LabelStyle}>
                      Guía Rem.
                    </label>
                    <input
                      type="text"
                      id="guiaRemision"
                      name="guiaRemision"
                      autoComplete="off"
                      placeholder="Guía de Remisión"
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.guiaRemision ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="numeroDocumento"
                      className={Global.LabelStyle}
                    >
                      O.C
                    </label>
                    <input
                      type="text"
                      id="numeroDocumento"
                      name="numeroDocumento"
                      placeholder="Orden de Compra"
                      autoComplete="off"
                      readOnly={true}
                      value={
                        data.ordenesCompraRelacionadas.map((map) => {
                          return map.numeroDocumento;
                        }) ?? ""
                      }
                      onChange={ValidarData}
                      className={Global.InputBoton}
                    />
                    <button
                      id="consultarOC"
                      className={
                        Global.BotonBuscar +
                        Global.Anidado +
                        Global.BotonPrimary
                      }
                      hidden={modo == "Consultar" ? true : false}
                      onClick={(e) => AbrirFiltroOC(e)}
                    >
                      <FaSearch></FaSearch>
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
                      readOnly={true}
                      value={dataProveedor.observacion ?? ""}
                      onChange={ValidarData}
                      className={Global.InputBoton}
                    />
                    <div className={Global.Input36}>
                      <div className={Global.CheckStyle + Global.Anidado}>
                        <Checkbox
                          inputId="incluyeIGV"
                          name="incluyeIGV"
                          readOnly={modo == "Consultar" ? true : false}
                          onChange={(e) => {
                            setCheckIgv(e.checked);
                            ValidarData();
                          }}
                          checked={checkIgv ? true : ""}
                        ></Checkbox>
                      </div>
                      <label
                        htmlFor="incluyeIGV"
                        className={Global.LabelCheckStyle + " rounded-r-none"}
                      >
                        Incluye IGV
                      </label>
                    </div>
                    <div className={Global.Input36}>
                      <div className={Global.CheckStyle + Global.Anidado}>
                        <Checkbox
                          inputId="afectarStock"
                          name="afectarStock"
                          readOnly={modo == "Consultar" ? true : false}
                          onChange={(e) => {
                            setCheckStock(e.checked);
                            ValidarData();
                          }}
                          checked={checkStock ? true : ""}
                        ></Checkbox>
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

              <div
                className={
                  Global.ContenedorBasico + Global.FondoContenedor + " mt-2"
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
                      readOnly={true}
                      value={data.serie ?? ""}
                      onChange={ValidarData}
                      className={Global.InputBoton}
                    />
                    <button
                      id="consultar"
                      className={Global.BotonBuscar + Global.BotonPrimary}
                      hidden={modo == "Consultar" ? true : false}
                      onClick={(e) => AbrirFiltroProveedor(e)}
                    >
                      <FaSearch></FaSearch>
                    </button>
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.Input25pct}>
                    <label htmlFor="id" className={Global.LabelStyle}>
                      Unidad
                    </label>
                    <input
                      type="number"
                      id="serie"
                      name="serie"
                      autoComplete="off"
                      readOnly={true}
                      value={data.serie ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.Input25pct}>
                    <label htmlFor="id" className={Global.LabelStyle}>
                      Cantidad
                    </label>
                    <input
                      type="number"
                      id="serie"
                      name="serie"
                      placeholder="0"
                      autoComplete="off"
                      readOnly={modo != "Consultar" ? false : true}
                      value={data.serie ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.Input25pct}>
                    <label htmlFor="id" className={Global.LabelStyle}>
                      P. Unitario
                    </label>
                    <input
                      type="numer"
                      id="serie"
                      name="serie"
                      placeholder="Precio Unitario"
                      autoComplete="off"
                      readOnly={modo != "Consultar" ? false : true}
                      value={data.serie ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.Input25pct}>
                    <label htmlFor="id" className={Global.LabelStyle}>
                      Importe
                    </label>
                    <input
                      type="number"
                      id="serie"
                      name="serie"
                      placeholder="0"
                      autoComplete="off"
                      readOnly={modo != "Consultar" ? false : true}
                      value={data.serie ?? ""}
                      onChange={ValidarData}
                      className={Global.InputBoton}
                    />
                    <button
                      id="consultar"
                      className={Global.BotonBuscar + Global.BotonPrimary}
                      hidden={modo == "Consultar" ? true : false}
                      onClick={(e) => AbrirFiltroProveedor(e)}
                    >
                      <FaPlus></FaPlus>
                    </button>
                  </div>
                </div>
              </div>

              <div className={Global.ContenedorBasico + Global.FondoContenedor}>
                {/* Tabla */}
                <TablaStyle>
                  <TableBasic columnas={columnas} datos={dataDetalle} />
                </TablaStyle>
                {/* Tabla */}
              </div>
            </div>
          </ModalCrud>
        </>
      )}
      {modalProv && (
        <FiltroProveedor setModal={setModalProv} setObjeto={setDataProveedor} />
      )}
      {modalOC && (
        <FiltroOrdenCompra
          setModal={setModalOC}
          id={data.proveedorId}
          setObjeto={setDataOC}
          objeto={data.ordenesCompraRelacionadas}
        />
      )}
    </>
  );
  //#endregion
};

export default Modal;
