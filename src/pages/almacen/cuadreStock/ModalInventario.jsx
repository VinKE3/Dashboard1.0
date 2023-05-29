import React, { useState } from "react";
import ModalBasic from "../../../components/modal/ModalBasic";
import * as Global from "../../../components/Global";

const ModalInventario = ({ setModal, modo, objeto, setObjeto, foco }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));
  };
  const KeyDown = async (e) => {
    if (e.key === "Enter") {
      await PasarDatos();
    }
    if (e.key == "Escape") {
      setModal(false);
    }
  };
  const PasarDatos = async () => {
    setObjeto((prev) => ({ ...prev, inventario: data.inventario }));
    foco.focus();
    setModal(false);
  };
  //#endregion

  //#region  Render
  return (
    <ModalBasic
      setModal={setModal}
      objeto={data}
      modo={"Nuevo"}
      menu={["", ""]}
      titulo={data.descripcion}
      cerrar={false}
      tamañoModal={[Global.ModalPequeño + " !w-auto !max-w-3xl", Global.Form]}
    >
      <div className={Global.ContenedorBasico}>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="inventario" className={Global.LabelStyle}>
              Inventario
            </label>
            <input
              type="number"
              id="inventario"
              name="inventario"
              autoComplete="off"
              autoFocus
              placeholder="Inventario"
              disabled={modo == "Consultar"}
              value={data.inventario ?? ""}
              onChange={ValidarData}
              onKeyDown={(e) => KeyDown(e)}
              className={Global.InputStyle}
            />
            {/* <button
              id="guardarInventario"
              className={
                Global.BotonBuscar + Global.Anidado + Global.BotonAgregar
              }
              hidden={modo == "Consultar"}
              onClick={() => PasarDatos()}
            >
              <FaUndoAlt></FaUndoAlt>
            </button> */}
          </div>
        </div>
      </div>
    </ModalBasic>
  );
  //#endregion
};

export default ModalInventario;
