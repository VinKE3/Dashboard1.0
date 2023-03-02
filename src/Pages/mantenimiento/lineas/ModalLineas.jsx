import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ApiMasy from "../../../api/ApiMasy";
import Api from "../../../api/Api";

const ModalLineas = ({ setModal, modo, setRespuestaModal, objeto }) => {
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
    // document.getElementById("id").readOnly = true;
    document.getElementById("descripcion").readOnly = true;
  };
  const ModoModificar = () => {
    console.log("modificar");
    // document.getElementById("id").readOnly = false;
    document.getElementById("descripcion").readOnly = false;
  };
  //#endregion

  //#region Envío y Validación
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await ApiMasy.post(`api/Mantenimiento/Linea`, data);
    if (result.status === 201 || result.status === 200) {
      Swal.fire("Registro!", String(result.data.messages[0].textos), "success");
      console.log(result.status);
    } else if (result.data.messages[0].tipo == 1) {
      Swal.fire("Error!", String(result.data.messages[1].textos), "error");
      console.log(result.data.messages[0].tipo);
    } else if (result.status === 409) {
      Swal.fire("Error!", String(result.data.messages[1].textos), "error");
    } else {
      Swal.fire("Error!", String(result.data.messages[1].textos), "error");
    }
    setModal(false);
  };

  const handleUpdate = async () => {
    const result = await ApiMasy.put(`api/Mantenimiento/Linea`, data);
    if (result.status === 201) {
      setRespuestaModal(true);
    } else {
      setRespuestaModal(false);
    }
    setModal(false);
  };
  //#endregion

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
                  <div className="grid grid-cols-1 gap-6 mt-1 sm:grid-cols-2">
                    <div>
                      <label className="text-white" htmlFor="codigo">
                        Código
                      </label>
                      <input
                        placeholder="00"
                        id="codigo"
                        readOnly={true}
                        type="text"
                        className="block w-full px-4 py-2 mt-2 text-white bg-white border border-gray-200 rounded-md dark:bg-gray-500 dark:text-white dark:border-gray-600 focus:border-secondary-900 focus:ring-secondary-900 focus:ring-opacity-40 dark:focus:border-secondary-900 focus:outline-none focus:ring"
                      />
                    </div>
                    <div>
                      <label className="text-white" htmlFor="descripcion">
                        Descripción
                      </label>
                      <input
                        type="text"
                        id="descripcion"
                        placeholder="descripcion"
                        defaultValue={data.descripcion}
                        name="descripcion"
                        onChange={handleChange}
                        className="block w-full px-4 py-2 mt-2 text-white bg-white border border-gray-200 rounded-md dark:bg-gray-500 dark:text-white dark:border-gray-600 focus:border-secondary-900 focus:ring-secondary-900 focus:ring-opacity-40 dark:focus:border-secondary-900 focus:outline-none focus:ring"
                      />
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
};

export default ModalLineas;
