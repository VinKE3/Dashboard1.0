import React, { useState } from "react";
import ModalBasic from "../../../components/modal/ModalBasic";
import ApiMasy from "../../../api/ApiMasy";
import { useEffect } from "react";
import * as G from "../../../components/Global";
import BotonBasico from "../../../components/boton/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import store from "store2";
import moment from "moment";

const VentasPorClienteDocumento = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal == null ? "" : dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format("YYYY-MM-DD"),
    clienteId: "",
    tipoDocumentoId: "",
    monedaId: "S",
  });
  const [tipoDocumento, setTipoDocumento] = useState([]);
  const [cliente, setCliente] = useState([]);
  const [monedas, setMonedas] = useState([]);
  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    Cliente();
    TipoDocumentos();
    Monedas();
  }, []);

  const HandleData = async ({ target }) => {
    if (target.value === "sinDetalle" || target.value === "conDetalle") {
      setData((prevState) => ({
        ...prevState,
        checkFiltro: target.value,
      }));
      return;
    }
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };

  const Cliente = async () => {
    const result = await ApiMasy.get(`api/Mantenimiento/Cliente/Listar`);
    setCliente(result.data.data.data);
  };

  const TipoDocumentos = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Correlativo/FormularioTablas`
    );
    setTipoDocumento(result.data.data.tiposDocumento);
  };

  const Monedas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Articulo/FormularioTablas`
    );
    setMonedas(result.data.data.monedas);
  };

  const Imprimir = async () => {
    console.log("Imprimir");
  };
  return (
    <>
      <ModalBasic titulo="Ventas Por Cliente Documento" setModal={setModal}>
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
            <label htmlFor="tipoDocumentoId" className={G.LabelStyle}>
              Tipo Documento
            </label>
            <select
              id="tipoDocumentoId"
              name="tipoDocumentoId"
              autoFocus
              value={data.tipoDocumentoId ?? ""}
              onChange={HandleData}
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
              {monedas.map((moneda) => (
                <option key={moneda.id} value={moneda.id}>
                  {moneda.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className={G.ContenedorInputs}>
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
        </div>
      </ModalBasic>
    </>
  );
};

export default VentasPorClienteDocumento;
