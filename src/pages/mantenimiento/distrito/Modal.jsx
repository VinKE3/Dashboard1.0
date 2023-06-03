import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import * as G from "../../../components/Global";

const Modal = ({ setModal, objeto, modo }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataDepartamento, setDataDepartamento] = useState([]);
  const [dataProvincia, setDataProvincia] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (Object.entries(dataDepartamento).length > 0) {
      ConsultarProvincia();
    }
  }, [dataDepartamento]);
  useEffect(() => {
    ConsultarDepartamento();
  }, []);
  //#endregion

  //#region Funciones
  const HandleData = async ({ target }) => {
    if (target.name == "departamentoId") {
      setData((prevState) => ({
        ...prevState,
        departamentoId: target.value,
      }));
      await ConsultarProvincia();
      document.getElementById("provinciaId").selectedIndex = 0;
      document
        .getElementById("provinciaId")
        .dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  //#endregion

  //#region Funciones API
  const ConsultarDepartamento = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Distrito/FormularioTablas`
    );
    setDataDepartamento(
      result.data.data.departamentos.map((res) => ({
        id: res.id,
        nombre: res.nombre,
        provincias: res.provincias,
      }))
    );
  };
  const ConsultarProvincia = async () => {
    if (dataDepartamento.length > 0) {
      let index = document.getElementById("departamentoId").selectedIndex;
      setDataProvincia(
        dataDepartamento[index].provincias.map((res) => ({
          id: res.id,
          nombre: res.nombre,
        }))
      );
    }
  };
  //#endregion

  //#region Render
  return (
    <>
      {dataDepartamento.length > 0 && (
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={["Mantenimiento", "Distrito"]}
          titulo="Distrito"
          foco={document.getElementById("tablaDistrito")}
          tamañoModal={[G.ModalPequeño, G.Form]}
        >
          <div className={G.ContenedorBasico}>
            <div className={G.ContenedorInputs}>
              <div className={G.Input48}>
                <label htmlFor="distritoId" className={G.LabelStyle}>
                  Código
                </label>
                <input
                  type="text"
                  id="distritoId"
                  name="distritoId"
                  placeholder="Código"
                  autoComplete="off"
                  maxLength="2"
                  autoFocus
                  disabled={modo != "Nuevo"}
                  value={data.distritoId ?? ""}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputFull}>
                <label htmlFor="departamentoId" className={G.LabelStyle}>
                  Departamento
                </label>
                <select
                  id="departamentoId"
                  name="departamentoId"
                  value={data.departamentoId ?? ""}
                  onChange={HandleData}
                  disabled={modo != "Nuevo"}
                  className={G.InputStyle}
                >
                  {dataDepartamento.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex">
              <label htmlFor="provinciaId" className={G.LabelStyle}>
                Provincia
              </label>
              <select
                id="provinciaId"
                name="provinciaId"
                value={data.provinciaId ?? ""}
                onChange={HandleData}
                disabled={modo != "Nuevo"}
                className={G.InputStyle}
              >
                {dataProvincia.map((provincia) => (
                  <option key={provincia.id} value={provincia.id}>
                    {provincia.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex">
              <label htmlFor="nombre" className={G.LabelStyle}>
                Distrito
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Distrito"
                autoComplete="off"
                autoFocus={modo == "Modificar"}
                disabled={modo == "Consultar"}
                value={data.nombre ?? ""}
                onChange={HandleData}
                className={G.InputStyle}
              />
            </div>
          </div>
        </ModalCrud>
      )}
    </>
  );
  //#endregion
};

export default Modal;
