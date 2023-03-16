import React, { useState, useEffect } from "react";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../Components/Global";
import ApiMasy from "../../../api/ApiMasy";
import { Checkbox } from "primereact/checkbox";

const Modal = ({ setModal, modo, setRespuestaModal, objeto }) => {
  //#region useState
  const [data, setData] = useState([]);
  const [dataDepartamento, setDataDepartamento] = useState([]);
  const [dataProvincia, setDataProvincia] = useState([]);
  const [dataDistrito, setDataDistrito] = useState([]);
  const [checked, setChecked] = useState(true);
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
    ConsultarDistrito();
    // Consultar();
  }, [dataProvincia]);

  useEffect(() => {
    dataDistrito;
    document.getElementById("distritoId").value = data.distritoId;
  }, [dataDistrito]);

  useEffect(() => {
    data;
  }, [data]);

  useEffect(() => {
    ConsultarDepartamento();
  }, []);

  //#endregion

  //#region Funcion onChange y validación de campos
  function uppercase(e) {
    e.target.value = e.target.value.toUpperCase();
  }

  const handleChange = async ({ target }) => {
    if (target.name == "departamentoId") {
      await ConsultarProvincia();
      document.getElementById("provinciaId").selectedIndex = 0;
      document.getElementById("distritoId").selectedIndex = 0;
    }
    if (target.name == "provinciaId") {
      await ConsultarDistrito();
      document.getElementById("distritoId").selectedIndex = 0;
    }
    setData({ ...data, [target.name]: target.value });
  };
  //#endregion

  //#region Funciones API
  const ConsultarDepartamento = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ClienteDireccion/FormularioTablas`
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
      let prov = dataDepartamento.map((res) => res.provincias);
      let index = document.getElementById("departamentoId").selectedIndex;
      let provi = prov[index].map((res) => ({
        id: res.id,
        nombre: res.nombre,
        distritos: res.distritos,
      }));
      setDataProvincia(provi);
    }
  };

  const ConsultarDistrito = async () => {
    if (dataProvincia.length > 0) {
      let dist = dataProvincia.map((res) => res.distritos);
      let index = document.getElementById("provinciaId").selectedIndex;
      let distri = dist[index].map((res) => ({
        id: res.id,
        nombre: res.nombre,
      }));
      setDataDistrito(distri);
    }
  };

  //#endregion

  return (
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "Conductor"]}
    >
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="id" className={Global.LabelStyle}>
            Código
          </label>
          <input
            type="text"
            id="id"
            name="id"
            placeholder="id"
            defaultValue={data.id}
            autoComplete="off"
            onKeyUp={uppercase}
            onChange={handleChange}
            readOnly={true}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInputFull}>
          <div className=" flex gap-2 justify-center mt-3">
            <Checkbox
              id="isActivo"
              name="isActivo"
              readOnly={modo == "Consultar" ? true : false}
              defaultValue={data.isActivo}
              onChange={(e) => setChecked(e.checked)}
              checked={checked}
            ></Checkbox>
            <label />
            Activo <label />
          </div>
        </div>
      </div>
      <div className={Global.ContenedorInputFull}>
        <label htmlFor="empresaTransporteId" className={Global.LabelStyle}>
          Emp. Transporte
        </label>
        <input
          type="text"
          id="empresaTransporteId"
          name="empresaTransporteId"
          placeholder="Empresa Transporte"
          defaultValue={data.empresaTransporteId}
          autoComplete="off"
          onKeyUp={uppercase}
          onChange={handleChange}
          readOnly={modo == "Consultar" ? true : false}
          className={Global.InputStyle}
        />
      </div>
      <div className={Global.ContenedorInputFull}>
        <label htmlFor="nombre" className={Global.LabelStyle}>
          Nombre
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          placeholder="Nombre Conductor"
          defaultValue={data.nombre}
          autoComplete="off"
          onKeyUp={uppercase}
          onChange={handleChange}
          readOnly={modo == "Consultar" ? true : false}
          className={Global.InputStyle}
        />
      </div>
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInputFull}>
          <label
            htmlFor="numeroDocumentoIdentidad"
            className={Global.LabelStyle}
          >
            D.N.I. N°
          </label>
          <input
            type="text"
            id="numeroDocumentoIdentidad"
            name="numeroDocumentoIdentidad"
            placeholder="D.N.I. N°"
            defaultValue={data.numeroDocumentoIdentidad}
            autoComplete="off"
            onKeyUp={uppercase}
            onChange={handleChange}
            readOnly={modo == "Consultar" ? true : false}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="licenciaConducir" className={Global.LabelStyle}>
            Licencia de Conducir
          </label>
          <input
            type="text"
            id="licenciaConducir"
            name="licenciaConducir"
            placeholder="Licencia de Conducir"
            onKeyUp={uppercase}
            defaultValue={data.licenciaConducir}
            readOnly={modo == "Consultar" ? true : false}
            onChange={handleChange}
            className={Global.InputStyle}
          />
        </div>
      </div>
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="telefono" className={Global.LabelStyle}>
            Telefono
          </label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            placeholder="Telefono"
            defaultValue={data.telefono}
            autoComplete="off"
            onKeyUp={uppercase}
            onChange={handleChange}
            readOnly={modo == "Consultar" ? true : false}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="celular" className={Global.LabelStyle}>
            Celular
          </label>
          <input
            type="text"
            id="celular"
            name="celular"
            placeholder="Celular"
            onKeyUp={uppercase}
            defaultValue={data.celular}
            readOnly={modo == "Consultar" ? true : false}
            onChange={handleChange}
            className={Global.InputStyle}
          />
        </div>
      </div>

      <div className={Global.ContenedorInputFull}>
        <label htmlFor="correoElectronico" className={Global.LabelStyle}>
          Email
        </label>
        <input
          type="email"
          id="correoElectronico"
          name="correoElectronico"
          placeholder="Email"
          defaultValue={data.correoElectronico}
          autoComplete="off"
          onKeyUp={uppercase}
          onChange={handleChange}
          readOnly={modo == "Consultar" ? true : false}
          className={Global.InputStyle}
        />
      </div>
      <div className={Global.ContenedorInputFull}>
        <label htmlFor="direccion" className={Global.LabelStyle}>
          Dirección
        </label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          placeholder="Direccion"
          onKeyUp={uppercase}
          defaultValue={data.direccion}
          readOnly={modo == "Consultar" ? true : false}
          onChange={handleChange}
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

      <div className={Global.ContenedorInputFull}>
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

      <div className={Global.ContenedorInputFull}>
        <label htmlFor="distritoId" className={Global.LabelStyle}>
          Distrito
        </label>
        <select
          id="distritoId"
          name="distritoId"
          onChange={handleChange}
          disabled={modo == "Registrar" ? false : true}
          className={Global.SelectStyle}
        >
          {dataDistrito.map((distrito) => (
            <option key={distrito.id} value={distrito.id}>
              {distrito.nombre}
            </option>
          ))}
        </select>
        {/* <select>
          <option value="1">Lima</option>
        </select> */}
      </div>

      <div className={Global.ContenedorInputFull}>
        <label htmlFor="observacion" className={Global.LabelStyle}>
          Observación
        </label>
        <input
          type="text"
          id="observacion"
          name="observacion"
          placeholder="Observación"
          defaultValue={data.observacion}
          autoComplete="off"
          onKeyUp={uppercase}
          onChange={handleChange}
          readOnly={modo == "Consultar" ? true : false}
          className={Global.InputStyle}
        />
      </div>
    </ModalBasic>
  );
};

export default Modal;
