import React, { useState } from "react";
import ModalBasic from "../../../components/ModalBasic";
import { FaSearch, FaUndoAlt, FaPen } from "react-icons/fa";
import * as Global from "../../../components/Global";

const ModalInventario = ({ setModal, modo, objeto, setObjeto }) => {
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
  };
  const PasarDatos = async () => {
    setObjeto((prev) => ({ ...prev, inventario: data.inventario }));
    setModal(false);
  };
  //#endregion

  //#region  Render
  return (
    <ModalBasic
      setModal={setModal}
      objeto={data}
      modo={"Registrar"}
      menu={["", ""]}
      titulo={data.descripcion}
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
              disabled={modo == "Consultar" ? true : false}
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
              hidden={modo == "Consultar" ? true : false}
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
