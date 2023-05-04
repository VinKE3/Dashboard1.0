import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import { Checkbox } from "primereact/checkbox";
import * as Global from "../../../components/Global";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
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
          setRespuestaModal={setRespuestaModal}
          objeto={data}
          modo={modo}
          menu={["Mantenimiento", "Usuario"]}
          titulo="Usuario"
        >
          <div className={Global.ContenedorBasico}>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="id" className={Global.LabelStyle}>
                  Código
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  autoComplete="off"
                  placeholder="Código"
                  value={data.id ?? ""}
                  onChange={ValidarData}
                  readOnly={true}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputMitad}>
                <div className={Global.LabelStyle}>
                  <Checkbox
                    inputId="isActivo"
                    name="isActivo"
                    readOnly={modo == "Consultar" ? true : false}
                    checked={data.isActivo ? true : ""}
                    onChange={(e) => ValidarData(e)}
                    ></Checkbox>
                </div>
                <label htmlFor="isActivo" className={Global.InputStyle}>
                  Activo{" "}
                </label>
              </div>
              <div className={Global.InputMitad}>
                <div className={Global.LabelStyle}>
                  <Checkbox
                    inputId="habilitarAfectarStock"
                    name="habilitarAfectarStock"
                    readOnly={modo == "Consultar" ? true : false}
                    checked={data.habilitarAfectarStock ? true : ""}
                    onChange={(e) => ValidarData(e)}
                  ></Checkbox>
                </div>
                <label
                  htmlFor="habilitarAfectarStock"
                  className={Global.InputStyle}
                >
                  Afectar Stock
                </label>
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
                  autoComplete="off"
                  placeholder="Nick de Usuario"
                  value={data.nick ?? ""}
                  onChange={ValidarData}
                  readOnly={modo == "Registrar" ? false : true}
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
                  {dataModal.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.personal}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {modo == "Registrar" && (
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label htmlFor="clave" className={Global.LabelStyle}>
                    Clave
                  </label>
                  <input
                    type="password"
                    id="clave"
                    name="clave"
                    autoComplete="off"
                    placeholder="Clave"
                    value={data.clave ?? ""}
                    onChange={ValidarData}
                    readOnly={modo == "Consultar" ? true : false}
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
                    autoComplete="off"
                    placeholder="Repetir Clave"
                    value={data.claveConfirmacion ?? ""}
                    onChange={ValidarData}
                    readOnly={modo == "Consultar" ? true : false}
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
                autoComplete="off"
                placeholder="Observación"
                value={data.observacion ?? ""}
                onChange={ValidarData}
                readOnly={modo == "Consultar" ? true : false}
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
