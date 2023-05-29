import React, { useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
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
    const result = await ApiMasy.get(
      `api/Servicio/ConsultarTipoCambio${filtro}`
    );
    if (modo == "Modificar") {
      setData({
        ...data,
        precioCompra: result.data.data.precioCompra,
        precioVenta: result.data.data.precioVenta,
      });
    } else {
      setData({
        ...data,
        precioCompra: result.data.data.precioCompra,
        precioVenta: result.data.data.precioVenta,
      });
    }
    if (result.name == "AxiosError") {
      let error = "";
      //Captura el mensaje de error
      if (Object.entries(result.response.data).length > 0) {
        error = String(result.response.data.messages[0].textos);
      } else {
        error = String(result.message);
      }
      //Captura el mensaje de error

      toast.error(error, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      document.getElementById("id").focus();
    } else {
      toast.info(
        "Tipo de Cambio extraído exitosamente. Día: " +
          moment(result.data.data.fecha).format("DD/MM/YYYY"),
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      document.getElementById("botonRegistrarModalCrud").focus();
      setEliminar(true);
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
      foco={document.getElementById("tablaTipoCambio")}
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
            autoFocus
            disabled={modo == "Consultar"}
            value={moment(data.id).format("yyyy-MM-DD")}
            onChange={ValidarData}
            className={Global.InputBoton}
          />
          <button
            id="consultarTipoCambio"
            className={
              Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
            }
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
              min={0}
              disabled={modo == "Consultar"}
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
              min={0}
              disabled={modo == "Consultar"}
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
