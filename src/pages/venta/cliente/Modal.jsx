import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import BotonBasico from "../../../components/boton/BotonBasico";
import TableBasic from "../../../components/tabla/TableBasic";
import { Checkbox } from "primereact/checkbox";
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
import * as Global from "../../../components/Global";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(4) {
    width: 90px;
    text-align: center;
  }
  & th:last-child {
    width: 90px;
    max-width: 90px;
    text-align: center;
  }
`;
const TablaPersonal = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    display: none;
  }
  & tbody td:nth-child(2) {
    display: none;
  }
  & th:nth-child(5) {
    width: 100px;
    text-align: center;
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
  const [dataZona, setDataZona] = useState([]);
  const [dataTipoVenta, setDataTipoVenta] = useState([]);
  const [dataTipoCobro, setDataTipoCobro] = useState([]);
  const [dataUbigeo, setDataUbigeo] = useState([]);
  const [tipoMen, setTipoMen] = useState(-1);
  const [men, setMen] = useState([]);
  const [respuesta, setEliminar] = useState(false);

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
      setEliminar(true);
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
    if (modo != "Nuevo") {
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
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value,
      }));
      return;
    }

    if (target.name == "tipoVentaId") {
      let model = dataTipoCobro.find(
        (map) => map.tipoVentaCompraId == target.value
      );
      setData((prevData) => ({
        ...prevData,
        tipoCobroId: model.id,
      }));
    }

    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  const ValidarDataDireccion = async ({ target }) => {
    if (target.name == "isActivo") {
      setObjetoDireccion((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
    } else {
      setObjetoDireccion((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  const ValidarDataContacto = async ({ target }) => {
    setObjetoContacto((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  const ValidarDataPersonal = async ({ target }) => {
    if (target.name == "default") {
      setObjetoPersonal((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
    } else {
      setObjetoPersonal((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
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
  const Limpiar = async () => {
    setMen([]);
    setTipoMen(-1);
    setEliminar(false);
  };
  const LimpiarDireccion = async () => {
    setObjetoDireccion({
      id: 0,
      clienteId: data.id,
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
      clienteId: data.id,
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
      clienteId: data.id,
      personalId: "<<NI>>01",
      default: true,
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
    setDataZona(result.data.data.zonas);
    setDataTipoVenta(result.data.data.tiposVenta);
    setDataTipoCobro(result.data.data.tiposCobro);
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
        ...data,
        numeroDocumentoIdentidad: model.numeroDocumentoIdentidad,
        nombre: model.nombre,
        direccionPrincipal: model.direccionPrincipal,
        departamentoId:
          model.departamentoId == ""
            ? data.departamentoId
            : model.departamentoId,
        provinciaId:
          model.provinciaId == "" ? data.provinciaId : model.provinciaId,
        distritoId: model.distritoId == "" ? data.distritoId : model.distritoId,
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

  const ListarDireccion = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ClienteDireccion/ListarPorCliente?clienteId=${data.id}`
    );
    //Filtrar comentario DIRECCION PRINCIPAL
    setDataDireccion(
      result.data.data.filter((map) => map.comentario != "DIRECCION PRINCIPAL")
    );
  };
  const GetDireccion = async (id) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ClienteDireccion/${id}`
    );
    setObjetoDireccion(result.data.data);
  };
  const EnviarClienteDireccion = async () => {
    if (objetoDireccion.id == 0) {
      let existe = dataDireccion.find(
        (map) => map.direccion == objetoDireccion.direccion
      );
      if (existe == undefined) {
        await Insert(
          ["Mantenimiento", "ClienteDireccion"],
          objetoDireccion,
          setTipoMen,
          setMen
        );
      } else {
        toast.error("Cliente Dirección: Ya existe el registro ingresado", {
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
      `api/Mantenimiento/ClienteContacto/ListarPorCliente?clienteId=${data.id}`
    );
    setDataContacto(result.data.data);
  };
  const GetContacto = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/ClienteContacto/${id}`);
    setObjetoContacto(result.data.data);
  };
  const EnviarClienteContacto = async () => {
    if (objetoContacto.id == 0) {
      let existe = dataContacto.find(
        (map) => map.nombres == objetoContacto.nombres
      );
      if (existe == undefined) {
        await Insert(
          ["Mantenimiento", "ClienteContacto"],
          objetoContacto,
          setTipoMen,
          setMen
        );
      } else {
        toast.error("Cliente Contacto: Ya existe el registro ingresado", {
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
    setDataPersonalCombo(
      result.data.data.personal.map((res) => ({
        id: res.id,
        personal:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
  };
  const ListarPersonal = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ClientePersonal/ListarPorCliente?clienteId=${data.id}`
    );
    setDataPersonal(
      result.data.data.map((res) => ({
        ...res,
        personal:
          res.personal.apellidoPaterno +
          " " +
          res.personal.apellidoMaterno +
          " " +
          res.personal.nombres,
        numeroDocumentoIdentidad: res.personal.numeroDocumentoIdentidad,
      }))
    );
  };
  const GetPersonal = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/ClientePersonal/${id}`);
    setObjetoPersonal(result.data.data);
  };
  const EnviarClientePersonal = async () => {
    if (objetoPersonal.id == 0) {
      let existe = dataPersonal.find(
        (map) => map.personalId == objetoPersonal.personalId
      );
      if (existe == undefined) {
        await Insert(
          ["Mantenimiento", "ClientePersonal"],
          objetoPersonal,
          setTipoMen,
          setMen
        );
      } else {
        toast.error("Cliente Personal: Ya existe el registro ingresado", {
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
                  id="boton"
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
                  onClick={() => {
                    Delete(
                      ["Mantenimiento", "ClienteDireccion"],
                      row.values.id,
                      setEliminar
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
                  id="boton"
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
                      ["Mantenimiento", "ClienteContacto"],
                      row.values.id,
                      setEliminar
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
      Header: "Personal",
      accessor: "personalId",
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
      Header: "Default",
      accessor: "default",
      Cell: ({ value }) => {
        return (
          <div className="flex justify-center">
            <Checkbox checked={value} />
          </div>
        );
      },
    },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <div className="flex item-center justify-center">
          {modo == "Consultar" ? (
            ""
          ) : (
            <>
              {/* <div className={Global.TablaBotonModificar}>
                <button
                  id="boton"
                  onClick={(e) => AgregarPersonal(e, row.values.id)}
                  className="p-0 px-1"
                  title="Click para modificar registro"
                >
                  <FaPen></FaPen>
                </button>
              </div> */}
              <div className={Global.TablaBotonEliminar}>
                <button
                  id="boton-eliminar"
                  onClick={() => {
                    Delete(
                      ["Mantenimiento", "ClientePersonal"],
                      row.values.id.substr(6),
                      setEliminar
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
          menu={["Mantenimiento", "Cliente"]}
          titulo="Cliente"
          foco={document.getElementById("tablaCliente")}
          tamañoModal={[Global.ModalMediano, Global.Form + " pt-0"]}
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
                      placeholder="Código"
                      autoComplete="off"
                      disabled={true}
                      autoFocus={modo == "Consultar"}
                      value={data.id ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputMitad}>
                    <label
                      htmlFor="tipoDocumentoIdentidadId"
                      className={Global.LabelStyle}
                    >
                      T. Documento
                    </label>
                    <select
                      id="tipoDocumentoIdentidadId"
                      name="tipoDocumentoIdentidadId"
                      autoFocus
                      value={data.tipoDocumentoIdentidadId ?? ""}
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
                      placeholder="N° Documento Identidad"
                      autoComplete="off"
                      disabled={modo == "Consultar" ? true : false}
                      value={data.numeroDocumentoIdentidad ?? ""}
                      onChange={ValidarData}
                      className={
                        modo != "Consultar"
                          ? Global.InputBoton
                          : Global.InputStyle
                      }
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
                  <div className={Global.InputFull}>
                    <label htmlFor="zonaId" className={Global.LabelStyle}>
                      Zona
                    </label>
                    <select
                      id="zonaId"
                      name="zonaId"
                      value={data.zonaId ?? ""}
                      onChange={ValidarData}
                      disabled={modo == "Consultar" ? true : false}
                      className={Global.InputStyle}
                    >
                      {dataZona.map((map) => (
                        <option key={map.id} value={map.id}>
                          {map.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex">
                  <label htmlFor="nombre" className={Global.LabelStyle}>
                    Razón Social
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Nombre"
                    autoComplete="off"
                    disabled={modo == "Consultar" ? true : false}
                    value={data.nombre ?? ""}
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
                      placeholder="Teléfono"
                      autoComplete="off"
                      disabled={modo == "Consultar" ? true : false}
                      value={data.telefono ?? ""}
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
                      placeholder="Correo"
                      autoComplete="off"
                      disabled={modo == "Consultar" ? true : false}
                      value={data.correoElectronico ?? ""}
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
                    placeholder="Dirección Principal"
                    autoComplete="off"
                    disabled={modo == "Consultar" ? true : false}
                    value={data.direccionPrincipal ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
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
                  <div className={Global.InputMitad}>
                    <label htmlFor="tipoVentaId" className={Global.LabelStyle}>
                      Tipo Venta
                    </label>
                    <select
                      id="tipoVentaId"
                      name="tipoVentaId"
                      value={data.tipoVentaId ?? ""}
                      onChange={ValidarData}
                      disabled={modo == "Consultar" ? true : false}
                      className={Global.InputStyle}
                    >
                      {dataTipoVenta.map((map) => (
                        <option key={map.id} value={map.id}>
                          {map.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={Global.InputFull}>
                    <label htmlFor="tipoCobroId" className={Global.LabelStyle}>
                      Tipo Cobro
                    </label>
                    <select
                      id="tipoCobroId"
                      name="tipoCobroId"
                      value={data.tipoCobroId ?? ""}
                      onChange={ValidarData}
                      disabled={modo == "Consultar" ? true : false}
                      className={Global.InputStyle}
                    >
                      {dataTipoCobro
                        .filter(
                          (model) => model.tipoVentaCompraId == data.tipoVentaId
                        )
                        .map((map) => (
                          <option key={map.id} value={map.id}>
                            {map.descripcion}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="flex">
                  <label htmlFor="observacion" className={Global.LabelStyle}>
                    Observación
                  </label>
                  <input
                    type="text"
                    id="observacion"
                    name="observacion"
                    placeholder="Observación"
                    autoComplete="off"
                    disabled={modo == "Consultar" ? true : false}
                    value={data.observacion ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>

                <div className={Global.ContenedorBasico}>
                  <div className={Global.ContenedorInputs}>
                    <div className={Global.InputMitad}>
                      <label
                        htmlFor="maximoCreditoUSD"
                        className={Global.LabelStyle}
                      >
                        Máximo US$
                      </label>
                      <input
                        type="number"
                        id="maximoCreditoUSD"
                        name="maximoCreditoUSD"
                        placeholder="Máximo US$"
                        autoComplete="off"
                        min={0}
                        disabled={modo == "Consultar" ? true : false}
                        value={data.maximoCreditoUSD ?? ""}
                        onChange={ValidarData}
                        className={Global.InputStyle}
                      />
                    </div>
                    <div className={Global.InputMitad}>
                      <label htmlFor="creditoUSD" className={Global.LabelStyle}>
                        Crédito US$
                      </label>
                      <input
                        type="number"
                        id="creditoUSD"
                        name="creditoUSD"
                        placeholder="Crédito US$"
                        autoComplete="off"
                        min={0}
                        disabled={true}
                        value={data.creditoUSD ?? ""}
                        onChange={ValidarData}
                        className={Global.InputStyle}
                      />
                    </div>
                  </div>
                  <div className={Global.ContenedorInputs}>
                    <div className={Global.InputMitad}>
                      <label
                        htmlFor="maximoCreditoPEN"
                        className={Global.LabelStyle}
                      >
                        Máximo S/
                      </label>
                      <input
                        type="number"
                        id="maximoCreditoPEN"
                        name="maximoCreditoPEN"
                        placeholder="Máximo S/"
                        autoComplete="off"
                        min={0}
                        disabled={modo == "Consultar" ? true : false}
                        value={data.maximoCreditoPEN ?? ""}
                        onChange={ValidarData}
                        className={Global.InputStyle}
                      />
                    </div>
                    <div className={Global.InputMitad}>
                      <label htmlFor="creditoPEN" className={Global.LabelStyle}>
                        Crédito S/
                      </label>
                      <input
                        type="number"
                        id="creditoPEN"
                        name="creditoPEN"
                        placeholder="Crédito S/"
                        autoComplete="off"
                        min={0}
                        disabled={true}
                        value={data.credicreditoPENtoUSD ?? ""}
                        onChange={ValidarData}
                        className={Global.InputStyle}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            {modo != "Nuevo" ? (
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
                      contenedor=""
                    />
                  </div>
                )}
                {/* Boton */}

                {/* Form Direcciones */}
                {estadoDireccion && (
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
                        <div className={Global.InputFull}>
                          <label
                            htmlFor="direccion"
                            className={Global.LabelStyle}
                          >
                            Dirección
                          </label>
                          <input
                            type="text"
                            id="direccion"
                            name="direccion"
                            placeholder="Dirección secundaria"
                            autoComplete="off"
                            disabled={modo == "Consultar" ? true : false}
                            value={objetoDireccion.direccion ?? ""}
                            onChange={ValidarDataDireccion}
                            className={Global.InputBoton}
                          />
                        </div>
                        <div className={Global.Input + "w-36"}>
                          <div className={Global.CheckStyle + Global.Anidado}>
                            <Checkbox
                              inputId="isActivo"
                              name="isActivo"
                              disabled={modo == "Consultar" ? true : false}
                              value={objetoDireccion.isActivo}
                              onChange={ValidarDataDireccion}
                              checked={objetoDireccion.isActivo ? true : ""}
                            ></Checkbox>
                          </div>
                          <label
                            htmlFor="isActivo"
                            className={Global.LabelCheckStyle}
                          >
                            Activo
                          </label>
                        </div>
                      </div>
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
                    <div className={Global.ContenedorInputs}>
                      <div className={Global.InputFull}>
                        <label
                          htmlFor="comentario"
                          className={Global.LabelStyle}
                        >
                          Comentario
                        </label>
                        <input
                          type="text"
                          id="comentario"
                          name="comentario"
                          placeholder="Comentario"
                          autoComplete="off"
                          disabled={modo == "Consultar" ? true : false}
                          value={objetoDireccion.comentario ?? ""}
                          onChange={ValidarDataDireccion}
                          className={Global.InputStyle}
                        />
                      </div>
                    </div>
                    {/*footer*/}
                    <div className="flex items-center justify-start">
                      {modo == "Consultar" ? (
                        ""
                      ) : (
                        <button
                          type="button"
                          onClick={EnviarClienteDireccion}
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
                        onClick={() => setEstadoDireccion(false)}
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
            {modo != "Nuevo" ? (
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
                      contenedor=""
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
                          placeholder="Nombres"
                          autoComplete="off"
                          disabled={modo == "Consultar" ? true : false}
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
                          placeholder="N° Documento Identidad"
                          autoComplete="off"
                          maxLength="15"
                          disabled={modo == "Consultar" ? true : false}
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
                          placeholder="Celular"
                          autoComplete="off"
                          maxLength="15"
                          disabled={modo == "Consultar" ? true : false}
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
                          placeholder="Teléfono"
                          autoComplete="off"
                          maxLength="15"
                          disabled={modo == "Consultar" ? true : false}
                          value={objetoContacto.telefono ?? ""}
                          onChange={ValidarDataContacto}
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
                          placeholder="Correo"
                          name="correoElectronico"
                          autoComplete="off"
                          disabled={modo == "Consultar" ? true : false}
                          value={objetoContacto.correoElectronico ?? ""}
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
                        placeholder="Dirección"
                        autoComplete="off"
                        disabled={modo == "Consultar" ? true : false}
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
            {modo != "Nuevo" ? (
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
                      contenedor=""
                    />
                  </div>
                )}
                {/* Boton */}

                {/* Form Personal */}
                {estadoPersonal && (
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
                            className={Global.InputBoton}
                          >
                            {dataPersonalCombo.map((personal) => (
                              <option key={personal.id} value={personal.id}>
                                {personal.personal}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className={Global.Input + "w-32"}>
                          <div className={Global.CheckStyle + Global.Anidado}>
                            <Checkbox
                              inputId="default"
                              name="default"
                              disabled={modo == "Consultar" ? true : false}
                              value={objetoPersonal.default}
                              onChange={ValidarDataPersonal}
                              checked={objetoPersonal.default ? true : ""}
                            ></Checkbox>
                          </div>
                          <label
                            htmlFor="default"
                            className={Global.LabelCheckStyle}
                          >
                            Default
                          </label>
                        </div>
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
                        onClick={() => setEstadoPersonal(false)}
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
                {/* Form Personal */}

                {/* Tabla */}
                <TablaPersonal>
                  <TableBasic columnas={colPersonal} datos={dataPersonal} />
                </TablaPersonal>
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
