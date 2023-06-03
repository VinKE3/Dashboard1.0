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

const VentasPorPersonalDetalle = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal == null ? "" : dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format("YYYY-MM-DD"),
    monedaId: "S",
    personalId: "",
    tipoDocumentoId: "",
    verComision: true,
  });
  const [moneda, setMoneda] = useState([]);
  const [tipoDocumento, setTipoDocumento] = useState([]);
  const [personal, setPersonal] = useState([]);
  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    TipoDocumentos();
    Personal();
    Monedas();
  }, []);

  const ValidarData = async ({ target }) => {
    if (target.name === "verComision") {
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

  const TipoDocumentos = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Correlativo/FormularioTablas`
    );
    setTipoDocumento(result.data.data.tiposDocumento);
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
      <ModalBasic titulo="Ventas Por Personal Detalle" setModal={setModal}>
        <div
          className={G.ContenedorBasico + G.FondoContenedor + " mb-2"}
        >
          <div className={G.InputFull}>
            <label htmlFor="tipoDocumentoId" className={G.LabelStyle}>
              Tipo Documento
            </label>
            <select
              id="tipoDocumentoId"
              name="tipoDocumentoId"
              autoFocus
              value={data.tipoDocumentoId ?? ""}
              onChange={ValidarData}
              className={G.InputStyle}
            >
              <option key={-1} value={""}>
                {"--TODOS--"}
              </option>
              {tipoDocumento.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.descripcion}
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
              onChange={ValidarData}
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
                onChange={ValidarData}
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
                onChange={ValidarData}
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
              onChange={ValidarData}
              className={G.InputBoton}
            >
              {moneda.map((moneda) => (
                <option key={moneda.id} value={moneda.id}>
                  {moneda.descripcion}
                </option>
              ))}
            </select>
            <div className={G.Input + " w-25"}>
              <div className={G.CheckStyle + G.Anidado}>
                <Checkbox
                  inputId="verComision"
                  name="verComision"
                  onChange={(e) => {
                    ValidarData(e);
                  }}
                  checked={data.verComision ? true : ""}
                />
              </div>
              <label htmlFor="verComision" className={G.InputBoton}>
                Ver Comision
              </label>
            </div>
          </div>
          <div className="mt-2">
            <BotonBasico
              botonText="ACEPTAR"
              botonClass={G.BotonAgregar}
              botonIcon={faPlus}
              click={() => Imprimir()}
            />
          </div>
        </div>
      </ModalBasic>
    </>
  );
};

export default VentasPorPersonalDetalle;
