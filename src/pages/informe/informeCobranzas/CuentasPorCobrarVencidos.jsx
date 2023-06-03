import React, { useState } from "react";
import ModalBasic from "../../../components/modal/ModalBasic";
import ApiMasy from "../../../api/ApiMasy";
import { useEffect } from "react";
import * as G from "../../../components/Global";
import BotonBasico from "../../../components/boton/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import store from "store2";
import moment from "moment";

const CuentasPorCobrarVencidos = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
    clienteId: "",
    checkFiltro: "sinDetalle",
    monedaId: "S",
    diasId: "15dias",
  });
  const [cliente, setCliente] = useState([]);
  const [monedas, setMonedas] = useState([]);
  const Rango = [
    {
      id: "15dias",
      nombre: "1-15 Días",
    },
    {
      id: "30dias",
      nombre: "16-30 Días",
    },
    {
      id: "60dias",
      nombre: "31-60 Días",
    },
    {
      id: "90dias",
      nombre: "61-90 Días",
    },
    {
      id: "120dias",
      nombre: "mas de 90 Días",
    },
  ];
  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    Cliente();
    Monedas();
  }, []);

  const ValidarData = async ({ target }) => {
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
      <ModalBasic titulo="Cuentas por Cobrar Vencidos" setModal={setModal}>
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
              onChange={ValidarData}
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
              className={G.InputStyle}
            >
              {monedas.map((moneda) => (
                <option key={moneda.id} value={moneda.id}>
                  {moneda.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className={G.InputFull}>
            <label htmlFor="diasId" className={G.LabelStyle}>
              Rango de Días
            </label>
            <select
              id="diasId"
              name="diasId"
              autoFocus
              value={data.diasId ?? ""}
              onChange={ValidarData}
              className={G.InputStyle}
            >
              {Rango.map((rango) => (
                <option key={rango.id} value={rango.id}>
                  {rango.nombre}
                </option>
              ))}
            </select>
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

export default CuentasPorCobrarVencidos;
