import React, { useState } from "react";
import ModalCrud from "../../../components/ModalCrud";
import * as Global from "../../../components/Global";
import { useEffect } from "react";
import moment from "moment";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import { faPlus, faBan } from "@fortawesome/free-solid-svg-icons";
import { FaPlus, FaSearch, FaUndoAlt, FaPen, FaTrashAlt } from "react-icons/fa";
import Mensajes from "../../../components/Mensajes";
import ApiMasy from "../../../api/ApiMasy";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [detalle, setDetalle] = useState(objeto.abonos);
  const [abono, setAbono] = useState([
    // {
    //   empresaId: "",
    //   proveedorId: "",
    //   tipoDocumentoId: "",
    //   serie: "",
    //   numero: "",
    //   abonoId: 0,
    //   fecha: moment(new Date()).format("yyyy-MM-DD"),
    //   concepto: "",
    //   monedaId: "",
    //   tipoCambio: 0,
    //   monto: 0,
    //   montoPEN: 0,
    //   montoUSD: 0,
    //   documentoCompraId: "",
    //   tipoPagoId: "",
    //   cuentaCorrienteId: "",
    //   numeroOperacion: "",
    // },
  ]);
  const [monedas, setMonedas] = useState([]);
  const [tipoPagos, setTipoPagos] = useState([]);
  const [cuentasCorrientes, setCuentasCorrientes] = useState([]);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  //#endregion
  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    detalle;
    console.log(detalle);
  }, [detalle]);

  useEffect(() => {
    abono;
    console.log(abono);
  }, [abono]);

  useEffect(() => {
    GetPorIdTipoCambio(abono.fecha);
    GetTablas();
  }, []);
  //#region useEffect
  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    setAbono((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  const OcultarMensajes = () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  const EnviarAbono = async () => {
    console.log(abono);
  };

  const GetTablas = async () => {
    const result = await ApiMasy(`/api/Finanzas/AbonoCompra/FormularioTablas`);
    let model = result.data.data.cuentasCorrientes.map((res) => ({
      cuentaCorrienteId:
        res.numero +
        " | " +
        res.entidadBancariaNombre +
        " |  " +
        "[" +
        res.monedaId +
        "/.]",
      ...res,
    }));
    setMonedas(result.data.data.monedas);
    setCuentasCorrientes(model);
    setTipoPagos(result.data.data.tiposPago);
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
      setAbono({
        ...abono,
        tipoCambio: 0,
      });
    } else {
      setAbono({
        ...abono,
        tipoCambio: result.data.data.precioCompra,
      });
      setTipoMensaje(-1);
      setMensaje([]);
    }
  };
  //#endregion

  //#region  Render
  return (
    <ModalCrud
      setModal={setModal}
      objeto={data}
      modo={modo}
      menu={["Finanzas", "CuentaPorPagar"]}
      titulo="Cuentas Por Pagar"
      tamañoModal={[Global.ModalGrande, Global.Form]}
    >
      {tipoMensaje > 0 && (
        <Mensajes
          tipoMensaje={tipoMensaje}
          mensaje={mensaje}
          Click={() => OcultarMensajes()}
        />
      )}
      <div className={Global.ContenedorBasico}>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="tipoDocumento" className={Global.LabelStyle}>
              Tipo Documento
            </label>
            <input
              type="text"
              id="tipoDocumento"
              name="tipoDocumento"
              autoComplete="off"
              placeholder="00"
              readOnly={true}
              value={data.tipoDocumento.descripcion ?? ""}
              className={Global.InputStyle + Global.Disabled}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="serie" className={Global.LabelStyle}>
              Serie
            </label>
            <input
              type="text"
              id="serie"
              name="serie"
              autoComplete="off"
              placeholder="Serie"
              readOnly={true}
              value={data.serie ?? ""}
              className={Global.InputStyle + Global.Disabled}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="numero" className={Global.LabelStyle}>
              Número
            </label>
            <input
              type="text"
              id="numero"
              name="numero"
              autoComplete="off"
              placeholder="numero"
              readOnly={true}
              value={data.numero ?? ""}
              className={Global.InputStyle + Global.Disabled}
            />
          </div>
        </div>
      </div>
      <div className={Global.ContenedorBasico}>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="fechaContable" className={Global.LabelStyle}>
              Fecha
            </label>
            <input
              type="text"
              id="fechaContable"
              name="fechaContable"
              autoComplete="off"
              placeholder="fechaContable"
              readOnly={true}
              value={moment(data.fechaContable).format("DD/MM/YYYY") ?? ""}
              className={Global.InputStyle + Global.Disabled}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="monedaId" className={Global.LabelStyle}>
              Moneda
            </label>
            <input
              type="text"
              id="monedaId"
              name="monedaId"
              autoComplete="off"
              placeholder="monedaId"
              readOnly={true}
              value={data.monedaId ?? ""}
              className={Global.InputStyle + Global.Disabled}
            />
          </div>
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
            placeholder="total"
            readOnly={true}
            value={data.total ?? ""}
            className={Global.InputStyle + Global.Disabled}
          />
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
              placeholder="abonado"
              readOnly={true}
              value={data.abonado ?? ""}
              className={Global.InputStyle + Global.Disabled}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="saldo" className={Global.LabelStyle}>
              Saldo
            </label>
            <input
              type="text"
              id="saldo"
              name="saldo"
              autoComplete="off"
              placeholder="saldo"
              readOnly={true}
              value={data.saldo ?? ""}
              className={Global.InputStyle + Global.Disabled}
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
            placeholder="observacion"
            readOnly={true}
            value={data.observacion ?? ""}
            className={Global.InputStyle + Global.Disabled}
          />
        </div>
      </div>
      <div className={Global.ContenedorBasico}>
        <div className={Global.ContenedorInputs}>
          <BotonBasico
            botonText="Nuevo"
            botonClass={Global.BotonAgregar}
            botonIcon={faPlus}
            click={() => EnviarAbono()}
            containerClass=""
          />
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="abonoId" className={Global.LabelStyle}>
              Abono N°
            </label>
            <input
              type="text"
              id="abonoId"
              name="abonoId"
              autoComplete="off"
              onChange={ValidarData}
              placeholder="abonoId"
              // readOnly={modo === "Consultar" ? true : false}
              value={abono.abonoId ?? ""}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="fecha" className={Global.LabelStyle}>
              Fecha
            </label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              maxLength="2"
              autoComplete="off"
              // readOnly={modo == "Consultar" ? true : false}
              value={moment(abono.fecha).format("yyyy-MM-DD") ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
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
              // readOnly={modo == "Consultar" ? true : false}
              value={abono.tipoCambio ?? ""}
              onChange={ValidarData}
              className={Global.InputBoton}
            />
            <button
              id="consultarTipoCambio"
              className={
                Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
              }
              // hidden={modo == "Consultar" ? true : false}
              onClick={(e) => {
                e.preventDefault();
                GetPorIdTipoCambio(abono.fecha);
              }}
            >
              <FaUndoAlt></FaUndoAlt>
            </button>
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
              onChange={ValidarData}
              className={Global.InputStyle}
              value={abono.tipoPagoId ?? ""}
            >
              {tipoPagos.map((item, index) => (
                <option key={index} value={item.texto}>
                  {item.texto}
                </option>
              ))}
            </select>
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="cuentaCorrienteId" className={Global.LabelStyle}>
              Cuenta Corriente
            </label>
            <select
              id="cuentaCorrienteId"
              name="cuentaCorrienteId"
              onChange={ValidarData}
              className={Global.InputStyle}
              value={abono.cuentaCorrienteId ?? ""}
            >
              {cuentasCorrientes.map((item, index) => (
                <option key={index} value={item.id}>
                  {item.texto}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </ModalCrud>
  );
  //#endregion
};

export default Modal;
