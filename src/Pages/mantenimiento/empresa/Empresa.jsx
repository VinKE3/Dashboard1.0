import { useState, useEffect } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import * as Global from "../../../components/Global";
import Ubigeo from "../../../Components/filtros/Ubigeo";
import moment from "moment";
import { Checkbox } from "primereact/checkbox";
import ApiMasy from "../../../api/ApiMasy";
import styled from "styled-components";
import TableBasic from "../../../components/tablas/TableBasic";
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import Update from "../../../components/CRUD/Update";
import { id } from "date-fns/locale";

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
  // const [checkboxes2, setCheckboxes2] = useState({
  //   checked2: true,
  //   enero2: true,
  //   febrero2: true,
  //   marzo2: true,
  //   abril2: true,
  //   mayo2: true,
  //   junio2: true,
  //   julio2: true,
  //   agosto2: true,
  //   septiembre2: true,
  //   octubre2: true,
  //   noviembre2: true,
  //   diciembre2: true,
  // });
  const [mesesHabilitados, setMesesHabilitados] = useState([]);
  const [porcentajesIGV, setPorcentajesIGV] = useState([]);
  const [porcentajesRetencion, setPorcentajesRetencion] = useState([]);
  const [porcentajesDetraccion, setPorcentajesDetraccion] = useState([]);
  const [porcentajesPercepcion, setPorcentajesPercepcion] = useState([]);

  // const [contador = 0, setContador] = useState(0);
  const [estadoIgv, setEstadoIgv] = useState(false);
  const [estadoRetencion, setEstadoRetencion] = useState(false);
  const [estadoDetraccion, setEstadoDetraccion] = useState(false);
  const [estadoPercepcion, setEstadoPercepcion] = useState(false);
  const [objetoIgv, setObjetoIgv] = useState([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    Configuracion();
  }, []);

  useEffect(() => {
    objetoIgv;
  }, [objetoIgv]);

  useEffect(() => {
    dataGeneral;
  }, [dataGeneral]);

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

  //quiero un useffect que se ejecute cuando el estado de los checkbox cambie
  useEffect(() => {
    console.log("checkboxes", checkboxes);
  }, [checkboxes]);

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
    enero: 0,
    febrero: 1,
    marzo: 2,
    abril: 3,
    mayo: 4,
    junio: 5,
    julio: 6,
    agosto: 7,
    septiembre: 8,
    octubre: 9,
    noviembre: 10,
    diciembre: 11,
    enero2: 12,
    febrero2: 13,
    marzo2: 14,
    abril2: 15,
    mayo2: 16,
    junio2: 17,
    julio2: 18,
    agosto2: 19,
    septiembre2: 20,
    octubre2: 21,
    noviembre2: 22,
    diciembre2: 23,
  };

  const handleCheck = (mes, checked) => {
    setCheckboxes({ ...checkboxes, [mes]: checked });
    const index = meses[mes];
    if (index !== undefined) {
      mesesHabilitados[index] = checked
        ? dataGeneral.anioHabilitado1 + ("0" + (index + 1)).slice(-2)
        : "";
      if (mesesHabilitados[index] === "") {
        mesesHabilitados[index] = "";
      }
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

  const handleCheckAll2 = (event) => {
    const { checked } = event.target.checked;
    setCheckboxes((prevState) => ({
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

  //?handleCheck2
  // const meses2 = {
  //   enero2: 0,
  //   febrero2: 1,
  //   marzo2: 2,
  //   abril2: 3,
  //   mayo2: 4,
  //   junio2: 5,
  //   julio2: 6,
  //   agosto2: 7,
  //   septiembre2: 8,
  //   octubre2: 9,
  //   noviembre2: 10,
  //   diciembre2: 11,
  // };
  // const handleCheck2 = (mes2, checked2) => {
  //   setCheckboxes2({ ...checkboxes2, [mes2]: checked2 });
  //   const index = meses2[mes2];
  //   if (index !== undefined) {
  //     mesesHabilitados[index] = checked2
  //       ? dataGeneral.anioHabilitado2 + ("0" + (index + 1)).slice(-2)
  //       : "";
  //     if (mesesHabilitados[index] === "") {
  //       mesesHabilitados[index] = "";
  //     }
  //     const filteredMesesHabilitados = mesesHabilitados.filter(
  //       (mes2) => mes2 !== null && mes2 !== undefined && mes2 !== ""
  //     );
  //     setDataGeneral({
  //       ...dataGeneral,
  //       mesesHabilitados: filteredMesesHabilitados.join(","),
  //     });
  //     console.log(filteredMesesHabilitados.join(","));
  //     console.log("meses 2");
  //   }
  // };

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
                    Delete(
                      ["Empresa", "Configuracion"],
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

  const [contador, setContador] = useState(0);

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

  const EnviarIgv = async () => {
    if (objetoIgv.id === "") {
      const nuevoIgv = porcentajesIGV.push({
        porcentaje: objetoIgv.porcentaje,
        default: objetoIgv.default,
      });
      const nuevosPorcentajesIGV = [...porcentajesIGV, nuevoIgv];
      setDataGeneral({
        ...dataGeneral,
        porcentajesIGV: nuevosPorcentajesIGV,
      });
      setContador(contador + 1);
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
                  handleCheck("enero", e.target.checked);
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
                onChange={(e) => handleCheck("febrero", e.target.checked)}
                checked={checkboxes.febrero ? true : false}
              />
              <label>Febrero</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                id="marzo"
                name="marzo"
                value={mesesHabilitados[2]}
                onChange={(e) => handleCheck("marzo", e.target.checked)}
                checked={checkboxes.marzo ? true : false}
              />
              <label>Marzo</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                id="abril"
                name="abril"
                value={mesesHabilitados[3]}
                onChange={(e) => handleCheck("abril", e.target.checked)}
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
                onChange={(e) => handleCheck("mayo", e.target.checked)}
                checked={checkboxes.mayo ? true : false}
              />
              <label>Mayo</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                id="junio"
                name="junio"
                value={mesesHabilitados[5]}
                onChange={(e) => handleCheck("junio", e.target.checked)}
                checked={checkboxes.junio ? true : false}
              />
              <label>Junio</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                id="julio"
                name="julio"
                value={mesesHabilitados[6]}
                onChange={(e) => handleCheck("julio", e.target.checked)}
                checked={checkboxes.julio ? true : false}
              />
              <label>Julio</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                id="agosto"
                name="agosto"
                value={mesesHabilitados[7]}
                onChange={(e) => handleCheck("agosto", e.target.checked)}
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
                onChange={(e) => handleCheck("septiembre", e.target.checked)}
                checked={checkboxes.septiembre ? true : false}
              />
              <label>Septiembre</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                id="octubre"
                name="octubre"
                value={mesesHabilitados[9]}
                onChange={(e) => handleCheck("octubre", e.target.checked)}
                checked={checkboxes.octubre ? true : false}
              />
              <label>Octubre</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                id="noviembre"
                name="noviembre"
                value={mesesHabilitados[10]}
                onChange={(e) => handleCheck("noviembre", e.target.checked)}
                checked={checkboxes.noviembre ? true : false}
              />
              <label>Noviembre</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                id="diciembre"
                name="diciembre"
                value={mesesHabilitados[11]}
                onChange={(e) => handleCheck("diciembre", e.target.checked)}
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
                  value={checkboxes.checked}
                  onChange={handleCheckAll2}
                  checked={checkboxes.checked}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4 ml-2">
              <div className="flex gap-3">
                <Checkbox
                  id="enero2"
                  name="enero2"
                  value={checkboxes.enero2}
                  onChange={(e) => {
                    handleCheck("enero2", e.target.checked);
                    setCheckboxes({
                      ...checkboxes,
                      enero2: e.target.checked,
                    });
                  }}
                  checked={checkboxes.enero2 ? true : false}
                />
                <label>Enero</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  id="febrero2"
                  name="febrero2"
                  value={checkboxes.febrero}
                  onChange={(e) => {
                    handleCheck("febrero", e.target.checked);
                    setCheckboxes({
                      ...checkboxes,
                      febrero2: e.target.checked,
                    });
                  }}
                  checked={checkboxes.febrero2 ? true : false}
                />
                <label>Febrero</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                // onChange={(e) => handleCheck2("marzo", e.target.checked)}
                // checked={checkboxes2.marzo}
                />
                <label>Marzo</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                // onChange={(e) => handleCheck2("abril", e.target.checked)}
                // checked={checkboxes2.abril}
                />
                <label>Abril</label>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4 ml-2">
              <div className="flex gap-3">
                <Checkbox
                // onChange={(e) => handleCheck2("mayo", e.target.checked)}
                // checked={checkboxes2.mayo}
                />
                <label>Mayo</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                // onChange={(e) => handleCheck2("junio", e.target.checked)}
                // checked={checkboxes2.junio}
                />
                <label>Junio</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                // onChange={(e) => handleCheck2("julio", e.target.checked)}
                // checked={checkboxes2.julio}
                />
                <label>Julio</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                // onChange={(e) => handleCheck2("agosto", e.target.checked)}
                // checked={checkboxes2.agosto}
                />
                <label>Agosto</label>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4 ml-2">
              <div className="flex gap-3">
                <Checkbox
                // onChange={(e) => handleCheck2("septiembre", e.target.checked)}
                // checked={checkboxes2.septiembre}
                />
                <label>Septiembre</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                // onChange={(e) => handleCheck2("octubre", e.target.checked)}
                // checked={checkboxes2.octubre}
                />
                <label>Octubre</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                // onChange={(e) => handleCheck2("noviembre", e.target.checked)}
                // checked={checkboxes2.noviembre}
                />
                <label>Noviembre</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                // onChange={(e) => handleCheck2("diciembre", e.target.checked)}
                // checked={checkboxes2.diciembre}
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
                    <label htmlFor="default" className={Global.LabelStyle}>
                      Default
                    </label>
                    <Checkbox
                      id="default"
                      name="default"
                      onChange={(e) => {
                        setChecked(e.checked);
                        ValidarDataIgv(e);
                      }}
                      checked={objetoIgv.default ? checked : ""}
                      value={objetoIgv.default ? true : false}
                    ></Checkbox>
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
            <div>2</div>
            <div>3</div>
            <div>4</div>
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
