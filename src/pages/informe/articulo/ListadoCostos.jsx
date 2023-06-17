import { RadioButton } from "primereact/radiobutton";
import React, { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import * as G from "../../../components/Global";
import Reporte from "../../../components/funciones/Reporte";
import ModalBasic from "../../../components/modal/ModalBasic";

const ListadoCostos = ({ setModal }) => {
  //#region useState
  const [data, setData] = useState({
    tipoExistenciaId: "",
    marcaId: "",
    conStock: null,
  });
  const [dataTipoExistencia, setDataTipoExistencia] = useState([]);
  const [dataMarca, setDataMarca] = useState([]);
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
        conStock: target.value,
      }));
      return;
    }
    setData((prev) => ({
      ...prev,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  //#endregion

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Informes/Articulos/ListadoCostos/FormularioTablas`
    );
    setDataMarca(result.data.data.marcas);
    setDataTipoExistencia(result.data.data.tiposExistencia);
  };
  const Enviar = async (origen = 1) => {
    let model = await Reporte(
      `Informes/Articulos/ListadoCostos`,
      origen,
      `&TipoExistenciaId=${data.tipoExistenciaId}&MarcaId=${data.marcaId}&ConStock=${data.conStock}`
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

  //#region Render
  return (
    <>
      <ModalBasic
        setModal={setModal}
        titulo="Listado de Costos"
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
        <div className={G.ContenedorBasico}>
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
              className={G.InputStyle}
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
          </div>
          <div className={G.InputFull}>
            <label htmlFor="marcaId" className={G.LabelStyle}>
              Marca
            </label>
            <select
              id="marcaId"
              name="marcaId"
              value={data.marcaId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              <option key={-1} value={""}>
                {"--TODOS--"}
              </option>
              {dataMarca.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <div className={G.InputTercio}>
                <div className={G.CheckStyle}>
                  <RadioButton
                    inputId="todos"
                    name="conStock"
                    value={null}
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.conStock === null}
                  />
                </div>
                <label
                  htmlFor="todos"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Todos
                </label>
              </div>
              <div className={G.InputTercio}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="stock"
                    name="conStock"
                    value={true}
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.conStock === true}
                  />
                </div>
                <label
                  htmlFor="stock"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Con Stock
                </label>
              </div>
              <div className={G.InputMitad}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="sinStock"
                    name="conStock"
                    value={false}
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.conStock === false}
                  />
                </div>
                <label
                  htmlFor="sinStock"
                  className={G.LabelCheckStyle + " !py-1 "}
                >
                  Sin Stock
                </label>
              </div>
            </div>
          </div>
        </div>
      </ModalBasic>
    </>
  );
  //#endregion
};

export default ListadoCostos;
