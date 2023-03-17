import React, { useState, useEffect } from "react";
import * as Global from "../../../Components/Global";
import ApiMasy from "../../../api/ApiMasy";
import moment from "moment";
import { toast } from "react-toastify";
import ModalBasic from "../../../components/ModalBasic";
import { FaSearch } from "react-icons/fa";

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    objeto;
    setData(objeto);
  }, [objeto]);
  useEffect(() => {
    data;
  }, [data]);
  //#endregion

  //#region Funciones
  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
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
    let model = {
      id: res.data.data.fecha,
      precioCompra: res.data.data.precioCompra,
      precioVenta: res.data.data.precioVenta,
    };
    setData(model);
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
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "TipoCambio"]}
    >
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
          onChange={handleChange}
          className={Global.InputBoton}
        />
        <button
          id="consultarTipoCambio"
          className={Global.BotonBuscar}
          onClick={(e) => ValidarConsulta(e)}
          hidden={modo == "Consultar" ? true : false}
        >
          <FaSearch></FaSearch>
        </button>
      </div>
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="precioCompra" className={Global.LabelStyle}>
            P. Compra
          </label>
          <input
            type="number"
            id="precioCompra"
            name="precioCompra"
            autoComplete="off"
            readOnly={modo == "Registrar" ? false : true}
            defaultValue={data.precioCompra}
            onChange={handleChange}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="precioVenta" className={Global.LabelStyle}>
            P.Venta
          </label>
          <input
            type="number"
            id="precioVenta"
            name="precioVenta"
            autoComplete="off"
            readOnly={modo == "Registrar" ? false : true}
            defaultValue={data.precioVenta}
            onChange={handleChange}
            className={Global.InputStyle}
          />
        </div>
      </div>
    </ModalBasic>
  );
  //#endregion
};

export default Modal;
