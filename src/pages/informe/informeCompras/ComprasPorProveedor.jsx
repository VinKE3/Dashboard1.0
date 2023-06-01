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

const ComprasPorProveedor = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
    monedaId: "S",
    proveedorId: "",
    checkFiltro: "sinDetalle",
  });
  const [moneda, setMoneda] = useState([]);
  const [proveedor, setProveedor] = useState([]);

  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    Proveedores();
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

  const Monedas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Articulo/FormularioTablas`
    );
    setMoneda(result.data.data.monedas);
  };

  const Proveedores = async () => {
    const result = await ApiMasy.get(`api/Mantenimiento/Proveedor/Listar`);
    setProveedor(result.data.data.data);
  };

  const Imprimir = async () => {
    console.log("Imprimir");
  };
  return (
    <>
      <ModalBasic titulo="Compras Por Proveedor" setModal={setModal}>
        <div
          className={Global.ContenedorBasico + Global.FondoContenedor + " mb-2"}
        >
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
          <div className={Global.InputFull}>
            <label htmlFor="proveedorId" className={Global.LabelStyle}>
              Proveedores
            </label>
            <select
              id="proveedorId"
              name="proveedorId"
              autoFocus
              value={data.proveedorId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            >
              <option key={-1} value={""}>
                {"--TODOS--"}
              </option>
              {proveedor.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <div className={Global.Input + "w-42"}>
                <div className={Global.CheckStyle}>
                  <RadioButton
                    inputId="sinDetalle"
                    name="agrupar"
                    value="sinDetalle"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro === "sinDetalle"}
                  />
                </div>
                <label
                  htmlFor="sinDetalle"
                  className={Global.LabelCheckStyle + "rounded-r-none"}
                >
                  Sin Detalle de Articulos
                </label>
              </div>
              <div className={Global.Input + "w-42"}>
                <div className={Global.CheckStyle + Global.Anidado}>
                  <RadioButton
                    inputId="conDetalle"
                    name="agrupar"
                    value="conDetalle"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro === "conDetalle"}
                  />
                </div>
                <label
                  htmlFor="conDetalle"
                  className={Global.LabelCheckStyle + "rounded-r-none"}
                >
                  Con Detalle de Articulos
                </label>
              </div>
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

export default ComprasPorProveedor;
