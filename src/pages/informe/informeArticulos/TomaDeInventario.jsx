import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalBasic from "../../../components/modal/ModalBasic";
import { Checkbox } from "primereact/checkbox";
import * as G from "../../../components/Global";

const TomaDeInventario = ({ setModal }) => {
  //#region useState
  const [data, setData] = useState([]);
  const [tipoDeExistencia, setTipoDeExistencia] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
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
  //#endregion

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Almacen/MovimientoArticulo/FormularioTablas`
    );
    setTipoDeExistencia(result.data.data.tiposExistencia);
  };
  const Imprimir = async (origen) => {
    console.log(origen);
  };
  //#endregion

  return (
    <>
      <ModalBasic
        setModal={setModal}
        titulo="Toma de Inventarios"
        habilitarFoco={false}
        tamañoModal={[G.ModalPequeño + " !max-w-2xl", G.Form]}
        childrenFooter={
          <>
            <button
              type="button"
              onClick={() => Imprimir("pdf")}
              className={G.BotonModalBase + G.BotonRojo + " border-gray-200"}
            >
              PDF
            </button>
            <button
              type="button"
              onClick={() => Imprimir("excel")}
              className={G.BotonModalBase + G.BotonVerde + "  border-gray-200"}
            >
              EXCEL
            </button>
            <button
              type="button"
              onClick={() => setModal(false)}
              className={G.BotonModalBase + G.BotonCerrarModal}
            >
              CERRAR
            </button>
          </>
        }
      >
        <div className={G.ContenedorInputs}>
          <div className={G.InputFull}>
            <label htmlFor="tipoExistenciaId" className={G.LabelStyle}>
              Tipo de Existencia
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
                  onChange={(e) => {
                    HandleData(e);
                  }}
                  checked={data.conStock ? true : ""}
                />
              </div>
              <label htmlFor="conStock" className={G.LabelCheckStyle}>
                Con Stock
              </label>
            </div>
          </div>
        </div>
      </ModalBasic>
    </>
  );
};

export default TomaDeInventario;
