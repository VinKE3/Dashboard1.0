import React from "react";
import { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";

const ModalLineas = (estado) => {
  const [showModal, setShowModal] = useState(true);
  const [data, setData] = useState({ descripcion: "" });

  // const handleChange = (e) => {
  //   console.log(e.target.value);
  //   setData({ ...data, [e.target.name]: e.target.value });
  //   console.log(data);
  // };

  const handleChange = ({ target }) => {
    setData({
      ...data,
      [target.name]: target.value,
    });
    console.log(data);
  };

  const handleSubmit = async (e) => {
    console.log("submit");
    e.preventDefault();
    console.log(data.descripcion);
    try {
      const result = await ApiMasy.post(`api/Mantenimiento/Linea`, {
        descripcion: data.descripcion,
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setShowModal(estado);
  }, [estado]);

  useEffect(() => {
    data && console.log(data);
  }, [data]);

  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-5xl">
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
                            defaultValue={data.descripcion}
                            id="descripcion"
                            type="text"
                            name="descripcion"
                            onChange={handleChange}
                            required
                            className="block w-full px-4 py-2 mt-2 text-white bg-white border border-gray-200 rounded-md dark:bg-gray-500 dark:text-white dark:border-gray-600 focus:border-secondary-900 focus:ring-secondary-900 focus:ring-opacity-40 dark:focus:border-secondary-900 focus:outline-none focus:ring"
                          />
                        </div>
                      </div>
                    </form>
                  </section>
                  {/* <form onSubmit={handleSubmit} className="w-full max-w-lg">
                    <div className="flex flex-wrap -mx-3 mb-6">
                      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="descripcion"
                        >
                          First Name
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                          id="descripcion"
                          type="text"
                          name="descripcion"
                          onChange={handleChange}
                          required
                          defaultValue={data.descripcion}
                        />
                        <p className="text-red-500 text-xs italic">
                          Please fill out this field.
                        </p>
                      </div>
                      <div className="w-full md:w-1/2 px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-last-name"
                        >
                          Last Name
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          id="grid-last-name"
                          type="text"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                      <div className="w-full px-3">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Password
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          id="grid-password"
                          type="password"
                          placeholder="******************"
                        />
                        <p className="text-gray-600 text-xs italic">
                          Make it as long and as crazy as you'd like
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-2">
                      <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-city"
                        >
                          City
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          id="grid-city"
                          type="text"
                          placeholder="Albuquerque"
                        />
                      </div>
                      <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-state"
                        >
                          State
                        </label>
                        <div className="relative">
                          <select
                            className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-state"
                          >
                            <option>New Mexico</option>
                            <option>Missouri</option>
                            <option>Texas</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                              className="fill-current h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label
                          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="grid-zip"
                        >
                          Zip
                        </label>
                        <input
                          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          id="grid-zip"
                          type="text"
                          placeholder="90210"
                        />
                      </div>
                    </div>
                  </form> */}
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
                    onSubmit={handleSubmit}
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
