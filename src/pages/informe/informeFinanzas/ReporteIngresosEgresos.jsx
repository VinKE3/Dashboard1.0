import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import FiltroCliente from "../../../components/filtro/FiltroCliente";
import FiltroProveedor from "../../../components/filtro/FiltroProveedor";
import ModalBasic from "../../../components/modal/ModalBasic";
import { Checkbox } from "primereact/checkbox";
import moment from "moment";
import * as G from "../../../components/Global";
import { FaSearch } from "react-icons/fa";

const ReporteIngresosEgresos = ({ setModal }) => {
  //#region useState
  //Data General
  const [dataGlobal] = useState(store.session.get("global"));
  const [data, setData] = useState({
    fechaInicio: moment(
      dataGlobal == null ? "" : dataGlobal.fechaInicio
    ).format("YYYY-MM-DD"),
    fechaFin: moment(dataGlobal == null ? "" : dataGlobal.fechaFin).format(
      "YYYY-MM-DD"
    ),
    monedaId: "",
    tipoMovimientoId: "",
    tipoBeneficiarioId: "",
    clienteProveedorId: null,
    clienteProveedorNombre: "",
  });
  //Data General
  //GetTablas
  const [dataMoneda, setdataMoneda] = useState([]);
  const [dataTipoMovimiento, setDataTipoMovimiento] = useState([]);
  const [dataTipoBenef, setDataTipoBenef] = useState([]);
  const [dataPersonal, setDataPersonal] = useState([]);
  //GetTablas
  //Data Modales Ayuda
  const [dataCliente, setDataCliente] = useState([]);
  const [dataProveedor, setDataProveedor] = useState([]);
  //Data Modales Ayuda
  //Modales de Ayuda
  const [modalCliente, setModalCliente] = useState(false);
  const [modalProveedor, setModalProveedor] = useState(false);
  //Modales de Ayuda
  const [todos, setTodos] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (Object.keys(dataCliente).length > 0) {
      setData({
        ...data,
        clienteProveedorId: dataCliente.clienteId,
        clienteProveedorNombre: dataCliente.clienteNombre,
      });
    }
  }, [dataCliente]);
  useEffect(() => {
    if (Object.keys(dataProveedor).length > 0) {
      setData({
        ...data,
        clienteProveedorId: dataProveedor.proveedorId,
        clienteProveedorNombre: dataProveedor.proveedorNombre,
      });
    }
  }, [dataProveedor]);
  useEffect(() => {
    GetTablas();
  }, []);
  //#endregion

  // const HandleData = async ({ target }) => {
  //   if (target.name === "tipoId") {
  //     setData((prevState) => ({
  //       ...prevState,
  //       conceptoIngresoId: "",
  //       conceptoEgresoId: "",
  //     }));
  //     return;
  //   }
  //    if (

  //     target.name === "visualizar"
  //   ) {
  //     setData((prevState) => ({
  //       ...prevState,
  //       [target.name]: target.checked,
  //     }));
  //     return;
  //   }
  //   setData((prevState) => ({
  //     ...prevState,
  //     [target.name]: target.value,
  //   }));
  // };

  const HandleData = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "tipoId") {
      setData((prevState) => ({
        ...prevState,
        conceptoIngresoId: "",
        conceptoEgresoId: "",
      }));
      return;
    }
    if (target.name == "tipoBeneficiarioId") {
      setData((prevData) => ({
        ...prevData,
        tipoBeneficiarioId: target.value,
        clienteProveedorId: null,
        clienteProveedorNombre: "",
      }));
      return;
    }
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  //#endregion

  //#region API
  const GetTablas = async () => {
    const result = await ApiMasy.get(
      `api/Finanzas/MovimientoBancario/FormularioTablas`
    );
    setDataTipoMovimiento(result.data.data.tiposMovimiento);
    let tiposBeneficiario = result.data.data.tiposBeneficiario;
    tiposBeneficiario.push(
      {
        descripcion: "--TODOS--",
        id: "",
        isActivo: true,
        tipoBeneficiarioId: "",
        tipoMovimientoId: "",
      },
      {
        descripcion: "--TODOS--",
        id: "",
        isActivo: true,
        tipoBeneficiarioId: "",
        tipoMovimientoId: "IN",
      },
      {
        descripcion: "--TODOS--",
        id: "",
        isActivo: true,
        tipoBeneficiarioId: "",
        tipoMovimientoId: "EG",
      }
    );
    setDataTipoBenef(tiposBeneficiario);
    setdataMoneda([
      { abreviatura: "S/", descripcion: "SOLES", id: "S" },
      {
        abreviatura: "US$",
        descripcion: "DÓLARES AMERICANOS",
        id: "D",
      },
    ]);

    const res = await ApiMasy.get(`api/Mantenimiento/Personal/Listar`);
    setDataPersonal(
      res.data.data.data.map((map) => ({
        id: map.id,
        personal:
          map.apellidoPaterno + " " + map.apellidoMaterno + " " + map.nombres,
      }))
    );
  };
  const Enviar = async (origen = 1) => {
    let model = await Reporte(`Informes/Sistema/ReporteClientes`, origen);
    if (model != null) {
      const enlace = document.createElement("a");
      enlace.href = model.url;
      enlace.download = model.fileName;
      enlace.click();
      enlace.remove();
    }
  };
  //#endregion

  //#region Funciones Modal
  const AbrirFiltroCliente = async () => {
    setModalCliente(true);
  };
  const AbrirFiltroProveedor = async () => {
    setModalProveedor(true);
  };
  //#endregion

  //#region Render
  return (
    <>
      <ModalBasic titulo="Reporte Ingresos/Egresos" setModal={setModal}>
        <div
          className={G.ContenedorBasico + G.FondoContenedor + " mb-2"}
        >
          <div className={G.InputFull}>
            <label htmlFor="monedaId" className={G.LabelStyle}>
              Moneda
            </label>
            <select
              id="monedaId"
              name="monedaId"
              autoFocus
              value={data.monedaId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              {monedas.map((moneda) => (
                <option key={moneda.id} value={moneda.id}>
                  {moneda.descripcion}
                </option>
              ))}
            </select>
          </div>
          <div className={G.InputFull}>
            <label htmlFor="tipoId" className={G.LabelStyle}>
              Tipo
            </label>
            <select
              id="tipoId"
              name="tipoId"
              autoFocus
              value={data.tipoId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              {tipos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.descripcion}
                </option>
              ))}
            </select>
          </div>

          {data.tipoId === "1" && (
            <div className={G.InputFull}>
              <label htmlFor="conceptoIngresoId" className={G.LabelStyle}>
                Concepto
              </label>
              <select
                id="conceptoIngresoId"
                name="conceptoIngresoId"
                autoFocus
                value={data.conceptoIngresoId ?? ""}
                onChange={HandleData}
                className={G.InputStyle}
              >
                {dataMoneda.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <div className={G.InputMitad}>
              <label htmlFor="tipoMovimientoId" className={G.LabelStyle}>
                Movimiento
              </label>
              <select
                id="tipoMovimientoId"
                name="tipoMovimientoId"
                value={data.tipoMovimientoId ?? ""}
                onChange={HandleData}
                className={G.InputStyle}
              >
                <option key="-1" value="">
                  -- TODOS --
                </option>
                {dataTipoMovimiento.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.descripcion}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <div className={G.Input + "w-36"}>
                <div className={G.CheckStyle}>
                  <Checkbox
                    inputId="todos"
                    name="todos"
                    onChange={(e) => {
                      HandleData(e);
                    }}
                    checked={todos ? true : ""}
                  ></Checkbox>
                </div>
                <label
                  htmlFor="todos"
                  className={G.LabelCheckStyle + " rounded-r-none "}
                >
                  Todos
                </label>
              </div>
              <div className={G.InputFull}>
                <label
                  htmlFor="tipoBeneficiarioId"
                  className={G.LabelStyle + G.Anidado}
                >
                  Tipos
                </label>
                <select
                  id="tipoBeneficiarioId"
                  name="tipoBeneficiarioId"
                  disabled={todos}
                  value={data.tipoBeneficiarioId ?? ""}
                  onChange={HandleData}
                  className={G.InputStyle}
                >
                  {dataTipoBenef
                    .filter(
                      (map) => map.tipoMovimientoId == data.tipoMovimientoId
                    )
                    .map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
          <div className={G.ContenedorInputs}>
            {data.tipoBeneficiarioId != "INC" &&
            data.tipoBeneficiarioId != "EGC" &&
            data.tipoBeneficiarioId != "EGP" &&
            data.tipoBeneficiarioId != "EGQ" ? (
              <div className={G.InputFull}>
                <label
                  htmlFor="clienteProveedorNombre"
                  className={G.LabelStyle}
                >
                  Nombres
                </label>
                <input
                  type="text"
                  id="clienteProveedorNombre"
                  name="clienteProveedorNombre"
                  placeholder="Nombre"
                  autoComplete="off"
                  value={data.clienteProveedorNombre ?? ""}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
            ) : (
              <div className={G.InputFull}>
                <label
                  htmlFor="clienteProveedorNombre"
                  className={G.LabelStyle}
                >
                  Nombres
                </label>
                <input
                  type="text"
                  id="clienteProveedorNombre"
                  name="clienteProveedorNombre"
                  placeholder="Buscar"
                  autoComplete="off"
                  disabled={true}
                  value={data.clienteProveedorNombre ?? ""}
                  onChange={HandleData}
                  className={G.InputBoton}
                />
                <button
                  id="consultarProveedor"
                  className={G.BotonBuscar + G.BotonPrimary}
                  onKeyDown={(e) => Funciones.KeyClick(e)}
                  onClick={() =>
                    data.tipoBeneficiarioId == "INC" ||
                    data.tipoBeneficiarioId == "EGC"
                      ? AbrirFiltroCliente()
                      : AbrirFiltroProveedor()
                  }
                >
                  <FaSearch></FaSearch>
                </button>
              </div>
            )}
          </div>
          <div className={G.InputFull}>
            <label htmlFor="personalId" className={G.LabelStyle}>
              Personal
            </label>
            <select
              id="personalId"
              disabled={data.tipoId == 3 ? true : false}
              name="personalId"
              value={data.personalId ?? ""}
              onChange={HandleData}
              className={G.InputStyle}
            >
              <option key={-1} value={""}>
                {"--TODOS--"}
              </option>
              {dataPersonal.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.personal}
                </option>
              ))}
            </select>
          </div>
          <div className={G.ContenedorInputs}>
            <div className={G.InputFull}>
              <label htmlFor="fechaInicio" className={G.LabelStyle}>
                Desde
              </label>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={data.fechaInicio ?? ""}
                onChange={HandleData}
                className={G.InputStyle}
              />
            </div>
            <div className={G.InputFull}>
              <label htmlFor="fechaFin" className={G.LabelStyle}>
                Hasta
              </label>
              <input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={data.fechaFin ?? ""}
                onChange={HandleData}
                className={G.InputStyle}
              />
            </div>
          </div>
          <div className={G.Input33pct}>
            <div className={G.Input + " w-25"}>
              <div className={G.CheckStyle + G.Anidado}>
                <Checkbox
                  inputId="visualizar"
                  name="visualizar"
                  onChange={(e) => {
                    HandleData(e);
                  }}
                  checked={data.visualizar ? true : ""}
                />
              </div>
              <label htmlFor="visualizar" className={G.InputBoton}>
                Visualizar
              </label>
            </div>
          </div>

          <div className="mt-2">
            <BotonBasico
              botonText="ACEPTAR"
              botonClass={G.BotonVerde}
              botonIcon={faPlus}
              click={() => Imprimir()}
contenedor=""
            />
          </div>
        </div>
      </ModalBasic>

      {modalCliente && (
        <FiltroCliente
          setModal={setModalCliente}
          setObjeto={setDataCliente}
          foco={document.getElementById("fechaInicio")}
        />
      )}
      {modalProveedor && (
        <FiltroProveedor
          setModal={setModalProveedor}
          setObjeto={setDataProveedor}
          foco={document.getElementById("fechaInicio")}
        />
      )}
    </>
  );
  //#endregion
};

export default ReporteIngresosEgresos;
