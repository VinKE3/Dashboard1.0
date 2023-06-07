import React, { useState } from "react";
import ModalBasic from "../../../components/modal/ModalBasic";
import * as G from "../../../components/Global";

const ModalInventario = ({ setModal, modo, objeto, setObjeto, foco }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  //#endregion

  //#region Funciones
  const HandleData = async ({ target }) => {
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
      titulo={data.descripcion}
      foco={foco}
      tamañoModal={[G.ModalPequeño + " !w-auto !max-w-3xl", G.Form]}
    >
      <div className={G.ContenedorBasico}>
        <div className={G.ContenedorInputs}>
          <div className={G.InputFull}>
            <label htmlFor="inventario" className={G.LabelStyle}>
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
              onChange={HandleData}
              onKeyDown={(e) => KeyDown(e)}
              className={G.InputStyle}
            />
            {/* <button
              id="guardarInventario"
              className={
                G.BotonBuscar + G.Anidado + G.BotonVerde
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
