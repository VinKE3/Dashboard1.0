import React, { useState, useEffect } from "react";
import ApiMasy from "../../api/ApiMasy";
import * as G from "../Global";
const Ubigeo = ({ modo, id, dato, setDataUbigeo }) => {
  //#region useState
  const [ubigeo, setUbigeo] = useState(dato);
  const [dataDep, setDataDep] = useState([]);
  const [dataProv, setDataProv] = useState([]);
  const [dataDist, setDataDist] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    setUbigeo(dato);
  }, [dato]);
  useEffect(() => {
    document.getElementById(id[0]).value = ubigeo.departamentoId;
    ConsultarProvincia();
  }, [dataDep]);
  useEffect(() => {
    document.getElementById(id[1]).value = ubigeo.provinciaId;
    ConsultarDistrito();
  }, [dataProv]);
  useEffect(() => {
    document.getElementById(id[2]).value = ubigeo.distritoId;
  }, [dataDist]);
  useEffect(() => {
    document.getElementById(id[0]).value = ubigeo.departamentoId;
    ConsultarProvincia();
  }, [ubigeo]);
  useEffect(() => {
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones
  const HandleData = async ({ target }) => {
    if (target.name == id[0]) {
      await ConsultarProvincia();
      document.getElementById(id[1]).selectedIndex = 0;
      document
        .getElementById(id[1])
        .dispatchEvent(new Event("change", { bubbles: true }));
    } else if (target.name == id[1]) {
      await ConsultarDistrito();
      document.getElementById(id[2]).selectedIndex = 0;
      //Obtenemos el texto del opcion seleccionado
      let departamento = document.getElementById(id[0]);
      let provincia = document.getElementById(id[1]);
      let distrito = document.getElementById(id[2]);
      //Obtenemos el texto del opcion seleccionado
      setDataUbigeo({
        departamentoId: document.getElementById(id[0]).value,
        provinciaId: document.getElementById(id[1]).value,
        distritoId: document.getElementById(id[2]).value,
        //Obtenemos el texto del opcion seleccionado
        departamento: departamento.options[departamento.selectedIndex].text,
        provincia: provincia.options[provincia.selectedIndex].text,
        distrito: distrito.options[distrito.selectedIndex].text,
        //Obtenemos el texto del opcion seleccionado
      });
    } else {
      setDataUbigeo({
        departamentoId: document.getElementById(id[0]).value,
        provinciaId: document.getElementById(id[1]).value,
        distritoId: document.getElementById(id[2]).value,
        //Obtenemos el texto del opcion seleccionado
        departamento: departamento.options[departamento.selectedIndex].text,
        provincia: provincia.options[provincia.selectedIndex].text,
        distrito: distrito.options[distrito.selectedIndex].text,
        //Obtenemos el texto del opcion seleccionado
      });
    }
  };
  //#endregion

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Cliente/FormularioTablas`
    );
    setDataDep(result.data.data.departamentos);
  };
  const ConsultarProvincia = async () => {
    if (dataDep.length > 0) {
      let index = document.getElementById(id[0]).selectedIndex;
      if (index == -1) index = 0;
      let model = dataDep[index].provincias.map((res) => ({
        id: res.id,
        nombre: res.nombre,
        distritos: res.distritos,
      }));
      setDataProv(model);
    } else {
      setDataProv([]);
    }
  };
  const ConsultarDistrito = async () => {
    if (dataProv.length > 0) {
      let index = document.getElementById(id[1]).selectedIndex;
      if (index == -1) index = 0;
      let model = dataProv[index].distritos.map((res) => ({
        id: res.id,
        nombre: res.nombre,
      }));
      setDataDist(model);
    } else {
      setDataDist([]);
    }
  };
  //#endregion

  //#region Render
  return (
    <div className={G.ContenedorInputs + " !gap-y-2"}>
      <div className={G.InputTercio}>
        <label htmlFor={id[0]} className={G.LabelStyle}>
          Dep.
        </label>
        <select
          id={id[0]}
          name={id[0]}
          onChange={HandleData}
          disabled={modo == "Consultar"}
          className={G.InputStyle}
        >
          {dataDep.map((departamento) => (
            <option key={departamento.id} value={departamento.id}>
              {departamento.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className={G.InputTercio}>
        <label htmlFor={id[1]} className={G.LabelStyle}>
          Prov.
        </label>
        <select
          id={id[1]}
          name={id[1]}
          onChange={HandleData}
          disabled={modo == "Consultar"}
          className={G.InputStyle}
        >
          {dataProv.map((provincia) => (
            <option key={provincia.id} value={provincia.id}>
              {provincia.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className={G.InputTercio}>
        <label htmlFor={id[2]} className={G.LabelStyle}>
          Dist.
        </label>
        <select
          id={id[2]}
          name={id[2]}
          onChange={HandleData}
          disabled={modo == "Consultar"}
          className={G.InputStyle}
        >
          {Object.entries(dataDist).length > 0 &&
            dataDist.map((distrito) => (
              <option key={distrito.id} value={distrito.id}>
                {distrito.nombre}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
  //#endregion
};

export default Ubigeo;
