import React, { useState, useEffect } from "react";
import ApiMasy from "../../api/ApiMasy";
import * as Global from "../../../src/components/Global";
const Ubigeo = ({ modo, id, dato, setDataUbigeo }) => {
  //#region useState
  const [ubigeo, setUbigeo] = useState(dato);
  const [dataDep, setDataDep] = useState([]);
  const [dataProv, setDataProv] = useState([]);
  const [dataDist, setDataDist] = useState([]);
  let Id = id;
  //#endregion

  //#region useEffect
  useEffect(() => {
    dataDep && console.log(dataDep);
    document.getElementById(Id[0]).value = ubigeo.departamentoId;
    ConsultarProvincia();
  }, [dataDep]);
  useEffect(() => {
    dataProv;
    document.getElementById(Id[1]).value = ubigeo.provinciaId;
    ConsultarDistrito();
  }, [dataProv]);
  useEffect(() => {
    dataDist;
    document.getElementById(Id[2]).value = ubigeo.distritoId;
  }, [dataDist]);
  useEffect(() => {
    ubigeo;
    document.getElementById(Id[0]).value = ubigeo.departamentoId;
    ConsultarProvincia();
  }, [ubigeo]);
  useEffect(() => {
      Tablas();
  }, []);
  //#endregion

  //#region Funciones
  const Retornar = async ({ target }) => {
    if (target.name == Id[0]) {
      await ConsultarProvincia();
      document.getElementById(Id[1]).selectedIndex = 0;
      document
        .getElementById(Id[1])
        .dispatchEvent(new Event("change", { bubbles: true }));
    } else if (target.name == Id[1]) {
      await ConsultarDistrito();
      document.getElementById(Id[2]).selectedIndex = 0;
    }
    setDataUbigeo({
      departamentoId: document.getElementById(Id[0]).value,
      provinciaId: document.getElementById(Id[1]).value,
      distritoId: document.getElementById(Id[2]).value,
    });
  };
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Cliente/FormularioTablas`
    );
    setDataDep(result.data.data.departamentos);
  };
  const ConsultarProvincia = async () => {
    if (dataDep.length > 0) {
      let index = document.getElementById(Id[0]).selectedIndex;
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
      let index = document.getElementById(Id[1]).selectedIndex;
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
    <div className={Global.ContenedorVarios}>
      <div className={Global.ContenedorInputTercio}>
        <label htmlFor={Id[0]} className={Global.LabelStyle}>
          Dep.
        </label>
        <select
          id={Id[0]}
          name={Id[0]}
          onChange={Retornar}
          disabled={modo == "Consultar" ? true : false}
          className={Global.SelectStyle}
        >
          {dataDep.map((departamento) => (
            <option key={departamento.id} value={departamento.id}>
              {departamento.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className={Global.ContenedorInputTercio}>
        <label htmlFor={Id[1]} className={Global.LabelStyle}>
          Prov.
        </label>
        <select
          id={Id[1]}
          name={Id[1]}
          onChange={Retornar}
          disabled={modo == "Consultar" ? true : false}
          className={Global.SelectStyle}
        >
          {dataProv.map((provincia) => (
            <option key={provincia.id} value={provincia.id}>
              {provincia.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className={Global.ContenedorInputTercio}>
        <label htmlFor={Id[2]} className={Global.LabelStyle}>
          Dist.
        </label>
        <select
          id={Id[2]}
          name={Id[2]}
          onChange={Retornar}
          disabled={modo == "Consultar" ? true : false}
          className={Global.SelectStyle}
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
