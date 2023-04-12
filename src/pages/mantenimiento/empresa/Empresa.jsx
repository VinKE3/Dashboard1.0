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
import { toast } from "react-toastify";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    /* display: none; */
  }
  & tbody td:first-child {
    /* display: none; */
  }
  & th:nth-child(3) {
    width: 90px;
  }
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;

const Empresa = ({ modo }) => {
  const [dataGeneral, setDataGeneral] = useState({
    id: "",
    numeroDocumentoIdentidad: "",
    nombre: "",
    direccion: " ",
    departamentoId: "",
    provinciaId: "",
    distritoId: "",
    telefono: "",
    celular: "",
    correoElectronico: "",
    observacion: "",
    concarEmpresaId: "",
    concarEmpresaNombre: "",
    concarUsuarioVenta: "",
    concarUsuarioCompra: "",
    concarUsuarioPago: "",
    concarUsuarioCobro: "",
    filtroFechaInicio: "",
    filtroFechaFin: "",
    anioHabilitado1: "",
    anioHabilitado2: "",
    mesesHabilitados: "",
    porcentajesIGV: [
      {
        porcentaje: 0,
        default: true,
      },
    ],
    porcentajesRetencion: [
      {
        porcentaje: 0,
        default: true,
      },
    ],
    porcentajesDetraccion: [
      {
        porcentaje: 0,
        default: true,
      },
    ],
    porcentajesPercepcion: [
      {
        porcentaje: 0,
        default: true,
      },
    ],
  });
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

  useEffect(() => {
    Configuracion();
  }, []);

  useEffect(() => {
    objetoIgv;
    objetoRetencion;
  }, [objetoIgv, objetoRetencion]);

  useEffect(() => {
    dataGeneral;
    mesesHabilitados;
  }, [dataGeneral, mesesHabilitados]);

  useEffect(() => {
    dataUbigeo;
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
    console.log("checkboxes", checkboxes);
    console.log("checkboxes2", checkboxes2);
  }, [checkboxes, checkboxes2]);

  const Configuracion = async () => {
    const result = await ApiMasy.get(`api/Empresa/Configuracion`);
    console.log("result", result);
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
    console.log(
      "meses habilitados",
      result.data.data.mesesHabilitados.split(",")
    );
    setDataGeneral(result.data.data);
    setPorcentajesIGV(igv);
    setPorcentajesRetencion(retencion);
    setPorcentajesDetraccion(detraccion);
    setPorcentajesPercepcion(percepcion);
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
  //?handleCheck1
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
    console.log(filteredMesesHabilitados.join(","));
  };

  //?handleCheck2
  const handleCheckAll2 = (event) => {
    const { checked } = event.target;
    console.log("checked2", checked);
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

  //*IGV
  //#region
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
          <Checkbox checked={true} />
        ) : (
          <Checkbox checked={false} />
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
        id: "",
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

  const EliminarIgv = async (id) => {
    const nuevoPorcentajesIGV = porcentajesIGV.filter((igv) => igv.id !== id);
    setDataGeneral({
      ...dataGeneral,
      porcentajesIGV: nuevoPorcentajesIGV,
    });
    document.getElementById("guardarTodo").click();
  };

  const EnviarIgv = async () => {
    if (objetoIgv.id == "") {
      porcentajesIGV.push({
        porcentaje: objetoIgv.porcentaje,
        default: objetoIgv.default,
      });
      setDataGeneral({
        ...dataGeneral,
        porcentajesIGV,
      });
    } else {
      porcentajesIGV[objetoIgv.id] = {
        porcentaje: objetoIgv.porcentaje,
        default: objetoIgv.default,
      };
      setDataGeneral({
        ...dataGeneral,
        porcentajesIGV,
      });
    }
    document.getElementById("guardarTodo").click();
  };
  //#endregion

  //*RETENCION
  //#region
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
          <Checkbox checked={true} />
        ) : (
          <Checkbox checked={false} />
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

  const EliminarRetencion = async (id) => {
    const nuevoPorcentajesRetencion = porcentajesRetencion.filter(
      (retencion) => retencion.id !== id
    );
    setDataGeneral({
      ...dataGeneral,
      porcentajesRetencion: nuevoPorcentajesRetencion,
    });
    document.getElementById("guardarTodo").click();
  };

  const AgregarRetencion = async (e, id = "") => {
    e.preventDefault();
    if (e.target.innerText == "AGREGAR") {
      setObjetoRetencion({
        id: "",
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
    if (objetoRetencion.id == "") {
      porcentajesRetencion.push({
        porcentaje: objetoRetencion.porcentaje,
        default: objetoRetencion.default,
      });
      setDataGeneral({
        ...dataGeneral,
        porcentajesRetencion,
      });
    } else {
      porcentajesRetencion[objetoRetencion.id] = {
        porcentaje: objetoRetencion.porcentaje,
        default: objetoRetencion.default,
      };
      setDataGeneral({
        ...dataGeneral,
        porcentajesRetencion,
      });
    }
    document.getElementById("guardarTodo").click();
  };

  //#endregion

  //*DETRACCION
  //#region
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
          <Checkbox checked={true} />
        ) : (
          <Checkbox checked={false} />
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
        id: "",
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

  const EliminarDetraccion = async (id) => {
    const nuevoPorcentajesDetraccion = porcentajesDetraccion.filter(
      (detraccion) => detraccion.id !== id
    );
    setDataGeneral({
      ...dataGeneral,
      porcentajesDetraccion: nuevoPorcentajesDetraccion,
    });
    document.getElementById("guardarTodo").click();
  };

  const EnviarIDetraccion = async () => {
    if (objetoDetraccion.id == "") {
      porcentajesDetraccion.push({
        porcentaje: objetoDetraccion.porcentaje,
        default: objetoDetraccion.default,
      });
      setDataGeneral({
        ...dataGeneral,
        porcentajesDetraccion,
      });
    } else {
      porcentajesDetraccion[objetoDetraccion.id] = {
        porcentaje: objetoDetraccion.porcentaje,
        default: objetoDetraccion.default,
      };
      setDataGeneral({
        ...dataGeneral,
        porcentajesDetraccion,
      });
    }
    document.getElementById("guardarTodo").click();
  };
  //#endregion

  //*PERCEPCION
  //#region
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
          <Checkbox checked={true} />
        ) : (
          <Checkbox checked={false} />
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
        id: "",
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

  const EliminarPercepcion = async (id) => {
    const nuevoPorcentajesPercepcion = porcentajesPercepcion.filter(
      (percepcion) => percepcion.id !== id
    );
    setDataGeneral({
      ...dataGeneral,
      porcentajesPercepcion: nuevoPorcentajesPercepcion,
    });
    document.getElementById("guardarTodo").click();
  };

  const EnviarPercepcion = async () => {
    if (objetoPercepcion.id == "") {
      porcentajesPercepcion.push({
        porcentaje: objetoPercepcion.porcentaje,
        default: objetoPercepcion.default,
      });
      setDataGeneral({
        ...dataGeneral,
        porcentajesPercepcion,
      });
    } else {
      porcentajesPercepcion[objetoPercepcion.id] = {
        porcentaje: objetoPercepcion.porcentaje,
        default: objetoPercepcion.default,
      };
      setDataGeneral({
        ...dataGeneral,
        porcentajesPercepcion,
      });
    }
    document.getElementById("guardarTodo").click();
  };
  //#endregion

  const GuardarTodo = async (e) => {
    e.preventDefault();
    const result = await ApiMasy.put(`api/Empresa/Configuracion`, dataGeneral);
    console.log(result);
  };

  return (
    <div className="card">
      <TabView>
        <TabPanel
          header="Datos Principales"
          leftIcon="pi pi-user mr-2"
          style={{ color: "white" }}
        >
          <div className="grid gap-y-3 md:gap-x-2">
            <div className={Global.ContenedorVarios}>
              <div className={Global.ContenedorInput96}>
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
                  value={dataGeneral.numeroDocumentoIdentidad}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.ContenedorInputFull}>
                <label htmlFor="nombre" className={Global.LabelStyle}>
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  autoComplete="off"
                  placeholder="Nombre"
                  value={dataGeneral.nombre}
                  typeof="text"
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
            <div className={Global.ContenedorVarios}>
              <div className={Global.ContenedorInput96}>
                <label htmlFor="telefono" className={Global.LabelStyle}>
                  Teléfono
                </label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  autoComplete="off"
                  placeholder="Teléfono"
                  value={dataGeneral.telefono}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.ContenedorInputFull}>
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
                  value={dataGeneral.correoElectronico}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
            <div className={Global.ContenedorVarios}>
              <div className={Global.ContenedorInput96}>
                <label htmlFor="celular" className={Global.LabelStyle}>
                  Celular
                </label>
                <input
                  type="text"
                  id="celular"
                  name="celular"
                  autoComplete="off"
                  placeholder="Celular"
                  value={dataGeneral.celular}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.ContenedorInputFull}>
                <label htmlFor="observacion" className={Global.LabelStyle}>
                  Observacion
                </label>
                <input
                  type="text"
                  id="observacion"
                  name="observacion"
                  autoComplete="off"
                  placeholder="Observacion"
                  value={dataGeneral.observacion}
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
                value={dataGeneral.direccion}
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
            <div className={Global.ContenedorVarios}>
              <div className={Global.ContenedorInput96}>
                <label htmlFor="concarEmpresaId" className={Global.LabelStyle}>
                  Id Concar
                </label>
                <input
                  type="text"
                  id="concarEmpresaId"
                  name="concarEmpresaId"
                  autoComplete="off"
                  placeholder="Número Concar Id"
                  value={dataGeneral.concarEmpresaId}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.ContenedorInputFull}>
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
                  value={dataGeneral.concarEmpresaNombre}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
            <div className={Global.ContenedorVarios}>
              <div className={Global.ContenedorInputFull}>
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
                  value={dataGeneral.concarUsuarioVenta}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.ContenedorInputFull}>
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
                  value={dataGeneral.concarUsuarioCompra}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
            <div className={Global.ContenedorVarios}>
              <div className={Global.ContenedorInputFull}>
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
              <div className={Global.ContenedorInputFull}>
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
                  value={dataGeneral.concarUsuarioCobro}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
            <div className={Global.ContenedorInputFull}>
              <h1 className=" uppercase font-bold">Filtro de Fechas</h1>
            </div>
            <div className={Global.ContenedorVarios}>
              <div className={Global.ContenedorInputFull}>
                <label
                  htmlFor="filtroFechaInicio"
                  className={Global.LabelStyle}
                >
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  id="filtroFechaInicio"
                  name="filtroFechaInicio"
                  autoComplete="off"
                  placeholder="Fecha Inicio"
                  value={moment(dataGeneral.filtroFechaInicio).format(
                    "yyyy-MM-DD"
                  )}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.ContenedorInputFull}>
                <label htmlFor="filtroFechaFin" className={Global.LabelStyle}>
                  Fecha Fin
                </label>
                <input
                  type="date"
                  id="filtroFechaFin"
                  name="filtroFechaFin"
                  autoComplete="off"
                  placeholder="Fecha Fin"
                  value={moment(dataGeneral.filtroFechaFin).format(
                    "yyyy-MM-DD"
                  )}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel
          header="Habilitar Periodo"
          leftIcon="pi pi-calendar mr-2"
          style={{ color: "white" }}
        >
          <div className={Global.ContenedorInputFull}>
            <label htmlFor="anioHabilitado1" className={Global.LabelStyle}>
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
              className={Global.InputStyle}
            />
            <div className="flex mt-2 gap-2 ml-2">
              <label>Todos</label>
              <Checkbox
                id="todos"
                name="todos"
                value={checkboxes.checked}
                onChange={handleCheckAll}
                checked={checkboxes.checked}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4 ml-2">
            <div className="flex gap-3">
              <Checkbox
                id="enero"
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
              <label>Enero</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                id="febrero"
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
              <label>Febrero</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                id="marzo"
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
              <label>Marzo</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                id="abril"
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
              <label>Abril</label>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4 ml-2">
            <div className="flex gap-3">
              <Checkbox
                id="mayo"
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
              <label>Mayo</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                id="junio"
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
              <label>Junio</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                id="julio"
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
              <label>Julio</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                id="agosto"
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
              <label>Agosto</label>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4 ml-2">
            <div className="flex gap-3">
              <Checkbox
                id="septiembre"
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
              <label>Septiembre</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                id="octubre"
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
              <label>Octubre</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                id="noviembre"
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
              <label>Noviembre</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                id="diciembre"
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
              <label>Diciembre</label>
            </div>
          </div>
          <div className="mt-4">
            <div className={Global.ContenedorInputFull}>
              <label htmlFor="anioHabilitado2" className={Global.LabelStyle}>
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
                className={Global.InputStyle}
              />
              <div className="flex mt-2 gap-2 ml-2">
                <label>Todos</label>
                <Checkbox
                  id="todos2"
                  name="todos2"
                  value={checkboxes2.checked}
                  onChange={handleCheckAll2}
                  checked={checkboxes2.checked}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4 ml-2">
              <div className="flex gap-3">
                <Checkbox
                  id="enero2"
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
                <label>Enero</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  id="febrero2"
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
                <label>Febrero</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  id="marzo2"
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
                <label>Marzo</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  id="abril2"
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
                <label>Abril</label>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4 ml-2">
              <div className="flex gap-3">
                <Checkbox
                  id="mayo2"
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
                <label>Mayo</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  id="junio2"
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
                <label>Junio</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  id="julio2"
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
                <label>Julio</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  id="agosto2"
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
                <label>Agosto</label>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4 ml-2">
              <div className="flex gap-3">
                <Checkbox
                  id="septiembre2"
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
                <label>Septiembre</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  id="octubre2"
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
                <label>Octubre</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  id="noviembre2"
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
                <label>Noviembre</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  id="diciembre2"
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
                <label>Diciembre</label>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel
          header="Configuracion"
          leftIcon="pi pi-calendar mr-2"
          style={{ color: "white" }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <h1 className="text-center mb-2 text-primary font-bold">IGV</h1>
              <BotonBasico
                botonText="Agregar"
                botonClass={Global.BotonAgregar}
                botonIcon={faPlus}
                click={(e) => {
                  AgregarIgv(e);
                }}
              />
              {/* Form Direcciones */}
              {estadoIgv && (
                <div className={Global.FormSecundario}>
                  <div className="flex">
                    <label htmlFor="porcentaje" className={Global.LabelStyle}>
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
                  <div className="flex">
                    <label
                      htmlFor="default"
                      className="inline-flex items-center px-3 border  bg-gray-800 text-light border-gray-600 font-semibold "
                    >
                      Default
                    </label>
                    <div className="mx-2">
                      <Checkbox
                        id="default"
                        name="default"
                        onChange={(e) => {
                          setCheckedIgv(e.checked);
                          ValidarDataIgv(e);
                        }}
                        checked={objetoIgv.default ? checkedIgv : ""}
                        value={objetoIgv.default ? true : false}
                      ></Checkbox>
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
                        className={Global.BotonOkModal + " py-2 sm:py-1 px-3"}
                      >
                        Guardar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setEstadoIgv(false)}
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
              <TablaStyle>
                <TableBasic columnas={colIgv} datos={porcentajesIGV} />
              </TablaStyle>
            </div>
            <div className="card">
              <h1 className="text-center mb-2 text-primary font-bold uppercase">
                Retenciones
              </h1>
              <BotonBasico
                botonText="Agregar"
                botonClass={Global.BotonAgregar}
                botonIcon={faPlus}
                click={(e) => {
                  AgregarRetencion(e);
                }}
              />
              {/* Form Direcciones */}
              {estadoRetencion && (
                <div className={Global.FormSecundario}>
                  <div className="flex">
                    <label htmlFor="porcentaje" className={Global.LabelStyle}>
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
                  <div className="flex">
                    <label
                      htmlFor="default"
                      className="inline-flex items-center px-3 border  bg-gray-800 text-light border-gray-600 font-semibold "
                    >
                      Default
                    </label>
                    <div className="mx-2">
                      <Checkbox
                        id="default"
                        name="default"
                        onChange={(e) => {
                          setCheckedRetencion(e.checked);
                          ValidarDataRetencion(e);
                        }}
                        checked={
                          objetoRetencion.default ? checkedRetencion : ""
                        }
                        value={objetoRetencion.default ? true : false}
                      ></Checkbox>
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
                        className={Global.BotonOkModal + " py-2 sm:py-1 px-3"}
                      >
                        Guardar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setEstadoRetencion(false)}
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
              <TablaStyle>
                <TableBasic
                  columnas={colRetencion}
                  datos={porcentajesRetencion}
                />
              </TablaStyle>
            </div>
            <div className="card">
              <h1 className="text-center mb-2 text-primary font-bold uppercase">
                Detracción
              </h1>
              <BotonBasico
                botonText="Agregar"
                botonClass={Global.BotonAgregar}
                botonIcon={faPlus}
                click={(e) => {
                  AgregarDetraccion(e);
                }}
              />
              {/* Form Direcciones */}
              {estadoDetraccion && (
                <div className={Global.FormSecundario}>
                  <div className="flex">
                    <label htmlFor="porcentaje" className={Global.LabelStyle}>
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
                  <div className="flex">
                    <label
                      htmlFor="default"
                      className="inline-flex items-center px-3 border  bg-gray-800 text-light border-gray-600 font-semibold "
                    >
                      Default
                    </label>
                    <div className="mx-2">
                      <Checkbox
                        id="default"
                        name="default"
                        onChange={(e) => {
                          setCheckedDetraccion(e.checked);
                          ValidarDataDetraccion(e);
                        }}
                        checked={
                          objetoDetraccion.default ? checkedDetraccion : ""
                        }
                        value={objetoDetraccion.default ? true : false}
                      ></Checkbox>
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
                        className={Global.BotonOkModal + " py-2 sm:py-1 px-3"}
                      >
                        Guardar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setEstadoDetraccion(false)}
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
              <TablaStyle>
                <TableBasic
                  columnas={colDetraccion}
                  datos={porcentajesDetraccion}
                />
              </TablaStyle>
            </div>
            <div className="card">
              <h1 className="text-center mb-2 text-primary font-bold uppercase">
                Percepción
              </h1>
              <BotonBasico
                botonText="Agregar"
                botonClass={Global.BotonAgregar}
                botonIcon={faPlus}
                click={(e) => {
                  AgregarPercepcion(e);
                }}
              />
              {/* Form Direcciones */}
              {estadoPercepcion && (
                <div className={Global.FormSecundario}>
                  <div className="flex">
                    <label htmlFor="porcentaje" className={Global.LabelStyle}>
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
                  <div className="flex">
                    <label
                      htmlFor="default"
                      className="inline-flex items-center px-3 border  bg-gray-800 text-light border-gray-600 font-semibold "
                    >
                      Default
                    </label>
                    <div className="mx-2">
                      <Checkbox
                        id="default"
                        name="default"
                        onChange={(e) => {
                          setCheckedPercepcion(e.checked);
                          ValidarDataPercepcion(e);
                        }}
                        checked={
                          objetoPercepcion.default ? checkedPercepcion : ""
                        }
                        value={objetoPercepcion.default ? true : false}
                      ></Checkbox>
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
                        className={Global.BotonOkModal + " py-2 sm:py-1 px-3"}
                      >
                        Guardar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setEstadoPercepcion(false)}
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
              <TablaStyle>
                <TableBasic
                  columnas={colPercepcion}
                  datos={porcentajesPercepcion}
                />
              </TablaStyle>
            </div>
          </div>
        </TabPanel>
      </TabView>
      <div className="mt-2">
        <button
          id="guardarTodo"
          className={Global.BotonOkModal}
          type="button"
          onClick={GuardarTodo}
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default Empresa;
