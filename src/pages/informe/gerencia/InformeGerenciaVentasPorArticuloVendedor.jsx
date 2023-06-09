import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import Reporte from "../../../components/funciones/Reporte";
import ModalBasic from "../../../components/modal/ModalBasic";
import moment from "moment";
import * as G from "../../../components/Global";

const InformeGerenciaVentasPorArticuloVendedor = ({ setModal }) => {
  //#region useState
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
    marcaId: "",
    personalId: "",
  });
  const [marcas, setMarcas] = useState([]);
  const [personal, setPersonal] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
  const HandleData = async ({ target }) => {
    if (
      target.value === "porDocumento" ||
      target.value === "porDetalle" ||
      target.value === "porArticulo" ||
      target.value === "porPersonal"
    ) {
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
  //#endregion

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(`api/Mantenimiento/Marca/Listar`);
    setMarcas(result.data.data.data);
    const res = await ApiMasy.get(`api/Mantenimiento/Personal/Listar`);
    setPersonal(
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

  return (
    <ModalBasic
      setModal={setModal}
      titulo="Ventas por Artículo y Vendedor"
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
          <div className={G.InputMitad}>
            <label htmlFor="fechaInicio" className={G.LabelStyle}>
              Desde
            </label>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              autoFocus
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
            {marcas.map((map) => (
              <option key={map.id} value={map.id}>
                {map.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className={G.InputFull}>
          <label htmlFor="personalId" className={G.LabelStyle}>
            Personal
          </label>
          <select
            id="personalId"
            name="personalId"
            value={data.personalId ?? ""}
            onChange={HandleData}
            className={G.InputStyle}
          >
            <option key={-1} value={""}>
              {"--TODOS--"}
            </option>
            {personal.map((map) => (
              <option key={map.id} value={map.id}>
                {map.personal}
              </option>
            ))}
          </select>
        </div>
      </div>
    </ModalBasic>
  );
};

export default InformeGerenciaVentasPorArticuloVendedor;
