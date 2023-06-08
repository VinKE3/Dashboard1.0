import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalBasic from "../../../components/modal/ModalBasic";
import { Checkbox } from "primereact/checkbox";
import moment from "moment";
import * as G from "../../../components/Global";

const ReporteIngresosEgresos = ({ setModal }) => {
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
    tipoId: "3",
    conceptoIngresoId: "",
    conceptoEgresoId: "",
    personalId: "",
    visualizar: true,
  });
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataPersonal, setDataPersonal] = useState([]);
  const tipos = [
    {
      id: 1,
      descripcion: "INGRESOS",
    },
    {
      id: 2,
      descripcion: "EGRESOS",
    },
    {
      id: 3,
      descripcion: "TODOS",
    },
  ];
  const conceptoEgresos = [
    {
      id: 1,
      descripcion: "Alquiler",
    },
    {
      id: 2,
      descripcion: "Comisiones",
    },
    {
      id: 3,
      descripcion: "Traspasos",
    },
    {
      id: 4,
      descripcion: "Cambio Dolar",
    },
    {
      id: 5,
      descripcion: "Extorno",
    },
    {
      id: 6,
      descripcion: "Combustible",
    },
    {
      id: 7,
      descripcion: "P.Relacionados",
    },
    {
      id: 8,
      descripcion: "Impuestos",
    },
  ];
  const conceptoIngresos = [
    {
      id: 1,
      descripcion: "Traspasos",
    },
    {
      id: 2,
      descripcion: "Cliente",
    },
    {
      id: 3,
      descripcion: "Extorno",
    },
    {
      id: 4,
      descripcion: "Cobranzas",
    },
    {
      id: 5,
      descripcion: "Otros",
    },
    {
      id: 6,
      descripcion: "Sin Sustento",
    },
    {
      id: 7,
      descripcion: "Tiendas",
    },
    {
      id: 8,
      descripcion: "Prestamos",
    },
  ];
  //#endregion

  //#region useEffect
  useEffect(() => {
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
  const HandleData = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "tipoId") {
      setData((prevState) => ({
        ...prevState,
        conceptoIngresoId: "",
        conceptoEgresoId: "",
      }));
      return;
    }
    if (name === "visualizar") {
      setData((prevState) => ({
        ...prevState,
        [name]: e.checked,
      }));
      return;
    }
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
      res.data.data.data.map((map) => ({
        id: map.id,
        personal:
          map.apellidoPaterno + " " + map.apellidoMaterno + " " + map.nombres,
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
        titulo="Reporte Ingresos/Egresos"
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
          <div className={G.InputFull}>
            <label htmlFor="tipoId" className={G.LabelStyle}>
              Tipo
            </label>
            <select
              id="tipoId"
              name="tipoId"
              value={data.tipoId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              {tipos.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.descripcion}
                </option>
              ))}
            </select>
          </div>

          {data.tipoId === "1" && (
            <div className={G.InputFull}>
              <label htmlFor="conceptoIngresoId" className={G.LabelStyle}>
                Concepto
              </label>
              <select
                id="conceptoIngresoId"
                name="conceptoIngresoId"
                value={data.conceptoIngresoId ?? ""}
                onChange={HandleData}
                className={G.InputStyle}
              >
                {conceptoIngresos.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.descripcion}
                  </option>
                ))}
              </select>
            </div>
          )}

          {data.tipoId === "2" && (
            <div className={G.InputFull}>
              <label htmlFor="conceptoEgresoId" className={G.LabelStyle}>
                Concepto
              </label>
              <select
                id="conceptoEgresoId"
                name="conceptoEgresoId"
                value={data.conceptoEgresoId ?? ""}
                onChange={HandleData}
                className={G.InputStyle}
              >
                {conceptoEgresos.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.descripcion}
                  </option>
                ))}
              </select>
            </div>
          )}

          {data.tipoId === "3" && (
            <div className={G.InputFull}>
              <div className={G.InputFull}>
                <label htmlFor="conceptoId" className={G.LabelStyle}>
                  Concepto
                </label>
                <select
                  id="conceptoId"
                  name="conceptoId"
                  value={""}
                  onChange={HandleData}
                  disabled={true}
                  className={G.InputBoton}
                >
                  <option value="">TODOS</option>
                </select>
              </div>
              <div className={G.Input + " w-40"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <Checkbox
                    inputId="visualizar"
                    name="visualizar"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.visualizar ? true : ""}
                  />
                </div>
                <label htmlFor="visualizar" className={G.LabelCheckStyle}>
                  Visualizar
                </label>
              </div>
            </div>
          )}

          {data.conceptoIngresoId === "2" ? (
            <div className={G.InputFull}>
              <label htmlFor="personalId" className={G.LabelStyle}>
                Personal
              </label>
              <select
                id="personalId"
                disabled={data.tipoId == 3 ? true : false}
                name="personalId"
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
          ) : (
            <>
              <div className={G.InputFull}>
                <label htmlFor="nombre" className={G.LabelStyle}>
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={data.nombre ?? ""}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
            </>
          )}
          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
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
            <div className={G.InputFull}>
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
        </div>
      </ModalBasic>
    </>
  );
};

export default ReporteIngresosEgresos;
