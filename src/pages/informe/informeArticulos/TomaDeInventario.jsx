import React, { useState } from "react";
import ModalBasic from "../../../components/modal/ModalBasic";
import ApiMasy from "../../../api/ApiMasy";
import { useEffect } from "react";
import { Checkbox } from "primereact/checkbox";
import * as G from "../../../components/Global";
import BotonBasico from "../../../components/boton/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const TomaDeInventario = ({ setModal }) => {
  const [data, setData] = useState([]);
  const [tipoDeExistencia, setTipoDeExistencia] = useState([]);

  useEffect(() => {
    TipoDeDocumentos();
  }, []);

  const HandleData = async ({ target }) => {
    if (target.name == "conStock") {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };

  const TipoDeDocumentos = async () => {
    const result = await ApiMasy.get(
      `api/Almacen/MovimientoArticulo/FormularioTablas`
    );
    setTipoDeExistencia(result.data.data.tiposExistencia);
  };
  const Imprimir = async () => {
    console.log("Imprimir");
  };

  return (
    <>
      <ModalBasic titulo="Toma de Inventario" setModal={setModal}>
        <div className={G.ContenedorInputs}>
          <div className={G.InputFull}>
            <label htmlFor="tipoExistenciaId" className={G.LabelStyle}>
              Tipo
            </label>
            <select
              id="tipoExistenciaId"
              name="tipoExistenciaId"
              autoFocus
              value={data.tipoExistenciaId ?? ""}
              onChange={HandleData}
              className={G.InputBoton}
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

            <div className={G.Input + " w-25"}>
              <div className={G.CheckStyle + G.Anidado}>
                <Checkbox
                  inputId="conStock"
                  name="conStock"
                  value="New York"
                  onChange={(e) => {
                    HandleData(e);
                  }}
                  checked={data.conStock ? true : ""}
                />
              </div>
              <label htmlFor="abonar" className={G.LabelCheckStyle}>
                Con Stock
              </label>
            </div>
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
      </ModalBasic>
    </>
  );
};

export default TomaDeInventario;
