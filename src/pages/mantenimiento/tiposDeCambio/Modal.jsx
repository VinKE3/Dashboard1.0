import React, { useState } from "react";
import * as Global from "../../../components/Global";
import ApiMasy from "../../../api/ApiMasy";
import moment from "moment";
import { toast } from "react-toastify";
import ModalCrud from "../../../components/ModalCrud";
import { FaSearch } from "react-icons/fa";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
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
  const ValidarConsulta = (e) => {
    e.preventDefault();
    let fecha = document.getElementById("id").value;
    ConsultarTipoCambio("?fecha=" + fecha);
  };
  //#endregion

  //#region Funciones API
  const ConsultarTipoCambio = async (filtroApi = "") => {
    const res = await ApiMasy.get(
      `api/Servicio/ConsultarTipoCambio${filtroApi}`
    );
    setData({
      id: res.data.data.fecha,
      precioCompra: res.data.data.precioCompra,
      precioVenta: res.data.data.precioVenta,
    });
    if (res.status == 200) {
      toast.success("Tipo de Cambio extraído exitosamente", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      toast.error(String(result.response.data.messages[0].textos), {
        position: "bottom-right",
        autoClose: 5000,
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
      setRespuestaModal={setRespuestaModal}
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
            className={Global.BotonBuscar + Global.Anidado + Global.BotonPrimary}
            onClick={(e) => ValidarConsulta(e)}
            hidden={modo == "Consultar" ? true : false}
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
              P.Venta
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
