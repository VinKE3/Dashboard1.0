import React, { useState } from "react";
import ModalBasic from "../../../components/Modal/ModalBasic";
import ApiMasy from "../../../api/ApiMasy";
import { useEffect } from "react";
import * as Global from "../../../components/Global";
import { Checkbox } from "primereact/checkbox";
import BotonBasico from "../../../components/Boton/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import store from "store2";
import moment from "moment";

const VentaTipoDocumento = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
    monedaId: "S",
    cargoId: "",
    personalId: "",
    boletas: true,
    facturas: true,
    notasCredito: true,
    guiasRemision: true,
    agruparPersonal: false,
  });
  const [moneda, setMoneda] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [personal, setPersonal] = useState([]);
  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    Cargos();
    Personal();
    Monedas();
  }, []);

  const ValidarData = async ({ target }) => {
    if (
      target.name === "facturas" ||
      target.name === "boletas" ||
      target.name === "notasCredito" ||
      target.name === "guiasRemision" ||
      target.name === "agruparPersonal"
    ) {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
      return;
    }
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  const Monedas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Articulo/FormularioTablas`
    );
    setMoneda(result.data.data.monedas);
  };

  const Cargos = async () => {
    const result = await ApiMasy.get(`api/Mantenimiento/Cargo/Listar`);
    setCargos(result.data.data.data);
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

  const Imprimir = async () => {
    console.log("Imprimir");
  };
  return (
    <>
      <ModalBasic titulo="Ventas Por Tipo de Documento" setModal={setModal}>
        <div
          className={Global.ContenedorBasico + Global.FondoContenedor + " mb-2"}
        >
          <div className={Global.InputFull}>
            <label htmlFor="tiendaId" className={Global.LabelStyle}>
              Cargo
            </label>
            <select
              id="cargoId"
              name="cargoId"
              autoFocus
              value={data.cargoId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            >
              <option key={-1} value={""}>
                {"--TODOS--"}
              </option>
              {cargos.map((cargo) => (
                <option key={cargo.id} value={cargo.id}>
                  {cargo.descripcion}
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
              {moneda.map((moneda) => (
                <option key={moneda.id} value={moneda.id}>
                  {moneda.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <div className={Global.Input + " w-25"}>
                <div className={Global.CheckStyle + Global.Anidado}>
                  <Checkbox
                    inputId="facturas"
                    name="facturas"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.facturas ? true : ""}
                  />
                </div>
                <label htmlFor="facturas" className={Global.InputBoton}>
                  Facturas
                </label>
              </div>
              <div className={Global.Input + " w-25"}>
                <div className={Global.CheckStyle + Global.Anidado}>
                  <Checkbox
                    inputId="boletas"
                    name="boletas"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.boletas ? true : ""}
                  />
                </div>
                <label htmlFor="boletas" className={Global.InputBoton}>
                  Boletas
                </label>
              </div>
              <div className={Global.Input + " w-25"}>
                <div className={Global.CheckStyle + Global.Anidado}>
                  <Checkbox
                    inputId="guiasRemision"
                    name="guiasRemision"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.guiasRemision ? true : ""}
                  />
                </div>
                <label htmlFor="guiasRemision" className={Global.InputBoton}>
                  Guias Remision
                </label>
              </div>
              <div className={Global.Input + " w-25"}>
                <div className={Global.CheckStyle + Global.Anidado}>
                  <Checkbox
                    inputId="notasCredito"
                    name="notasCredito"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.notasCredito ? true : ""}
                  />
                </div>
                <label htmlFor="notasCredito" className={Global.InputBoton}>
                  Notas Credito
                </label>
              </div>
            </div>
            <div className={Global.Input + " w-60"}>
              <div className={Global.CheckStyle + Global.Anidado}>
                <Checkbox
                  inputId="agruparPersonal"
                  name="agruparPersonal"
                  onChange={(e) => {
                    ValidarData(e);
                  }}
                  checked={data.agruparPersonal ? true : ""}
                />
              </div>
              <label htmlFor="agruparPersonal" className={Global.InputBoton}>
                Agrupar Personal
              </label>
            </div>
          </div>
          <div className="mt-2">
            <BotonBasico
              botonText="ACEPTAR"
              botonClass={Global.BotonAgregar}
              botonIcon={faPlus}
              click={() => Imprimir()}
            />
          </div>
        </div>
      </ModalBasic>
    </>
  );
};

export default VentaTipoDocumento;
