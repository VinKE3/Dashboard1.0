import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import { Checkbox } from "primereact/checkbox";
import * as G from "../../../components/Global";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataModal, setDataModal] = useState([]);
  //#endregion

  //#region useEffect.
  useEffect(() => {
    GetTablas();
  }, []);
  //#endregion

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Usuario/FormularioTablas`
    );
    setDataModal(
      result.data.data.personal.map((res) => ({
        id: res.id,
        personal:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
  };
  //#endregion

  //#region Funciones
  const HandleData = ({ target }) => {
    if (target.name == "isActivo" || target.name == "habilitarAfectarStock") {
      setData({ ...data, [target.name]: target.checked });
    } else {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  //#endregion

  //#region Render
  return (
    <>
      {Object.entries(dataModal).length > 0 && (
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          titulo="Usuario"
          menu={["Mantenimiento", "Usuario"]}
          foco={document.getElementById("tablaUsuario")}
        >
          <div className={G.ContenedorBasico}>
            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <div className={G.InputFull}>
                  <label htmlFor="id" className={G.LabelStyle}>
                    Código
                  </label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    placeholder="Código"
                    autoComplete="off"
                    value={data.id ?? ""}
                    onChange={HandleData}
                    disabled={true}
                    className={G.InputBoton}
                  />
                </div>
                <div className={G.InputFull}>
                  <div className={G.CheckStyle + G.Anidado}>
                    <Checkbox
                      inputId="isActivo"
                      name="isActivo"
                      disabled={modo == "Consultar"}
                      checked={data.isActivo ? true : ""}
                      onChange={(e) => HandleData(e)}
                    ></Checkbox>
                  </div>
                  <label
                    htmlFor="isActivo"
                    className={G.LabelCheckStyle + " !rounded-r-none"}
                  >
                    Activo{" "}
                  </label>
                </div>
                <div className={G.InputFull}>
                  <div className={G.CheckStyle + G.Anidado}>
                    <Checkbox
                      inputId="habilitarAfectarStock"
                      name="habilitarAfectarStock"
                      disabled={modo == "Consultar"}
                      checked={data.habilitarAfectarStock ? true : ""}
                      onChange={(e) => HandleData(e)}
                    ></Checkbox>
                  </div>
                  <label
                    htmlFor="habilitarAfectarStock"
                    className={G.LabelCheckStyle}
                  >
                    Afectar Stock
                  </label>
                </div>
              </div>
            </div>

            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label htmlFor="nick" className={G.LabelStyle}>
                  Nick
                </label>
                <input
                  type="text"
                  id="nick"
                  name="nick"
                  placeholder="Nick de Usuario"
                  autoComplete="off"
                  autoFocus
                  value={data.nick ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Nuevo" ? false : true}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputFull}>
                <label htmlFor="personalId" className={G.LabelStyle}>
                  Personal
                </label>
                <select
                  id="personalId"
                  name="personalId"
                  autoFocus={modo == "Modificar"}
                  value={data.personalId ?? ""}
                  onChange={HandleData}
                  disabled={modo == "Consultar"}
                  className={G.InputStyle}
                >
                  <option key={-1} value={""}>
                    --SELECCIONAR--
                  </option>
                  {dataModal.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.personal}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {modo == "Nuevo" && (
              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <label htmlFor="clave" className={G.LabelStyle}>
                    Clave
                  </label>
                  <input
                    type="password"
                    id="clave"
                    name="clave"
                    placeholder="Clave"
                    autoComplete="off"
                    value={data.clave ?? ""}
                    onChange={HandleData}
                    disabled={modo == "Consultar"}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputFull}>
                  <label
                    htmlFor="claveConfirmacion"
                    className={G.LabelStyle}
                  >
                    Repetir Clave
                  </label>
                  <input
                    type="password"
                    id="claveConfirmacion"
                    name="claveConfirmacion"
                    placeholder="Repetir Clave"
                    autoComplete="off"
                    value={data.claveConfirmacion ?? ""}
                    onChange={HandleData}
                    disabled={modo == "Consultar"}
                    className={G.InputStyle}
                  />
                </div>
              </div>
            )}

            <div className={G.InputFull}>
              <label htmlFor="observacion" className={G.LabelStyle}>
                Observación
              </label>
              <input
                type="observacion"
                id="observacion"
                name="observacion"
                placeholder="Observación"
                autoComplete="off"
                value={data.observacion ?? ""}
                onChange={HandleData}
                disabled={modo == "Consultar"}
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
