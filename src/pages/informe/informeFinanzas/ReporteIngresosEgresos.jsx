import React, { useState } from "react";
import ModalBasic from "../../../components/Modal/ModalBasic";
import ApiMasy from "../../../api/ApiMasy";
import { useEffect } from "react";
import * as Global from "../../../components/Global";
import BotonBasico from "../../../components/Boton/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import store from "store2";
import moment from "moment";
import { Checkbox } from "primereact/checkbox";

const ReporteIngresosEgresos = ({ setModal }) => {
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(dataGlobal.fechaInicio).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal.fechaFin).format("YYYY-MM-DD"),
    monedaId: "S",
    tipoId: "3",
    conceptoIngresoId: "",
    conceptoEgresoId: "",
    personalId: "",
    visualizar: true,
  });
  const [monedas, setMonedas] = useState([]);
  const [personal, setPersonal] = useState([]);
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

  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    Monedas();
    Personal();
  }, []);

  // const ValidarData = async ({ target }) => {
  //   if (target.name === "tipoId") {
  //     setData((prevState) => ({
  //       ...prevState,
  //       conceptoIngresoId: "",
  //       conceptoEgresoId: "",
  //     }));
  //     return;
  //   }
  //    if (

  //     target.name === "visualizar"
  //   ) {
  //     setData((prevState) => ({
  //       ...prevState,
  //       [target.name]: target.checked,
  //     }));
  //     return;
  //   }
  //   setData((prevState) => ({
  //     ...prevState,
  //     [target.name]: target.value,
  //   }));
  // };

  const ValidarData = (e) => {
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
  const Personal = async () => {
    const result = await ApiMasy.get(`api/Mantenimiento/Personal/Listar`);
    setPersonal(
      result.data.data.data.map((res) => ({
        id: res.id,
        personal:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
  };
  const Monedas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Articulo/FormularioTablas`
    );
    setMonedas(result.data.data.monedas);
  };
  const Imprimir = async () => {
    console.log("Imprimir");
  };
  return (
    <>
      <ModalBasic titulo="Reporte Ingresos/Egresos" setModal={setModal}>
        <div
          className={Global.ContenedorBasico + Global.FondoContenedor + " mb-2"}
        >
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
              {monedas.map((moneda) => (
                <option key={moneda.id} value={moneda.id}>
                  {moneda.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="tipoId" className={Global.LabelStyle}>
              Tipo
            </label>
            <select
              id="tipoId"
              name="tipoId"
              autoFocus
              value={data.tipoId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            >
              {tipos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.descripcion}
                </option>
              ))}
            </select>
          </div>

          {data.tipoId === "1" && (
            <div className={Global.InputFull}>
              <label htmlFor="conceptoIngresoId" className={Global.LabelStyle}>
                Concepto
              </label>
              <select
                id="conceptoIngresoId"
                name="conceptoIngresoId"
                autoFocus
                value={data.conceptoIngresoId ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              >
                {conceptoIngresos.map((concepto) => (
                  <option key={concepto.id} value={concepto.id}>
                    {concepto.descripcion}
                  </option>
                ))}
              </select>
            </div>
          )}

          {data.tipoId === "2" && (
            <div className={Global.InputFull}>
              <label htmlFor="conceptoEgresoId" className={Global.LabelStyle}>
                Concepto
              </label>
              <select
                id="conceptoEgresoId"
                name="conceptoEgresoId"
                autoFocus
                value={data.conceptoEgresoId ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              >
                {conceptoEgresos.map((concepto) => (
                  <option key={concepto.id} value={concepto.id}>
                    {concepto.descripcion}
                  </option>
                ))}
              </select>
            </div>
          )}

          {data.tipoId === "3" && (
            <div className={Global.InputFull}>
              <label htmlFor="conceptoId" className={Global.LabelStyle}>
                Concepto
              </label>
              <select
                id="conceptoId"
                name="conceptoId"
                autoFocus
                value={""}
                onChange={ValidarData}
                disabled={true}
                className={Global.InputStyle}
              >
                <option value="">TODOS</option>
              </select>
            </div>
          )}

          {data.conceptoIngresoId === "2" ? (
            <div className={Global.InputFull}>
              <label htmlFor="personalId" className={Global.LabelStyle}>
                Personal
              </label>
              <select
                id="personalId"
                disabled={data.tipoId == 3 ? true : false}
                name="personalId"
                autoFocus
                value={data.personalId ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              >
                <option key={-1} value={""}>
                  {"--TODOS--"}
                </option>
                {personal.map((personal) => (
                  <option key={personal.id} value={personal.id}>
                    {personal.personal}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div className={Global.InputFull}>
                <label htmlFor="nombre" className={Global.LabelStyle}>
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  autoFocus
                  value={data.nombre ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </>
          )}
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
          <div className={Global.Input33pct}>
            <div className={Global.Input + " w-25"}>
              <div className={Global.CheckStyle + Global.Anidado}>
                <Checkbox
                  inputId="visualizar"
                  name="visualizar"
                  onChange={(e) => {
                    ValidarData(e);
                  }}
                  checked={data.visualizar ? true : ""}
                />
              </div>
              <label htmlFor="visualizar" className={Global.InputBoton}>
                Visualizar
              </label>
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

export default ReporteIngresosEgresos;