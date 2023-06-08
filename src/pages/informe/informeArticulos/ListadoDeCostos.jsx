import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalBasic from "../../../components/modal/ModalBasic";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import * as G from "../../../components/Global";
import BotonBasico from "../../../components/boton/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const ListadoDeCostos = ({ setModal }) => {
  const [data, setData] = useState({
    tipoExistenciaId: "",
    marcaId: "",
    checkFiltro: "todos",
  });
  const [tipoDeExistencia, setTipoDeExistencia] = useState([]);
  const [marcas, setMarcas] = useState([]);

  useEffect(() => {
    GetTablas();
    Marcas();
  }, []);

  const HandleData = async ({ target }) => {
    if (
      target.value === "agruparMarca" ||
      target.value === "agruparLinea" ||
      target.value === "todos"
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
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Articulo/FormularioTablas`
    );
    setTipoDeExistencia(result.data.data.tiposExistencia);
  };
  const Marcas = async () => {
    const result = await ApiMasy.get(`api/Mantenimiento/Marca/Listar`);
    setMarcas(result.data.data.data);
  };
  const Imprimir = async () => {
    console.log("Imprimir");
  };
  return (
    <>
      <ModalBasic titulo="Listado De Costos" setModal={setModal}>
        <div className={G.ContenedorBasico + G.FondoContenedor + " mb-2"}>
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
              className={G.InputStyle}
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
          </div>
          <div className={G.InputFull}>
            <label htmlFor="marcaId" className={G.LabelStyle}>
              Marca
            </label>
            <select
              id="marcaId"
              name="marcaId"
              autoFocus
              value={data.marcaId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              <option key={-1} value={""}>
                {"--TODOS--"}
              </option>
              {marcas.map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <div className={G.Input + "w-42"}>
                <div className={G.CheckStyle}>
                  <RadioButton
                    inputId="todos"
                    name="agrupar"
                    value="todos"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "todos"}
                  />
                </div>
                <label
                  htmlFor="todos"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Todos
                </label>
              </div>
              <div className={G.Input + "w-42"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="agruparMarca"
                    name="agrupar"
                    value="agruparMarca"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "agruparMarca"}
                  />
                </div>
                <label
                  htmlFor="agruparMarca"
                  className={G.LabelCheckStyle + "rounded-r-none"}
                >
                  Agrupar por Marca
                </label>
              </div>
              <div className={G.Input + "w-42"}>
                <div className={G.CheckStyle + G.Anidado}>
                  <RadioButton
                    inputId="agruparLinea"
                    name="agrupar"
                    value="agruparLinea"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={data.checkFiltro === "agruparLinea"}
                  />
                </div>
                <label
                  htmlFor="agruparLinea"
                  className={G.LabelCheckStyle + " !py-1 "}
                >
                  Agrupar por Linea y Sublinea
                </label>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <BotonBasico
              botonText="ACEPTAR"
              botonClass={G.BotonVerde}
              botonIcon={faPlus}
              click={() => Imprimir()}
              contenedor=""
            />
          </div>
        </div>
      </ModalBasic>
    </>
  );
};

export default ListadoDeCostos;
