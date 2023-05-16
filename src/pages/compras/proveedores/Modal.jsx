import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import TableBasic from "../../../components/tablas/TableBasic";
import { TabView, TabPanel } from "primereact/tabview";
import Ubigeo from "../../../components/filtros/Ubigeo";
import Insert from "../../../components/CRUD/Insert";
import Update from "../../../components/CRUD/Update";
import Delete from "../../../components/CRUD/Delete";
import Mensajes from "../../../components/Mensajes";
import { toast } from "react-toastify";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaSearch, FaPen, FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import * as Global from "../../../components/Global";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(3) {
    width: 90px;
  }
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;
//#endregion
const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataTipoDoc, setDataTipoDoc] = useState([]);
  const [dataUbigeo, setDataUbigeo] = useState([]);
  const [tipoMen, setTipoMen] = useState(-1);
  const [men, setMen] = useState([]);
  const [respuesta, setRespuesta] = useState(false);

  const [dataCcorriente, setDataCcorriente] = useState([]);
  const [dataCcorrienteMoneda, setDataCcorrienteMoneda] = useState([]);
  const [dataCcorrienteEntidad, setDataCcorrienteEntidad] = useState([]);
  const [objetoCcorriente, setObjetoCcorriente] = useState([]);
  const [estadoCcorriente, setEstadoCcorriente] = useState(false);

  const [dataContacto, setDataContacto] = useState([]);
  const [dataContactoCargo, setDataContactoCargo] = useState([]);
  const [objetoContacto, setObjetoContacto] = useState([]);
  const [estadoContacto, setEstadoContacto] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (tipoMen == 0) {
      setRespuesta(true);
    }
  }, [tipoMen]);
  useEffect(() => {
    if (respuesta) {
      RetornarMensaje();
    }
  }, [respuesta]);
  useEffect(() => {
    if (Object.keys(dataUbigeo).length > 0) {
      setData({
        ...data,
        departamentoId: dataUbigeo.departamentoId,
        provinciaId: dataUbigeo.provinciaId,
        distritoId: dataUbigeo.distritoId,
      });
    }
  }, [dataUbigeo]);
  useEffect(() => {
    Tablas();
    if (modo != "Registrar") {
      ListarCcorriente();
      ListarContacto();
      TablasCargo();
      TablasCcorriente();
    }
  }, []);
  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    if (target.name == "correoElectronico") {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value,
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  const ValidarDataCcorriente = async ({ target }) => {
    setObjetoCcorriente((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  const ValidarDataContacto = async ({ target }) => {
    setObjetoContacto((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  const ValidarConsultarDocumento = () => {
    let documento = document.getElementById("numeroDocumentoIdentidad").value;
    let tipo = document.getElementById("tipoDocumentoIdentidadId").value;
    if (tipo == 1) {
      tipo = "dni";
    } else if (tipo == 6) {
      tipo = "ruc";
    } else {
      tipo = "";
    }
    ConsultarDocumento(`?tipo=${tipo}&numeroDocumentoIdentidad=${documento}`);
  };
  const AgregarCcorriente = async (e, id = 0) => {
    await Limpiar(e);
    if (e.target.innerText == "AGREGAR") {
      await LimpiarCcorriente();
    } else {
      await GetCcorriente(id);
    }
    setEstadoCcorriente(true);
  };
  const AgregarContacto = async (e, id = 0) => {
    await Limpiar(e);
    if (e.target.innerText == "AGREGAR") {
      await LimpiarContacto();
    } else {
      await GetContacto(id);
    }
    setEstadoContacto(true);
  };
  const Limpiar = async () => {
    setMen([]);
    setTipoMen(-1);
    setRespuesta(false);
  };
  const LimpiarCcorriente = async () => {
    setObjetoCcorriente({
      id: "",
      proveedorId: data.id,
      cuentaCorrienteId: 0,
      monedaId: "S",
      numero: "",
      entidadBancariaId: 11,
    });
  };
  const LimpiarContacto = async () => {
    setObjetoContacto({
      id: "",
      proveedorId: data.id,
      contactoId: 0,
      nombres: "",
      numeroDocumentoIdentidad: "",
      celular: "",
      telefono: "",
      cargoId: 2,
      correoElectronico: "",
      direccion: "",
    });
  };
  const RetornarMensaje = async () => {
    if (tipoMen == 0) {
      toast.info(men, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
    await ListarContacto();
    await ListarCcorriente();
    await Limpiar();
    setEstadoContacto(false);
    setEstadoCcorriente(false);
  };
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Proveedor/FormularioTablas`
    );
    setDataTipoDoc(result.data.data.tiposDocumentoIdentidad);
  };
  const ConsultarDocumento = async (filtroApi = "") => {
    document.getElementById("consultarApi").hidden = true;
    const res = await ApiMasy.get(`api/Servicio/ConsultarRucDni${filtroApi}`);
    if (res.status == 200) {
      let model = {
        numeroDocumentoIdentidad: res.data.data.numeroDocumentoIdentidad,
        nombre: res.data.data.nombre,
        direccionPrincipal: res.data.data.direccion,
      };
      setData({
        ...data,
        numeroDocumentoIdentidad: model.numeroDocumentoIdentidad,
        nombre: model.nombre,
        direccionPrincipal: model.direccionPrincipal,
      });
      toast.info("Datos extraídos exitosamente", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      document.getElementById("consultarApi").hidden = false;
    } else {
      toast.error(String(res.response.data.messages[0].textos), {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      document.getElementById("consultarApi").hidden = false;
    }
  };

  const TablasCcorriente = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ProveedorCuentaCorriente/FormularioTablas`
    );
    setDataCcorrienteMoneda(result.data.data.monedas);
    setDataCcorrienteEntidad(result.data.data.entidadesBancarias);
  };
  const ListarCcorriente = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ProveedorCuentaCorriente/ListarPorProveedor?proveedorId=${data.id}`
    );
    setDataCcorriente(result.data.data);
  };
  const GetCcorriente = async (id) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ProveedorCuentaCorriente/${id}`
    );
    setObjetoCcorriente(result.data.data);
  };
  const EnviarCcorriente = async () => {
    if (objetoCcorriente.id == 0) {
      let existe = dataCcorriente.find(
        (map) => map.numero == objetoCcorriente.numero
      );
      if (existe == undefined) {
        await Insert(
          ["Mantenimiento", "ProveedorCuentaCorriente"],
          objetoCcorriente,
          setTipoMen,
          setMen
        );
      } else {
        toast.error(
          "Proveedor Cuenta Corriente: Ya existe el registro ingresado",
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
      }
    } else {
      await Update(
        ["Mantenimiento", "ProveedorCuentaCorriente"],
        objetoCcorriente,
        setTipoMen,
        setMen
      );
    }
  };

  const TablasCargo = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ProveedorContacto/FormularioTablas`
    );
    setDataContactoCargo(result.data.data.cargos);
  };
  const ListarContacto = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ProveedorContacto/ListarPorProveedor?proveedorId=${data.id}`
    );
    setDataContacto(result.data.data);
  };
  const GetContacto = async (id) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ProveedorContacto/${id}`
    );
    setObjetoContacto(result.data.data);
  };
  const EnviarContacto = async () => {
    if (objetoContacto.id == 0) {
      let existe = dataContacto.find(
        (map) => map.nombres == objetoContacto.nombres
      );
      if (existe == undefined) {
        await Insert(
          ["Mantenimiento", "ProveedorContacto"],
          objetoContacto,
          setTipoMen,
          setMen
        );
      } else {
        toast.error("Proveedor Contacto: Ya existe el registro ingresado", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } else {
      await Update(
        ["Mantenimiento", "ProveedorContacto"],
        objetoContacto,
        setTipoMen,
        setMen
      );
    }
  };
  //#endregion

  //#region Columnas
  const colCcorriente = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Cuenta Corriente",
      accessor: "numero",
    },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <div className="flex item-center justify-center">
          {modo == "Consultar" ? (
            ""
          ) : (
            <>
              <div className={Global.TablaBotonModificar}>
                <button
                  id="boton-modificar"
                  onClick={(e) => AgregarCcorriente(e, row.values.id)}
                  className="p-0 px-1"
                  title="Click para modificar registro"
                >
                  <FaPen></FaPen>
                </button>
              </div>

              <div className={Global.TablaBotonEliminar}>
                <button
                  id="boton-eliminar"
                  onClick={() => {
                    Delete(
                      ["Mantenimiento", "ProveedorCuentaCorriente"],
                      row.values.id,
                      setRespuesta
                    );
                  }}
                  className="p-0 px-1"
                  title="Click para eliminar registro"
                >
                  <FaTrashAlt></FaTrashAlt>
                </button>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];
  const colContacto = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Nombres",
      accessor: "nombres",
    },
    {
      Header: "Documento",
      accessor: "numeroDocumentoIdentidad",
    },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <div className="flex item-center justify-center">
          {modo == "Consultar" ? (
            ""
          ) : (
            <>
              <div className={Global.TablaBotonModificar}>
                <button
                  id="boton-modificar"
                  onClick={(e) => AgregarContacto(e, row.values.id)}
                  className="p-0 px-1"
                  title="Click para modificar registro"
                >
                  <FaPen></FaPen>
                </button>
              </div>

              <div className={Global.TablaBotonEliminar}>
                <button
                  id="boton-eliminar"
                  onClick={() => {
                    Delete(
                      ["Mantenimiento", "ProveedorContacto"],
                      row.values.id,
                      setRespuesta
                    );
                  }}
                  className="p-0 px-1"
                  title="Click para eliminar registro"
                >
                  <FaTrashAlt></FaTrashAlt>
                </button>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];
  //#endregion

  //#region Render
  return (
    <>
      {Object.entries(dataTipoDoc).length > 0 && (
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={["Mantenimiento", "Proveedor"]}
          titulo="Proveedor"
          tamañoModal={[Global.ModalMediano, Global.Form + "pt-0 "]}
        >
          <TabView>
            <TabPanel
              header="Datos Principales"
              leftIcon="pi pi-user mr-2"
              style={{ color: "green" }}
            >
              <div className={Global.ContenedorBasico + " mt-4"}>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputTercio}>
                    <label htmlFor="id" className={Global.LabelStyle}>
                      Código
                    </label>
                    <input
                      type="text"
                      id="id"
                      name="id"
                      autoComplete="off"
                      placeholder="Código"
                      readOnly={true}
                      value={data.id ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle + Global.Disabled}
                    />
                  </div>
                  <div className={Global.InputTercio}>
                    <label htmlFor="condicion" className={Global.LabelStyle}>
                      Condición
                    </label>
                    <input
                      type="text"
                      id="condicion"
                      name="condicion"
                      autoComplete="off"
                      placeholder="Condición"
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.condicion ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputTercio}>
                    <label htmlFor="estado" className={Global.LabelStyle}>
                      Estado
                    </label>
                    <input
                      type="text"
                      id="estado"
                      name="estado"
                      autoComplete="off"
                      placeholder="Estado"
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.estado ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputMitad}>
                    <label
                      htmlFor="tipoDocumentoIdentidadId"
                      className={Global.LabelStyle}
                    >
                      Tipo Doc
                    </label>
                    <select
                      id="tipoDocumentoIdentidadId"
                      name="tipoDocumentoIdentidadId"
                      value={data.tipoDocumentoIdentidadId ?? ""}
                      onChange={ValidarData}
                      disabled={modo == "Consultar" ? true : false}
                      className={Global.InputStyle}
                    >
                      {dataTipoDoc.map((map) => (
                        <option key={map.id} value={map.id}>
                          {map.abreviatura}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={Global.InputMitad}>
                    <label
                      htmlFor="numeroDocumentoIdentidad"
                      className={Global.LabelStyle}
                    >
                      Número Doc
                    </label>
                    <input
                      type="text"
                      id="numeroDocumentoIdentidad"
                      name="numeroDocumentoIdentidad"
                      autoComplete="off"
                      maxLength={
                        data.tipoDocumentoIdentidadId == "1" ? 8 : 12
                      }
                      placeholder="Número Documento Identidad"
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.numeroDocumentoIdentidad ?? ""}
                      onChange={ValidarData}
                      className={Global.InputBoton}
                    />
                    <button
                      id="consultarApi"
                      hidden={modo == "Consultar" ? true : false}
                      onClick={(e) => ValidarConsultarDocumento(e)}
                      className={
                        Global.BotonBuscar +
                        Global.Anidado +
                        Global.BotonPrimary
                      }
                    >
                      <FaSearch></FaSearch>
                    </button>
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <label htmlFor="nombre" className={Global.LabelStyle}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    autoComplete="off"
                    placeholder="Nombre"
                    readOnly={modo == "Consultar" ? true : false}
                    value={data.nombre ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputMitad}>
                    <label htmlFor="telefono" className={Global.LabelStyle}>
                      Teléfono
                    </label>
                    <input
                      type="text"
                      id="telefono"
                      name="telefono"
                      autoComplete="off"
                      placeholder="Teléfono"
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.telefono ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputMitad}>
                    <label htmlFor="celular" className={Global.LabelStyle}>
                      Telef. Fax. N°
                    </label>
                    <input
                      type="text"
                      id="celular"
                      name="celular"
                      autoComplete="off"
                      placeholder="Telef. Fax. N°"
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.celular ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="correoElectronico"
                      className={Global.LabelStyle}
                    >
                      Correo
                    </label>
                    <input
                      type="text"
                      id="correoElectronico"
                      name="correoElectronico"
                      autoComplete="off"
                      placeholder="Correo"
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.correoElectronico ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="direccionPrincipal"
                      className={Global.LabelStyle}
                    >
                      Dirección
                    </label>
                    <input
                      type="text"
                      id="direccionPrincipal"
                      name="direccionPrincipal"
                      autoComplete="off"
                      placeholder="Dirección Principal"
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.direccionPrincipal ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <Ubigeo
                  modo={modo}
                  setDataUbigeo={setDataUbigeo}
                  id={["departamentoId", "provinciaId", "distritoId"]}
                  dato={{
                    departamentoId: data.departamentoId,
                    provinciaId: data.provinciaId,
                    distritoId: data.distritoId,
                  }}
                ></Ubigeo>
                                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="observacion"
                      className={Global.LabelStyle}
                    >
                      Observación
                    </label>
                    <input
                      type="text"
                      id="observacion"
                      name="observacion"
                      autoComplete="off"
                      placeholder="Observación"
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.observacion ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
              </div>
            </TabPanel>
            {modo != "Registrar" ? (
              <TabPanel
                header="Cuentas Corrientes"
                leftIcon="pi pi-money-bill mr-2"
              >
                {/* Boton */}
                {modo == "Consultar" ? (
                  ""
                ) : (
                  <div className="my-4">
                    <Mensajes
                      tipoMensaje={2}
                      mensaje={[Global.MensajeInformacion]}
                      cerrar={false}
                    />
                    <BotonBasico
                      botonText="Agregar"
                      botonClass="bg-green-700 hover:bg-green-600 hover:text-light"
                      botonIcon={faPlus}
                      click={(e) => {
                        AgregarCcorriente(e);
                      }}
                      containerClass=""
                    />
                  </div>
                )}
                {/* Boton */}

                {/* Form Cuenta Corriente */}
                {estadoCcorriente && (
                  <div
                    className={
                      Global.ContenedorBasico +
                      Global.FondoContenedor +
                      " pb-1 mb-2"
                    }
                  >
                    {tipoMen > 0 && (
                      <Mensajes
                        tipoMensaje={tipoMen}
                        mensaje={men}
                        Click={() => {
                          setMen([]);
                          setTipoMen(-1);
                        }}
                      />
                    )}

                    <div className={Global.ContenedorInputs}>
                      <div className={Global.Input40pct}>
                        <label htmlFor="monedaId" className={Global.LabelStyle}>
                          Moneda
                        </label>
                        <select
                          id="monedaId"
                          name="monedaId"
                          value={objetoCcorriente.monedaId ?? ""}
                          onChange={ValidarDataCcorriente}
                          disabled={modo == "Consultar" ? true : false}
                          className={Global.InputStyle}
                        >
                          {dataCcorrienteMoneda.map((map) => (
                            <option key={map.id} value={map.id}>
                              {map.abreviatura}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={Global.InputFull}>
                        <label htmlFor="numero" className={Global.LabelStyle}>
                          Número
                        </label>
                        <input
                          type="text"
                          id="numero"
                          name="numero"
                          autoComplete="off"
                          maxLength="60"
                          placeholder="Número"
                          readOnly={modo == "Consultar" ? true : false}
                          value={objetoCcorriente.numero ?? ""}
                          onChange={ValidarDataCcorriente}
                          className={Global.InputStyle}
                        />
                      </div>
                    </div>
                    <div className="flex">
                      <label
                        htmlFor="entidadBancariaId"
                        className={Global.LabelStyle}
                      >
                        E.B.
                      </label>
                      <select
                        id="entidadBancariaId"
                        name="entidadBancariaId"
                        value={objetoCcorriente.entidadBancariaId ?? ""}
                        onChange={ValidarDataCcorriente}
                        disabled={modo == "Consultar" ? true : false}
                        className={Global.InputStyle}
                      >
                        {dataCcorrienteEntidad.map((map) => (
                          <option key={map.id} value={map.id}>
                            {map.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-start">
                      {modo == "Consultar" ? (
                        ""
                      ) : (
                        <button
                          type="button"
                          onClick={EnviarCcorriente}
                          className={
                            Global.BotonModalBase +
                            Global.BotonOkModal +
                            " py-2 sm:py-1 px-3"
                          }
                        >
                          Guardar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setEstadoCcorriente(false)}
                        className={
                          Global.BotonModalBase +
                          Global.BotonCancelarModal +
                          " py-2 sm:py-1  px-3"
                        }
                      >
                        CERRAR
                      </button>
                    </div>
                    {/*footer*/}
                  </div>
                )}
                {/* Form Cuenta Corriente */}

                {/* Tabla */}
                <TablaStyle>
                  <TableBasic columnas={colCcorriente} datos={dataCcorriente} />
                </TablaStyle>
                {/* Tabla */}
              </TabPanel>
            ) : (
              ""
            )}
            {modo != "Registrar" ? (
              <TabPanel header="Contactos" leftIcon="pi pi-user mr-2">
                {/* Boton */}
                {modo == "Consultar" ? (
                  ""
                ) : (
                  <div className="my-4">
                    <Mensajes
                      tipoMensaje={2}
                      mensaje={[Global.MensajeInformacion]}
                      cerrar={false}
                    />
                    <BotonBasico
                      botonText="Agregar"
                      botonClass="bg-green-700 hover:bg-green-600 hover:text-light"
                      botonIcon={faPlus}
                      click={(e) => {
                        AgregarContacto(e);
                      }}
                      containerClass=""
                    />
                  </div>
                )}
                {/* Boton */}

                {/* Form Contactos */}
                {estadoContacto && (
                  <div
                    className={
                      Global.ContenedorBasico +
                      Global.FondoContenedor +
                      " pb-1 mb-2"
                    }
                  >
                    {tipoMen > 0 && (
                      <Mensajes
                        tipoMensaje={tipoMen}
                        mensaje={men}
                        Click={() => {
                          setMen([]);
                          setTipoMen(-1);
                        }}
                      />
                    )}

                    <div className={Global.ContenedorInputs}>
                      <div className={Global.InputFull}>
                        <label htmlFor="nombres" className={Global.LabelStyle}>
                          Nombres
                        </label>
                        <input
                          type="text"
                          id="nombres"
                          name="nombres"
                          autoComplete="off"
                          placeholder="Nombres"
                          readOnly={modo == "Consultar" ? true : false}
                          value={objetoContacto.nombres ?? ""}
                          onChange={ValidarDataContacto}
                          className={Global.InputStyle}
                        />
                      </div>
                      <div className={Global.Input96}>
                        <label
                          htmlFor="numeroDocumentoIdentidad"
                          className={Global.LabelStyle}
                        >
                          DNI
                        </label>
                        <input
                          type="text"
                          id="numeroDocumentoIdentidad"
                          name="numeroDocumentoIdentidad"
                          autoComplete="off"
                          maxLength="15"
                          placeholder="N° Documento Identidad"
                          readOnly={modo == "Consultar" ? true : false}
                          value={objetoContacto.numeroDocumentoIdentidad ?? ""}
                          onChange={ValidarDataContacto}
                          className={Global.InputStyle}
                        />
                      </div>
                    </div>

                    <div className={Global.ContenedorInputs}>
                      <div className={Global.InputFull}>
                        <label htmlFor="cargoId" className={Global.LabelStyle}>
                          Cargo
                        </label>
                        <select
                          id="cargoId"
                          name="cargoId"
                          value={objetoContacto.cargoId ?? ""}
                          onChange={ValidarDataContacto}
                          disabled={modo == "Consultar" ? true : false}
                          className={Global.InputStyle}
                        >
                          {dataContactoCargo.map((cargo) => (
                            <option key={cargo.id} value={cargo.id}>
                              {cargo.descripcion}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={Global.Input96}>
                        <label htmlFor="celular" className={Global.LabelStyle}>
                          Celular
                        </label>
                        <input
                          type="text"
                          id="celular"
                          name="celular"
                          autoComplete="off"
                          maxLength="15"
                          placeholder="Celular"
                          readOnly={modo == "Consultar" ? true : false}
                          value={objetoContacto.celular ?? ""}
                          onChange={ValidarDataContacto}
                          className={Global.InputStyle}
                        />
                      </div>
                    </div>

                    <div className={Global.ContenedorInputs}>
                      <div className={Global.Input96}>
                        <label htmlFor="telefono" className={Global.LabelStyle}>
                          Telefono
                        </label>
                        <input
                          type="text"
                          id="telefono"
                          name="telefono"
                          autoComplete="off"
                          maxLength="15"
                          placeholder="Teléfono"
                          readOnly={modo == "Consultar" ? true : false}
                          value={objetoContacto.telefono ?? ""}
                          onChange={ValidarDataContacto}
                          className={Global.InputStyle}
                        />
                      </div>
                      <div className={Global.InputFull}>
                        <label htmlFor="correo" className={Global.LabelStyle}>
                          Correo
                        </label>
                        <input
                          type="text"
                          id="correo"
                          name="correo"
                          autoComplete="off"
                          placeholder="Correo"
                          readOnly={modo == "Consultar" ? true : false}
                          value={objetoContacto.correo ?? ""}
                          onChange={ValidarDataContacto}
                          className={Global.InputStyle}
                        />
                      </div>
                    </div>

                    <div className="flex">
                      <label htmlFor="direccion" className={Global.LabelStyle}>
                        Dirección
                      </label>
                      <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        autoComplete="off"
                        placeholder="Dirección"
                        readOnly={modo == "Consultar" ? true : false}
                        value={objetoContacto.direccion ?? ""}
                        onChange={ValidarDataContacto}
                        className={Global.InputStyle}
                      />
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-start">
                      {modo == "Consultar" ? (
                        ""
                      ) : (
                        <button
                          type="button"
                          onClick={EnviarContacto}
                          className={
                            Global.BotonModalBase +
                            Global.BotonOkModal +
                            " py-2 sm:py-1 px-3"
                          }
                        >
                          Guardar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setEstadoContacto(false)}
                        className={
                          Global.BotonModalBase +
                          Global.BotonCancelarModal +
                          " py-2 sm:py-1  px-3"
                        }
                      >
                        CERRAR
                      </button>
                    </div>
                    {/*footer*/}
                  </div>
                )}
                {/* Form Contactos */}

                {/* Tabla */}
                <TablaStyle>
                  <TableBasic columnas={colContacto} datos={dataContacto} />
                </TablaStyle>
                {/* Tabla */}
              </TabPanel>
            ) : (
              ""
            )}
          </TabView>
        </ModalCrud>
      )}
    </>
  );
  //#endregion
};

export default Modal;
