import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalBasic from "../../../components/modal/ModalBasic";
import moment from "moment";
import Ubigeo from "../../../components/filtro/Ubigeo";
import * as G from "../../../components/Global";

const RegistroVentaUbigueo = ({ setModal }) => {
  //#region useState
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(
      dataGlobal == null ? "" : dataGlobal.fechaInicio
    ).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format(
      "YYYY-MM-DD"
    ),
    monedaId: "S",
    personalId: "",
    departamentoId: "",
    provinciaId: "",
    distritoId: "",
  });
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataPersonal, setDataPersonal] = useState([]);
  const [dataUbigeo, setDataUbigeo] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (Object.keys(dataUbigeo).length > 0) {
      setData({
        ...data,
        departamentoId: dataUbigeo.departamentoId,
        provinciaId: dataUbigeo.provinciaId,
        distritoId: dataUbigeo.distritoId,
      });
    }
  }, [dataUbigeo]);
  useEffect(() => {
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
  const HandleData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  //#endregion

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Articulo/FormularioTablas`
    );
    setDataMoneda(result.data.data.monedas);
    const res = await ApiMasy.get(`api/Mantenimiento/Personal/Listar`);
    setDataPersonal(
      res.data.data.data.map((res) => ({
        id: res.id,
        personal:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
  };
  const Enviar = async (origen = 1) => {
    let model = await Reporte(`Informes/Sistema/ReporteClientes`, origen);
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
        titulo="Ventas por ubigeo"
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
          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <label htmlFor="personalId" className={G.LabelStyle}>
                Personal
              </label>
              <select
                id="personalId"
                name="personalId"
                autoFocus
                value={data.personalId ?? ""}
                onChange={HandleData}
                className={G.InputStyle}
              >
                <option key={-1} value={""}>
                  {"--TODOS--"}
                </option>
                {dataPersonal.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.personal}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Ubigeo
            setDataUbigeo={setDataUbigeo}
            id={["departamentoId", "provinciaId", "distritoId"]}
            dato={{
              departamentoId: data.departamentoId,
              provinciaId: data.provinciaId,
              distritoId: data.distritoId,
            }}
          />

          <div className={G.ContenedorInputs}>
            <div className={G.InputMitad}>
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
            <div className={G.InputMitad}>
              <label htmlFor="fechaFin" className={G.LabelStyle}>
                Hasta
              </label>
              <input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={data.fechaFin ?? ""}
                onChange={HandleData}
                className={G.InputStyle}
              />
            </div>
          </div>
          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <label htmlFor="monedaId" className={G.LabelStyle}>
                Moneda
              </label>
              <select
                id="monedaId"
                name="monedaId"
                value={data.monedaId ?? ""}
                onChange={HandleData}
                className={G.InputStyle}
              >
                {dataMoneda.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.descripcion}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </ModalBasic>
    </>
  );
  //#endregion
};

export default RegistroVentaUbigueo;
