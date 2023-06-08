import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import Get from "../../../components/funciones/Get";
import ModalCrud from "../../../components/modal/ModalCrud";
import BotonBasico from "../../../components/boton/BotonBasico";
import TableBasic from "../../../components/tabla/TableBasic";
import { TabView, TabPanel } from "primereact/tabview";
import Ubigeo from "../../../components/filtro/Ubigeo";
import Insert from "../../../components/funciones/Insert";
import Update from "../../../components/funciones/Update";
import Delete from "../../../components/funciones/Delete";
import Mensajes from "../../../components/funciones/Mensajes";
import { toast } from "react-toastify";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaSearch, FaPen, FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import * as G from "../../../components/Global";
import * as Funciones from "../../../components/funciones/Validaciones";

//#region Estilos
const DivTabla = styled.div`
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
    width: 100px;
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
  const [respuesta, setListar] = useState(false);

  const [dataCcorriente, setDataCcorriente] = useState([]);
  const [dataCcorrienteMoneda, setDataCcorrienteMoneda] = useState([]);
  const [dataCcorrienteEntidad, setDataCcorrienteEntidad] = useState([]);
  const [objetoCcorriente, setObjetoCcorriente] = useState([]);
  const [habilitarCuentaCorriente, setHabilitarCuentaCorriente] =
    useState(false);

  const [dataContacto, setDataContacto] = useState([]);
  const [dataContactoCargo, setDataContactoCargo] = useState([]);
  const [objetoContacto, setObjetoContacto] = useState([]);
  const [habilitarContacto, setHabilitarContacto] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (tipoMen == 0) {
      setListar(true);
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
    GetTablas();
    if (modo != "Nuevo") {
      ListarCcorriente();
      ListarContacto();
      TablasCargo();
      TablasCcorriente();
    }
  }, []);
  //#endregion

  //#region Funciones
  const HandleData = async ({ target }) => {
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
    GetDocumento(tipo, documento);
  };
  const AgregarCuentaCorriente = async (value = 0, e = null, click = false) => {
    if (modo != "Consultar") {
      await Limpiar();
      if (click) {
        let row = value.target.closest("tr");
        let id = row.firstChild.innerText;
        await GetCcorriente(id);
      } else {
        if (e.target.innerText == "AGREGAR") {
          await LimpiarCcorriente();
        } else {
          await GetCcorriente(id);
        }
      }
      setHabilitarCuentaCorriente(true);
      if (habilitarCuentaCorriente) {
        document.getElementById("monedaIdCuenta").focus();
      }
    }
  };
  const AgregarContacto = async (value = 0, e = null, click = false) => {
    if (modo != "Consultar") {
      await Limpiar();
      if (click) {
        let row = value.target.closest("tr");
        let id = row.firstChild.innerText;
        await GetContacto(id);
      } else {
        if (e.target.innerText == "AGREGAR") {
          await LimpiarContacto();
        } else {
          await GetContacto(id);
        }
      }
      setHabilitarContacto(true);
      if (habilitarContacto) {
        document.getElementById("nombresContacto").focus();
      }
    }
  };
  const Limpiar = async () => {
    setMen([]);
    setTipoMen(-1);
    setListar(false);
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
    setHabilitarContacto(false);
    setHabilitarCuentaCorriente(false);
  };
  //#endregion

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Proveedor/FormularioTablas`
    );
    setDataTipoDoc(result.data.data.tiposDocumentoIdentidad);

    if (modo == "Nuevo") {
      //Datos Iniciales
      let tiposDocumentoIdentidad =
        result.data.data.tiposDocumentoIdentidad.find((map) => map);
      //Datos Iniciales
      setData((prev) => ({
        ...prev,
        tipoDocumentoIdentidadId: tiposDocumentoIdentidad.id,
      }));
    }
  };
  const GetDocumento = async (tipo, documento) => {
    document.getElementById("consultarApi").hidden = true;
    const result = await Get(
      `Servicio/ConsultarRucDni?tipo=${tipo}&numeroDocumentoIdentidad=${documento}`,
      "Datos extraídos exitosamente."
    );
    if (result == undefined) {
      document.getElementById("consultarApi").hidden = false;
      document.getElementById("numeroDocumentoIdentidad").focus();
    } else {
      setData({
        ...data,
        numeroDocumentoIdentidad: result.numeroDocumentoIdentidad,
        nombre: result.nombre,
        direccionPrincipal: result.direccion,
      });
      document.getElementById("consultarApi").hidden = false;
      document.getElementById("nombreProveedor").focus();
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
        document.getElementById("monedaIdCuenta").focus();
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
              <div className={G.TablaBotonModificar}>
                <button
                  id="boton"
                  onClick={(e) => AgregarCuentaCorriente(row.values.id, e)}
                  className="p-0 px-1"
                  title="Click para modificar registro"
                >
                  <FaPen></FaPen>
                </button>
              </div>

              <div className={G.TablaBotonEliminar}>
                <button
                  id="botonEliminarFila"
                  onClick={() => {
                    Delete(
                      ["Mantenimiento", "ProveedorCuentaCorriente"],
                      row.values.id,
                      setListar
                    );
                  }}
                  className="p-0 px-1"
                  title="Click para Eliminar registro"
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
              <div className={G.TablaBotonModificar}>
                <button
                  id="boton"
                  onClick={(e) => AgregarContacto(row.values.id, e)}
                  className="p-0 px-1"
                  title="Click para modificar registro"
                >
                  <FaPen></FaPen>
                </button>
              </div>

              <div className={G.TablaBotonEliminar}>
                <button
                  id="botonEliminarFila"
                  onClick={() => {
                    Delete(
                      ["Mantenimiento", "ProveedorContacto"],
                      row.values.id,
                      setListar
                    );
                  }}
                  className="p-0 px-1"
                  title="Click para Eliminar registro"
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
          menu={"Mantenimiento/Proveedor"}
          titulo="Proveedor"
          foco={document.getElementById("tablaProveedor")}
          tamañoModal={[G.ModalMediano, G.Form + "pt-0 "]}
        >
          <TabView>
            <TabPanel
              header="Datos Principales"
              leftIcon="pi pi-user mr-2"
              style={{ color: "green" }}
            >
              <div className={G.ContenedorBasico + " mt-4"}>
                <div className={G.ContenedorInputs}>
                  {modo != "Nuevo" && (
                    <div className={G.InputMitad}>
                      <label htmlFor="id" className={G.LabelStyle}>
                        Código
                      </label>
                      <input
                        type="text"
                        id="id"
                        name="id"
                        placeholder="Código"
                        autoComplete="off"
                        value={data.id ?? ""}
                        onChange={HandleData}
                        disabled={true}
                        className={G.InputStyle}
                      />
                    </div>
                  )}
                  <div className={G.InputFull}>
                    <label htmlFor="condicion" className={G.LabelStyle}>
                      Condición
                    </label>
                    <input
                      type="text"
                      id="condicion"
                      name="condicion"
                      placeholder="Condición"
                      autoComplete="off"
                      autoFocus
                      disabled={modo == "Consultar"}
                      value={data.condicion ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.InputFull}>
                    <label htmlFor="estado" className={G.LabelStyle}>
                      Estado
                    </label>
                    <input
                      type="text"
                      id="estado"
                      name="estado"
                      placeholder="Estado"
                      autoComplete="off"
                      disabled={modo == "Consultar"}
                      value={data.estado ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                </div>
                <div className={G.ContenedorInputs}>
                  <div className={G.InputMitad}>
                    <label
                      htmlFor="tipoDocumentoIdentidadId"
                      className={G.LabelStyle}
                    >
                      Tipo Doc
                    </label>
                    <select
                      id="tipoDocumentoIdentidadId"
                      name="tipoDocumentoIdentidadId"
                      value={data.tipoDocumentoIdentidadId ?? ""}
                      onChange={HandleData}
                      disabled={modo == "Consultar"}
                      className={G.InputStyle}
                    >
                      {dataTipoDoc.map((map) => (
                        <option key={map.id} value={map.id}>
                          {map.abreviatura}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={G.InputMitad}>
                    <label
                      htmlFor="numeroDocumentoIdentidad"
                      className={G.LabelStyle}
                    >
                      Número Doc
                    </label>
                    <input
                      type="text"
                      id="numeroDocumentoIdentidad"
                      name="numeroDocumentoIdentidad"
                      placeholder="Número Documento Identidad"
                      autoComplete="off"
                      maxLength={data.tipoDocumentoIdentidadId == "1" ? 8 : 12}
                      disabled={modo == "Consultar"}
                      value={data.numeroDocumentoIdentidad ?? ""}
                      onChange={HandleData}
                      className={
                        modo == "Consultar" ? G.InputStyle : G.InputBoton
                      }
                    />
                    <button
                      id="consultarApi"
                      hidden={modo == "Consultar"}
                      onKeyDown={(e) => Funciones.KeyClick(e)}
                      onClick={(e) => ValidarConsultarDocumento(e)}
                      className={G.BotonBuscar + G.Anidado + G.BotonPrimary}
                    >
                      <FaSearch></FaSearch>
                    </button>
                  </div>
                </div>
                <div className={G.ContenedorInputs}>
                  <div className={G.InputFull}>
                    <label htmlFor="nombre" className={G.LabelStyle}>
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombreProveedor"
                      name="nombre"
                      placeholder="Nombre"
                      autoComplete="off"
                      disabled={modo == "Consultar"}
                      value={data.nombre ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                </div>
                <div className={G.ContenedorInputs}>
                  <div className={G.InputMitad}>
                    <label htmlFor="telefono" className={G.LabelStyle}>
                      Teléfono
                    </label>
                    <input
                      type="text"
                      id="telefono"
                      name="telefono"
                      placeholder="Teléfono"
                      autoComplete="off"
                      disabled={modo == "Consultar"}
                      value={data.telefono ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.InputMitad}>
                    <label htmlFor="celular" className={G.LabelStyle}>
                      Telef. Fax. N°
                    </label>
                    <input
                      type="text"
                      id="celular"
                      name="celular"
                      placeholder="Telef. Fax. N°"
                      autoComplete="off"
                      disabled={modo == "Consultar"}
                      value={data.celular ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                </div>
                <div className={G.ContenedorInputs}>
                  <div className={G.InputFull}>
                    <label htmlFor="correoElectronico" className={G.LabelStyle}>
                      Correo
                    </label>
                    <input
                      type="text"
                      id="correoElectronico"
                      name="correoElectronico"
                      placeholder="Correo"
                      autoComplete="off"
                      disabled={modo == "Consultar"}
                      value={data.correoElectronico ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                </div>
                <div className={G.ContenedorInputs}>
                  <div className={G.InputFull}>
                    <label
                      htmlFor="direccionPrincipal"
                      className={G.LabelStyle}
                    >
                      Dirección
                    </label>
                    <input
                      type="text"
                      id="direccionPrincipal"
                      name="direccionPrincipal"
                      placeholder="Dirección Principal"
                      autoComplete="off"
                      disabled={modo == "Consultar"}
                      value={data.direccionPrincipal ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle}
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
                <div className={G.ContenedorInputs}>
                  <div className={G.InputFull}>
                    <label htmlFor="observacion" className={G.LabelStyle}>
                      Observación
                    </label>
                    <input
                      type="text"
                      id="observacion"
                      name="observacion"
                      placeholder="Observación"
                      autoComplete="off"
                      disabled={modo == "Consultar"}
                      value={data.observacion ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                </div>
              </div>
            </TabPanel>
            {modo != "Nuevo" ? (
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
                      mensaje={[G.MensajeInformacion]}
                      cerrar={false}
                    />
                    <BotonBasico
                      botonText="Agregar"
                      botonClass={G.BotonVerde}
                      botonIcon={faPlus}
                      autoFoco={true}
                      click={(e) => {
                        AgregarCuentaCorriente(null, e);
                      }}
                      contenedor=""
                    />
                  </div>
                )}
                {/* Boton */}

                {/* Form Cuenta Corriente */}
                {habilitarCuentaCorriente && (
                  <div
                    className={
                      G.ContenedorBasico + G.FondoContenedor + " pb-1 mb-2"
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

                    <div className={G.ContenedorInputs}>
                      <div className={G.Input40pct}>
                        <label htmlFor="monedaId" className={G.LabelStyle}>
                          Moneda
                        </label>
                        <select
                          id="monedaIdCuenta"
                          name="monedaId"
                          autoFocus={habilitarCuentaCorriente}
                          value={objetoCcorriente.monedaId ?? ""}
                          onChange={ValidarDataCcorriente}
                          disabled={modo == "Consultar"}
                          className={G.InputStyle}
                        >
                          {dataCcorrienteMoneda.map((map) => (
                            <option key={map.id} value={map.id}>
                              {map.abreviatura}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={G.InputFull}>
                        <label htmlFor="numero" className={G.LabelStyle}>
                          Número
                        </label>
                        <input
                          type="text"
                          id="numero"
                          name="numero"
                          placeholder="Número"
                          autoComplete="off"
                          maxLength="60"
                          disabled={modo == "Consultar"}
                          value={objetoCcorriente.numero ?? ""}
                          onChange={ValidarDataCcorriente}
                          className={G.InputStyle}
                        />
                      </div>
                    </div>
                    <div className="flex">
                      <label
                        htmlFor="entidadBancariaId"
                        className={G.LabelStyle}
                      >
                        E.B.
                      </label>
                      <select
                        id="entidadBancariaId"
                        name="entidadBancariaId"
                        value={objetoCcorriente.entidadBancariaId ?? ""}
                        onChange={ValidarDataCcorriente}
                        disabled={modo == "Consultar"}
                        className={G.InputStyle}
                      >
                        {dataCcorrienteEntidad.map((map) => (
                          <option key={map.id} value={map.id}>
                            {map.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-start gap-x-2">
                      {modo == "Consultar" ? (
                        ""
                      ) : (
                        <button
                          type="button"
                          onKeyDown={(e) => Funciones.KeyClick(e)}
                          onClick={EnviarCcorriente}
                          className={
                            G.BotonModalBase +
                            G.BotonOkModal +
                            " py-2 sm:py-1 px-3"
                          }
                        >
                          Guardar
                        </button>
                      )}
                      <button
                        type="button"
                        className={
                          G.BotonModalBase +
                          G.BotonCerrarModal +
                          " py-2 sm:py-1  px-3"
                        }
                        onKeyDown={(e) => Funciones.KeyClick(e)}
                        onClick={() => setHabilitarCuentaCorriente(false)}
                      >
                        CERRAR
                      </button>
                    </div>
                    {/*footer*/}
                  </div>
                )}
                {/* Form Cuenta Corriente */}

                {/* Tabla */}
                <DivTabla>
                  <TableBasic
                    id="tablaCuentaCorrienteProveedor"
                    columnas={colCcorriente}
                    datos={dataCcorriente}
                    DobleClick={(e) => AgregarCuentaCorriente(e, null, true)}
                  />
                </DivTabla>
                {/* Tabla */}
              </TabPanel>
            ) : (
              ""
            )}
            {modo != "Nuevo" ? (
              <TabPanel header="Contactos" leftIcon="pi pi-user mr-2">
                {/* Boton */}
                {modo == "Consultar" ? (
                  ""
                ) : (
                  <div className="my-4">
                    <Mensajes
                      tipoMensaje={2}
                      mensaje={[G.MensajeInformacion]}
                      cerrar={false}
                    />
                    <BotonBasico
                      botonText="Agregar"
                      botonClass={G.BotonVerde}
                      botonIcon={faPlus}
                      autoFoco={true}
                      click={(e) => {
                        AgregarContacto(null, e);
                      }}
                      contenedor=""
                    />
                  </div>
                )}
                {/* Boton */}

                {/* Form Contactos */}
                {habilitarContacto && (
                  <div
                    className={
                      G.ContenedorBasico + G.FondoContenedor + " pb-1 mb-2"
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

                    <div className={G.ContenedorInputs}>
                      <div className={G.InputFull}>
                        <label htmlFor="nombres" className={G.LabelStyle}>
                          Nombres
                        </label>
                        <input
                          type="text"
                          id="nombresContacto"
                          name="nombres"
                          placeholder="Nombres"
                          autoComplete="off"
                          autoFocus={habilitarContacto}
                          disabled={modo == "Consultar"}
                          value={objetoContacto.nombres ?? ""}
                          onChange={ValidarDataContacto}
                          className={G.InputStyle}
                        />
                      </div>
                      <div className={G.Input96}>
                        <label
                          htmlFor="numeroDocumentoIdentidad"
                          className={G.LabelStyle}
                        >
                          DNI
                        </label>
                        <input
                          type="text"
                          id="numeroDocumentoIdentidad"
                          name="numeroDocumentoIdentidad"
                          placeholder="N° Documento Identidad"
                          autoComplete="off"
                          maxLength="15"
                          disabled={modo == "Consultar"}
                          value={objetoContacto.numeroDocumentoIdentidad ?? ""}
                          onChange={ValidarDataContacto}
                          className={G.InputStyle}
                        />
                      </div>
                    </div>

                    <div className={G.ContenedorInputs}>
                      <div className={G.InputFull}>
                        <label htmlFor="cargoId" className={G.LabelStyle}>
                          Cargo
                        </label>
                        <select
                          id="cargoId"
                          name="cargoId"
                          value={objetoContacto.cargoId ?? ""}
                          onChange={ValidarDataContacto}
                          disabled={modo == "Consultar"}
                          className={G.InputStyle}
                        >
                          {dataContactoCargo.map((cargo) => (
                            <option key={cargo.id} value={cargo.id}>
                              {cargo.descripcion}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={G.Input96}>
                        <label htmlFor="celular" className={G.LabelStyle}>
                          Celular
                        </label>
                        <input
                          type="text"
                          id="celular"
                          name="celular"
                          placeholder="Celular"
                          autoComplete="off"
                          maxLength="15"
                          disabled={modo == "Consultar"}
                          value={objetoContacto.celular ?? ""}
                          onChange={ValidarDataContacto}
                          className={G.InputStyle}
                        />
                      </div>
                    </div>

                    <div className={G.ContenedorInputs}>
                      <div className={G.Input96}>
                        <label htmlFor="telefono" className={G.LabelStyle}>
                          Telefono
                        </label>
                        <input
                          type="text"
                          id="telefono"
                          name="telefono"
                          placeholder="Teléfono"
                          autoComplete="off"
                          maxLength="15"
                          disabled={modo == "Consultar"}
                          value={objetoContacto.telefono ?? ""}
                          onChange={ValidarDataContacto}
                          className={G.InputStyle}
                        />
                      </div>
                      <div className={G.InputFull}>
                        <label htmlFor="correo" className={G.LabelStyle}>
                          Correo
                        </label>
                        <input
                          type="text"
                          id="correo"
                          name="correo"
                          placeholder="Correo"
                          autoComplete="off"
                          disabled={modo == "Consultar"}
                          value={objetoContacto.correo ?? ""}
                          onChange={ValidarDataContacto}
                          className={G.InputStyle}
                        />
                      </div>
                    </div>

                    <div className="flex">
                      <label htmlFor="direccion" className={G.LabelStyle}>
                        Dirección
                      </label>
                      <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        placeholder="Dirección"
                        autoComplete="off"
                        disabled={modo == "Consultar"}
                        value={objetoContacto.direccion ?? ""}
                        onChange={ValidarDataContacto}
                        className={G.InputStyle}
                      />
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-start">
                      {modo == "Consultar" ? (
                        ""
                      ) : (
                        <button
                          type="button"
                          onKeyDown={(e) => Funciones.KeyClick(e)}
                          onClick={EnviarContacto}
                          className={
                            G.BotonModalBase +
                            G.BotonOkModal +
                            " py-2 sm:py-1 px-3"
                          }
                        >
                          Guardar
                        </button>
                      )}
                      <button
                        type="button"
                        onKeyDown={(e) => Funciones.KeyClick(e)}
                        onClick={() => setHabilitarContacto(false)}
                        className={
                          G.BotonModalBase +
                          G.BotonCerrarModal +
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
                <DivTabla>
                  <TableBasic
                    id="tablaContactoProveedor"
                    columnas={colContacto}
                    datos={dataContacto}
                    DobleClick={(e) => AgregarContacto(e, null, true)}
                  />
                </DivTabla>
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
