import React, { useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import { toast } from "react-toastify";
import moment from "moment";
import { FaSearch } from "react-icons/fa";
import * as Global from "../../../components/Global";

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  //#endregion

  //#region useEffect
  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));
  };
  //#endregion

  //#region Funciones API
  const ConsultarTipoCambio = async (filtro = "") => {
    const resultado = await ApiMasy.get(`api/Servicio/ConsultarTipoCambio${filtro}`);
    if (modo == "Modificar") {
      setData({
        ...data,
        precioCompra: resultado.data.data.precioCompra,
        precioVenta: resultado.data.data.precioVenta,
      });
    } else {
      setData({
        id: resultado.data.data.fecha,
        precioCompra: resultado.data.data.precioCompra,
        precioVenta: resultado.data.data.precioVenta,
      });
    }

    if (resultado.status == 200) {
      toast.success("Tipo de Cambio extraído exitosamente", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      toast.error(String(resultado.response.data.messages[0].textos), {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };
  //#endregion

  //#region Render
  return (
    <ModalCrud
      setModal={setModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "TipoCambio"]}
      titulo="Tipo de Cambio"
      tamañoModal={[Global.ModalPequeño, Global.Form]}
    >
      <div className={Global.ContenedorBasico}>
        <div className="flex">
          <label htmlFor="id" className={Global.LabelStyle}>
            Tipo
          </label>
          <input
            type="date"
            id="id"
            name="id"
            readOnly={modo == "Consultar" ? true : false}
            value={moment(data.id).format("yyyy-MM-DD")}
            onChange={ValidarData}
            className={Global.InputBoton}
          />
          <button
            id="consultarTipoCambio"
            className={
              Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
            }
            hidden={modo == "Consultar" ? true : false}
            onClick={() => ConsultarTipoCambio(`?fecha=${data.id}`)}
          >
            <FaSearch></FaSearch>
          </button>
        </div>
        <div className={Global.ContenedorInputs}>
          <div className={Global.InputFull}>
            <label htmlFor="precioCompra" className={Global.LabelStyle}>
              P. Compra
            </label>
            <input
              type="number"
              id="precioCompra"
              name="precioCompra"
              autoComplete="off"
              readOnly={modo == "Consultar" ? true : false}
              value={data.precioCompra}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.InputFull}>
            <label htmlFor="precioVenta" className={Global.LabelStyle}>
              P. Venta
            </label>
            <input
              type="number"
              id="precioVenta"
              name="precioVenta"
              autoComplete="off"
              readOnly={modo == "Consultar" ? true : false}
              value={data.precioVenta}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </div>
      </div>
    </ModalCrud>
  );
  //#endregion
};

export default Modal;
