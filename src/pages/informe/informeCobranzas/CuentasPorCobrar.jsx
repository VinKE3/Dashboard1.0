import React, { useState } from "react";
import ModalBasic from "../../../components/modal/ModalBasic";
import ApiMasy from "../../../api/ApiMasy";
import { useEffect } from "react";
import * as Global from "../../../components/Global";
import { RadioButton } from "primereact/radiobutton";
import BotonBasico from "../../../components/boton/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import store from "store2";
import moment from "moment";

const CuentasPorCobrar = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
    personalId: "",
    clienteId: "",
    checkFiltro: "general",
    checkFiltro2: "fechaVencimiento",
  });
  const [personal, setPersonal] = useState([]);
  const [cliente, setCliente] = useState([]);
  const [monedas, setMonedas] = useState([]);
  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    Personal();
    Cliente();
    Monedas();
  }, []);

  const ValidarData = async ({ target }) => {
    if (
      target.value === "general" ||
      target.value === "detallado" ||
      target.value === "porPersonal"
    ) {
      setData((prevState) => ({
        ...prevState,
        checkFiltro: target.value,
      }));
      return;
    }
    if (
      target.value === "fechaEmision" ||
      target.value === "fechaVencimiento"
    ) {
      setData((prevState) => ({
        ...prevState,
        checkFiltro2: target.value,
      }));
      return;
    }
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };

  const Personal = async () => {
    const result = await ApiMasy.get(`api/Mantenimiento/Personal/Listar`);
    setPersonal(
      result.data.data.data.map((res) => ({
        id: res.id,
        personal:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
  };
  const Monedas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Articulo/FormularioTablas`
    );
    setMonedas(result.data.data.monedas);
  };

  const Cliente = async () => {
    const result = await ApiMasy.get(`api/Mantenimiento/Cliente/Listar`);
    setCliente(result.data.data.data);
  };

  const Imprimir = async () => {
    console.log("Imprimir");
  };
  return (
    <>
      <ModalBasic titulo="Cuentas Por Cobrar" setModal={setModal}>
        <div
          className={Global.ContenedorBasico + Global.FondoContenedor + " mb-2"}
        >
          <div className={Global.InputFull}>
            <label htmlFor="clienteId" className={Global.LabelStyle}>
              Cliente
            </label>
            <select
              id="clienteId"
              name="clienteId"
              autoFocus
              value={data.clienteId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            >
              <option key={-1} value={""}>
                {"--TODOS--"}
              </option>
              {cliente.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="personalId" className={Global.LabelStyle}>
              Personal
            </label>
            <select
              id="personalId"
              name="personalId"
              autoFocus
              value={data.personalId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            >
              <option key={-1} value={""}>
                {"--TODOS--"}
              </option>
              {personal.map((personal) => (
                <option key={personal.id} value={personal.id}>
                  {personal.personal}
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
              autoFocus
              value={data.monedaId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            >
              {monedas.map((moneda) => (
                <option key={moneda.id} value={moneda.id}>
                  {moneda.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className={Global.ContenedorFiltro + " !my-0"}>
            <div className={Global.InputFull}>
              <label htmlFor="fechaInicio" className={Global.LabelStyle}>
                Desde
              </label>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={data.fechaInicio ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.InputFull}>
              <label htmlFor="fechaFin" className={Global.LabelStyle}>
                Hasta
              </label>
              <input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={data.fechaFin ?? ""}
                onChange={ValidarData}
                className={Global.InputBoton}
              />
            </div>
          </div>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <div className={Global.Input + "w-42"}>
                <div className={Global.CheckStyle}>
                  <RadioButton
                    inputId="general"
                    name="agrupar"
                    value="general"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro === "general"}
                  />
                </div>
                <label
                  htmlFor="general"
                  className={Global.LabelCheckStyle + "rounded-r-none"}
                >
                  General
                </label>
              </div>
              <div className={Global.Input + "w-42"}>
                <div className={Global.CheckStyle + Global.Anidado}>
                  <RadioButton
                    inputId="detallado"
                    name="agrupar"
                    value="detallado"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro === "detallado"}
                  />
                </div>
                <label
                  htmlFor="detallado"
                  className={Global.LabelCheckStyle + "rounded-r-none"}
                >
                  Detallado
                </label>
              </div>
              <div className={Global.Input + "w-42"}>
                <div className={Global.CheckStyle + Global.Anidado}>
                  <RadioButton
                    inputId="porPersonal"
                    name="agrupar"
                    value="porPersonal"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro === "porPersonal"}
                  />
                </div>
                <label
                  htmlFor="porPersonal"
                  className={Global.LabelCheckStyle + " !py-1 "}
                >
                  Por Personal
                </label>
              </div>
            </div>
          </div>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <div className={Global.Input + "w-42"}>
                <div className={Global.CheckStyle}>
                  <RadioButton
                    inputId="fechaEmision"
                    name="agrupar"
                    value="fechaEmision"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro2 === "fechaEmision"}
                  />
                </div>
                <label
                  htmlFor="fechaEmision"
                  className={Global.LabelCheckStyle + "rounded-r-none"}
                >
                  Fecha Emisión
                </label>
              </div>
              <div className={Global.Input + "w-42"}>
                <div className={Global.CheckStyle + Global.Anidado}>
                  <RadioButton
                    inputId="fechaVencimiento"
                    name="agrupar"
                    value="fechaVencimiento"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro2 === "fechaVencimiento"}
                  />
                </div>
                <label
                  htmlFor="fechaVencimiento"
                  className={Global.LabelCheckStyle + " !py-1 "}
                >
                  Fecha Vencimiento
                </label>
              </div>
            </div>
          </div>
          <div className={Global.ContenedorInputs}>
            <div className="mt-2">
              <BotonBasico
                botonText="ACEPTAR"
                botonClass={Global.BotonAgregar}
                botonIcon={faPlus}
                click={() => Imprimir()}
              />
            </div>
          </div>
        </div>
      </ModalBasic>
    </>
  );
};

export default CuentasPorCobrar;
