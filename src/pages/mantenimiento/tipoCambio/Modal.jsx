import moment from "moment";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import * as G from "../../../components/Global";
import Get from "../../../components/funciones/Get";
import ModalCrud from "../../../components/modal/ModalCrud";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  //#endregion

  //#region Funciones
  const HandleData = async ({ target }) => {
    if (target.name == "id") {
      setData((prev) => ({
        ...prev,
        [target.name]: target.value,
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [target.name]: Number(target.value),
      }));
    }
  };
  //#endregion

  //#region Funciones API
  const ConsultarTipoCambio = async (filtro = "") => {
    const result = await Get(
      `Servicio/ConsultarTipoCambio${filtro}`,
      `Tipo de Cambio extraído exitosamente`
    );
    if (result == undefined) {
      document.getElementById("id").focus();
    } else {
      setData({
        ...data,
        precioCompra: result.precioCompra,
        precioVenta: result.precioVenta,
      });
      document.getElementById("botonRegistrarModalCrud").focus();
    }
  };
  //#endregion

  //#region Render
  return (
    <ModalCrud
      setModal={setModal}
      objeto={data}
      modo={modo}
      menu={"Mantenimiento/TipoCambio"}
      titulo="Tipo de Cambio"
      foco={document.getElementById("tablaTipoCambio")}
      tamañoModal={[G.ModalPequeño, G.Form]}
    >
      <div className={G.ContenedorBasico}>
        <div className="flex">
          <label htmlFor="id" className={G.LabelStyle}>
            Fecha
          </label>
          <input
            type="date"
            id="id"
            name="id"
            autoFocus
            disabled={modo == "Consultar"}
            value={moment(data.id).format("yyyy-MM-DD")}
            onChange={HandleData}
            className={G.InputBoton}
          />
          <button
            id="consultarTipoCambio"
            className={G.BotonBuscar + G.Anidado + G.BotonPrimary}
            hidden={modo == "Consultar"}
            onClick={() => ConsultarTipoCambio(`?fecha=${data.id}`)}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                ConsultarTipoCambio(`?fecha=${data.id}`);
              }
            }}
          >
            <FaSearch></FaSearch>
          </button>
        </div>
        <div className={G.ContenedorInputs}>
          <div className={G.InputFull}>
            <label htmlFor="precioCompra" className={G.LabelStyle}>
              Precio Compra
            </label>
            <input
              type="number"
              id="precioCompra"
              name="precioCompra"
              autoComplete="off"
              min={0}
              disabled={modo == "Consultar"}
              value={data.precioCompra}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
          <div className={G.InputFull}>
            <label htmlFor="precioVenta" className={G.LabelStyle}>
              Precio Venta
            </label>
            <input
              type="number"
              id="precioVenta"
              name="precioVenta"
              autoComplete="off"
              min={0}
              disabled={modo == "Consultar"}
              value={data.precioVenta}
              onChange={HandleData}
              className={G.InputStyle}
            />
          </div>
        </div>
      </div>
    </ModalCrud>
  );
  //#endregion
};

export default Modal;
