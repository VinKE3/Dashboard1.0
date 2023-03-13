import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../Components/Global";

const Modal = ({ setModal, setRespuestaModal, objeto, modo }) => {
  //#region useState
  const [data, setData] = useState([]);
  const [dataDepartamento, setDataDepartamento] = useState([]);
  const [dataProvincia, setDataProvincia] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    objeto;
    setData(objeto);
  }, [objeto]);
  useEffect(() => {
    dataDepartamento;
    document.getElementById("departamentoId").value = data.departamentoId;
    ConsultarProvincia();
  }, [dataDepartamento]);
  useEffect(() => {
    dataProvincia;
    document.getElementById("provinciaId").value = data.provinciaId;
  }, [dataProvincia]);
  useEffect(() => {
    data;
  }, [data]);
  useEffect(() => {
    ConsultarDepartamento();
  }, []);
  //#endregion

  //#region Funciones
  const handleChange = async ({ target }) => {
    if (target.name == "departamentoId") {
      ConsultarProvincia();
    }
    setData({ ...data, [target.name]: target.value });
  };
  function uppercase(e) {
    e.target.value = e.target.value.toUpperCase();
  }
  //#endregion

  //#region Funciones API
  const ConsultarDepartamento = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Distrito/FormularioTablas`
    );
    console.log(result.data.data.departamentos);
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
      console.log(prov);
      setDataProvincia(prov);
    }
  };
  //#endregion

  //#region Render
  return (
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "Distrito"]}
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
            defaultValue={data.distritoId}
            onChange={handleChange}
            onKeyUp={uppercase}
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
            onChange={handleChange}
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
          onChange={handleChange}
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
          defaultValue={data.nombre}
          onChange={handleChange}
          onKeyUp={uppercase}
          className={Global.InputStyle}
        />
      </div>
    </ModalBasic>
  );
  //#endregion
};

export default Modal;
