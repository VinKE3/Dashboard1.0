import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../components/Global";

const Modal = ({ setModal, setRespuestaModal, objeto, modo }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataDepartamento, setDataDepartamento] = useState([]);
  const [dataProvincia, setDataProvincia] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (Object.entries(dataDepartamento).length > 0) {
      document.getElementById("departamentoId").value = data.departamentoId;
      ConsultarProvincia();
    }
  }, [dataDepartamento]);
  useEffect(() => {
    if (Object.entries(dataProvincia).length > 0) {
      document.getElementById("provinciaId").value = data.provinciaId;
    }
  }, [dataProvincia]);
  useEffect(() => {
    ConsultarDepartamento();
  }, []);
  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    if (target.name == "departamentoId") {
      await ConsultarProvincia();
      document.getElementById("provinciaId").selectedIndex = 0;
    }
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  //#endregion

  //#region Funciones API
  const ConsultarDepartamento = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Distrito/FormularioTablas`
    );
    let depa = result.data.data.departamentos.map((res) => ({
      id: res.id,
      nombre: res.nombre,
      provincias: res.provincias,
    }));
    setDataDepartamento(depa);
  };
  const ConsultarProvincia = async () => {
    if (dataDepartamento.length > 0) {
      let index = document.getElementById("departamentoId").selectedIndex;
      let prov = dataDepartamento[index].provincias.map((res) => ({
        id: res.id,
        nombre: res.nombre,
      }));
      setDataProvincia(prov);
    }
  };
  //#endregion

  //#region Render
  return (
    <>
      {dataDepartamento.length > 0 && (
        <ModalBasic
          setModal={setModal}
          setRespuestaModal={setRespuestaModal}
          objeto={data}
          modo={modo}
          menu={["Mantenimiento", "Distrito"]}
          titulo="Distrito"
          tamañoModal={[Global.ModalPequeño, Global.FormSimple]}
        >
          <div className={Global.ContenedorVarios}>
            <div className={Global.ContenedorInput48}>
              <label htmlFor="distritoId" className={Global.LabelStyle}>
                Código
              </label>
              <input
                type="text"
                id="distritoId"
                name="distritoId"
                autoComplete="off"
                maxLength="2"
                placeholder="00"
                readOnly={modo == "Registrar" ? false : true}
                value={data.distritoId ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.ContenedorInputFull}>
              <label htmlFor="departamentoId" className={Global.LabelStyle}>
                Departamento
              </label>
              <select
                id="departamentoId"
                name="departamentoId"
                onChange={ValidarData}
                disabled={modo == "Registrar" ? false : true}
                className={Global.SelectStyle}
              >
                {dataDepartamento.map((departamento) => (
                  <option key={departamento.id} value={departamento.id}>
                    {departamento.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex">
            <label htmlFor="provinciaId" className={Global.LabelStyle}>
              Provincia
            </label>
            <select
              id="provinciaId"
              name="provinciaId"
              onChange={ValidarData}
              disabled={modo == "Registrar" ? false : true}
              className={Global.SelectStyle}
            >
              {dataProvincia.map((provincia) => (
                <option key={provincia.id} value={provincia.id}>
                  {provincia.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="flex">
            <label htmlFor="nombre" className={Global.LabelStyle}>
              Distrito
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              autoComplete="off"
              placeholder="Distrito"
              readOnly={modo == "Consultar" ? true : false}
              value={data.nombre ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </ModalBasic>
      )}
    </>
  );
  //#endregion
};

export default Modal;
