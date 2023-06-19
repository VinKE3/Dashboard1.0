import { Checkbox } from "primereact/checkbox";
import React, { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import * as G from "../../../components/Global";
import Reporte from "../../../components/funciones/Reporte";
import ModalBasic from "../../../components/modal/ModalBasic";

const TomaInventario = ({ setModal }) => {
  //#region useState
  const [data, setData] = useState({
    tipoExistenciaId: "",
    conStock: false,
  });
  const [dataTipoExistencia, setDataTipoExistencia] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
  const HandleData = async ({ target }) => {
    if (target.name == "conStock") {
      setData((prev) => ({
        ...prev,
        [target.name]: target.checked,
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  //#endregion

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Informes/Articulos/TomaInventario/FormularioTablas`
    );
    setDataTipoExistencia(result.data.data.tiposExistencia);
  };
  const Enviar = async (origen = 1) => {
    let model = await Reporte(
      `Informes/Articulos/TomaInventario`,
      origen,
      `&tipoExistenciaId=${data.tipoExistenciaId}&conStock=${data.conStock}`
    );
    if (model != null) {
      const enlace = document.createElement("a");
      enlace.href = model.url;
      enlace.download = model.fileName;
      enlace.click();
      enlace.remove();
    }
  };
  //#endregion

  return (
    <>
      <ModalBasic
        setModal={setModal}
        titulo="Toma de Inventarios"
        habilitarFoco={false}
        tamañoModal={[G.ModalPequeño, G.Form]}
        childrenFooter={
          <>
            <button
              type="button"
              onClick={() => Enviar(1)}
              className={G.BotonModalBase + G.BotonRojo}
            >
              PDF
            </button>
            <button
              type="button"
              onClick={() => Enviar(2)}
              className={G.BotonModalBase + G.BotonVerde}
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
              {dataTipoExistencia.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.descripcion}
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

export default TomaInventario;