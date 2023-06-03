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
  const [objDireccion, setObjDireccion] = useState([]);
  const [dataUbiDirec, setDataUbiDirec] = useState([]);
  const [habilitarDireccion, setHabilitarDireccion] = useState(false);

  const [dataContacto, setDataContacto] = useState([]);
  const [dataContactoCargo, setDataContactoCargo] = useState([]);
  const [objContacto, setObjContacto] = useState([]);
  const [habilitarContacto, setHabilitarContacto] = useState(false);

  const [dataPersonal, setDataPersonal] = useState([]);
  const [dataPersonalCombo, setDataPersonalCombo] = useState([]);
  const [objPersonal, setObjPersonal] = useState([]);
  const [habilitarPersonal, setHabilitarPersonal] = useState(false);
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
      setObjDireccion({
        ...objDireccion,
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
      TablasContacto();
      TablasPersonal();
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
      setObjDireccion((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
    } else {
      setObjDireccion((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  const ValidarDataContacto = async ({ target }) => {
    setObjContacto((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  const ValidarDataPersonal = async ({ target }) => {
    if (target.name == "default") {
      setObjPersonal((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
    } else {
      setObjPersonal((prevState) => ({
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
    GetDocumento(`?tipo=${tipo}&numeroDocumentoIdentidad=${documento}`);
  };
  const AgregarDireccion = async (value = 0, e = null, click = false) => {
    if (modo != "Consultar") {
      await Limpiar();
      if (click) {
        let row = value.target.closest("tr");
        let id = row.firstChild.innerText;
        await GetDireccion(id);
      } else {
        if (e.target.innerText == "AGREGAR") {
          await LimpiarDireccion();
        } else {
          await GetDireccion(value);
        }
      }
      setHabilitarDireccion(true);
      if (habilitarDireccion) {
        document.getElementById("direccionDireccion").focus();
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
          await GetContacto(value);
        }
      }
      setHabilitarContacto(true);
      if (habilitarContacto) {
        document.getElementById("nombresContacto").focus();
      }
    }
  };
  const AgregarPersonal = async (e, id = 0) => {
    await Limpiar(e);
    if (e.target.innerText == "AGREGAR") {
      await LimpiarPersonal();
    } else {
      await GetPersonal(id);
    }
    setHabilitarPersonal(true);
  };
  const Limpiar = async () => {
    setMen([]);
    setTipoMen(-1);
    setEliminar(false);
  };
  const LimpiarDireccion = async () => {
    setObjDireccion({
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
    setObjContacto({
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
    setObjPersonal({
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
    setHabilitarDireccion(false);
    setHabilitarContacto(false);
    setHabilitarPersonal(false);
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
  const GetDocumento = async (filtroApi = "") => {
    document.getElementById("consultarApi").hidden = true;
    const result = await ApiMasy.get(
      `api/Servicio/ConsultarRucDni${filtroApi}`
    );
    if (result.name == "AxiosError") {
      let err = "";
      if (result.response.data == "") {
        err = result.message;
      } else {
        err = String(result.response.data.messages[0].textos);
      }
      toast.error(err, {
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
      document.getElementById("numeroDocumentoIdentidad").focus();
    } else {
      setData({
        ...data,
        numeroDocumentoIdentidad: result.data.data.numeroDocumentoIdentidad,
        nombre: result.data.data.nombre,
        direccionPrincipal: result.data.data.direccionPrincipal,
        departamentoId:
          result.data.data.departamentoId == ""
            ? data.departamentoId
            : result.data.data.departamentoId,
        provinciaId:
          result.data.data.provinciaId == ""
            ? data.provinciaId
            : result.data.data.provinciaId,
        distritoId:
          result.data.data.distritoId == ""
            ? data.distritoId
            : result.data.data.distritoId,
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
      document.getElementById("zonaId").focus();
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
    setObjDireccion(result.data.data);
  };
  const EnviarClienteDireccion = async () => {
    if (objDireccion.id == 0) {
      let existe = dataDireccion.find(
        (map) => map.direccion == objDireccion.direccion
      );
      if (existe == undefined) {
        await Insert(
          ["Mantenimiento", "ClienteDireccion"],
          objDireccion,
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
        objDireccion,
        setTipoMen,
        setMen
      );
    }
  };

  const TablasContacto = async () => {
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
    setObjContacto(result.data.data);
  };
  const EnviarClienteContacto = async () => {
    if (objContacto.id == 0) {
      let existe = dataContacto.find(
        (map) => map.nombres == objContacto.nombres
      );
      if (existe == undefined) {
        await Insert(
          ["Mantenimiento", "ClienteContacto"],
          objContacto,
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
        objContacto,
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
    setObjPersonal(result.data.data);
  };
  const EnviarClientePersonal = async () => {
    if (objPersonal.id == 0) {
      let existe = dataPersonal.find(
        (map) => map.personalId == objPersonal.personalId
      );
      if (existe == undefined) {
        await Insert(
          ["Mantenimiento", "ClientePersonal"],
          objPersonal,
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
        objPersonal,
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
              <div className={G.TablaBotonModificar}>
                <button
                  id="boton"
                  onClick={(e) => AgregarDireccion(row.values.id, e)}
                  className="p-0 px-1"
                  title="Click para modificar registro"
                >
                  <FaPen></FaPen>
                </button>
              </div>

              <div className={G.TablaBotonEliminar}>
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
              {/* <div className={G.TablaBotonModificar}>
                <button
                  id="boton"
                  onClick={(e) => AgregarPersonal(e, row.values.id)}
                  className="p-0 px-1"
                  title="Click para modificar registro"
                >
                  <FaPen></FaPen>
                </button>
              </div> */}
              <div className={G.TablaBotonEliminar}>
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
          tamañoModal={[G.ModalMediano, G.Form + " pt-0"]}
        >
          <TabView>
            <TabPanel
              header="Datos Principales"
              leftIcon="pi pi-user mr-2"
              style={{ color: "green" }}
            >
              <div className={G.ContenedorBasico + " mt-4"}>
                <div className={G.ContenedorInputs}>
                  <div className={G.Input25pct}>
                    <label htmlFor="id" className={G.LabelStyle}>
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
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.InputMitad}>
                    <label
                      htmlFor="tipoDocumentoIdentidadId"
                      className={G.LabelStyle}
                    >
                      T. Documento
                    </label>
                    <select
                      id="tipoDocumentoIdentidadId"
                      name="tipoDocumentoIdentidadId"
                      autoFocus
                      value={data.tipoDocumentoIdentidadId ?? ""}
                      onChange={HandleData}
                      disabled={modo == "Consultar"}
                      className={G.InputStyle}
                    >
                      {dataTipoDoc.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.abreviatura}
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
                      placeholder="N° Documento Identidad"
                      autoComplete="off"
                      disabled={modo == "Consultar"}
                      value={data.numeroDocumentoIdentidad ?? ""}
                      onChange={HandleData}
                      className={
                        modo != "Consultar"
                          ? G.InputBoton
                          : G.InputStyle
                      }
                    />
                    <button
                      id="consultarApi"
                      hidden={modo == "Consultar"}
                      onKeyDown={(e) => Funciones.KeyClick(e)}
                      onClick={(e) => ValidarConsultarDocumento(e)}
                      className={
                        G.BotonBuscar +
                        G.Anidado +
                        G.BotonPrimary
                      }
                    >
                      <FaSearch></FaSearch>
                    </button>
                  </div>
                </div>
                <div className={G.ContenedorInputs}>
                  <div className={G.InputFull}>
                    <label htmlFor="zonaId" className={G.LabelStyle}>
                      Zona
                    </label>
                    <select
                      id="zonaId"
                      name="zonaId"
                      value={data.zonaId ?? ""}
                      onChange={HandleData}
                      disabled={modo == "Consultar"}
                      className={G.InputStyle}
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
                  <label htmlFor="nombre" className={G.LabelStyle}>
                    Razón Social
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Nombre"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.nombre ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.ContenedorInputs}>
                  <div className={G.Input96}>
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
                  <div className={G.InputFull}>
                    <label
                      htmlFor="correoElectronico"
                      className={G.LabelStyle}
                    >
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
                <div className="flex">
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
                  <div className={G.InputMitad}>
                    <label htmlFor="tipoVentaId" className={G.LabelStyle}>
                      Tipo Venta
                    </label>
                    <select
                      id="tipoVentaId"
                      name="tipoVentaId"
                      value={data.tipoVentaId ?? ""}
                      onChange={HandleData}
                      disabled={modo == "Consultar"}
                      className={G.InputStyle}
                    >
                      {dataTipoVenta.map((map) => (
                        <option key={map.id} value={map.id}>
                          {map.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={G.InputFull}>
                    <label htmlFor="tipoCobroId" className={G.LabelStyle}>
                      Tipo Cobro
                    </label>
                    <select
                      id="tipoCobroId"
                      name="tipoCobroId"
                      value={data.tipoCobroId ?? ""}
                      onChange={HandleData}
                      disabled={modo == "Consultar"}
                      className={G.InputStyle}
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

                <div className={G.ContenedorBasico}>
                  <div className={G.ContenedorInputs}>
                    <div className={G.InputMitad}>
                      <label
                        htmlFor="maximoCreditoUSD"
                        className={G.LabelStyle}
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
                        disabled={modo == "Consultar"}
                        value={data.maximoCreditoUSD ?? ""}
                        onChange={HandleData}
                        className={G.InputStyle}
                      />
                    </div>
                    <div className={G.InputMitad}>
                      <label htmlFor="creditoUSD" className={G.LabelStyle}>
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
                        onChange={HandleData}
                        className={G.InputStyle}
                      />
                    </div>
                  </div>
                  <div className={G.ContenedorInputs}>
                    <div className={G.InputMitad}>
                      <label
                        htmlFor="maximoCreditoPEN"
                        className={G.LabelStyle}
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
                        disabled={modo == "Consultar"}
                        value={data.maximoCreditoPEN ?? ""}
                        onChange={HandleData}
                        className={G.InputStyle}
                      />
                    </div>
                    <div className={G.InputMitad}>
                      <label htmlFor="creditoPEN" className={G.LabelStyle}>
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
                        onChange={HandleData}
                        className={G.InputStyle}
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
                      botonClass={G.BotonAgregar}
                      botonIcon={faPlus}
                      autoFoco={true}
                      click={(e) => {
                        AgregarDireccion(null, e);
                      }}
                      contenedor=""
                    />
                  </div>
                )}
                {/* Boton */}

                {/* Form Direcciones */}
                {habilitarDireccion && (
                  <div
                    className={
                      G.ContenedorBasico +
                      G.FondoContenedor +
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
                    <div className={G.ContenedorInputs}>
                      <div className={G.InputFull}>
                        <div className={G.InputFull}>
                          <label
                            htmlFor="direccion"
                            className={G.LabelStyle}
                          >
                            Dirección
                          </label>
                          <input
                            type="text"
                            id="direccionDireccion"
                            name="direccionContacto"
                            placeholder="Dirección secundaria"
                            autoComplete="off"
                            autoFocus={habilitarDireccion}
                            disabled={modo == "Consultar"}
                            value={objDireccion.direccion ?? ""}
                            onChange={ValidarDataDireccion}
                            className={G.InputBoton}
                          />
                        </div>
                        <div className={G.Input + "w-36"}>
                          <div className={G.CheckStyle + G.Anidado}>
                            <Checkbox
                              inputId="isActivo"
                              name="isActivo"
                              disabled={modo == "Consultar"}
                              value={objDireccion.isActivo}
                              onChange={ValidarDataDireccion}
                              checked={objDireccion.isActivo ? true : ""}
                            ></Checkbox>
                          </div>
                          <label
                            htmlFor="isActivo"
                            className={G.LabelCheckStyle}
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
                        departamentoId: objDireccion.departamentoId,
                        provinciaId: objDireccion.provinciaId,
                        distritoId: objDireccion.distritoId,
                      }}
                    ></Ubigeo>
                    <div className={G.ContenedorInputs}>
                      <div className={G.InputFull}>
                        <label
                          htmlFor="comentario"
                          className={G.LabelStyle}
                        >
                          Comentario
                        </label>
                        <input
                          type="text"
                          id="comentario"
                          name="comentario"
                          placeholder="Comentario"
                          autoComplete="off"
                          disabled={modo == "Consultar"}
                          value={objDireccion.comentario ?? ""}
                          onChange={ValidarDataDireccion}
                          className={G.InputStyle}
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
                          id="enviarClientDireccion"
                          onKeyDown={(e) => Funciones.KeyClick(e)}
                          onClick={EnviarClienteDireccion}
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
                        id="cerrarClienteDireccion"
                        onKeyDown={(e) => Funciones.KeyClick(e)}
                        onClick={() => setHabilitarDireccion(false)}
                        className={
                          G.BotonModalBase +
                          G.BotonCancelarModal +
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
                <DivTabla>
                  <TableBasic
                    id="tablaDireccionCliente"
                    columnas={colDireccion}
                    datos={dataDireccion}
                    DobleClick={(e) => AgregarDireccion(e, null, true)}
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
                      mensaje={[
                        "Cualquier registro, modificación o eliminación de direcciones será guardado automáticamente en la base de datos, usar con precaución.",
                      ]}
                      cerrar={false}
                    />
                    <BotonBasico
                      botonText="Agregar"
                      botonClass={G.BotonAgregar}
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
                      G.ContenedorBasico +
                      G.FondoContenedor +
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

                    <div className={G.ContenedorInputs}>
                      <div className={G.InputFull}>
                        <label htmlFor="nombres" className={G.LabelStyle}>
                          Nombres
                        </label>
                        <input
                          type="text"
                          id="nombresContacto"
                          name="nombresContactoCliente"
                          placeholder="Nombres"
                          autoComplete="off"
                          autoFocus={habilitarContacto}
                          disabled={modo == "Consultar"}
                          value={objContacto.nombres ?? ""}
                          onChange={ValidarDataContacto}
                          className={G.InputStyle}
                        />
                      </div>
                      <div className={G.Input96}>
                        <label
                          htmlFor="numeroDocumentoIdentidad"
                          className={G.LabelStyle}
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
                          disabled={modo == "Consultar"}
                          value={objContacto.numeroDocumentoIdentidad ?? ""}
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
                          value={objContacto.cargoId ?? ""}
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
                          value={objContacto.celular ?? ""}
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
                          value={objContacto.telefono ?? ""}
                          onChange={ValidarDataContacto}
                          className={G.InputStyle}
                        />
                      </div>
                      <div className={G.InputFull}>
                        <label
                          htmlFor="correoElectronico"
                          className={G.LabelStyle}
                        >
                          Correo
                        </label>
                        <input
                          type="text"
                          id="correoElectronico"
                          placeholder="Correo"
                          name="correoElectronico"
                          autoComplete="off"
                          disabled={modo == "Consultar"}
                          value={objContacto.correoElectronico ?? ""}
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
                        id="direccionContacto"
                        name="direccion"
                        placeholder="Dirección"
                        autoComplete="off"
                        disabled={modo == "Consultar"}
                        value={objContacto.direccion ?? ""}
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
                          id="enviarClienteContacto"
                          onKeyDown={(e) => Funciones.KeyClick(e)}
                          onClick={EnviarClienteContacto}
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
                        id="cerrarClienteContacto"
                        onKeyDown={(e) => Funciones.KeyClick(e)}
                        onClick={() => setHabilitarContacto(false)}
                        className={
                          G.BotonModalBase +
                          G.BotonCancelarModal +
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
                    id="tablaContactoCliente"
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
                      botonClass={G.BotonAgregar}
                      botonIcon={faPlus}
                      autoFoco={true}
                      click={(e) => {
                        AgregarPersonal(e);
                      }}
                      contenedor=""
                    />
                  </div>
                )}
                {/* Boton */}

                {/* Form Personal */}
                {habilitarPersonal && (
                  <div
                    className={
                      G.ContenedorBasico +
                      G.FondoContenedor +
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

                    <div className={G.ContenedorInputs}>
                      <div className={G.InputFull}>
                        <div className={G.InputFull}>
                          <label
                            htmlFor="personalId"
                            className={G.LabelStyle}
                          >
                            Personal
                          </label>
                          <select
                            id="personalId"
                            name="personalId"
                            autoFocus={habilitarPersonal}
                            value={objPersonal.personalId ?? ""}
                            onChange={ValidarDataPersonal}
                            disabled={modo == "Consultar"}
                            className={G.InputBoton}
                          >
                            {dataPersonalCombo.map((personal) => (
                              <option key={personal.id} value={personal.id}>
                                {personal.personal}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className={G.Input + "w-32"}>
                          <div className={G.CheckStyle + G.Anidado}>
                            <Checkbox
                              inputId="default"
                              name="default"
                              disabled={modo == "Consultar"}
                              value={objPersonal.default}
                              onChange={ValidarDataPersonal}
                              checked={objPersonal.default ? true : ""}
                            ></Checkbox>
                          </div>
                          <label
                            htmlFor="default"
                            className={G.LabelCheckStyle}
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
                          id="enviarClientePersonal"
                          onKeyDown={(e) => Funciones.KeyClick(e)}
                          onClick={EnviarClientePersonal}
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
                        id="cerrarClientePersonal"
                        onKeyDown={(e) => Funciones.KeyClick(e)}
                        onClick={() => setHabilitarPersonal(false)}
                        className={
                          G.BotonModalBase +
                          G.BotonCancelarModal +
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
                  <TableBasic
                    id="tablaPersonalCliente"
                    columnas={colPersonal}
                    datos={dataPersonal}
                  />
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
