import { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import Update from "../../../components/funciones/Update";
import { TabView, TabPanel } from "primereact/tabview";
import Ubigeo from "../../../components/filtro/Ubigeo";
import TableBasic from "../../../components/tabla/TableBasic";
import BotonBasico from "../../../components/boton/BotonBasico";
import Mensajes from "../../../components/funciones/Mensajes";
import { Checkbox } from "primereact/checkbox";
import Swal from "sweetalert2";
import { ToastContainer } from "react-toastify";
import moment from "moment";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import * as G from "../../../components/Global";

//#region Estilos
const DivTabla = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  th:nth-child(3) {
    text-align: center;
  }
  & th:last-child {
    text-align: center;
    width: 100px;
    max-width: 100px;
  }
`;

const Empresa = ({ modo }) => {
  //#region useState
  const [data, setData] = useState([]);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  const [dataUbigeo, setDataUbigeo] = useState([]);
  const [checkboxes, setCheckboxes] = useState({
    checked: true,
    enero: true,
    febrero: true,
    marzo: true,
    abril: true,
    mayo: true,
    junio: true,
    julio: true,
    agosto: true,
    septiembre: true,
    octubre: true,
    noviembre: true,
    diciembre: true,
  });
  const [checkboxes2, setCheckboxes2] = useState({
    checked: true,
    enero2: true,
    febrero2: true,
    marzo2: true,
    abril2: true,
    mayo2: true,
    junio2: true,
    julio2: true,
    agosto2: true,
    septiembre2: true,
    octubre2: true,
    noviembre2: true,
    diciembre2: true,
  });
  const [mesesHabilitados, setMesesHabilitados] = useState([]);

  const [porcentajesIGV, setPorcentajesIGV] = useState([]);
  const [porcentajesRetencion, setPorcentajesRetencion] = useState([]);
  const [porcentajesDetraccion, setPorcentajesDetraccion] = useState([]);
  const [porcentajesPercepcion, setPorcentajesPercepcion] = useState([]);

  const [estadoIgv, setEstadoIgv] = useState(false);
  const [estadoRetencion, setEstadoRetencion] = useState(false);
  const [estadoDetraccion, setEstadoDetraccion] = useState(false);
  const [estadoPercepcion, setEstadoPercepcion] = useState(false);
  const [objetoIgv, setObjetoIgv] = useState([]);
  const [objetoRetencion, setObjetoRetencion] = useState([]);
  const [objetoDetraccion, setObjetoDetraccion] = useState([]);
  const [objetoPercepcion, setObjetoPercepcion] = useState([]);
  const [checkedIgv, setCheckedIgv] = useState(false);
  const [checkedRetencion, setCheckedRetencion] = useState(false);
  const [checkedDetraccion, setCheckedDetraccion] = useState(false);
  const [checkedPercepcion, setCheckedPercepcion] = useState(false);
  //#endregion

  //#region useEffect
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
    if (refrescar) {
      GuardarTodo(new Event("click"));
      setRefrescar(false);
    }
  }, [data, mesesHabilitados]);

  useEffect(() => {
    Configuracion();
  }, []);
  //#endregion

  //#region Funciones
  const meses = {
    enero: [0, 0],
    febrero: [1, 1],
    marzo: [2, 2],
    abril: [3, 3],
    mayo: [4, 4],
    junio: [5, 5],
    julio: [6, 6],
    agosto: [7, 7],
    septiembre: [8, 8],
    octubre: [9, 9],
    noviembre: [10, 10],
    diciembre: [11, 11],
    enero2: [0, 12],
    febrero2: [1, 13],
    marzo2: [2, 14],
    abril2: [3, 15],
    mayo2: [4, 16],
    junio2: [5, 17],
    julio2: [6, 18],
    agosto2: [7, 19],
    septiembre2: [8, 20],
    octubre2: [9, 21],
    noviembre2: [10, 22],
    diciembre2: [11, 23],
  };
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
  const HandleCheck = (mes, checked) => {
    setCheckboxes({ ...checkboxes, [mes]: checked });
    const index = meses[mes];
    if (mes !== undefined) {
      if (mes[1] > 11) {
        mesesHabilitados[mes[1]] = checked
          ? data.anioHabilitado2 + ("0" + (mes[0] + 1)).slice(-2)
          : "";
      } else {
        mesesHabilitados[mes[1]] = checked
          ? data.anioHabilitado1 + ("0" + (mes[0] + 1)).slice(-2)
          : "";
      }
      // if (mesesHabilitados[index] === "") {
      //   mesesHabilitados[index] = "";
      // }
    }
    const filteredMesesHabilitados = mesesHabilitados.filter(
      (mes) => mes !== null && mes !== undefined && mes !== ""
    );
    setData({
      ...data,
      mesesHabilitados: filteredMesesHabilitados.join(","),
    });
  };
  const HandleCheckAll = (event) => {
    const { checked } = event.target;
    setCheckboxes((prevState) => ({
      ...prevState,
      checked,
      enero: checked,
      febrero: checked,
      marzo: checked,
      abril: checked,
      mayo: checked,
      junio: checked,
      julio: checked,
      agosto: checked,
      septiembre: checked,
      octubre: checked,
      noviembre: checked,
      diciembre: checked,
    }));
    setData({
      ...data,
      mesesHabilitados: checked
        ? [
            "202201",
            "202202",
            "202203",
            "202204",
            "202205",
            "202206",
            "202207",
            "202208",
            "202209",
            "202210",
            "202211",
            "202212",
          ]
        : [],
    });
  };
  const HandleCheckAll2 = (event) => {
    const { checked } = event.target;
    setCheckboxes2((prevState) => ({
      ...prevState,
      checked,
      enero2: checked,
      febrero2: checked,
      marzo2: checked,
      abril2: checked,
      mayo2: checked,
      junio2: checked,
      julio2: checked,
      agosto2: checked,
      septiembre2: checked,
      octubre2: checked,
      noviembre2: checked,
      diciembre2: checked,
    }));
    setData({
      ...data,
      mesesHabilitados: checked
        ? [
            "202301",
            "202302",
            "202303",
            "202304",
            "202305",
            "202306",
            "202307",
            "202308",
            "202309",
            "202310",
            "202311",
            "202312",
          ]
        : [],
    });
  };
  //#endregion

  //#region Funciones API
  const Configuracion = async () => {
    const result = await ApiMasy.get(`api/Empresa/Configuracion`);
    let contadorIGV = 0;
    let contadorRetencion = 0;
    let contadorDetraccion = 0;
    let contadorPercepcion = 0;
    const igv = result.data.data.porcentajesIGV
      .map((item) => ({
        id: contadorIGV,
        porcentaje: item.porcentaje,
        default: item.default,
      }))
      .map((item) => ({ ...item, id: contadorIGV++ }));
    const retencion = result.data.data.porcentajesRetencion
      .map((item) => ({
        id: contadorRetencion,
        porcentaje: item.porcentaje,
        default: item.default,
      }))
      .map((item) => ({ ...item, id: contadorRetencion++ }));
    const detraccion = result.data.data.porcentajesDetraccion
      .map((item) => ({
        id: contadorDetraccion,
        porcentaje: item.porcentaje,
        default: item.default,
      }))
      .map((item) => ({ ...item, id: contadorDetraccion++ }));
    const percepcion = result.data.data.porcentajesPercepcion
      .map((item) => ({
        id: contadorPercepcion,
        porcentaje: item.porcentaje,
        default: item.default,
      }))
      .map((item) => ({ ...item, id: contadorPercepcion++ }));

    setMesesHabilitados(result.data.data.mesesHabilitados.split(","));
    setData(result.data.data);
    setPorcentajesIGV(igv);
    setPorcentajesRetencion(retencion);
    setPorcentajesDetraccion(detraccion);
    setPorcentajesPercepcion(percepcion);
  };
  const GuardarTodo = async (e) => {
    if (e._reactName != "onClick") {
      if (e.key == "Enter") {
        await Update(
          ["Empresa", "Configuracion"],
          data,
          setTipoMensaje,
          setMensaje
        );
      }
    } else {
      await Update(
        ["Empresa", "Configuracion"],
        data,
        setTipoMensaje,
        setMensaje
      );
    }
    await Configuracion();
  };
  //#endregion

  //#region IGV
  const colIgv = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Porcentaje",
      accessor: "porcentaje",
    },
    {
      Header: "Default",
      accessor: "default",
      Cell: ({ value }) => {
        return value ? (
          <div className="flex justify-center">
            <Checkbox checked={true} />
          </div>
        ) : (
          <div className="text-center">
            <Checkbox checked={false} />
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
              <div className={G.TablaBotonModificar}>
                <button
                  id="boton"
                  onClick={(e) => AgregarIgv(e, row.values.id)}
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
                    EliminarIgv(row.values.id);
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
  const ValidarDataIgv = async ({ target }) => {
    if (target.name == "default") {
      setObjetoIgv({ ...objetoIgv, [target.name]: target.checked });
    } else {
      setObjetoIgv((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  const AgregarIgv = async (e, id = "") => {
    if (e.target.innerText == "AGREGAR") {
      setObjetoIgv({
        id: -1,
        porcentaje: 0,
        default: false,
      });
    } else {
      setObjetoIgv({
        id: id,
        porcentaje: data.porcentajesIGV[id].porcentaje,
        default: data.porcentajesIGV[id].default,
      });
    }
    setEstadoIgv(true);
  };
  const EnviarIgv = async () => {
    if (objetoIgv.id > -1) {
      porcentajesIGV[objetoIgv.id] = {
        porcentaje: objetoIgv.porcentaje,
        default: objetoIgv.default,
      };
    } else {
      porcentajesIGV.push({
        porcentaje: objetoIgv.porcentaje,
        default: objetoIgv.default,
      });
    }
    setData({
      ...data,
      porcentajesIGV,
    });
    setRefrescar(true);
    setEstadoIgv(false);
  };
  const EliminarIgv = async (id) => {
    setRefrescar(true);
    const model = porcentajesIGV.filter((model) => model.id !== id);
    Swal.fire({
      title: "Eliminar registro",
      icon: "warning",
      iconColor: "#F7BF3A",
      showCancelButton: true,
      color: "#fff",
      background: "#1a1a2e",
      confirmButtonColor: "#eea508",
      confirmButtonText: "Aceptar",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setData({
          ...data,
          porcentajesIGV: model,
        });
      }
    });
  };
  //#endregion

  //#region Retencion
  const colRetencion = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Porcentaje",
      accessor: "porcentaje",
    },
    {
      Header: "Default",
      accessor: "default",
      Cell: ({ value }) => {
        return value ? (
          <div className="flex justify-center">
            <Checkbox checked={true} />
          </div>
        ) : (
          <div className="flex justify-center">
            <Checkbox checked={false} />
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
              <div className={G.TablaBotonModificar}>
                <button
                  id="boton"
                  onClick={(e) => AgregarRetencion(e, row.values.id)}
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
                    EliminarRetencion(row.values.id);
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
  const ValidarDataRetencion = async ({ target }) => {
    if (target.name == "default") {
      setObjetoRetencion({ ...objetoRetencion, [target.name]: target.checked });
    } else {
      setObjetoRetencion((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  const AgregarRetencion = async (e, id = "") => {
    if (e.target.innerText == "AGREGAR") {
      setObjetoRetencion({
        id: -1,
        porcentaje: 0,
        default: false,
      });
    } else {
      setObjetoRetencion({
        id: id,
        porcentaje: data.porcentajesRetencion[id].porcentaje,
        default: data.porcentajesRetencion[id].default,
      });
    }
    setEstadoRetencion(true);
  };
  const EnviarRetencion = async () => {
    if (objetoRetencion.id > -1) {
      porcentajesRetencion[objetoRetencion.id] = {
        porcentaje: objetoRetencion.porcentaje,
        default: objetoRetencion.default,
      };
    } else {
      porcentajesRetencion.push({
        porcentaje: objetoRetencion.porcentaje,
        default: objetoRetencion.default,
      });
    }
    setData({
      ...data,
      porcentajesRetencion,
    });
    setRefrescar(true);
    setEstadoRetencion(false);
  };
  const EliminarRetencion = async (id) => {
    setRefrescar(true);
    const model = porcentajesRetencion.filter((model) => model.id !== id);
    Swal.fire({
      title: "Eliminar registro",
      icon: "warning",
      iconColor: "#F7BF3A",
      showCancelButton: true,
      color: "#fff",
      background: "#1a1a2e",
      confirmButtonColor: "#eea508",
      confirmButtonText: "Aceptar",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setData({
          ...data,
          porcentajesRetencion: model,
        });
      }
    });
  };
  //#endregion

  //#region Detraccion
  const colDetraccion = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Porcentaje",
      accessor: "porcentaje",
    },
    {
      Header: "Default",
      accessor: "default",
      Cell: ({ value }) => {
        return value ? (
          <div className="flex justify-center">
            <Checkbox checked={true} />
          </div>
        ) : (
          <div className="flex justify-center">
            <Checkbox checked={false} />
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
              <div className={G.TablaBotonModificar}>
                <button
                  id="boton"
                  onClick={(e) => AgregarDetraccion(e, row.values.id)}
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
                    EliminarDetraccion(row.values.id);
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
  const ValidarDataDetraccion = async ({ target }) => {
    if (target.name == "default") {
      setObjetoDetraccion({
        ...objetoDetraccion,
        [target.name]: target.checked,
      });
    } else {
      setObjetoDetraccion((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  const AgregarDetraccion = async (e, id = "") => {
    if (e.target.innerText == "AGREGAR") {
      setObjetoDetraccion({
        id: -1,
        porcentaje: 0,
        default: false,
      });
    } else {
      setObjetoDetraccion({
        id: id,
        porcentaje: data.porcentajesDetraccion[id].porcentaje,
        default: data.porcentajesDetraccion[id].default,
      });
    }
    setEstadoDetraccion(true);
  };
  const EnviarIDetraccion = async () => {
    if (objetoDetraccion.id > -1) {
      porcentajesDetraccion[objetoDetraccion.id] = {
        porcentaje: objetoDetraccion.porcentaje,
        default: objetoDetraccion.default,
      };
    } else {
      porcentajesDetraccion.push({
        porcentaje: objetoDetraccion.porcentaje,
        default: objetoDetraccion.default,
      });
    }
    setData({
      ...data,
      porcentajesDetraccion,
    });
    setRefrescar(true);
    setEstadoDetraccion(false);
  };
  const EliminarDetraccion = async (id) => {
    setRefrescar(true);
    const model = porcentajesDetraccion.filter((model) => model.id !== id);
    Swal.fire({
      title: "Eliminar registro",
      icon: "warning",
      iconColor: "#F7BF3A",
      showCancelButton: true,
      color: "#fff",
      background: "#1a1a2e",
      confirmButtonColor: "#eea508",
      confirmButtonText: "Aceptar",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setData({
          ...data,
          porcentajesDetraccion: model,
        });
      }
    });
  };
  //#endregion

  //#region Percepcion
  const colPercepcion = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Porcentaje",
      accessor: "porcentaje",
    },
    {
      Header: "Default",
      accessor: "default",
      Cell: ({ value }) => {
        return value ? (
          <div className="flex justify-center">
            <Checkbox checked={true} />
          </div>
        ) : (
          <div className="flex justify-center">
            <Checkbox checked={false} />
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
              <div className={G.TablaBotonModificar}>
                <button
                  id="boton"
                  onClick={(e) => AgregarPercepcion(e, row.values.id)}
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
                    EliminarPercepcion(row.values.id);
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
  const ValidarDataPercepcion = async ({ target }) => {
    if (target.name == "default") {
      setObjetoPercepcion({
        ...objetoPercepcion,
        [target.name]: target.checked,
      });
    } else {
      setObjetoPercepcion((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  const AgregarPercepcion = async (e, id = "") => {
    if (e.target.innerText == "AGREGAR") {
      setObjetoPercepcion({
        id: -1,
        porcentaje: 0,
        default: false,
      });
    } else {
      setObjetoPercepcion({
        id: id,
        porcentaje: data.porcentajesPercepcion[id].porcentaje,
        default: data.porcentajesPercepcion[id].default,
      });
    }
    setEstadoPercepcion(true);
  };
  const EnviarPercepcion = async () => {
    if (objetoPercepcion.id > -1) {
      porcentajesPercepcion[objetoPercepcion.id] = {
        porcentaje: objetoPercepcion.porcentaje,
        default: objetoPercepcion.default,
      };
    } else {
      porcentajesPercepcion.push({
        porcentaje: objetoPercepcion.porcentaje,
        default: objetoPercepcion.default,
      });
    }
    setData({
      ...data,
      porcentajesPercepcion,
    });
    setRefrescar(true);
    setEstadoPercepcion(false);
  };
  const EliminarPercepcion = async (id) => {
    setRefrescar(true);
    const model = porcentajesPercepcion.filter((model) => model.id !== id);
    Swal.fire({
      title: "Eliminar registro",
      icon: "warning",
      iconColor: "#F7BF3A",
      showCancelButton: true,
      color: "#fff",
      background: "#1a1a2e",
      confirmButtonColor: "#eea508",
      confirmButtonText: "Aceptar",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setData({
          ...data,
          porcentajesPercepcion: model,
        });
      }
    });
  };
  //#endregion

  //#region Render
  return (
    <>
      {Object.entries(data).length > 0 && (
        <div className={G.ContenedorPadre + " overflow-y-auto"}>
          {tipoMensaje > -1 && (
            <Mensajes
              tipoMensaje={tipoMensaje}
              mensaje={mensaje}f
              Click={() =>  Funciones.OcultarMensajes(setTipoMensaje, setMensaje)}
            />
          )}
          <TabView>
            <TabPanel
              header="Datos Principales"
              leftIcon="pi pi-user mr-2"
              style={{ color: "white" }}
            >
              <div className={G.ContenedorBasico + " pt-5 rounded-t-none"}>
                <div className={G.ContenedorInputs}>
                  <div className={G.Input60pct}>
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
                      autoFocus
                      value={data.numeroDocumentoIdentidad ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.InputFull}>
                    <label htmlFor="nombre" className={G.LabelStyle}>
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      placeholder="Nombre"
                      autoComplete="off"
                      value={data.nombre ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                </div>
                <div className={G.ContenedorInputs}>
                  <div className={G.Input60pct}>
                    <label htmlFor="telefono" className={G.LabelStyle}>
                      Teléfono
                    </label>
                    <input
                      type="text"
                      id="telefono"
                      name="telefono"
                      placeholder="Teléfono"
                      autoComplete="off"
                      value={data.telefono ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
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
                      value={data.correoElectronico ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                </div>
                <div className={G.ContenedorInputs}>
                  <div className={G.Input60pct}>
                    <label htmlFor="celular" className={G.LabelStyle}>
                      Celular
                    </label>
                    <input
                      type="text"
                      id="celular"
                      name="celular"
                      placeholder="Celular"
                      autoComplete="off"
                      value={data.celular ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.InputFull}>
                    <label htmlFor="observacion" className={G.LabelStyle}>
                      Observacion
                    </label>
                    <input
                      type="text"
                      id="observacion"
                      name="observacion"
                      placeholder="Observacion"
                      autoComplete="off"
                      value={data.observacion ?? ""}
                      onChange={HandleData}
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
                    value={data.direccion ?? ""}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
                <Ubigeo
                  setDataUbigeo={setDataUbigeo}
                  id={["departamentoId", "provinciaId", "distritoId"]}
                  dato={{
                    departamentoId: data.departamentoId,
                    provinciaId: data.provinciaId,
                    distritoId: data.distritoId,
                  }}
                ></Ubigeo>
                <div className={G.ContenedorInputs}>
                  <div className={G.Input40pct}>
                    <label htmlFor="concarEmpresaId" className={G.LabelStyle}>
                      Id Concar
                    </label>
                    <input
                      type="text"
                      id="concarEmpresaId"
                      name="concarEmpresaId"
                      placeholder="Número Concar Id"
                      autoComplete="off"
                      value={data.concarEmpresaId ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.InputFull}>
                    <label
                      htmlFor="concarEmpresaNombre"
                      className={G.LabelStyle}
                    >
                      Empresa Concar
                    </label>
                    <input
                      type="text"
                      id="concarEmpresaNombre"
                      name="concarEmpresaNombre"
                      placeholder="Empresa Concar"
                      autoComplete="off"
                      value={data.concarEmpresaNombre ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                </div>
                <div className={G.ContenedorInputs}>
                  <div className={G.InputMitad}>
                    <label
                      htmlFor="concarUsuarioVenta"
                      className={G.LabelStyle}
                    >
                      Usuario Venta
                    </label>
                    <input
                      type="text"
                      id="concarUsuarioVenta"
                      name="concarUsuarioVenta"
                      placeholder="Usuario Venta"
                      autoComplete="off"
                      value={data.concarUsuarioVenta ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.InputMitad}>
                    <label
                      htmlFor="concarUsuarioCompra"
                      className={G.LabelStyle}
                    >
                      Usuario Compra
                    </label>
                    <input
                      type="text"
                      id="concarUsuarioCompra"
                      name="concarUsuarioCompra"
                      placeholder="Usuario Compra"
                      autoComplete="off"
                      value={data.concarUsuarioCompra ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                </div>
                <div className={G.ContenedorInputs}>
                  <div className={G.InputMitad}>
                    <label htmlFor="concarUsuarioPago" className={G.LabelStyle}>
                      Usuario Pago
                    </label>
                    <input
                      type="text"
                      id="concarUsuarioPago"
                      name="concarUsuarioPago"
                      placeholder="Usuario Pago"
                      autoComplete="off"
                      value={data.concarUsuarioPago ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.InputMitad}>
                    <label
                      htmlFor="concarUsuarioCobro"
                      className={G.LabelStyle}
                    >
                      Usuario Cobro
                    </label>
                    <input
                      type="text"
                      id="concarUsuarioCobro"
                      name="concarUsuarioCobro"
                      placeholder="Usuario Cobro"
                      autoComplete="off"
                      value={data.concarUsuarioCobro ?? ""}
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                </div>
                <div className={G.ContenedorInputs}>
                  <div className={G.InputMitad}>
                    <label htmlFor="filtroFechaInicio" className={G.LabelStyle}>
                      Desde
                    </label>
                    <input
                      type="date"
                      id="filtroFechaInicio"
                      name="filtroFechaInicio"
                      autoComplete="off"
                      value={
                        data.filtroFechaInicio == null
                          ? ""
                          : moment(data.filtroFechaInicio).format("yyyy-MM-DD")
                      }
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.InputMitad}>
                    <label htmlFor="filtroFechaFin" className={G.LabelStyle}>
                      Hasta
                    </label>
                    <input
                      type="date"
                      id="filtroFechaFin"
                      name="filtroFechaFin"
                      autoComplete="off"
                      value={
                        data.filtroFechaFin == null
                          ? ""
                          : moment(data.filtroFechaFin).format("yyyy-MM-DD")
                      }
                      onChange={HandleData}
                      className={G.InputStyle}
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2 ">
                  <button
                    id="guardarTodo"
                    className={G.BotonModalBase + G.BotonOkModal}
                    type="button"
                    onClick={GuardarTodo}
                    onKeyDown={(e) => GuardarTodo(e)}
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </TabPanel>

            <TabPanel
              header="Habilitar Periodo"
              leftIcon="pi pi-calendar mr-2"
              style={{ color: "white" }}
            >
              <div className={G.ContenedorBasico + " pt-5 rounded-t-none"}>
                <div className={G.ContenedorRow + " !gap-x-0 mb-1"}>
                  <div className={G.InputFull}>
                    <label htmlFor="anioHabilitado1" className={G.LabelStyle}>
                      Año 1
                    </label>
                    <input
                      type="number"
                      id="anioHabilitado1"
                      name="anioHabilitado1"
                      placeholder="año"
                      autoComplete="off"
                      min={0}
                      autoFocus
                      value={data.anioHabilitado1}
                      onChange={HandleData}
                      className={G.InputBoton}
                    />
                  </div>

                  <div className="flex">
                    <div className={G.CheckStyle + G.Anidado}>
                      <Checkbox
                        inputId="todos"
                        name="todos"
                        value={checkboxes.checked}
                        onChange={HandleCheckAll}
                        checked={checkboxes.checked}
                      />
                    </div>
                    <label htmlFor="todos" className={G.LabelCheckStyle}>
                      Todos
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:mt-1">
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="enero"
                        name="enero"
                        value={mesesHabilitados[0]}
                        onChange={(e) => {
                          HandleCheck([0, 0], e.target.checked);
                          setCheckboxes({
                            ...checkboxes,
                            enero: e.target.checked,
                          });
                        }}
                        checked={checkboxes.enero ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="enero"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Enero
                    </label>
                  </div>
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="febrero"
                        name="febrero"
                        value={mesesHabilitados[1]}
                        onChange={(e) => {
                          HandleCheck([1, 1], e.target.checked);
                          setCheckboxes({
                            ...checkboxes,
                            febrero: e.target.checked,
                          });
                        }}
                        checked={checkboxes.febrero ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="febrero"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Febrero
                    </label>
                  </div>
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="marzo"
                        name="marzo"
                        value={mesesHabilitados[2]}
                        onChange={(e) => {
                          HandleCheck([2, 2], e.target.checked);
                          setCheckboxes({
                            ...checkboxes,
                            marzo: e.target.checked,
                          });
                        }}
                        checked={checkboxes.marzo ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="marzo"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Marzo
                    </label>
                  </div>
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="abril"
                        name="abril"
                        value={mesesHabilitados[3]}
                        onChange={(e) => {
                          HandleCheck([3, 3], e.target.checked);
                          setCheckboxes({
                            ...checkboxes,
                            abril: e.target.checked,
                          });
                        }}
                        checked={checkboxes.abril ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="abril"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Abril
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:mt-1">
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="mayo"
                        name="mayo"
                        value={mesesHabilitados[4]}
                        onChange={(e) => {
                          HandleCheck([4, 4], e.target.checked);
                          setCheckboxes({
                            ...checkboxes,
                            mayo: e.target.checked,
                          });
                        }}
                        checked={checkboxes.mayo ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="mayo"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Mayo
                    </label>
                  </div>
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="junio"
                        name="junio"
                        value={mesesHabilitados[5]}
                        onChange={(e) => {
                          HandleCheck([5, 5], e.target.checked);
                          setCheckboxes({
                            ...checkboxes,
                            junio: e.target.checked,
                          });
                        }}
                        checked={checkboxes.junio ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="junio"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Junio
                    </label>
                  </div>
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="julio"
                        name="julio"
                        value={mesesHabilitados[6]}
                        onChange={(e) => {
                          HandleCheck([6, 6], e.target.checked);
                          setCheckboxes({
                            ...checkboxes,
                            julio: e.target.checked,
                          });
                        }}
                        checked={checkboxes.julio ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="julio"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Julio
                    </label>
                  </div>
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="agosto"
                        name="agosto"
                        value={mesesHabilitados[7]}
                        onChange={(e) => {
                          HandleCheck([7, 7], e.target.checked);
                          setCheckboxes({
                            ...checkboxes,
                            agosto: e.target.checked,
                          });
                        }}
                        checked={checkboxes.agosto ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="agosto"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Agosto
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:mt-1">
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="septiembre"
                        name="septiembre"
                        value={mesesHabilitados[8]}
                        onChange={(e) => {
                          HandleCheck([8, 8], e.target.checked);
                          setCheckboxes({
                            ...checkboxes,
                            septiembre: e.target.checked,
                          });
                        }}
                        checked={checkboxes.septiembre ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="septiembre"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Setiembre
                    </label>
                  </div>
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="octubre"
                        name="octubre"
                        value={mesesHabilitados[9]}
                        onChange={(e) => {
                          HandleCheck([9, 9], e.target.checked);
                          setCheckboxes({
                            ...checkboxes,
                            octubre: e.target.checked,
                          });
                        }}
                        checked={checkboxes.octubre ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="octubre"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Octubre
                    </label>
                  </div>
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="noviembre"
                        name="noviembre"
                        value={mesesHabilitados[10]}
                        onChange={(e) => {
                          HandleCheck([10, 10], e.target.checked);
                          setCheckboxes({
                            ...checkboxes,
                            noviembre: e.target.checked,
                          });
                        }}
                        checked={checkboxes.noviembre ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="noviembre"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Noviembre
                    </label>
                  </div>
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="diciembre"
                        name="diciembre"
                        value={mesesHabilitados[11]}
                        onChange={(e) => {
                          HandleCheck([11, 11], e.target.checked);
                          setCheckboxes({
                            ...checkboxes,
                            diciembre: e.target.checked,
                          });
                        }}
                        checked={checkboxes.diciembre ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="diciembre"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Diciembre
                    </label>
                  </div>
                </div>

                <div className={G.ContenedorRow + " !gap-x-0 mt-4 mb-1"}>
                  <div className={G.InputFull}>
                    <label htmlFor="anioHabilitado2" className={G.LabelStyle}>
                      Año 2
                    </label>
                    <input
                      type="number"
                      id="anioHabilitado2"
                      name="anioHabilitado2"
                      autoComplete="off"
                      placeholder="año"
                      min={0}
                      value={data.anioHabilitado2}
                      onChange={HandleData}
                      className={G.InputBoton}
                    />
                  </div>
                  <div className="flex">
                    <div className={G.CheckStyle + G.Anidado}>
                      <Checkbox
                        inputId="todos2"
                        name="todos2"
                        value={checkboxes2.checked}
                        onChange={HandleCheckAll2}
                        checked={checkboxes2.checked}
                      />
                    </div>
                    <label htmlFor="todos2" className={G.LabelCheckStyle}>
                      Todos
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:mt-1">
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="enero2"
                        name="enero2"
                        value={mesesHabilitados[12]}
                        onChange={(e) => {
                          HandleCheck([0, 12], e.target.checked);
                          setCheckboxes2({
                            ...checkboxes2,
                            enero2: e.target.checked,
                          });
                        }}
                        checked={checkboxes2.enero2 ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="enero2"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Enero
                    </label>
                  </div>
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="febrero2"
                        name="febrero2"
                        value={mesesHabilitados[13]}
                        onChange={(e) => {
                          HandleCheck([1, 13], e.target.checked);
                          setCheckboxes2({
                            ...checkboxes2,
                            febrero2: e.target.checked,
                          });
                        }}
                        checked={checkboxes2.febrero2 ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="febrero2"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Febrero
                    </label>
                  </div>
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="marzo2"
                        name="marzo2"
                        value={mesesHabilitados[14]}
                        onChange={(e) => {
                          HandleCheck([2, 14], e.target.checked);
                          setCheckboxes2({
                            ...checkboxes2,
                            marzo2: e.target.checked,
                          });
                        }}
                        checked={checkboxes2.marzo2 ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="marzo2"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Marzo
                    </label>
                  </div>
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="abril2"
                        name="abril2"
                        value={mesesHabilitados[15]}
                        onChange={(e) => {
                          HandleCheck([3, 15], e.target.checked);
                          setCheckboxes2({
                            ...checkboxes2,
                            abril2: e.target.checked,
                          });
                        }}
                        checked={checkboxes2.abril2 ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="abril2"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Abril
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:mt-1">
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="mayo2"
                        name="mayo2"
                        value={mesesHabilitados[16]}
                        onChange={(e) => {
                          HandleCheck([4, 16], e.target.checked);
                          setCheckboxes2({
                            ...checkboxes2,
                            mayo2: e.target.checked,
                          });
                        }}
                        checked={checkboxes2.mayo2 ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="mayo2"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Mayo
                    </label>
                  </div>
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="junio2"
                        name="junio2"
                        value={mesesHabilitados[17]}
                        onChange={(e) => {
                          HandleCheck([5, 17], e.target.checked);
                          setCheckboxes2({
                            ...checkboxes2,
                            junio2: e.target.checked,
                          });
                        }}
                        checked={checkboxes2.junio2 ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="junio2"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Junio
                    </label>
                  </div>
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="julio2"
                        name="julio2"
                        value={mesesHabilitados[18]}
                        onChange={(e) => {
                          HandleCheck([6, 18], e.target.checked);
                          setCheckboxes2({
                            ...checkboxes2,
                            julio2: e.target.checked,
                          });
                        }}
                        checked={checkboxes2.julio2 ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="julio2"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Julio
                    </label>
                  </div>
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="agosto2"
                        name="agosto2"
                        value={mesesHabilitados[19]}
                        onChange={(e) => {
                          HandleCheck([7, 19], e.target.checked);
                          setCheckboxes2({
                            ...checkboxes2,
                            agosto2: e.target.checked,
                          });
                        }}
                        checked={checkboxes2.agosto2 ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="agosto2"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Agosto
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:mt-1">
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="septiembre2"
                        name="septiembre2"
                        value={mesesHabilitados[20]}
                        onChange={(e) => {
                          HandleCheck([8, 20], e.target.checked);
                          setCheckboxes2({
                            ...checkboxes2,
                            septiembre2: e.target.checked,
                          });
                        }}
                        checked={checkboxes2.septiembre2 ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="septiembre2"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Setiembre
                    </label>
                  </div>
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="octubre2"
                        name="octubre2"
                        value={mesesHabilitados[21]}
                        onChange={(e) => {
                          HandleCheck([9, 21], e.target.checked);
                          setCheckboxes2({
                            ...checkboxes2,
                            octubre2: e.target.checked,
                          });
                        }}
                        checked={checkboxes2.octubre2 ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="octubre2"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Octubre
                    </label>
                  </div>
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="noviembre2"
                        name="noviembre2"
                        value={mesesHabilitados[22]}
                        onChange={(e) => {
                          HandleCheck([10, 22], e.target.checked);
                          setCheckboxes2({
                            ...checkboxes2,
                            noviembre2: e.target.checked,
                          });
                        }}
                        checked={checkboxes2.noviembre2 ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="noviembre2"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Noviembre
                    </label>
                  </div>
                  <div className="flex">
                    <div className={G.CheckStyle + G.SinBorde}>
                      <Checkbox
                        inputId="diciembre2"
                        name="diciembre2"
                        value={mesesHabilitados[23]}
                        onChange={(e) => {
                          HandleCheck([11, 23], e.target.checked);
                          setCheckboxes2({
                            ...checkboxes2,
                            diciembre2: e.target.checked,
                          });
                        }}
                        checked={checkboxes2.diciembre2 ? true : false}
                      />
                    </div>
                    <label
                      htmlFor="diciembre2"
                      className={G.LabelCheckStyle + G.SinBorde}
                    >
                      Diciembre
                    </label>
                  </div>
                </div>

                <div className="mt-10 pt-3 flex justify-end">
                  <button
                    id="guardarTodo"
                    className={G.BotonModalBase + G.BotonOkModal}
                    type="button"
                    onClick={GuardarTodo}
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            </TabPanel>

            <TabPanel
              header="Configuracion"
              leftIcon="pi pi-calendar mr-2"
              style={{ color: "white" }}
            >
              <div className={G.ContenedorBasico + " pt-2 rounded-t-none"}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="card">
                    <h4 className={G.TituloH4}>IGV</h4>
                    <BotonBasico
                      botonText="Agregar"
                      botonClass={G.BotonAgregar}
                      botonIcon={faPlus}
                      click={(e) => {
                        AgregarIgv(e);
                      }}
                      contenedor=""
                    />
                    {/* Form */}
                    {estadoIgv && (
                      <div
                        className={
                          G.ContenedorBasico + G.FondoContenedor + " pb-2 mb-3"
                        }
                      >
                        <div className={G.ContenedorRow}>
                          <div className={G.InputFull}>
                            <div className={G.InputFull}>
                              <label
                                htmlFor="porcentaje"
                                className={G.LabelStyle}
                              >
                                Porcentaje
                              </label>
                              <input
                                type="number"
                                id="porcentaje"
                                name="porcentaje"
                                placeholder="Porcentaje"
                                autoComplete="off"
                                min={0}
                                autoFocus
                                disabled={modo == "Consultar"}
                                value={objetoIgv.porcentaje}
                                onChange={ValidarDataIgv}
                                className={G.InputBoton}
                              />
                            </div>
                            <div className={G.Input36}>
                              <div className={G.CheckStyle + G.Anidado}>
                                <Checkbox
                                  inputId="defaultIgv"
                                  id="default"
                                  name="default"
                                  value={objetoIgv.default}
                                  checked={objetoIgv.default}
                                  onChange={(e) => {
                                    setCheckedIgv(e.checked);
                                    ValidarDataIgv(e);
                                  }}
                                ></Checkbox>
                              </div>
                              <label
                                htmlFor="defaultIgv"
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
                              onClick={EnviarIgv}
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
                            onClick={() => setEstadoIgv(false)}
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
                    <DivTabla>
                      <TableBasic
                        id="tablaIGV"
                        columnas={colIgv}
                        datos={porcentajesIGV}
                      />
                    </DivTabla>
                  </div>
                  <div className="card">
                    <h4 className={G.TituloH4}>RETENCIONES</h4>
                    <BotonBasico
                      botonText="Agregar"
                      botonClass={G.BotonAgregar}
                      botonIcon={faPlus}
                      click={(e) => {
                        AgregarRetencion(e);
                      }}
                      contenedor=""
                    />
                    {/* Form */}
                    {estadoRetencion && (
                      <div
                        className={
                          G.ContenedorBasico + G.FondoContenedor + " pb-2 mb-3"
                        }
                      >
                        <div className={G.ContenedorRow}>
                          <div className={G.InputFull}>
                            <div className={G.InputFull}>
                              <label
                                htmlFor="porcentaje"
                                className={G.LabelStyle}
                              >
                                Porcentaje
                              </label>
                              <input
                                type="number"
                                id="porcentaje"
                                name="porcentaje"
                                placeholder="Porcentaje"
                                autoComplete="off"
                                autoFocus
                                min={0}
                                disabled={modo == "Consultar"}
                                value={objetoRetencion.porcentaje}
                                onChange={ValidarDataRetencion}
                                className={G.InputBoton}
                              />
                            </div>
                            <div className={G.Input36}>
                              <div className={G.CheckStyle + G.Anidado}>
                                <Checkbox
                                  inputId="defaultRetencion"
                                  id="default"
                                  name="default"
                                  value={objetoRetencion.default}
                                  checked={objetoRetencion.default}
                                  onChange={(e) => {
                                    setCheckedRetencion(e.checked);
                                    ValidarDataRetencion(e);
                                  }}
                                ></Checkbox>
                              </div>
                              <label
                                htmlFor="defaultRetencion"
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
                              onClick={EnviarRetencion}
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
                            onClick={() => setEstadoRetencion(false)}
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
                    {/* Form */}
                    <DivTabla>
                      <TableBasic
                        id="tablaRetencion"
                        columnas={colRetencion}
                        datos={porcentajesRetencion}
                      />
                    </DivTabla>
                  </div>
                  <div className="card">
                    <h4 className={G.TituloH4}>DETRACCIONES</h4>
                    <BotonBasico
                      botonText="Agregar"
                      botonClass={G.BotonAgregar}
                      botonIcon={faPlus}
                      click={(e) => {
                        AgregarDetraccion(e);
                      }}
                      contenedor=""
                    />
                    {/* Form */}
                    {estadoDetraccion && (
                      <div
                        className={
                          G.ContenedorBasico + G.FondoContenedor + " pb-2 mb-3"
                        }
                      >
                        <div className={G.ContenedorRow}>
                          <div className={G.InputFull}>
                            <div className={G.InputFull}>
                              <label
                                htmlFor="porcentaje"
                                className={G.LabelStyle}
                              >
                                Porcentaje
                              </label>
                              <input
                                type="number"
                                id="porcentaje"
                                name="porcentaje"
                                placeholder="Porcentaje"
                                autoComplete="off"
                                min={0}
                                autoFocus
                                disabled={modo == "Consultar"}
                                value={objetoDetraccion.porcentaje}
                                onChange={ValidarDataDetraccion}
                                className={G.InputBoton}
                              />
                            </div>
                            <div className={G.Input36}>
                              <div className={G.CheckStyle + G.Anidado}>
                                <Checkbox
                                  inputId="defaultDetraccion"
                                  id="default"
                                  name="default"
                                  value={objetoDetraccion.default}
                                  checked={objetoDetraccion.default}
                                  onChange={(e) => {
                                    setCheckedDetraccion(e.checked);
                                    ValidarDataDetraccion(e);
                                  }}
                                ></Checkbox>
                              </div>
                              <label
                                htmlFor="defaultDetraccion"
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
                              onClick={EnviarIDetraccion}
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
                            onClick={() => setEstadoDetraccion(false)}
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
                    {/* Form */}
                    <DivTabla>
                      <TableBasic
                        id="tablaDetraccion"
                        columnas={colDetraccion}
                        datos={porcentajesDetraccion}
                      />
                    </DivTabla>
                  </div>
                  <div className="card">
                    <h4 className={G.TituloH4}>PERCEPCIONES</h4>
                    <BotonBasico
                      botonText="Agregar"
                      botonClass={G.BotonAgregar}
                      botonIcon={faPlus}
                      click={(e) => {
                        AgregarPercepcion(e);
                      }}
                      contenedor=""
                    />
                    {/* Form */}
                    {estadoPercepcion && (
                      <div
                        className={
                          G.ContenedorBasico + G.FondoContenedor + " pb-2 mb-3"
                        }
                      >
                        <div className={G.ContenedorRow}>
                          <div className={G.InputFull}>
                            <div className={G.InputFull}>
                              <label
                                htmlFor="porcentaje"
                                className={G.LabelStyle}
                              >
                                Porcentaje
                              </label>
                              <input
                                type="number"
                                id="porcentaje"
                                name="porcentaje"
                                placeholder="Porcentaje"
                                autoComplete="off"
                                min={0}
                                autoFocus
                                disabled={modo == "Consultar"}
                                value={objetoPercepcion.porcentaje}
                                onChange={ValidarDataPercepcion}
                                className={G.InputBoton}
                              />
                            </div>
                            <div className={G.Input36}>
                              <div className={G.CheckStyle + G.Anidado}>
                                <Checkbox
                                  inputId="defaultPercepcion"
                                  id="default"
                                  name="default"
                                  value={objetoPercepcion.default}
                                  checked={objetoPercepcion.default}
                                  onChange={(e) => {
                                    setCheckedPercepcion(e.checked);
                                    ValidarDataPercepcion(e);
                                  }}
                                ></Checkbox>
                              </div>
                              <label
                                htmlFor="defaultPercepcion"
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
                              onClick={EnviarPercepcion}
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
                            onClick={() => setEstadoPercepcion(false)}
                            className={
                              G.BotonModalBase +
                              G.BotonCancelarModal +
                              " py-2 sm:py-1 px-3"
                            }
                          >
                            CERRAR
                          </button>
                        </div>
                        {/*footer*/}
                      </div>
                    )}
                    {/* Form */}
                    <DivTabla>
                      <TableBasic
                        id="tablaPercepcion"
                        columnas={colPercepcion}
                        datos={porcentajesPercepcion}
                      />
                    </DivTabla>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabView>

          <ToastContainer />
        </div>
      )}
    </>
  );
  //#endregion
};

export default Empresa;
