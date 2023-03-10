import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../Components/Global";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState([]);
  const [dataDepartamento, setDataDepartamento] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    objeto;
    setData(objeto);
  }, [objeto]);
  useEffect(() => {
    dataDepartamento;
    document.getElementById("departamentoId").value = data.departamentoId;
  }, [dataDepartamento]);
  useEffect(() => {
    data;
  }, [data]);
  useEffect(() => {
    ConsultarDepartamento();
  }, []);
  //#endregion

  //#region Funciones
  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };
  function uppercase(e) {
    e.target.value = e.target.value.toUpperCase();
  }
  //#endregion

  //#region Funciones API
  const ConsultarDepartamento = async () => {
    const result = await ApiMasy.get(`api/Mantenimiento/Departamento/Listar`);
    setDataDepartamento(result.data.data.data);
  };
  //#endregion

  //#region Render
  return (
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "Provincia"]}
    >
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInput48}>
          <label htmlFor="provinciaId" className={Global.LabelStyle}>
            Código
          </label>
          <input
            type="text"
            id="provinciaId"
            name="provinciaId"
            autoComplete="off"
            maxLength="2"
            placeholder="00"
            readOnly={modo == "Registrar" ? false : true}
            defaultValue={data.provinciaId}
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
        <label htmlFor="nombre" className={Global.LabelStyle}>
          Provincia
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          autoComplete="off"
          placeholder="Provincia"
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
