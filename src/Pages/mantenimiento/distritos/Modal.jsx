import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import Mensajes from "../../../Components/Mensajes";
import moment from "moment";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";

const Modal = ({ setModal, modo, setRespuestaModal, objeto }) => {
  //#region useState
  const [data, setData] = useState([]);
  const [dataDepartamento, setDataDepartamento] = useState([]);
  const [dataProvincia, setDataProvincia] = useState([]);
  const [tipoMensaje, setTipoMensaje] = useState(0);
  const [mensaje, setMensaje] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    console.log("tipoMensaje modal");
    tipoMensaje && console.log(tipoMensaje);
    console.log("Cierra tipoMensaje modal");
  }, [tipoMensaje]);
  useEffect(() => {
    console.log("Mensaje modal");
    mensaje && console.log(mensaje);
    console.log("Cierra Mensaje modal");
  }, [mensaje]);
  useEffect(() => {
    console.log("Objeto modal");
    objeto && console.log(objeto);
    setData(objeto);
    console.log("Cierra objeto modal");
  }, [objeto]);
  useEffect(() => {
    console.log("dataDepartamento modal");
    dataDepartamento && console.log(dataDepartamento);
    document.getElementById("departamentoId").value = data.departamentoId;
    console.log("Cierra dataDepartamento modal");
  }, [dataDepartamento]);
  useEffect(() => {
    console.log("dataProvincia modal");
    dataProvincia && console.log(dataProvincia);
    document.getElementById("provinciaId").value = data.provinciaId;
    console.log("Cierra dataProvincia modal");
  }, [dataProvincia]);
  useEffect(() => {
    console.log("Data modal");
    data && console.log(data);
    console.log("Cierra data modal");
  }, [data]);
  useEffect(() => {
    ConsultarDepartamento();
  }, []);
  useEffect(() => {
    ConsultarProvincia();
  }, []);

  //#endregion

  //#region Funcion onChange y validación de campos
  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };
  const OcultarMensajes = () => {
    setMensaje([]);
    setTipoMensaje(0);
  };
  const ValidarConsulta = (e) => {
    e.preventDefault();
    let fecha = document.getElementById("id").value;
    ConsultarTipoCambio("?fecha=" + fecha);
  };
  //#endregion

  //#region Funciones API
  const Registrar = async (e) => {
    e.preventDefault();
    try {
      const result = await ApiMasy.post(`api/Mantenimiento/Distrito`, data);
      let tipo = result.data.messages[0].tipo;
      let msj = result.data.messages[0].textos[0];
      console.log(tipo);
      console.log(msj);
      setTipoMensaje(result.data.messages[0].tipo);
      setMensaje(result.data.messages[0].textos[0]);
      if (tipo == 0) {
        toast.success(msj, {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setRespuestaModal(true);
      }
      setModal(false);
    } catch (error) {
      if (error.response) {
        console.log(1);
        console.log(error);
      } else if (error.request) {
        console.log(2);
        console.log(error);
      } else if (error.message) {
        console.log(3);
        console.log(error);
      }
    }
  };
  const Modificar = async (e) => {
    e.preventDefault();
    const result = await ApiMasy.put(`api/Mantenimiento/Distrito`, data);
    setTipoMensaje(result.data.messages[0].tipo);
    setMensaje(result.data.messages[0].textos);
    console.log(result.data.messages[0].textos);
    if (tipoMensaje == 0) {
      toast.success(
        { mensaje },
        {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
      setRespuestaModal(true);
    }
    setModal(false);
  };
  const ConsultarDepartamento = async () => {
    const result = await ApiMasy.get(`api/Mantenimiento/Departamento/Listar`);
    setDataDepartamento(result.data.data.data);
    console.log(result.data.data.data);
  };
  const ConsultarProvincia = async () => {
    const result = await ApiMasy.get(`api/Mantenimiento/Provincia/Listar`);
    setDataProvincia(result.data.data.data);
    console.log(result.data.data.data);
  };
  const CerrarModal = () => {
    setRespuestaModal(false);
    setModal(false);
  };
  //#endregion

  //#region Render
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative h-full w-full md:h-auto my-0 md:my-5 mx-auto max-w-5xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full h-full bg-secondary-100 outline-none focus:outline-none">
            {/*header*/}
            <div className="flex text-center p-5 border-b border-solid border-secondary-900 rounded-t">
              <h3 className="text-3xl font-semibold text-white">{modo}</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 hover:text-red-500 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={CerrarModal}
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto">
              {tipoMensaje > 0 && (
                <Mensajes
                  tipoMensaje={tipoMensaje}
                  mensaje={mensaje}
                  Click={() => OcultarMensajes()}
                />
              )}
              <section className="min-w-fit max-w-4xl p-6 mx-auto rounded-md shadow-md">
                <form>
                  <div className="grid grid-cols-1 gap-2 md:gap-4 mt-1">
                    <div className="flex flex-col md:flex-row gap-y-2 md:gap-x-2">
                      <div className="flex min-w-min md:w-full">
                        <label
                          htmlFor="distritoId"
                          className="inline-flex items-center px-3 text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 font-bold"
                        >
                          Código
                        </label>
                        <input
                          type="text"
                          id="distritoId"
                          name="distritoId"
                          defaultValue={data.distritoId}
                          onChange={handleChange}
                          readOnly
                          className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                      </div>
                      <div className="flex min-w-min md:w-full">
                        <label
                          htmlFor="departamentoId"
                          className="inline-flex items-center px-3 text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 font-bold"
                        >
                          Departamento
                        </label>
                        <select
                          id="departamentoId"
                          name="departamentoId"
                          onChange={handleChange}
                          disabled={
                            modo == "Consultar" || modo == "Modificar"
                              ? true
                              : false
                          }
                          className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          {dataDepartamento.map((departamento) => (
                            <option
                              key={departamento.id}
                              value={departamento.id}
                            >
                              {departamento.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex min-w-min md:w-full">
                        <label
                          htmlFor="provinciaId"
                          className="inline-flex items-center px-3 text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 font-bold"
                        >
                          Provincia
                        </label>
                        <select
                          id="provinciaId"
                          name="provinciaId"
                          onChange={handleChange}
                          disabled={
                            modo == "Consultar" || modo == "Modificar"
                              ? true
                              : false
                          }
                          className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          {dataProvincia.map((provincia) => (
                            <option key={provincia.id} value={provincia.id}>
                              {provincia.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex">
                      <label
                        htmlFor="distritoNombre"
                        className="inline-flex items-center px-3 text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 font-bold"
                      >
                        Nombre
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        defaultValue={data.nombre}
                        placeholder="Nombre"
                        onChange={handleChange}
                        autoComplete="off"
                        readOnly={modo == "Consultar" ? true : false}
                        className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                      ? (e) => Registrar(e)
                      : (e) => Modificar(e)
                  }
                >
                  {modo == "Registrar" ? "Registrar" : "Guardar Cambios"}
                </button>
              )}
              <button
                className="background-transparent hover:bg-red-500 text-red-500 hover:text-white border-solid border-2 border-red-500 font-bold text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={CerrarModal}
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
