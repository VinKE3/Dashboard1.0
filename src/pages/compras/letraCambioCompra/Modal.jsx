import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import FiltroProveedor from "../../../components/filtros/FiltroProveedor";
import FiltroOrdenCompra from "../../../components/filtros/FiltroOrdenCompra";
import moment from "moment";
import { Checkbox } from "primereact/checkbox";
import { FaSearch, FaUndoAlt } from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import * as Global from "../../../components/Global";
import Mensajes from "../../../components/Mensajes";

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
  const [plazos, setPlazos] = useState([]);
  const [tiposCompra, setTiposCompra] = useState([]);
  const [tiposPago, setTiposPago] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const [dataDetalle, setDataDetalle] = useState(objeto.detalles);
  const [dataProveedor, setDataProveedor] = useState([]);
  const [checkVarios, setCheckVarios] = useState(false);
  const [modalProv, setModalProv] = useState(false);
  const [modalOC, setModalOC] = useState(false);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  //#endregion
  //#region useEffect
  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    GetTablas();
  }, []);

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

  const GetTablas = async () => {
    const result = await ApiMasy(
      `/api/Compra/LetraCambioCompra/FormularioTablas`
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
  const AbrirFiltroOC = async (e) => {
    e.preventDefault();
    if (data.proveedorId != "") {
      setModalOC(true);
    }
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
            menu={["Compra", "LetraCambioCompra"]}
            titulo="Letra de Cambio"
            tamañoModal={[Global.ModalFull, Global.Form]}
            cerrar={false}
          >
            <div className="gap-3 grid">
              <div className={Global.ContenedorBasico}>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.Input60pct}>
                    <label htmlFor="numeroLetra" className={Global.LabelStyle}>
                      N° Letra
                    </label>
                    <input
                      type="text"
                      id="numeroLetra"
                      name="numeroLetra"
                      maxLength="2"
                      autoComplete="off"
                      placeholder="00"
                      readOnly={modo == "Registrar" ? false : true}
                      value={data.numeroLetra ?? ""}
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
                      onChange={ValidarData}
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
                      disabled={modo == "Consultar" ? true : false}
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
                      disabled={modo == "Consultar" ? true : false}
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
                      disabled={modo == "Consultar" ? true : false}
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
                      Total
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
              </div>
              <div className={Global.ContenedorBasico}>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label htmlFor="avalNombre" className={Global.LabelStyle}>
                      Aval Nombre
                    </label>
                    <input
                      type="text"
                      id="avalNombre"
                      name="avalNombre"
                      autoComplete="off"
                      value={data.avalNombre ?? ""}
                      readOnly={modo == "Consultar" ? true : false}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="avalNumeroDocumentoIdentidad"
                      className={Global.LabelStyle}
                    >
                      Aval N° Doc.
                    </label>
                    <input
                      type="text"
                      id="avalNumeroDocumentoIdentidad"
                      name="avalNumeroDocumentoIdentidad"
                      autoComplete="off"
                      value={data.avalNumeroDocumentoIdentidad ?? ""}
                      readOnly={modo == "Consultar" ? true : false}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="avalDomicilio"
                      className={Global.LabelStyle}
                    >
                      Aval Domicilio
                    </label>
                    <input
                      type="text"
                      id="avalDomicilio"
                      name="avalDomicilio"
                      autoComplete="off"
                      value={data.avalDomicilio ?? ""}
                      readOnly={modo == "Consultar" ? true : false}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputFull}>
                    <label htmlFor="avalTelefono" className={Global.LabelStyle}>
                      Aval Telefono
                    </label>
                    <input
                      type="text"
                      id="avalTelefono"
                      name="avalTelefono"
                      autoComplete="off"
                      value={data.avalTelefono ?? ""}
                      readOnly={modo == "Consultar" ? true : false}
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
                    autoComplete="off"
                    value={data.observacion ?? ""}
                    readOnly={modo == "Consultar" ? true : false}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
              </div>
            </div>
          </ModalCrud>
        </>
      )}
      {modalProv && (
        <FiltroProveedor setModal={setModalProv} setObjeto={setDataProveedor} />
      )}
    </>
  );
};

export default Modal;
