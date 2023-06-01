import React, { useState } from "react";
import ModalBasic from "../../../components/modal/ModalBasic";
import ApiMasy from "../../../api/ApiMasy";
import { useEffect } from "react";
import { Checkbox } from "primereact/checkbox";
import * as Global from "../../../components/Global";
import BotonBasico from "../../../components/boton/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const TomaDeInventario = ({ setModal }) => {
  const [data, setData] = useState([]);
  const [tipoDeExistencia, setTipoDeExistencia] = useState([]);

  useEffect(() => {
    TipoDeDocumentos();
  }, []);

  const ValidarData = async ({ target }) => {
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
                  value="New York"
                  onChange={(e) => {
                    ValidarData(e);
                  }}
                  checked={data.conStock ? true : ""}
                />
              </div>
              <label htmlFor="abonar" className={Global.LabelCheckStyle}>
                Con Stock
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
      </ModalBasic>
    </>
  );
};

export default TomaDeInventario;
