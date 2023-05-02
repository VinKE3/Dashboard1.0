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
  const [dataGeneral, setDataGeneral] = useState(objeto);
  const [dataTipoDoc, setDataTipoDoc] = useState([]);
  const [dataUbigeo, setDataUbigeo] = useState([]);
  const [tipoMen, setTipoMen] = useState(-1);
  const [men, setMen] = useState([]);
  const [respuesta, setRespuesta] = useState(false);

  const [dataDireccion, setDataDireccion] = useState([]);
  const [objetoDireccion, setObjetoDireccion] = useState([]);
  const [dataUbiDirec, setDataUbiDirec] = useState([]);
  const [estadoDireccion, setEstadoDireccion] = useState(false);

  const [dataContacto, setDataContacto] = useState([]);
  const [dataContactoCargo, setDataContactoCargo] = useState([]);
  const [objetoContacto, setObjetoContacto] = useState([]);
  const [estadoContacto, setEstadoContacto] = useState(false);

  const [dataPersonal, setDataPersonal] = useState([]);
  const [dataPersonalCombo, setDataPersonalCombo] = useState([]);
  const [objetoPersonal, setObjetoPersonal] = useState([]);
  const [estadoPersonal, setEstadoPersonal] = useState(false);
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
      setDataGeneral({
        ...dataGeneral,
        departamentoId: dataUbigeo.departamentoId,
        provinciaId: dataUbigeo.provinciaId,
        distritoId: dataUbigeo.distritoId,
      });
    }
  }, [dataUbigeo]);

  useEffect(() => {
    if (Object.keys(dataUbiDirec).length > 0) {
      setObjetoDireccion({
        ...objetoDireccion,
        departamentoId: dataUbiDirec.departamentoId,
        provinciaId: dataUbiDirec.provinciaId,
        distritoId: dataUbiDirec.distritoId,
      });
    }
  }, [dataUbiDirec]);

  useEffect(() => {
    Tablas();
    if (modo != "Registrar") {
      ListarDireccion();
      ListarContacto();
      ListarPersonal();
      TablasCargo();
      TablasPersonal();
    }
  }, []);
  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    if (target.name == "correoElectronico") {
      setDataGeneral((prevState) => ({
        ...prevState,
        [target.name]: target.value,
      }));
    } else {
      setDataGeneral((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  const ValidarDataDireccion = async ({ target }) => {
    setObjetoDireccion((prevState) => ({
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
  const ValidarDataPersonal = async ({ target }) => {
    setObjetoPersonal((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  const ValidarConsultarDocumento = (e) => {
    e.preventDefault();
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
  const AgregarDireccion = async (e, id = 0) => {
    await Limpiar(e);
    if (e.target.innerText == "AGREGAR") {
      await LimpiarDireccion();
    } else {
      await GetDireccion(id);
    }
    setEstadoDireccion(true);
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
  const AgregarPersonal = async (e, id = 0) => {
    await Limpiar(e);
    if (e.target.innerText == "AGREGAR") {
      await LimpiarPersonal();
    } else {
      await GetPersonal(id);
    }
    setEstadoPersonal(true);
  };
  const Limpiar = async (e) => {
    if (e != null) {
      e.preventDefault();
    }
    setMen([]);
    setTipoMen(-1);
    setRespuesta(false);
  };
  const LimpiarDireccion = async () => {
    setObjetoDireccion({
      id: 0,
      clienteId: dataGeneral.id,
      direccion: "",
      departamentoId: "15",
      provinciaId: "01",
      distritoId: "01",
      comentario: "",
      isActivo: true,
    });
  };
  const LimpiarContacto = async () => {
    setObjetoContacto({
      id: "",
      clienteId: dataGeneral.id,
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
  const LimpiarPersonal = async () => {
    setObjetoPersonal({
      id: "",
      clienteId: dataGeneral.id,
      personalId: "<<NI>>01",
      default: true,
    });
  };
  const RetornarMensaje = async () => {
    if (tipoMen == 0) {
      toast.success(men, {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    await ListarDireccion();
    await ListarContacto();
    await ListarPersonal();
    await Limpiar();
    setEstadoDireccion(false);
    setEstadoContacto(false);
    setEstadoPersonal(false);
  };
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Cliente/FormularioTablas`
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
        departamentoId: res.data.data.ubigeo[0],
        provinciaId: res.data.data.ubigeo[1],
        distritoId: res.data.data.ubigeo[2],
      };
      setDataGeneral({
        ...dataGeneral,
        numeroDocumentoIdentidad: model.numeroDocumentoIdentidad,
        nombre: model.nombre,
        direccionPrincipal: model.direccionPrincipal,
        departamentoId:
          model.departamentoId == ""
            ? dataGeneral.departamentoId
            : model.departamentoId,
        provinciaId:
          model.provinciaId == "" ? dataGeneral.provinciaId : model.provinciaId,
        distritoId:
          model.distritoId == "" ? dataGeneral.distritoId : model.distritoId,
      });
      toast.success("Datos extraídos exitosamente", {
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

  const ListarDireccion = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ClienteDireccion/ListarPorCliente?clienteId=${dataGeneral.id}`
    );
    setDataDireccion(result.data.data);
  };
  const GetDireccion = async (id) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ClienteDireccion/${id}`
    );
    setObjetoDireccion(result.data.data);
  };
  const EnviarClienteDireccion = async () => {
    if (objetoDireccion.id == 0) {
      await Insert(
        ["Mantenimiento", "ClienteDireccion"],
        objetoDireccion,
        setTipoMen,
        setMen
      );
    } else {
      await Update(
        ["Mantenimiento", "ClienteDireccion"],
        objetoDireccion,
        setTipoMen,
        setMen
      );
    }
  };

  const TablasCargo = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ClienteContacto/FormularioTablas`
    );
    setDataContactoCargo(result.data.data.cargos);
  };
  const ListarContacto = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ClienteContacto/ListarPorCliente?clienteId=${dataGeneral.id}`
    );
    setDataContacto(result.data.data);
  };
  const GetContacto = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/ClienteContacto/${id}`);
    setObjetoContacto(result.data.data);
  };
  const EnviarClienteContacto = async () => {
    if (objetoContacto.id == 0) {
      await Insert(
        ["Mantenimiento", "ClienteContacto"],
        objetoContacto,
        setTipoMen,
        setMen
      );
    } else {
      await Update(
        ["Mantenimiento", "ClienteContacto"],
        objetoContacto,
        setTipoMen,
        setMen
      );
    }
  };

  const TablasPersonal = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ClientePersonal/FormularioTablas`
    );
    setDataPersonalCombo(result.data.data.personal.map((res) => ({
      id: res.id,
      personal:
        res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
    })));
  };
  const ListarPersonal = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ClientePersonal/ListarPorCliente?clienteId=${dataGeneral.id}`
    );
    let model = result.data.data.map((res) => ({
      id: res.id,
      personal:
        res.personal.apellidoPaterno +
        " " +
        res.personal.apellidoMaterno +
        " " +
        res.personal.nombres,
      numeroDocumentoIdentidad: res.personal.numeroDocumentoIdentidad,
    }));
    setDataPersonal(model);
  };
  const GetPersonal = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/ClientePersonal/${id}`);
    setObjetoPersonal(result.data.data);
  };
  const EnviarClientePersonal = async () => {
    if (objetoPersonal.id == "") {
      await Insert(
        ["Mantenimiento", "ClientePersonal"],
        objetoPersonal,
        setTipoMen,
        setMen
      );
    }
  };
  //#endregion

  //#region Columnas
  const colDireccion = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Direcciones Secundarias",
      accessor: "direccion",
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
                  onClick={(e) => AgregarDireccion(e, row.values.id)}
                  className="p-0 px-1"
                  title="Click para modificar registro"
                >
                  <FaPen></FaPen>
                </button>
              </div>

              <div className={Global.TablaBotonEliminar}>
                <button
                  id="boton-eliminar"
                  onClick={(e) => {
                    e.preventDefault();
                    Delete(
                      ["Mantenimiento", "ClienteDireccion"],
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
                  onClick={(e) => {
                    e.preventDefault();
                    Delete(
                      ["Mantenimiento", "ClienteContacto"],
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
  const colPersonal = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Nombres",
      accessor: "personal",
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
              <div className={Global.TablaBotonEliminar}>
                <button
                  id="boton-eliminar"
                  onClick={(e) => {
                    e.preventDefault();
                    Delete(
                      ["Mantenimiento", "ClientePersonal"],
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
          objeto={dataGeneral}
          modo={modo}
          menu={["Mantenimiento", "Cliente"]}
          titulo="Cliente"
          tamañoModal={[Global.ModalMediano, Global.Form]}
        >
          <TabView>
            <TabPanel
              header="Datos Principales"
              leftIcon="pi pi-user mr-2"
              style={{ color: "green" }}
            >
              <div className={Global.ContenedorBasico}>
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
                      value={dataGeneral.tipoDocumentoIdentidadId ?? ""}
                      onChange={ValidarData}
                      disabled={modo == "Consultar" ? true : false}
                      className={Global.InputStyle}
                    >
                      {dataTipoDoc.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.abreviatura}
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
                      placeholder="Número Documento Identidad"
                      readOnly={modo == "Consultar" ? true : false}
                      value={dataGeneral.numeroDocumentoIdentidad ?? ""}
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
                <div className="flex">
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
                    value={dataGeneral.nombre ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.Input96}>
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
                      value={dataGeneral.telefono ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
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
                      value={dataGeneral.correoElectronico ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className="flex">
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
                    value={dataGeneral.direccionPrincipal ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <Ubigeo
                  modo={modo}
                  setDataUbigeo={setDataUbigeo}
                  id={["departamentoId", "provinciaId", "distritoId"]}
                  dato={{
                    departamentoId: dataGeneral.departamentoId,
                    provinciaId: dataGeneral.provinciaId,
                    distritoId: dataGeneral.distritoId,
                  }}
                ></Ubigeo>
              </div>
            </TabPanel>
            {modo != "Registrar" ? (
              <TabPanel
                header="Direcciones"
                leftIcon="pi pi-home mr-2"
                className="text-yellow-500"
              >
                {/* Boton */}
                {modo == "Consultar" ? (
                  ""
                ) : (
                  <div className="my-4">
                    <Mensajes
                      tipoMensaje={2}
                      mensaje={[
                        "Cualquier registro, modificación o eliminación de direcciones será guardado automáticamente en la base de datos, usar con precaución.",
                      ]}
                      cerrar={false}
                    />
                    <BotonBasico
                      botonText="Agregar"
                      botonClass={Global.BotonAgregar}
                      botonIcon={faPlus}
                      click={(e) => {
                        AgregarDireccion(e);
                      }}
                      containerClass=""
                    />
                  </div>
                )}
                {/* Boton */}

                {/* Form Direcciones */}
                {estadoDireccion && (
                  <div className={Global.FormSecundario}>
                    {tipoMen > 0 && (
                      <Mensajes
                        tipoMensaje={tipoMen}
                        mensaje={men}
                        Click={(e) => {
                          e.preventDefault();
                          setMen([]);
                          setTipoMen(-1);
                        }}
                      />
                    )}
                    <div className="flex">
                      <label htmlFor="direccion" className={Global.LabelStyle}>
                        Dirección
                      </label>
                      <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        autoComplete="off"
                        placeholder="Dirección secundaria"
                        readOnly={modo == "Consultar" ? true : false}
                        value={objetoDireccion.direccion ?? ""}
                        onChange={ValidarDataDireccion}
                        className={Global.InputStyle}
                      />
                    </div>
                    <Ubigeo
                      modo={modo}
                      setDataUbigeo={setDataUbiDirec}
                      id={["depaId", "provId", "disId"]}
                      dato={{
                        departamentoId: objetoDireccion.departamentoId,
                        provinciaId: objetoDireccion.provinciaId,
                        distritoId: objetoDireccion.distritoId,
                      }}
                    ></Ubigeo>
                    {/*footer*/}
                    <div className="flex items-center justify-start">
                      {modo == "Consultar" ? (
                        ""
                      ) : (
                        <button
                          type="button"
                          onClick={EnviarClienteDireccion}
                          className={Global.BotonOkModal + " py-2 sm:py-1 px-3"}
                        >
                          Guardar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setEstadoDireccion(false)}
                        className={
                          Global.BotonCancelarModal + " py-2 sm:py-1  px-3"
                        }
                      >
                        CERRAR
                      </button>
                    </div>
                    {/*footer*/}
                  </div>
                )}
                {/* Form Direcciones */}
                {/* Tabla */}
                <TablaStyle>
                  <TableBasic columnas={colDireccion} datos={dataDireccion} />
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
                      mensaje={[
                        "Cualquier registro, modificación o eliminación de direcciones será guardado automáticamente en la base de datos, usar con precaución.",
                      ]}
                      cerrar={false}
                    />
                    <BotonBasico
                      botonText="Agregar"
                      botonClass={Global.BotonAgregar}
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
                  <div className={Global.FormSecundario}>
                    {tipoMen > 0 && (
                      <Mensajes
                        tipoMensaje={tipoMen}
                        mensaje={men}
                        Click={(e) => {
                          e.preventDefault();
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
                          DNI:
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
                          value={dataGeneral.cargoId ?? ""}
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
                          onClick={EnviarClienteContacto}
                          className={Global.BotonOkModal + " py-2 sm:py-1 px-3"}
                        >
                          Guardar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setEstadoContacto(false)}
                        className={
                          Global.BotonCancelarModal + " py-2 sm:py-1  px-3"
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
            {modo != "Registrar" ? (
              <TabPanel header="Personal" leftIcon="pi pi-user mr-2">
                {/* Boton */}
                {modo == "Consultar" ? (
                  ""
                ) : (
                  <div className="my-4">
                    <Mensajes
                      tipoMensaje={2}
                      mensaje={[
                        "Cualquier registro, modificación o eliminación de direcciones será guardado automáticamente en la base de datos, usar con precaución.",
                      ]}
                      cerrar={false}
                    />
                    <BotonBasico
                      botonText="Agregar"
                      botonClass={Global.BotonAgregar}
                      botonIcon={faPlus}
                      click={(e) => {
                        AgregarPersonal(e);
                      }}
                      containerClass=""
                    />
                  </div>
                )}
                {/* Boton */}

                {/* Form Personal */}
                {estadoPersonal && (
                  <div className={Global.FormSecundario}>
                    {tipoMen > 0 && (
                      <Mensajes
                        tipoMensaje={tipoMen}
                        mensaje={men}
                        Click={(e) => {
                          e.preventDefault();
                          setMen([]);
                          setTipoMen(-1);
                        }}
                      />
                    )}

                    <div className={Global.ContenedorInputs}>
                      <div className={Global.InputFull}>
                        <label
                          htmlFor="personalId"
                          className={Global.LabelStyle}
                        >
                          Personal
                        </label>
                        <select
                          id="personalId"
                          name="personalId"
                          value={objetoPersonal.personalId ?? ""}
                          onChange={ValidarDataPersonal}
                          disabled={modo == "Consultar" ? true : false}
                          className={Global.InputStyle}
                        >
                          {dataPersonalCombo.map((personal) => (
                            <option key={personal.id} value={personal.id}>
                              {personal.personal}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-start">
                      {modo == "Consultar" ? (
                        ""
                      ) : (
                        <button
                          type="button"
                          onClick={EnviarClientePersonal}
                          className={Global.BotonOkModal + " py-2 sm:py-1 px-3"}
                        >
                          Guardar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setEstadoPersonal(false)}
                        className={
                          Global.BotonCancelarModal + " py-2 sm:py-1  px-3"
                        }
                      >
                        CERRAR
                      </button>
                    </div>
                    {/*footer*/}
                  </div>
                )}
                {/* Form Personal */}
                {/* Tabla */}
                <TablaStyle>
                  <TableBasic columnas={colPersonal} datos={dataPersonal} />
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
