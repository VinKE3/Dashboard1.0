import React, { useState } from "react";
import ModalBasic from "../../../components/modal/ModalBasic";
import ApiMasy from "../../../api/ApiMasy";
import { useEffect } from "react";
import * as G from "../../../components/Global";
import { Checkbox } from "primereact/checkbox";
import BotonBasico from "../../../components/boton/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import store from "store2";
import moment from "moment";

const VentaTipoDocumento = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal == null ? "" : dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format("YYYY-MM-DD"),
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
  const [personal, setDataPersonal] = useState([]);
  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    Cargos();
    Personal();
    GetTablas();
  }, []);

  const HandleData = async ({ target }) => {
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
  const GetTablas = async  () => {
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
    setDataPersonal(
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
          className={G.ContenedorBasico + G.FondoContenedor + " mb-2"}
        >
          <div className={G.InputFull}>
            <label htmlFor="tiendaId" className={G.LabelStyle}>
              Cargo
            </label>
            <select
              id="cargoId"
              name="cargoId"
              autoFocus
              value={data.cargoId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
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
              {moneda.map((moneda) => (
                <option key={moneda.id} value={moneda.id}>
                  {moneda.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <div className={G.Input + " w-25"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <Checkbox
                    inputId="facturas"
                    name="facturas"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.facturas ? true : ""}
                  />
                </div>
                <label htmlFor="facturas" className={G.InputBoton}>
                  Facturas
                </label>
              </div>
              <div className={G.Input + " w-25"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <Checkbox
                    inputId="boletas"
                    name="boletas"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.boletas ? true : ""}
                  />
                </div>
                <label htmlFor="boletas" className={G.InputBoton}>
                  Boletas
                </label>
              </div>
              <div className={G.Input + " w-25"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <Checkbox
                    inputId="guiasRemision"
                    name="guiasRemision"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.guiasRemision ? true : ""}
                  />
                </div>
                <label htmlFor="guiasRemision" className={G.InputBoton}>
                  Guias Remision
                </label>
              </div>
              <div className={G.Input + " w-25"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <Checkbox
                    inputId="notasCredito"
                    name="notasCredito"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.notasCredito ? true : ""}
                  />
                </div>
                <label htmlFor="notasCredito" className={G.InputBoton}>
                  Notas Credito
                </label>
              </div>
            </div>
            <div className={G.Input + " w-60"}>
              <div className={G.CheckStyle + G.Anidado}>
                <Checkbox
                  inputId="agruparPersonal"
                  name="agruparPersonal"
                  onChange={(e) => {
                    HandleData(e);
                  }}
                  checked={data.agruparPersonal ? true : ""}
                />
              </div>
              <label htmlFor="agruparPersonal" className={G.InputBoton}>
                Agrupar Personal
              </label>
            </div>
          </div>
          <div className="mt-2">
            <BotonBasico
              botonText="ACEPTAR"
              botonClass={G.BotonVerde}
              botonIcon={faPlus}
              click={() => Imprimir()}
contenedor=""
            />
          </div>
        </div>
      </ModalBasic>
    </>
  );
};

export default VentaTipoDocumento;
