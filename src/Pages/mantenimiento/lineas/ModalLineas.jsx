import React from "react";
import { useState, useEffect } from "react";

const ModalLineas = (estado) => {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    setShowModal(estado);
  }, [estado]);

  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-full my-6 mx-auto max-w-5xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-secondary-100 outline-none focus:outline-none">
                {/*header*/}
                <div className="text-center p-5 border-b border-solid border-secondary-900 rounded-t">
                  <h3 className="text-3xl font-semibold text-white">
                    Registrar Nueva Linea
                  </h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <section className="max-w-4xl p-6 mx-auto bg-gray-600 rounded-md shadow-md">
                    <form>
                      <div className="grid grid-cols-1 gap-6 mt-1 sm:grid-cols-2">
                        <div>
                          <label className="text-white" htmlFor="codigo">
                            Código
                          </label>
                          <input
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
                            id="descripcion"
                            type="text"
                            required={true}
                            className="block w-full px-4 py-2 mt-2 text-white bg-white border border-gray-200 rounded-md dark:bg-gray-500 dark:text-white dark:border-gray-600 focus:border-secondary-900 focus:ring-secondary-900 focus:ring-opacity-40 dark:focus:border-secondary-900 focus:outline-none focus:ring"
                          />
                        </div>
                      </div>
                    </form>
                  </section>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-secondary-900 rounded-b">
                  <button
                    className="text-red-500 hover:text-red-600 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Cerrar
                  </button>
                  <button
                    className="bg-secondary-900 hover:text-primary text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Registrar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : (
        console.log("no se puede abrir")
      )}
    </>
  );
};

export default ModalLineas;
