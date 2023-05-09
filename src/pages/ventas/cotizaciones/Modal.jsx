import React, { useState, useEffect } from "react";
import ModalCrud from "../../../components/ModalCrud";
import * as Global from "../../../components/Global";
import { Checkbox } from "primereact/checkbox";
import moment from "moment";
import ApiMasy from "../../../api/ApiMasy";
import Ubigeo from "../../../components/filtros/Ubigeo";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [checked, setChecked] = useState(true);
  const [personal, setPersonal] = useState([]);
  const [moneda, setMoneda] = useState([]);
  const [tipoVenta, setTipoVenta] = useState([]);
  const [tipoCobro, setTipoCobro] = useState([]);
  const [cuentasCorrientes, setCuentasCorrientes] = useState([]);
  const [porcentajesIgv, setPorcentajesIgv] = useState([]);
  const [porcentajeRetencion, setPorcentajeRetencion] = useState([]);
  const [porcentajePercepcion, setPorcentajePercepcion] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [dataUbigeo, setDataUbigeo] = useState([]);
  const [numeroOperacionDisabled, setNumeroOperacionDisabled] = useState(true);
  //#endregion

  //#region useEffect

  useEffect(() => {
    dataUbigeo;
    if (Object.keys(dataUbigeo).length > 0) {
      setData({
        ...data,
        departamentoId: dataUbigeo.departamentoId,
        provinciaId: dataUbigeo.provinciaId,
        distritoId: dataUbigeo.distritoId,
      });
    }
  }, [dataUbigeo]);
  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    if (Object.entries(personal).length > 0) {
      document.getElementById("personalId").value = data.personalId;
    }
  }, [personal]);

  useEffect(() => {
    if (Object.entries(moneda).length > 0) {
      document.getElementById("monedaId").value = data.monedaId;
    }
  }, [moneda]);

  useEffect(() => {
    if (Object.entries(cuentasCorrientes).length > 0) {
      document.getElementById("cuentaCorrienteId").value =
        data.cuentaCorrienteDescripcion;
    }
  }, [cuentasCorrientes]);

  useEffect(() => {
    if (Object.entries(tipoVenta).length > 0) {
      document.getElementById("tipoVentaId").value = data.tipoVentaId;
    }
  }, [tipoVenta]);

  useEffect(() => {
    if (Object.entries(tipoCobro).length > 0) {
      document.getElementById("tipoCobroId").value = data.tipoCobroId;
    }
    console.log(tipoCobro);
  }, [tipoCobro]);

  useEffect(() => {
    if (Object.entries(porcentajesIgv).length > 0) {
      document.getElementById("porcentajeIGV").value = data.porcentajeIGV;
    }
  }, [porcentajesIgv]);

  useEffect(() => {
    if (Object.entries(porcentajePercepcion).length > 0) {
      document.getElementById("porcentajePercepcion").value =
        data.porcentajePercepcion;
    }
  }, [porcentajePercepcion]);

  useEffect(() => {
    if (Object.entries(porcentajeRetencion).length > 0) {
      document.getElementById("porcentajeRetencion").value =
        data.porcentajeRetencion;
    }
  }, [porcentajeRetencion]);

  useEffect(() => {
    checked;
  }, [checked]);

  useEffect(() => {
    GetTablas();
    GetDetalles();
  }, []);

  useEffect(() => {
    if (detalles.length > 0) {
      detalles;
    }
  }, [detalles]);
  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    if (target.name == "incluyeIGV") {
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

  const handleTipoCobroChange = (event) => {
    const tipoCobroId = event.target.value;
    const selectedTipoCobro = tipoCobro.find((cob) => cob.id === tipoCobroId);

    setData((prevData) => ({
      ...prevData,
      tipoCobroId: tipoCobroId,
    }));

    if (selectedTipoCobro.id === "CH") {
      setNumeroOperacionDisabled(false);
    } else {
      setNumeroOperacionDisabled(true);
    }

    const today = moment().format("YYYY-MM-DD");
    const newFechaVencimiento = moment(today)
      .add(selectedTipoCobro.plazo, "days")
      .format("YYYY-MM-DD");

    setData((prevData) => ({
      ...prevData,
      fechaVencimiento: newFechaVencimiento,
    }));
  };

  const GetTablas = async () => {
    const result = await ApiMasy(`/api/Venta/Cotizacion/FormularioTablas`);
    let model = result.data.data.vendedores.map((res) => ({
      personalId: res.apellidoPaterno + res.apellidoMaterno + res.nombres,
      ...res,
    }));
    let model2 = result.data.data.cuentasCorrientes.map((res) => ({
      cuentaCorrienteDes:
        res.numero +
        " | " +
        res.entidadBancariaNombre +
        " |  " +
        "[" +
        res.monedaId +
        "/.]",
      ...res,
    }));
    setPersonal(model);
    setCuentasCorrientes(model2);
    setMoneda(result.data.data.monedas);
    setTipoVenta(result.data.data.tiposVenta);
    setTipoCobro(result.data.data.tiposCobro);
    setPorcentajePercepcion(result.data.data.porcentajesPercepcion);
    setPorcentajeRetencion(result.data.data.porcentajesRetencion);
    setPorcentajesIgv(result.data.data.porcentajesIGV);
  };

  const GetDetalles = async () => {
    const result = data.detalles.map((res) => ({
      articuloId: res.articuloId,
      cantidad: res.cantidad,
      descripcion: res.descripcion,
      detalleId: res.detalleId,
      lineaId: res.lineaId,
      marcaId: res.marcaId,
      salidaCilindrosId: res.salidaCilindrosId,
      subLineaId: res.subLineaId,
      unidadMedidaDescripcion: res.unidadMedidaDescripcion,
      unidadMedidaId: res.unidadMedidaId,
    }));
    setDetalles(result);
  };
  //#endregion

  //#region  Render
  return (
    <ModalCrud
      setModal={setModal}
      objeto={data}
      modo={modo}
      menu={["Venta", "Cotizacion"]}
      tamañoModal={[Global.ModalFull, Global.FormSimple]}
      titulo="Cotización"
    >
      <div className={Global.ContenedorBasico}>
        <div className={Global.InputFull}>
          <h1 className="text-xl font-bold uppercase">
            corporación <span className="text-primary">cikron</span>
          </h1>
        </div>
      </div>
      <div className={Global.ContenedorBasico}>
        <div className={Global.ContenedorInputs}>
          <div className={Global.Input60pct}>
            <label htmlFor="tipoDocumentoId" className={Global.LabelStyle}>
              Tipo Doc.
            </label>
            <input
              type="text"
              id="tipoDocumentoId"
              name="tipoDocumentoId"
              autoComplete="off"
              placeholder="Tipo Doc."
              readOnly={true}
              value={data.tipoDocumentoId}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.Input60pct}>
            <label htmlFor="serie" className={Global.LabelStyle}>
              Código
            </label>
            <input
              type="text"
              id="serie"
              name="serie"
              autoComplete="off"
              placeholder="Código"
              readOnly={modo == "Consultar" ? true : false}
              value={data.serie}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.Input60pct}>
            <label htmlFor="numero" className={Global.LabelStyle}>
              Numero
            </label>
            <input
              type="text"
              id="numero"
              name="numero"
              autoComplete="off"
              placeholder="Numero"
              readOnly={modo == "Consultar" ? true : false}
              value={data.numero}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="fechaEmision" className={Global.LabelStyle}>
              Fecha Emisión
            </label>
            <input
              type="date"
              id="fechaEmision"
              name="fechaEmision"
              autoComplete="off"
              readOnly={modo == "Consultar" ? true : false}
              value={moment(data.fechaEmision).format("yyyy-MM-DD")}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="fechaVencimiento" className={Global.LabelStyle}>
              Fecha Vencimiento
            </label>
            <input
              type="date"
              id="fechaVencimiento"
              name="fechaVencimiento"
              autoComplete="off"
              readOnly={modo == "Consultar" ? true : false}
              value={moment(data.fechaVencimiento).format("yyyy-MM-DD")}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="clienteNombre" className={Global.LabelStyle}>
              Cliente
            </label>
            <input
              type="text"
              id="clienteNombre"
              name="clienteNombre"
              autoComplete="off"
              placeholder="Cliente"
              readOnly={modo == "Consultar" ? true : false}
              value={data.clienteNombre}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label
              htmlFor="clienteNumeroDocumentoIdentidad"
              className={Global.LabelStyle}
            >
              RUC/DNI
            </label>
            <input
              type="text"
              id="clienteNumeroDocumentoIdentidad"
              name="clienteNumeroDocumentoIdentidad"
              autoComplete="off"
              placeholder="RUC/DNI"
              readOnly={modo == "Consultar" ? true : false}
              value={data.clienteNumeroDocumentoIdentidad}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="clienteDireccion" className={Global.LabelStyle}>
              Dirección
            </label>
            <input
              type="text"
              id="clienteDireccion"
              name="clienteDireccion"
              autoComplete="off"
              placeholder="Dirección"
              readOnly={modo == "Consultar" ? true : false}
              value={data.clienteDireccion}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="clienteTelefono" className={Global.LabelStyle}>
              Teléfono
            </label>
            <input
              type="text"
              id="clienteTelefono"
              name="clienteTelefono"
              autoComplete="off"
              placeholder="Teléfono"
              readOnly={modo == "Consultar" ? true : false}
              value={data.clienteTelefono ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
        <div className="mt-3">
          <Ubigeo
            modo={modo}
            id={["departamentoId", "provinciaId", "distritoId"]}
            dato={{
              departamentoId: data.departamentoId,
              provinciaId: data.provinciaId,
              distritoId: data.distritoId,
            }}
            setDataUbigeo={setDataUbigeo}
          />
        </div>
      </div>
      <div className={Global.ContenedorBasico}>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="contactoNombre" className={Global.LabelStyle}>
              Nombre
            </label>
            <input
              type="text"
              id="contactoNombre"
              name="contactoNombre"
              autoComplete="off"
              placeholder="Nombre"
              readOnly={modo == "Consultar" ? true : false}
              value={data.contactoNombre ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="contactoTelefono" className={Global.LabelStyle}>
              Teléfono
            </label>
            <input
              type="text"
              id="contactoTelefono"
              name="contactoTelefono"
              autoComplete="off"
              placeholder="Teléfono"
              readOnly={modo == "Consultar" ? true : false}
              value={data.contactoTelefono ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label
              htmlFor="contactoCorreoElectronico"
              className={Global.LabelStyle}
            >
              E-mail
            </label>
            <input
              type="text"
              id="contactoCorreoElectronico"
              name="contactoCorreoElectronico"
              autoComplete="off"
              placeholder="E-mail"
              readOnly={modo == "Consultar" ? true : false}
              value={data.contactoCorreoElectronico ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label
              htmlFor="contactoCargoDescripcion"
              className={Global.LabelStyle}
            >
              Cargo
            </label>
            <input
              type="text"
              id="contactoCargoDescripcion"
              name="contactoCargoDescripcion"
              autoComplete="off"
              placeholder="Cargo"
              readOnly={modo == "Consultar" ? true : false}
              value={data.contactoCargoDescripcion ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="contactoCelular" className={Global.LabelStyle}>
              Celular
            </label>
            <input
              type="text"
              id="contactoCelular"
              name="contactoCelular"
              autoComplete="off"
              placeholder="Celular"
              readOnly={modo == "Consultar" ? true : false}
              value={data.contactoCelular ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
        <div className={Global.InputFull}>
          <label htmlFor="personalId" className={Global.LabelStyle}>
            Personal
          </label>
          <select
            id="personalId"
            name="personalId"
            onChange={ValidarData}
            className={Global.InputStyle}
            readOnly={modo == "Consultar" ? true : false}
          >
            {personal.map((per, index) => (
              <option key={index} value={per.id}>
                {per.personalId}
              </option>
            ))}
          </select>
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="monedaId" className={Global.LabelStyle}>
              Moneda
            </label>
            <select
              id="monedaId"
              name="monedaId"
              onChange={ValidarData}
              className={Global.InputStyle}
              readOnly={modo == "Consultar" ? true : false}
              disabled={modo == "Consultar" ? true : false}
            >
              {moneda.map((mon, index) => (
                <option key={index} value={mon.id}>
                  {mon.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="tipoCambio" className={Global.LabelStyle}>
              Tipo Cambio
            </label>
            <input
              type="text"
              id="tipoCambio"
              name="tipoCambio"
              autoComplete="off"
              placeholder="Tipo Cambio"
              readOnly={modo == "Consultar" ? true : false}
              value={data.tipoCambio ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="tipoVentaId" className={Global.LabelStyle}>
              Tipo Venta
            </label>
            <select
              id="tipoVentaId"
              name="tipoVentaId"
              onChange={ValidarData}
              className={Global.InputStyle}
              readOnly={modo == "Consultar" ? false : true}
            >
              {tipoVenta.map((ven, index) => (
                <option key={index} value={ven.id}>
                  {ven.descripcion}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="tipoCobroId" className={Global.LabelStyle}>
              Tipo Cobro
            </label>
            <select
              id="tipoCobroId"
              name="tipoCobroId"
              onChange={handleTipoCobroChange}
              className={Global.InputStyle}
              readOnly={modo == "Consultar" ? true : false}
              disabled={modo == "Consultar" ? true : false}
            >
              {tipoCobro.map((cob, index) => (
                <option key={index} value={cob.id}>
                  {cob.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="numeroOperacion" className={Global.LabelStyle}>
              Tipo Cobro Numero
            </label>
            <input
              type="text"
              id="numeroOperacion"
              name="numeroOperacion"
              autoComplete="off"
              placeholder="Tipo Cobro Numero"
              readOnly={
                numeroOperacionDisabled || modo == "Consultar" ? true : false
              }
              value={data.numeroOperacion ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="cuentaCorrienteId" className={Global.LabelStyle}>
              Cuenta Corriente
            </label>
            <select
              id="cuentaCorrienteId"
              name="cuentaCorrienteId"
              onChange={ValidarData}
              className={Global.InputStyle}
              readOnly={modo == "Consultar" ? true : false}
              disabled={modo == "Consultar" ? true : false}
            >
              {cuentasCorrientes.map((corr, index) => (
                <option key={index} value={corr.cuentaCorrienteDes}>
                  {corr.cuentaCorrienteDes}
                </option>
              ))}
            </select>
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="validez" className={Global.LabelStyle}>
              Validez
            </label>
            <input
              type="text"
              id="validez"
              name="validez"
              autoComplete="off"
              placeholder="Validez"
              readOnly={modo == "Consultar" ? true : false}
              value={data.validez ?? ""}
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
            placeholder="Observación"
            readOnly={modo == "Consultar" ? true : false}
            value={data.observacion ?? ""}
            onChange={ValidarData}
            className={Global.InputStyle}
          />
        </div>
      </div>
      <div className={Global.ContenedorBasico}>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="subTotal" className={Global.LabelStyle}>
              Subtotal
            </label>
            <input
              type="text"
              id="subTotal"
              name="subTotal"
              autoComplete="off"
              placeholder="00"
              readOnly={modo == "Consultar" ? true : false}
              value={data.subTotal ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>

          <div className={Global.InputFull}>
            <label htmlFor="porcentajeIGV" className={Global.LabelStyle}>
              Monto IGV
            </label>
            <select
              id="porcentajeIGV"
              name="porcentajeIGV"
              onChange={ValidarData}
              className={Global.InputStyle + " !rounded-none"}
              readOnly={modo == "Consultar" ? true : false}
            >
              {porcentajesIgv.map((ig, index) => (
                <option key={index} value={ig.porcentaje}>
                  {ig.porcentaje + "%"}
                </option>
              ))}
            </select>
            <input
              type="text"
              id="montoIGV"
              name="montoIGV"
              autoComplete="off"
              placeholder="00"
              disabled={true}
              value={data.montoIGV ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
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
              placeholder="00"
              disabled={true}
              value={data.total ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="porcentajePercepcion" className={Global.LabelStyle}>
              Percepción
            </label>
            <select
              id="porcentajePercepcion"
              name="porcentajePercepcion"
              onChange={ValidarData}
              className={Global.InputStyle + " !rounded-none"}
              readOnly={modo == "Consultar" ? true : false}
            >
              {porcentajePercepcion.map((persepcion, index) => (
                <option key={index} value={persepcion.porcentaje}>
                  {persepcion.porcentaje + "%"}
                </option>
              ))}
            </select>
            <input
              type="text"
              id="montoPercepcion"
              name="montoPercepcion"
              autoComplete="off"
              placeholder="00"
              disabled={true}
              value={data.montoPercepcion ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="porcentajeRetencion" className={Global.LabelStyle}>
              Retención
            </label>
            <select
              id="porcentajeRetencion"
              name="porcentajeRetencion"
              onChange={ValidarData}
              className={Global.InputStyle + " !rounded-none"}
              readOnly={modo == "Consultar" ? true : false}
            >
              {porcentajeRetencion.map((retencion, index) => (
                <option key={index} value={retencion.porcentaje}>
                  {retencion.porcentaje + "%"}
                </option>
              ))}
            </select>
            <input
              type="text"
              id="montoRetencion"
              name="montoRetencion"
              autoComplete="off"
              placeholder="00"
              disabled={true}
              value={data.montoRetencion ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="totalNeto" className={Global.LabelStyle}>
              Total a Pagar
            </label>
            <input
              type="text"
              id="totalNeto"
              name="totalNeto"
              autoComplete="off"
              placeholder="00"
              disabled={true}
              value={data.totalNeto ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="abonado" className={Global.LabelStyle}>
              Abonado
            </label>
            <input
              type="text"
              id="abonado"
              name="abonado"
              autoComplete="off"
              placeholder="00"
              disabled={true}
              // value={data.totalNeto ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="saldoTotal" className={Global.LabelStyle}>
              Saldo Total
            </label>
            <input
              type="text"
              id="saldoTotal"
              name="saldoTotal"
              autoComplete="off"
              placeholder="00"
              disabled={true}
              // value={data.totalNeto ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <div className={Global.LabelStyle}>
              <Checkbox
                inputId="incluyeIGV"
                name="incluyeIGV"
                readOnly={modo == "Consultar" ? true : false}
                value={data.incluyeIGV}
                onChange={(e) => {
                  setChecked(e.checked);
                  ValidarData(e);
                }}
                checked={data.incluyeIGV ? checked : ""}
              />
            </div>
            <label htmlFor="incluyeIGV" className={Global.InputStyle}>
              Incluye IGV
            </label>
          </div>
        </div>
      </div>
    </ModalCrud>
  );
  //#endregion
};

export default Modal;
