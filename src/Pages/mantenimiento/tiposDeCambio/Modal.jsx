import { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import { FaSearch } from "react-icons/fa";
import moment from "moment";
import Swal from "sweetalert2";
import "alertifyjs/build/css/alertify.css";
import alertify from "alertifyjs";
import Api from "../../../api/Api";

const Modal = ({ setModal, modo, setRespuestaModal, objeto }) => {
  //#region useState
  const [data, setData] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    console.log("Objeto modal");
    objeto && console.log(objeto);
    setData(objeto);
    console.log("Cierra objeto modal");
  }, [objeto]);

  useEffect(() => {
    console.log("Data modal");
    data && console.log(data);
    console.log("Cierra data modal");
  }, [data]);

  useEffect(() => {
    modo == "Consultar" ? ModoConsultar() : ModoModificar();
  }, []);
  //#endregion

  //#region Funcion Abrir y Cerrar
  const handleOKClick = () => {
    setRespuestaModal(true);
    setModal(false);
  };
  const handleCancelClick = () => {
    setRespuestaModal(false);
    setModal(false);
  };
  //#endregion

  //#region Funcion control de values
  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };
  const ModoConsultar = () => {
    console.log("consultar");
    document.getElementById("id").readOnly = true;
    document.getElementById("precioCompra").readOnly = true;
    document.getElementById("precioVenta").readOnly = true;
    document.getElementById("tipo-cambio-consultar").disabled = true;
  };
  const ModoModificar = () => {
    console.log("modificar");
    document.getElementById("id").readOnly = false;
    document.getElementById("precioCompra").readOnly = false;
    document.getElementById("precioVenta").readOnly = false;
    document.getElementById("tipo-cambio-consultar").disabled = false;
  };
  const ConsultarTipoCambio = (e) => {
    e.preventDefault();
    console.log("consultando tipo cambio");
  };
  //#endregion

  //#region Envío y Validación
  const handleSubmit = async () => {
    const result = await Api.post(`api/Mantenimiento/TipoCambio`, data);
    console.log(result);
    if (result.status === 201) {
      alertify.success(result.data.messages[0].textos);
      console.log(result.data.mensajes[0].texto);
      setRespuestaModal(true);
    } else {
      setRespuestaModal(false);
    }
    setModal(false);
  };
  const handleUpdate = async () => {
    const result = await ApiMasy.put(`api/Mantenimiento/TipoCambio`, data);
    if (result.status === 201) {
      setRespuestaModal(true);
    } else {
      setRespuestaModal(false);
    }
    setModal(false);
  };
  //#endregion

  //#region Render
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative h-full w-full md:h-auto md:w-auto my-0 md:my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full h-full bg-secondary-100 outline-none focus:outline-none">
            {/*header*/}
            <div className="flex text-center p-5 border-b border-solid border-secondary-900 rounded-t">
              <h3 className="text-3xl font-semibold text-white">{modo}</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 hover:text-red-500 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={handleCancelClick}
              >
                X
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              <section className="max-w-4xl p-6 mx-auto rounded-md shadow-md">
                <form>
                  <div className="grid grid-cols-1 gap-2 md:gap-4 mt-1">
                    <div className="flex">
                      <label
                        htmlFor="id"
                        className="inline-flex items-center px-3 text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 font-bold"
                      >
                        Tipo
                      </label>
                      <input
                        type="date"
                        id="id"
                        name="id"
                        value={moment(data.id).format("yyyy-MM-DD")}
                        onChange={handleChange}
                        className="rounded-none bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                      <button
                        id="tipo-cambio-consultar"
                        className="px-3 rounded-none rounded-r-lg bg-yellow-500 text-white hover:bg-yellow-600"
                        onClick={(e) => ConsultarTipoCambio(e)}
                      >
                        <FaSearch></FaSearch>
                      </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-y-2 md:gap-x-2">
                      <div className="flex">
                        <label
                          htmlFor="precioCompra"
                          className="inline-flex items-center px-3 text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 font-bold"
                        >
                          P. Compra
                        </label>
                        <input
                          type="number"
                          id="precioCompra"
                          name="precioCompra"
                          defaultValue={data.precioCompra}
                          onChange={handleChange}
                          className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div>
                      <div className="flex">
                        <label
                          htmlFor="tipo-cambio-precio-venta"
                          className="inline-flex items-center px-3 text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 font-bold"
                        >
                          P.Venta
                        </label>
                        <input
                          type="number"
                          id="precioVenta"
                          name="precioVenta"
                          defaultValue={data.precioVenta}
                          onChange={handleChange}
                          className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </section>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              {modo == "Consultar" ? (
                ""
              ) : (
                <button
                  className="bg-gray-700 hover:bg-primary hover:text-black text-gray-100 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 uppercase"
                  type="button"
                  onClick={
                    modo == "Registrar"
                      ? (e) => handleSubmit(e)
                      : (e) => handleUpdate(e)
                  }
                >
                  {modo == "Registrar" ? "Registrar" : "Guardar Cambios"}
                </button>
              )}
              <button
                className="background-transparent hover:bg-red-500 text-red-500 hover:text-white border-solid border-2 border-red-500 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={handleCancelClick}
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
  //#endregion
};

export default Modal;
