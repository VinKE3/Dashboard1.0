import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalBasic from "../../../components/ModalBasic";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import Mensajes from "../../../components/Mensajes";
import TableBasic from "../../../components/tablas/TableBasic";
import { Tabs } from "flowbite-react";
import { toast } from "react-toastify";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaSearch, FaPen, FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";
import * as Global from "../../../components/Global";

//#region Estilos
const TabsStyle = styled.div`
  & .base {
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    border-bottom: 2px solid transparent;
    transition: all ease 0.2s;
  }
  & .active:focus {
    color: #ffe600;
    border-bottom: 2px solid #ffe600;
  }
  & .active:hover {
    transition: ease 0.4s;
    color: #000;
    background-color: #ffe600;
  }
`;
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }

  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;
//#endregion
const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [dataGeneral, setDataGeneral] = useState([]);
  const [dataTipoDoc, setDataTipoDoc] = useState([]);
  const [dataDep, setDataDep] = useState([]);
  const [dataProv, setDataProv] = useState([]);
  const [dataDist, setDataDist] = useState([]);

  const [dataDireccion, setDataDireccion] = useState([]);
  const [objetoDireccion, setObjetoDireccion] = useState([]);
  const [dataDepDireccion, setDataDepDireccion] = useState([]);
  const [dataProDireccion, setDataProDireccion] = useState([]);
  const [dataDisDireccion, setDataDisDireccion] = useState([]);
  const [estadoFormDireccion, setEstadoFormDireccion] = useState(false);

  const [dataContacto, setDataContacto] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    objeto;
    if (Object.entries(objeto).length > 0) {
      setDataGeneral(objeto);
    }
  }, [objeto]);
  useEffect(() => {
    dataTipoDoc;
    document.getElementById("tipoDocumentoIdentidadId").value =
      dataGeneral.tipoDocumentoIdentidadId;
  }, [dataTipoDoc]);
  useEffect(() => {
    dataDep;
    document.getElementById("departamentoId").value =
      dataGeneral.departamentoId;
    ConsultarProvincia();
  }, [dataDep]);
  useEffect(() => {
    dataProv;
    document.getElementById("provinciaId").value = dataGeneral.provinciaId;
    ConsultarDistrito();
  }, [dataProv]);
  useEffect(() => {
    dataDist;
    document.getElementById("distritoId").value = dataGeneral.distritoId;
  }, [dataDist]);
  useEffect(() => {
    dataGeneral;
    if (Object.entries(dataGeneral).length > 0) {
      if (modo != "Registrar") ListarDireccion();
    }
  }, [dataGeneral]);

  useEffect(() => {
    dataDireccion;
  }, [dataDireccion]);
  useEffect(() => {
    objetoDireccion;
  }, [objetoDireccion]);
  useEffect(() => {
    dataDepDireccion;
    document.getElementById("departamentoId").value =
      dataDireccion.dataDepDireccion;
    ConsultarProvincia();
  }, [dataDepDireccion]);
  useEffect(() => {
    dataProDireccion;
    document.getElementById("provinciaId").value =
      dataDireccion.dataProDireccion;
    ConsultarDistrito();
  }, [dataProDireccion]);
  useEffect(() => {
    dataDisDireccion;
    document.getElementById("distritoId").value = dataGeneral.dataDisDireccion;
  }, [dataDisDireccion]);
  useEffect(() => {
    estadoFormDireccion;
  }, [estadoFormDireccion]);
  useEffect(() => {
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    if (target.name == "departamentoId") {
      await ConsultarProvincia();
      document.getElementById("provinciaId").selectedIndex = 0;
      document
        .getElementById("provinciaId")
        .dispatchEvent(new Event("change", { bubbles: true }));
    }
    if (target.name == "provinciaId") {
      if (target.value != "") {
        await ConsultarDistrito();
        document.getElementById("distritoId").selectedIndex = 0;
        document
          .getElementById("distritoId")
          .dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
    setDataGeneral({ ...dataGeneral, [target.name]: target.value });
  };
  const ValidarDataDirecciones = async ({ target }) => {
    if (target.name == "departamentoId") {
      await ConsultarProvincia();
      document.getElementById("distritoId").selectedIndex = 0;
      document.getElementById("provinciaId").selectedIndex = 0;
    }
    if (target.name == "provinciaId") {
      await ConsultarDistrito();
      document.getElementById("distritoId").selectedIndex = 0;
    }
    setObjetoDireccion({ ...objetoDireccion, [target.name]: target.value });
  };
  function uppercase(e) {
    e.target.value = e.target.value.toUpperCase();
  }
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
    e.preventDefault();
    if (e.target.innerText == "AGREGAR") {
      let model = {
        id: 0,
        clienteId: dataGeneral.id,
        direccion: "",
        departamentoId: "15",
        provinciaId: "01",
        distritoId: "01",
        comentario: "",
        isActivo: true,
      };
      setObjetoDireccion(model);
      setEstadoFormDireccion(true);
    } else {
      await GetDireccion(id);
    }
  };
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Cliente/FormularioTablas`
    );
    setDataTipoDoc(result.data.data.tiposDocumentoIdentidad);
    setDataDep(result.data.data.departamentos);
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
      setData({
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
        autoClose: 5000,
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
        autoClose: 5000,
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
  const ConsultarProvincia = async () => {
    if (Object.entries(dataDep).length > 0) {
      let index = document.getElementById("departamentoId").selectedIndex;
      let model = dataDep[index].provincias.map((res) => ({
        id: res.id,
        nombre: res.nombre,
        distritos: res.distritos,
      }));
      setDataProv(model);
    } else {
      setDataProv([]);
    }
  };
  const ConsultarDistrito = async () => {
    if (
      Object.entries(dataDep).length > 0 &&
      Object.entries(dataProv).length > 0
    ) {
      let index = document.getElementById("provinciaId").selectedIndex;
      let model = dataProv[index].distritos.map((res) => ({
        id: res.id,
        nombre: res.nombre,
      }));
      setDataDist(model);
    } else {
      setDataDist([]);
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
    setEstadoFormDireccion(true);
  };
  //#endregion

  //#region Columnas
  const columnas = [
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
              <div className="w-4 mr-2 transform hover:text-orange-500 hover:scale-125">
                <button
                  id="boton-modificar"
                  onClick={(e) => AgregarDireccion(e, row.values.id)}
                  className="p-0 px-1"
                  title="Click para modificar registro"
                >
                  <FaPen></FaPen>
                </button>
              </div>

              <div className="w-4 mr-2 transform hover:text-red-500 hover:scale-125">
                <button
                  id="boton-eliminar"
                  // onClick={() => Eliminar(id)}
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
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={dataGeneral}
      modo={modo}
      menu={["Mantenimiento", "Cliente"]}
      tamañoModal={[Global.ModalFull, Global.FormTabs]}
    >
      <TabsStyle>
        <Tabs.Group aria-label="Default tabs" style="underline">
          <Tabs.Item active={true} title="Datos Principales">
            <div className="grid gap-y-3 md:gap-x-2">
              <div className={Global.ContenedorVarios}>
                <div className={Global.ContenedorInputMitad}>
                  <label
                    htmlFor="tipoDocumentoIdentidadId"
                    className={Global.LabelStyle}
                  >
                    Tipo Doc
                  </label>
                  <select
                    id="tipoDocumentoIdentidadId"
                    name="tipoDocumentoIdentidadId"
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
                <div className={Global.ContenedorInputMitad}>
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
                    defaultValue={dataGeneral.numeroDocumentoIdentidad}
                    onChange={ValidarData}
                    className={Global.InputBoton}
                  />
                  <button
                    id="consultarApi"
                    hidden={modo == "Consultar" ? true : false}
                    onClick={(e) => ValidarConsultarDocumento(e)}
                    className={Global.BotonBuscar}
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
                  defaultValue={dataGeneral.nombre}
                  onChange={ValidarData}
                  onKeyUp={uppercase}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.ContenedorVarios}>
                <div className={Global.ContenedorInputMitad}>
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
                    defaultValue={dataGeneral.telefono}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.ContenedorInputMitad}>
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
                    defaultValue={dataGeneral.correoElectronico}
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
                  defaultValue={dataGeneral.direccionPrincipal}
                  onChange={ValidarData}
                  onKeyUp={uppercase}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.ContenedorVarios}>
                <div className={Global.ContenedorInputTercio}>
                  <label htmlFor="departamentoId" className={Global.LabelStyle}>
                    Dep.
                  </label>
                  <select
                    id="departamentoId"
                    name="departamentoId"
                    onChange={ValidarData}
                    disabled={modo == "Consultar" ? true : false}
                    className={Global.InputStyle}
                  >
                    {dataDep.map((departamento) => (
                      <option key={departamento.id} value={departamento.id}>
                        {departamento.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={Global.ContenedorInputTercio}>
                  <label htmlFor="provinciaId" className={Global.LabelStyle}>
                    Prov.
                  </label>
                  <select
                    id="provinciaId"
                    name="provinciaId"
                    onChange={ValidarData}
                    disabled={modo == "Consultar" ? true : false}
                    className={Global.InputStyle}
                  >
                    {dataProv.map((provincia) => (
                      <option key={provincia.id} value={provincia.id}>
                        {provincia.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={Global.ContenedorInputTercio}>
                  <label htmlFor="distritoId" className={Global.LabelStyle}>
                    Dist.
                  </label>
                  <select
                    id="distritoId"
                    name="distritoId"
                    onChange={ValidarData}
                    disabled={modo == "Consultar" ? true : false}
                    className={Global.InputStyle}
                  >
                    {Object.entries(dataDist).length > 0 &&
                      dataDist.map((distrito) => (
                        <option key={distrito.id} value={distrito.id}>
                          {distrito.nombre}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </Tabs.Item>
          {modo != "Registrar" ? (
            <Tabs.Item title="Direcciones">
              {/* Boton */}
              {modo == "Consultar" ? (
                ""
              ) : (
                <>
                  <Mensajes
                    tipoMensaje={2}
                    mensaje={[
                      "Cualquier registro, modificación o eliminación de direcciones será guardado automáticamente en la base de datos, usar con precaución.",
                    ]}
                    cerrar={false}
                  />
                  <BotonBasico
                    botonText="Agregar"
                    botonClass="bg-green-700 hover:bg-green-600 hover:text-light"
                    botonIcon={faPlus}
                    click={(e) => {
                      setEstadoFormDireccion(false);
                      AgregarDireccion(e);
                    }}
                  />
                </>
              )}
              {/* Boton */}

              {/* Form Direcciones */}
              {estadoFormDireccion && (
                <div className={Global.FormSecundario}>
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
                      defaultValue={objetoDireccion.direccion}
                      onChange={ValidarDataDirecciones}
                      className={Global.InputStyle}
                    />
                  </div>
                  {/* <div className={Global.ContenedorVarios}>
                    <div className={Global.ContenedorInputTercio}>
                      <label
                        htmlFor="departamentoIdDireccion"
                        className={Global.LabelStyle}
                      >
                        Dep.
                      </label>
                      <select
                        id="departamentoId"
                        name="departamentoId"
                        onChange={ValidarDataDirecciones}
                        disabled={modo == "Consultar" ? true : false}
                        className={Global.InputStyle}
                      >
                        {dataDep.map((departamento) => (
                          <option key={departamento.id} value={departamento.id}>
                            {departamento.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={Global.ContenedorInputTercio}>
                      <label
                        htmlFor="provinciaId"
                        className={Global.LabelStyle}
                      >
                        Prov.
                      </label>
                      <select
                        id="provinciaId"
                        name="provinciaId"
                        onChange={ValidarDataDirecciones}
                        disabled={modo == "Consultar" ? true : false}
                        className={Global.InputStyle}
                      >
                        {dataDep[
                          document.getElementById("departamentoId")
                            .selectedIndex
                        ].provincias.map((provincia) => (
                          <option key={provincia.id} value={provincia.id}>
                            {provincia.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={Global.ContenedorInputTercio}>
                      <label htmlFor="distritoId" className={Global.LabelStyle}>
                        Dist.
                      </label>
                      <select
                        id="distritoId"
                        name="distritoId"
                        onChange={ValidarDataDirecciones}
                        disabled={modo == "Consultar" ? true : false}
                        className={Global.InputStyle}
                      >
                        {dataDist.map((distrito) => (
                          <option key={distrito.id} value={distrito.id}>
                            {distrito.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div> */}
                  {/*footer*/}
                  <div className="flex items-center justify-start">
                    {modo == "Consultar" ? (
                      ""
                    ) : (
                      <button
                        className={Global.BotonOkModal + " py-2 sm:py-1 px-3"}
                        type="button"
                        // onClick={}
                      >
                        Guardar
                      </button>
                    )}
                    <button
                      className={
                        Global.BotonCancelarModal + " py-2 sm:py-1  px-3"
                      }
                      type="button"
                      onClick={() => setEstadoFormDireccion(false)}
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
                <TableBasic columnas={columnas} datos={dataDireccion} />
              </TablaStyle>
              {/* Tabla */}
            </Tabs.Item>
          ) : (
            ""
          )}
          {modo != "Registrar" ? (
            <Tabs.Item title="Contactos">Settings content</Tabs.Item>
          ) : (
            ""
          )}
        </Tabs.Group>
      </TabsStyle>
    </ModalBasic>
  );
  //#endregion
};

export default Modal;
