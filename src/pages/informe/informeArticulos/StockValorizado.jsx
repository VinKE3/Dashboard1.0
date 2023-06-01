import React, { useState } from "react";
import { RadioButton } from "primereact/radiobutton";
import ModalBasic from "../../../components/Modal/ModalBasic";
import ApiMasy from "../../../api/ApiMasy";
import { useEffect } from "react";
import { Checkbox } from "primereact/checkbox";
import * as Global from "../../../components/Global";
import BotonBasico from "../../../components/Boton/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const StockValorizado = ({ setModal }) => {
  const [data, setData] = useState({
    tipoExistenciaId: "",
    conStock: true,
    corteFecha: false,
    checkFiltro: "agruparLinea",
  });
  const [tipoDeExistencia, setTipoDeExistencia] = useState([]);

  useEffect(() => {
    TipoDeDocumentos();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const ValidarData = async ({ target }) => {
    if (target.name === "conStock" || target.name === "corteFecha") {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
      return;
    }
    if (target.value === "agruparMarca" || target.value === "agruparLinea") {
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

  const TipoDeDocumentos = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Articulo/FormularioTablas`
    );
    setTipoDeExistencia(result.data.data.tiposExistencia);
  };

  const Imprimir = async () => {
    console.log("Imprimir");
  };

  return (
    <>
      <ModalBasic titulo="Stock Valorizado" setModal={setModal}>
        <div
          className={Global.ContenedorBasico + Global.FondoContenedor + " mb-2"}
        >
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <label htmlFor="tipoExistenciaId" className={Global.LabelStyle}>
                Tipo
              </label>
              <select
                id="tipoExistenciaId"
                name="tipoExistenciaId"
                autoFocus
                value={data.tipoExistenciaId ?? ""}
                onChange={ValidarData}
                className={Global.InputBoton}
              >
                <option key={-1} value={""}>
                  {"--TODOS--"}
                </option>
                {tipoDeExistencia.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.descripcion}
                  </option>
                ))}
              </select>
              <div className={Global.Input + " w-25"}>
                <div className={Global.CheckStyle + Global.Anidado}>
                  <Checkbox
                    inputId="conStock"
                    name="conStock"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.conStock ? true : ""}
                  />
                </div>
                <label htmlFor="conStock" className={Global.InputBoton}>
                  Con Stock
                </label>
              </div>
              <div className={Global.Input + " w-25"}>
                <div className={Global.CheckStyle + Global.Anidado}>
                  <Checkbox
                    inputId="corteFecha"
                    name="corteFecha"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.corteFecha ? true : ""}
                  />
                </div>
                <label htmlFor="corteFecha" className={Global.InputBoton}>
                  Corte Fecha
                </label>
              </div>
            </div>
          </div>

          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <div className={Global.Input + "w-42"}>
                <div className={Global.CheckStyle}>
                  <RadioButton
                    inputId="agruparMarca"
                    name="agrupar"
                    value="agruparMarca"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro === "agruparMarca"}
                  />
                </div>
                <label
                  htmlFor="agruparMarca"
                  className={Global.LabelCheckStyle + "rounded-r-none"}
                >
                  Agrupar por Marca
                </label>
              </div>
              <div className={Global.Input + "w-42"}>
                <div className={Global.CheckStyle + Global.Anidado}>
                  <RadioButton
                    inputId="agruparLinea"
                    name="agrupar"
                    value="agruparLinea"
                    onChange={(e) => {
                      ValidarData(e);
                    }}
                    checked={data.checkFiltro === "agruparLinea"}
                  />
                </div>
                <label
                  htmlFor="agruparLinea"
                  className={Global.LabelCheckStyle + " !py-1 "}
                >
                  Agrupar por Linea y Sublinea
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

export default StockValorizado;
