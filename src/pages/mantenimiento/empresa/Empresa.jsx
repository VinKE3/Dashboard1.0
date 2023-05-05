import { useState, useEffect } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import * as Global from "../../../components/Global";
import Ubigeo from "../../../components/filtros/Ubigeo";
import moment from "moment";
import { Checkbox } from "primereact/checkbox";
import ApiMasy from "../../../api/ApiMasy";
import styled from "styled-components";
import TableBasic from "../../../components/tablas/TableBasic";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import Swal from "sweetalert2";

//#region Estilos
const TablaStyle = styled.div`
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
  const [dataGeneral, setDataGeneral] = useState([]);
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
      setDataGeneral({
        ...dataGeneral,
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
  }, [dataGeneral, mesesHabilitados]);

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
  const handleCheck = (mes, checked) => {
    setCheckboxes({ ...checkboxes, [mes]: checked });
    const index = meses[mes];
    if (mes !== undefined) {
      if (mes[1] > 11) {
        mesesHabilitados[mes[1]] = checked
          ? dataGeneral.anioHabilitado2 + ("0" + (mes[0] + 1)).slice(-2)
          : "";
      } else {
        mesesHabilitados[mes[1]] = checked
          ? dataGeneral.anioHabilitado1 + ("0" + (mes[0] + 1)).slice(-2)
          : "";
      }
      // if (mesesHabilitados[index] === "") {
      //   mesesHabilitados[index] = "";
      // }
    }
    const filteredMesesHabilitados = mesesHabilitados.filter(
      (mes) => mes !== null && mes !== undefined && mes !== ""
    );
    setDataGeneral({
      ...dataGeneral,
      mesesHabilitados: filteredMesesHabilitados.join(","),
    });
  };
  const handleCheckAll = (event) => {
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
    setDataGeneral({
      ...dataGeneral,
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
  const handleCheckAll2 = (event) => {
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
    setDataGeneral({
      ...dataGeneral,
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
    setDataGeneral(result.data.data);
    setPorcentajesIGV(igv);
    setPorcentajesRetencion(retencion);
    setPorcentajesDetraccion(detraccion);
    setPorcentajesPercepcion(percepcion);
  };
  const GuardarTodo = async (e) => {
    e.preventDefault();
    const result = await ApiMasy.put(`api/Empresa/Configuracion`, dataGeneral);
    if (result.name == "AxiosError") {
      if (Object.entries(result.response.data).length > 0) {
        toast.error(result.response.data.messages[0].textos[0], {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error(result.message, {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } else {
      toast.success(result.data.messages[0].textos[0], {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
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
              <div className={Global.TablaBotonModificar}>
                <button
                  id="boton-modificar"
                  onClick={(e) => AgregarIgv(e, row.values.id)}
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
                    EliminarIgv(row.values.id);
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
    e.preventDefault();
    if (e.target.innerText == "AGREGAR") {
      setObjetoIgv({
        id: -1,
        porcentaje: 0,
        default: false,
      });
    } else {
      setObjetoIgv({
        id: id,
        porcentaje: dataGeneral.porcentajesIGV[id].porcentaje,
        default: dataGeneral.porcentajesIGV[id].default,
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
    setDataGeneral({
      ...dataGeneral,
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
        setDataGeneral({
          ...dataGeneral,
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
              <div className={Global.TablaBotonModificar}>
                <button
                  id="boton-modificar"
                  onClick={(e) => AgregarRetencion(e, row.values.id)}
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
                    EliminarRetencion(row.values.id);
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
    e.preventDefault();
    if (e.target.innerText == "AGREGAR") {
      setObjetoRetencion({
        id: -1,
        porcentaje: 0,
        default: false,
      });
    } else {
      setObjetoRetencion({
        id: id,
        porcentaje: dataGeneral.porcentajesRetencion[id].porcentaje,
        default: dataGeneral.porcentajesRetencion[id].default,
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
    setDataGeneral({
      ...dataGeneral,
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
        setDataGeneral({
          ...dataGeneral,
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
              <div className={Global.TablaBotonModificar}>
                <button
                  id="boton-modificar"
                  onClick={(e) => AgregarDetraccion(e, row.values.id)}
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
                    EliminarDetraccion(row.values.id);
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
    e.preventDefault();
    if (e.target.innerText == "AGREGAR") {
      setObjetoDetraccion({
        id: -1,
        porcentaje: 0,
        default: false,
      });
    } else {
      setObjetoDetraccion({
        id: id,
        porcentaje: dataGeneral.porcentajesDetraccion[id].porcentaje,
        default: dataGeneral.porcentajesDetraccion[id].default,
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
    setDataGeneral({
      ...dataGeneral,
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
        setDataGeneral({
          ...dataGeneral,
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
              <div className={Global.TablaBotonModificar}>
                <button
                  id="boton-modificar"
                  onClick={(e) => AgregarPercepcion(e, row.values.id)}
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
                    EliminarPercepcion(row.values.id);
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
    e.preventDefault();
    if (e.target.innerText == "AGREGAR") {
      setObjetoPercepcion({
        id: -1,
        porcentaje: 0,
        default: false,
      });
    } else {
      setObjetoPercepcion({
        id: id,
        porcentaje: dataGeneral.porcentajesPercepcion[id].porcentaje,
        default: dataGeneral.porcentajesPercepcion[id].default,
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
    setDataGeneral({
      ...dataGeneral,
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
        setDataGeneral({
          ...dataGeneral,
          porcentajesPercepcion: model,
        });
      }
    });
  };
  //#endregion

  //#region Render
  return (
    <>
      {Object.entries(dataGeneral).length > 0 && (
        <div className={Global.Form}>
          <TabView>
            <TabPanel
              header="Datos Principales"
              leftIcon="pi pi-user mr-2"
              style={{ color: "white" }}
            >
              <div className={Global.ContenedorBasico + " pt-5 rounded-t-none"}>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.Input60pct}>
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
                      value={dataGeneral.numeroDocumentoIdentidad ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputFull}>
                    <label htmlFor="nombre" className={Global.LabelStyle}>
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      autoComplete="off"
                      placeholder="Nombre"
                      value={dataGeneral.nombre ?? ""}
                      typeof="text"
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.Input60pct}>
                    <label htmlFor="telefono" className={Global.LabelStyle}>
                      Teléfono
                    </label>
                    <input
                      type="text"
                      id="telefono"
                      name="telefono"
                      autoComplete="off"
                      placeholder="Teléfono"
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
                      value={dataGeneral.correoElectronico ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.Input60pct}>
                    <label htmlFor="celular" className={Global.LabelStyle}>
                      Celular
                    </label>
                    <input
                      type="text"
                      id="celular"
                      name="celular"
                      autoComplete="off"
                      placeholder="Celular"
                      value={dataGeneral.celular ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputFull}>
                    <label htmlFor="observacion" className={Global.LabelStyle}>
                      Observacion
                    </label>
                    <input
                      type="text"
                      id="observacion"
                      name="observacion"
                      autoComplete="off"
                      placeholder="Observacion"
                      value={dataGeneral.observacion ?? ""}
                      onChange={ValidarData}
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
                    value={dataGeneral.direccion ?? ""}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <Ubigeo
                  setDataUbigeo={setDataUbigeo}
                  id={["departamentoId", "provinciaId", "distritoId"]}
                  dato={{
                    departamentoId: dataGeneral.departamentoId,
                    provinciaId: dataGeneral.provinciaId,
                    distritoId: dataGeneral.distritoId,
                  }}
                ></Ubigeo>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.Input40pct}>
                    <label
                      htmlFor="concarEmpresaId"
                      className={Global.LabelStyle}
                    >
                      Id Concar
                    </label>
                    <input
                      type="text"
                      id="concarEmpresaId"
                      name="concarEmpresaId"
                      autoComplete="off"
                      placeholder="Número Concar Id"
                      value={dataGeneral.concarEmpresaId ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="concarEmpresaNombre"
                      className={Global.LabelStyle}
                    >
                      Empresa Concar
                    </label>
                    <input
                      type="text"
                      id="concarEmpresaNombre"
                      name="concarEmpresaNombre"
                      autoComplete="off"
                      placeholder="Empresa Concar"
                      value={dataGeneral.concarEmpresaNombre ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputMitad}>
                    <label
                      htmlFor="concarUsuarioVenta"
                      className={Global.LabelStyle}
                    >
                      Usuario Venta
                    </label>
                    <input
                      type="text"
                      id="concarUsuarioVenta"
                      name="concarUsuarioVenta"
                      autoComplete="off"
                      placeholder="Usuario Venta"
                      value={dataGeneral.concarUsuarioVenta ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputMitad}>
                    <label
                      htmlFor="concarUsuarioCompra"
                      className={Global.LabelStyle}
                    >
                      Usuario Compra
                    </label>
                    <input
                      type="text"
                      id="concarUsuarioCompra"
                      name="concarUsuarioCompra"
                      autoComplete="off"
                      placeholder="Usuario Compra"
                      value={dataGeneral.concarUsuarioCompra ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputMitad}>
                    <label
                      htmlFor="concarUsuarioPago"
                      className={Global.LabelStyle}
                    >
                      Usuario Pago
                    </label>
                    <input
                      type="text"
                      id="concarUsuarioPago"
                      name="concarUsuarioPago"
                      autoComplete="off"
                      placeholder="Usuario Pago"
                      value={dataGeneral.concarUsuarioPago ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputMitad}>
                    <label
                      htmlFor="concarUsuarioCobro"
                      className={Global.LabelStyle}
                    >
                      Usuario Cobro
                    </label>
                    <input
                      type="text"
                      id="concarUsuarioCobro"
                      name="concarUsuarioCobro"
                      autoComplete="off"
                      placeholder="Usuario Cobro"
                      value={dataGeneral.concarUsuarioCobro ?? ""}
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputMitad}>
                    <label
                      htmlFor="filtroFechaInicio"
                      className={Global.LabelStyle}
                    >
                      Desde
                    </label>
                    <input
                      type="date"
                      id="filtroFechaInicio"
                      name="filtroFechaInicio"
                      autoComplete="off"
                      value={
                        dataGeneral.filtroFechaInicio == null
                          ? ""
                          : moment(dataGeneral.filtroFechaInicio).format(
                              "yyyy-MM-DD"
                            )
                      }
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputMitad}>
                    <label
                      htmlFor="filtroFechaFin"
                      className={Global.LabelStyle}
                    >
                      Hasta
                    </label>
                    <input
                      type="date"
                      id="filtroFechaFin"
                      name="filtroFechaFin"
                      autoComplete="off"
                      value={
                        dataGeneral.filtroFechaFin == null
                          ? ""
                          : moment(dataGeneral.filtroFechaFin).format(
                              "yyyy-MM-DD"
                            )
                      }
                      onChange={ValidarData}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className="flex justify-end border-t pt-2 border-light ">
                  <button
                    id="guardarTodo"
                    className={Global.BotonModalBase + Global.BotonOkModal}
                    type="button"
                    onClick={GuardarTodo}
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
              <div className={Global.ContenedorBasico + " pt-5 rounded-t-none"}>
                <div className={Global.ContenedorRow + " !gap-x-0 mb-1"}>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="anioHabilitado1"
                      className={Global.LabelStyle}
                    >
                      Año 1
                    </label>
                    <input
                      type="number"
                      id="anioHabilitado1"
                      name="anioHabilitado1"
                      autoComplete="off"
                      placeholder="año"
                      value={dataGeneral.anioHabilitado1}
                      onChange={ValidarData}
                      className={Global.InputBoton}
                    />
                  </div>

                  <div className="flex">
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <Checkbox
                        inputId="todos"
                        name="todos"
                        value={checkboxes.checked}
                        onChange={handleCheckAll}
                        checked={checkboxes.checked}
                      />
                    </div>
                    <label htmlFor="todos" className={Global.LabelCheckStyle}>
                      Todos
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:mt-1">
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="enero"
                        name="enero"
                        value={mesesHabilitados[0]}
                        onChange={(e) => {
                          handleCheck([0, 0], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Enero
                    </label>
                  </div>
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="febrero"
                        name="febrero"
                        value={mesesHabilitados[1]}
                        onChange={(e) => {
                          handleCheck([1, 1], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Febrero
                    </label>
                  </div>
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="marzo"
                        name="marzo"
                        value={mesesHabilitados[2]}
                        onChange={(e) => {
                          handleCheck([2, 2], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Marzo
                    </label>
                  </div>
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="abril"
                        name="abril"
                        value={mesesHabilitados[3]}
                        onChange={(e) => {
                          handleCheck([3, 3], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Abril
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:mt-1">
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="mayo"
                        name="mayo"
                        value={mesesHabilitados[4]}
                        onChange={(e) => {
                          handleCheck([4, 4], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Mayo
                    </label>
                  </div>
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="junio"
                        name="junio"
                        value={mesesHabilitados[5]}
                        onChange={(e) => {
                          handleCheck([5, 5], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Junio
                    </label>
                  </div>
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="julio"
                        name="julio"
                        value={mesesHabilitados[6]}
                        onChange={(e) => {
                          handleCheck([6, 6], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Julio
                    </label>
                  </div>
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="agosto"
                        name="agosto"
                        value={mesesHabilitados[7]}
                        onChange={(e) => {
                          handleCheck([7, 7], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Agosto
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:mt-1">
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="septiembre"
                        name="septiembre"
                        value={mesesHabilitados[8]}
                        onChange={(e) => {
                          handleCheck([8, 8], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Setiembre
                    </label>
                  </div>
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="octubre"
                        name="octubre"
                        value={mesesHabilitados[9]}
                        onChange={(e) => {
                          handleCheck([9, 9], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Octubre
                    </label>
                  </div>
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="noviembre"
                        name="noviembre"
                        value={mesesHabilitados[10]}
                        onChange={(e) => {
                          handleCheck([10, 10], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Noviembre
                    </label>
                  </div>
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="diciembre"
                        name="diciembre"
                        value={mesesHabilitados[11]}
                        onChange={(e) => {
                          handleCheck([11, 11], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Diciembre
                    </label>
                  </div>
                </div>

                <div className={Global.ContenedorRow + " !gap-x-0 mt-4 mb-1"}>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="anioHabilitado2"
                      className={Global.LabelStyle}
                    >
                      Año 2
                    </label>
                    <input
                      type="number"
                      id="anioHabilitado2"
                      name="anioHabilitado2"
                      autoComplete="off"
                      placeholder="año"
                      value={dataGeneral.anioHabilitado2}
                      onChange={ValidarData}
                      className={Global.InputBoton}
                    />
                  </div>
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <Checkbox
                        inputId="todos2"
                        name="todos2"
                        value={checkboxes2.checked}
                        onChange={handleCheckAll2}
                        checked={checkboxes2.checked}
                      />
                    </div>
                    <label htmlFor="todos2" className={Global.LabelCheckStyle}>
                      Todos
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:mt-1">
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="enero2"
                        name="enero2"
                        value={mesesHabilitados[12]}
                        onChange={(e) => {
                          handleCheck([0, 12], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Enero
                    </label>
                  </div>
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="febrero2"
                        name="febrero2"
                        value={mesesHabilitados[13]}
                        onChange={(e) => {
                          handleCheck([1, 13], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Febrero
                    </label>
                  </div>
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="marzo2"
                        name="marzo2"
                        value={mesesHabilitados[14]}
                        onChange={(e) => {
                          handleCheck([2, 14], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Marzo
                    </label>
                  </div>
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="abril2"
                        name="abril2"
                        value={mesesHabilitados[15]}
                        onChange={(e) => {
                          handleCheck([3, 15], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Abril
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:mt-1">
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="mayo2"
                        name="mayo2"
                        value={mesesHabilitados[16]}
                        onChange={(e) => {
                          handleCheck([4, 16], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Mayo
                    </label>
                  </div>
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="junio2"
                        name="junio2"
                        value={mesesHabilitados[17]}
                        onChange={(e) => {
                          handleCheck([5, 17], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Junio
                    </label>
                  </div>
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="julio2"
                        name="julio2"
                        value={mesesHabilitados[18]}
                        onChange={(e) => {
                          handleCheck([6, 18], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Julio
                    </label>
                  </div>
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="agosto2"
                        name="agosto2"
                        value={mesesHabilitados[19]}
                        onChange={(e) => {
                          handleCheck([7, 19], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Agosto
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:mt-1">
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="septiembre2"
                        name="septiembre2"
                        value={mesesHabilitados[20]}
                        onChange={(e) => {
                          handleCheck([8, 20], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Setiembre
                    </label>
                  </div>
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="octubre2"
                        name="octubre2"
                        value={mesesHabilitados[21]}
                        onChange={(e) => {
                          handleCheck([9, 21], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Octubre
                    </label>
                  </div>
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="noviembre2"
                        name="noviembre2"
                        value={mesesHabilitados[22]}
                        onChange={(e) => {
                          handleCheck([10, 22], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Noviembre
                    </label>
                  </div>
                  <div className="flex">
                    <div className={Global.CheckStyle + Global.SinBorde}>
                      <Checkbox
                        inputId="diciembre2"
                        name="diciembre2"
                        value={mesesHabilitados[23]}
                        onChange={(e) => {
                          handleCheck([11, 23], e.target.checked);
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
                      className={Global.LabelCheckStyle + Global.SinBorde}
                    >
                      Diciembre
                    </label>
                  </div>
                </div>

                <div className="mt-10 pt-3 border-t border-light flex justify-end">
                  <button
                    id="guardarTodo"
                    className={Global.BotonModalBase + Global.BotonOkModal}
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
              <div className={Global.ContenedorBasico + " pt-2 rounded-t-none"}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="card">
                    <h4 className={Global.TituloH4}>IGV</h4>
                    <BotonBasico
                      botonText="Agregar"
                      botonClass={Global.BotonAgregar}
                      botonIcon={faPlus}
                      click={(e) => {
                        AgregarIgv(e);
                      }}
                      containerClass="mb-3"
                    />
                    {/* Form */}
                    {estadoIgv && (
                      <div
                        className={
                          Global.ContenedorBasico +
                          Global.FondoContenedor +
                          " pb-1 mb-2"
                        }
                      >
                        <div className={Global.ContenedorRow}>
                          <div className={Global.InputFull}>
                            <label
                              htmlFor="porcentaje"
                              className={Global.LabelStyle}
                            >
                              Porcentaje
                            </label>
                            <input
                              type="number"
                              id="porcentaje"
                              name="porcentaje"
                              autoComplete="off"
                              placeholder="Porcentaje"
                              readOnly={modo == "Consultar" ? true : false}
                              value={objetoIgv.porcentaje}
                              onChange={ValidarDataIgv}
                              className={Global.InputStyle}
                            />
                          </div>
                          <div className={Global.Input36}>
                            <label
                              htmlFor="defaultIgv"
                              className={Global.LabelStyle}
                            >
                              Default
                            </label>
                            <div className={Global.InputStyle}>
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
                            onClick={() => setEstadoIgv(false)}
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
                    <TablaStyle>
                      <TableBasic columnas={colIgv} datos={porcentajesIGV} />
                    </TablaStyle>
                  </div>
                  <div className="card">
                    <h4 className={Global.TituloH4}>RETENCIONES</h4>
                    <BotonBasico
                      botonText="Agregar"
                      botonClass={Global.BotonAgregar}
                      botonIcon={faPlus}
                      click={(e) => {
                        AgregarRetencion(e);
                      }}
                      containerClass="mb-3"
                    />
                    {/* Form */}
                    {estadoRetencion && (
                      <div
                        className={
                          Global.ContenedorBasico +
                          Global.FondoContenedor +
                          " pb-1 mb-2"
                        }
                      >
                        <div className={Global.ContenedorRow}>
                          <div className={Global.InputFull}>
                            <label
                              htmlFor="porcentaje"
                              className={Global.LabelStyle}
                            >
                              Porcentaje
                            </label>
                            <input
                              type="number"
                              id="porcentaje"
                              name="porcentaje"
                              autoComplete="off"
                              placeholder="Porcentaje"
                              readOnly={modo == "Consultar" ? true : false}
                              value={objetoRetencion.porcentaje}
                              onChange={ValidarDataRetencion}
                              className={Global.InputStyle}
                            />
                          </div>
                          <div className={Global.Input36}>
                            <label
                              htmlFor="defaultRetencion"
                              className={Global.LabelStyle}
                            >
                              Default
                            </label>
                            <div className={Global.InputStyle}>
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
                            onClick={() => setEstadoRetencion(false)}
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
                    {/* Form */}
                    <TablaStyle>
                      <TableBasic
                        columnas={colRetencion}
                        datos={porcentajesRetencion}
                      />
                    </TablaStyle>
                  </div>
                  <div className="card">
                    <h4 className={Global.TituloH4}>DETRACCIONES</h4>
                    <BotonBasico
                      botonText="Agregar"
                      botonClass={Global.BotonAgregar}
                      botonIcon={faPlus}
                      click={(e) => {
                        AgregarDetraccion(e);
                      }}
                      containerClass="mb-3"
                    />
                    {/* Form */}
                    {estadoDetraccion && (
                      <div
                        className={
                          Global.ContenedorBasico +
                          Global.FondoContenedor +
                          " pb-1 mb-2"
                        }
                      >
                        <div className={Global.ContenedorRow}>
                          <div className={Global.InputFull}>
                            <label
                              htmlFor="porcentaje"
                              className={Global.LabelStyle}
                            >
                              Porcentaje
                            </label>
                            <input
                              type="number"
                              id="porcentaje"
                              name="porcentaje"
                              autoComplete="off"
                              placeholder="Porcentaje"
                              readOnly={modo == "Consultar" ? true : false}
                              value={objetoDetraccion.porcentaje}
                              onChange={ValidarDataDetraccion}
                              className={Global.InputStyle}
                            />
                          </div>
                          <div className={Global.Input36}>
                            <label
                              htmlFor="defaultDetraccion"
                              className={Global.LabelStyle}
                            >
                              Default
                            </label>
                            <div className={Global.InputStyle}>
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
                            onClick={() => setEstadoDetraccion(false)}
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
                    {/* Form */}
                    <TablaStyle>
                      <TableBasic
                        columnas={colDetraccion}
                        datos={porcentajesDetraccion}
                      />
                    </TablaStyle>
                  </div>
                  <div className="card">
                    <h4 className={Global.TituloH4}>PERCEPCIONES</h4>
                    <BotonBasico
                      botonText="Agregar"
                      botonClass={Global.BotonAgregar}
                      botonIcon={faPlus}
                      click={(e) => {
                        AgregarPercepcion(e);
                      }}
                      containerClass="mb-3"
                    />
                    {/* Form */}
                    {estadoPercepcion && (
                      <div
                        className={
                          Global.ContenedorBasico +
                          Global.FondoContenedor +
                          " pb-1 mb-2"
                        }
                      >
                        <div className={Global.ContenedorRow}>
                          <div className={Global.InputFull}>
                            <label
                              htmlFor="porcentaje"
                              className={Global.LabelStyle}
                            >
                              Porcentaje
                            </label>
                            <input
                              type="number"
                              id="porcentaje"
                              name="porcentaje"
                              autoComplete="off"
                              placeholder="Porcentaje"
                              readOnly={modo == "Consultar" ? true : false}
                              value={objetoPercepcion.porcentaje}
                              onChange={ValidarDataPercepcion}
                              className={Global.InputStyle}
                            />
                          </div>
                          <div className={Global.Input36}>
                            <label
                              htmlFor="defaultPercepcion"
                              className={Global.LabelStyle}
                            >
                              Default
                            </label>
                            <div className={Global.InputStyle}>
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
                            onClick={() => setEstadoPercepcion(false)}
                            className={
                              Global.BotonModalBase +
                              Global.BotonCancelarModal +
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
                    <TablaStyle>
                      <TableBasic
                        columnas={colPercepcion}
                        datos={porcentajesPercepcion}
                      />
                    </TablaStyle>
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
