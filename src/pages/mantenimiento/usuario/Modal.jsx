import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import { Checkbox } from "primereact/checkbox";
import * as Global from "../../../components/Global";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataModal, setDataModal] = useState([]);
  //#endregion

  //#region useEffect.
  useEffect(() => {
    Tablas();
  }, []);
  //#endregion

  //#region API
  const Tablas = async () => {
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
  const ValidarData = ({ target }) => {
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
          menu={["Mantenimiento", "Usuario"]}
          titulo="Usuario"
        >
          <div className={Global.ContenedorBasico}>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <div className={Global.InputFull}>
                  <label htmlFor="id" className={Global.LabelStyle}>
                    Código
                  </label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    placeholder="Código"
                    autoComplete="off"
                    value={data.id ?? ""}
                    onChange={ValidarData}
                    disabled={true}
                    className={Global.InputBoton }
                  />
                </div>
                <div className={Global.InputFull}>
                  <div className={Global.CheckStyle + Global.Anidado}>
                    <Checkbox
                      inputId="isActivo"
                      name="isActivo"
                      disabled={modo == "Consultar" ? true : false}
                      checked={data.isActivo ? true : ""}
                      onChange={(e) => ValidarData(e)}
                    ></Checkbox>
                  </div>
                  <label
                    htmlFor="isActivo"
                    className={Global.LabelCheckStyle + " !rounded-r-none"}
                  >
                    Activo{" "}
                  </label>
                </div>
                <div className={Global.InputFull}>
                  <div className={Global.CheckStyle + Global.Anidado}>
                    <Checkbox
                      inputId="habilitarAfectarStock"
                      name="habilitarAfectarStock"
                      disabled={modo == "Consultar" ? true : false}
                      checked={data.habilitarAfectarStock ? true : ""}
                      onChange={(e) => ValidarData(e)}
                    ></Checkbox>
                  </div>
                  <label
                    htmlFor="habilitarAfectarStock"
                    className={Global.LabelCheckStyle}
                  >
                    Afectar Stock
                  </label>
                </div>
              </div>
            </div>

            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="nick" className={Global.LabelStyle}>
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
                  onChange={ValidarData}
                  disabled={modo == "Nuevo" ? false : true}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="personalId" className={Global.LabelStyle}>
                  Personal
                </label>
                <select
                  id="personalId"
                  name="personalId"
                  value={data.personalId ?? ""}
                  onChange={ValidarData}
                  disabled={modo == "Consultar" ? true : false}
                  className={Global.InputStyle}
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
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label htmlFor="clave" className={Global.LabelStyle}>
                    Clave
                  </label>
                  <input
                    type="password"
                    id="clave"
                    name="clave"
                    placeholder="Clave"
                    autoComplete="off"
                    value={data.clave ?? ""}
                    onChange={ValidarData}
                    disabled={modo == "Consultar" ? true : false}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputFull}>
                  <label
                    htmlFor="claveConfirmacion"
                    className={Global.LabelStyle}
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
                    onChange={ValidarData}
                    disabled={modo == "Consultar" ? true : false}
                    className={Global.InputStyle}
                  />
                </div>
              </div>
            )}
            
            <div className={Global.InputFull}>
              <label htmlFor="observacion" className={Global.LabelStyle}>
                Observación
              </label>
              <input
                type="observacion"
                id="observacion"
                name="observacion"
                placeholder="Observación"
                autoComplete="off"
                value={data.observacion ?? ""}
                onChange={ValidarData}
                disabled={modo == "Consultar" ? true : false}
                className={Global.InputStyle}
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
