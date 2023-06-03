import React, { useState } from "react";
import ModalBasic from "../../../components/modal/ModalBasic";
import ApiMasy from "../../../api/ApiMasy";
import { useEffect } from "react";
import * as G from "../../../components/Global";
import { RadioButton } from "primereact/radiobutton";
import BotonBasico from "../../../components/boton/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import store from "store2";
import moment from "moment";

const CuentasPorCobrar = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal == null ? "" : dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format("YYYY-MM-DD"),
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

  const HandleData = async ({ target }) => {
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
          className={G.ContenedorBasico + G.FondoContenedor + " mb-2"}
        >
          <div className={G.InputFull}>
            <label htmlFor="clienteId" className={G.LabelStyle}>
              Cliente
            </label>
            <select
              id="clienteId"
              name="clienteId"
              autoFocus
              value={data.clienteId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
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
          <div className={G.InputFull}>
            <label htmlFor="personalId" className={G.LabelStyle}>
              Personal
            </label>
            <select
              id="personalId"
              name="personalId"
              autoFocus
              value={data.personalId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
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
          <div className={G.InputFull}>
            <label htmlFor="monedaId" className={G.LabelStyle}>
              Moneda
            </label>
            <select
              id="monedaId"
              name="monedaId"
              autoFocus
              value={data.monedaId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              {monedas.map((moneda) => (
                <option key={moneda.id} value={moneda.id}>
                  {moneda.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className={G.ContenedorInputsFiltro + " !my-0"}>
            <div className={G.InputFull}>
              <label htmlFor="fechaInicio" className={G.LabelStyle}>
                Desde
              </label>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={data.fechaInicio ?? ""}
                onChange={HandleData}
                className={G.InputStyle}
              />
            </div>
            <div className={G.InputFull}>
              <label htmlFor="fechaFin" className={G.LabelStyle}>
                Hasta
              </label>
              <input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={data.fechaFin ?? ""}
                onChange={HandleData}
                className={G.InputBoton}
              />
            </div>
          </div>
          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <div className={G.Input + "w-42"}>
                <div className={G.CheckStyle}>
                  <RadioButton
                    inputId="general"
                    name="agrupar"
                    value="general"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "general"}
                  />
                </div>
                <label
                  htmlFor="general"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  General
                </label>
              </div>
              <div className={G.Input + "w-42"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="detallado"
                    name="agrupar"
                    value="detallado"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "detallado"}
                  />
                </div>
                <label
                  htmlFor="detallado"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Detallado
                </label>
              </div>
              <div className={G.Input + "w-42"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="porPersonal"
                    name="agrupar"
                    value="porPersonal"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "porPersonal"}
                  />
                </div>
                <label
                  htmlFor="porPersonal"
                  className={G.LabelCheckStyle + " !py-1 "}
                >
                  Por Personal
                </label>
              </div>
            </div>
          </div>
          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <div className={G.Input + "w-42"}>
                <div className={G.CheckStyle}>
                  <RadioButton
                    inputId="fechaEmision"
                    name="agrupar"
                    value="fechaEmision"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro2 === "fechaEmision"}
                  />
                </div>
                <label
                  htmlFor="fechaEmision"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Fecha Emisión
                </label>
              </div>
              <div className={G.Input + "w-42"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="fechaVencimiento"
                    name="agrupar"
                    value="fechaVencimiento"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro2 === "fechaVencimiento"}
                  />
                </div>
                <label
                  htmlFor="fechaVencimiento"
                  className={G.LabelCheckStyle + " !py-1 "}
                >
                  Fecha Vencimiento
                </label>
              </div>
            </div>
          </div>
          <div className={G.ContenedorInputs}>
            <div className="mt-2">
              <BotonBasico
                botonText="ACEPTAR"
                botonClass={G.BotonAgregar}
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
