import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalInventario from "./ModalInventario";
import ModalCrud from "../../../components/modal/ModalCrud";
import Mensajes from "../../../components/funciones/Mensajes";
import Table from "../../../components/tabla/Table";
import { toast } from "react-toastify";
import { RadioButton } from "primereact/radiobutton";
import moment from "moment";
import { FaSearch, FaUndoAlt, FaPen } from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";
import * as Funciones from "../../../components/funciones/Validaciones";

//#region Estilos
const TablaStyle = styled.div`
  max-width: 100%;
  overflow-x: auto;
  & th:first-child {
    min-width: 30px;
    width: 40px;
    text-align: center;
  }
  & th:nth-child(2) {
    min-width: 40px;
    width: 40px;
    text-align: center;
  }
  & th:nth-child(3) {
    min-width: 150px;
    width: 100%;
  }
  & th:nth-child(4) {
    width: 70px;
    text-align: center;
  }
  & th:nth-child(5),
  & th:nth-child(6),
  & th:nth-child(7),
  & th:nth-child(8),
  & th:nth-child(9),
  & th:nth-child(10),
  & th:nth-child(11) {
    min-width: 90px;
    width: 90px;
    text-align: right;
  }
  & th:last-child {
    display: none;
  }
  & tbody td:last-child {
    display: none;
  }
`;
//#endregion

const Modal = ({ setModal, modo, objeto, detalle }) => {
  //#region useState
  //Data General
  const [data, setData] = useState(objeto);
  const [dataDetalle, setDataDetalle] = useState(detalle);
  const [dataLocal, setDataLocal] = useState(detalle);
  const [dataGlobal] = useState(store.session.get("global"));
  //Data General
  //Tablas
  const [dataVendedor, setDataVendedor] = useState([]);
  const [dataMoneda, setDataMoneda] = useState([]);
  //Tablas
  //Data Modales Ayuda
  const [dataCabecera, setDataCabecera] = useState([]);
  //Data Modales Ayuda
  //Modales de Ayuda
  const [modalInventario, setModalInventario] = useState(false);
  const [modoInventario, setModoInventario] = useState("Nuevo");
  const [dataInventario, setDataInventario] = useState([]);
  //Modales de Ayuda
  //Filtro
  const [filtro, setFiltro] = useState({
    marca: "",
    descripcion: "",
    tipoExistenciaId: "",
  });
  const [total, setTotal] = useState(detalle.length);
  const [index, setIndex] = useState(0);
  //Filtro

  const [detalleId, setDetalleId] = useState(1);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    FiltroLocal();
  }, [filtro]);
  useEffect(() => {
    if (Object.entries(dataInventario).length > 0) {
      Inventario();
    }
  }, [dataInventario]);
  useEffect(() => {
    setData({ ...data, detalles: dataDetalle });
    setDataLocal(dataDetalle);
    FiltradoPaginado({ selected: index });
  }, [dataDetalle]);
  useEffect(() => {
    if (refrescar) {
      ActualizarTotales();
      setRefrescar(false);
    }
  }, [refrescar]);
  useEffect(() => {
    if (modo == "Nuevo") {
      GetPorIdTipoCambio(data.fechaRegistro);
    }
    Tablas();
  }, []);
  //#endregion

  //#region Funciones Filtrado
  const ValidarDataFiltro = async ({ target }) => {
    setFiltro((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  const FiltroLocal = async (index = 0) => {
    setIndex(index);
    //Detalle completo
    let model = dataDetalle;
    //Detalle completo

    //Expresiones a filtrar
    let marca = new RegExp(`${filtro.marca}.*`, "i");
    let descripcion = new RegExp(`${filtro.descripcion}.*`, "i");
    //Expresiones a filtrar

    //Tipo Existencia
    if (filtro.tipoExistenciaId != "") {
      model = dataDetalle.filter(
        (map) => map.tipoExistenciaId == filtro.tipoExistenciaId
      );
    }
    //Tipo Existencia

    //Filtra en base a las expresiones
    model = model.filter(
      (map) => marca.test(map.marcaNombre) && descripcion.test(map.descripcion)
    );
    //Filtra en base a las expresiones

    setDataLocal(model);
    setTotal(model.length);
  };
  const FiltradoPaginado = (e) => {
    let filtrado = dataDetalle.slice(e.selected * 50, total);
    setDataLocal(filtrado);
    setIndex(e.selected);
  };
  //#endregion

  //#region Funciones
  //Data General
  const ValidarData = async ({ target }) => {
    if (
      target.name == "incluyeIGV" ||
      target.name == "afectarStock" ||
      target.name == "abonar" ||
      target.name == "isAnticipo" ||
      target.name == "isOperacionGratuita"
    ) {
      if (target.name == "incluyeIGV" || target.name == "isOperacionGratuita") {
        setRefrescar(true);
      }
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }

    if (
      target.name == "porcentajeIGV" ||
      target.name == "porcentajeRetencion" ||
      target.name == "porcentajeDetraccion" ||
      target.name == "factorImpuestoBolsa"
    ) {
      setRefrescar(true);
    }

    if (target.name == "tipoCobroId") {
      let fecha = await FechaVencimiento(data.tipoVentaId, target.value);
      setData((prevState) => ({
        ...prevState,
        fechaVencimiento: fecha,
      }));

      if (target.value != "CH" || target.value != "DE") {
        setData((prevState) => ({
          ...prevState,
          numeroOperacion: "",
          cuentaCorrienteId: "",
        }));
      }
    }
  };
  const FechaEmision = async () => {
    if (modo != "Consultar") {
      toast(
        "Si la fecha de emisión ha sido cambiada, no olvide consultar el tipo de cambio.",
        {
          position: "bottom-left",
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
  };
  const OcultarMensajes = async () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  //Data General
  //#endregion

  //#region Funciones Detalles
  const Inventario = async () => {
    let detalleMod = dataDetalle.map((map) => {
      if (map.detalleId == dataInventario.detalleId) {
        //Calculos
        let cantidad = map.stockFinal - Number(dataInventario.inventario);
        let precioUnitario = map.precioUnitario;
        let cantidadSobra = 0;
        let cantidadFalta = 0;
        if (cantidad < 0) {
          cantidadSobra = cantidad;
        } else {
          cantidadFalta = cantidad;
        }
        let totalSobra = cantidadSobra * precioUnitario;
        let totalFalta = cantidadFalta * precioUnitario;
        //Calculos
        return {
          ...map,
          inventario: Funciones.RedondearNumero(dataInventario.inventario, 2),
          cantidadSobra: Math.abs(Funciones.RedondearNumero(cantidadSobra, 2)),
          cantidadFalta: Math.abs(Funciones.RedondearNumero(cantidadFalta, 2)),
          totalSobra: Math.abs(Funciones.RedondearNumero(totalSobra, 2)),
          totalFalta: Math.abs(Funciones.RedondearNumero(totalFalta, 2)),
        };
      } else {
        return map;
      }
    });
    setDataDetalle(detalleMod);
    setRefrescar(true);
  };
  //Calculos
  const ActualizarTotales = async () => {
    //Suma los importes de los detalles
    let totalFalta = dataDetalle.reduce((i, map) => {
      return i + map.cantidadFalta;
    }, 0);
    let totalSobra = dataDetalle.reduce((i, map) => {
      return i + map.cantidadSobra;
    }, 0);
    let saldoTotal = totalSobra - totalFalta;
    setData((prevState) => ({
      ...prevState,
      totalFalta: Math.abs(Funciones.RedondearNumero(totalFalta, 2)),
      totalSobra: Math.abs(Funciones.RedondearNumero(totalSobra, 2)),
      saldoTotal: Math.abs(Funciones.RedondearNumero(saldoTotal, 2)),
    }));
  };
  //Calculos
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Almacen/CuadreStock/FormularioTablas`
    );
    setDataVendedor(
      result.data.data.vendedores.map((res) => ({
        id: res.id,
        nombre:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
    setDataMoneda(result.data.data.monedas);
  };
  const GetPorIdTipoCambio = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/TipoCambio/${id}`);
    if (result.name == "AxiosError") {
      if (Object.entries(result.response.data).length > 0) {
        setTipoMensaje(result.response.data.messages[0].tipo);
        setMensaje(result.response.data.messages[0].textos);
      } else {
        setTipoMensaje(1);
        setMensaje([result.message]);
      }
      setData({
        ...data,
        tipoCambio: 0,
      });
    } else {
      setData({
        ...data,
        tipoCambio: result.data.data.precioVenta,
      });
      toast.info(
        "El tipo de cambio del día " +
          moment(data.fechaRegistro).format("DD/MM/YYYY") +
          " es: " +
          result.data.data.precioVenta,
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          toastId: "toastTipoCambio",
        }
      );
      OcultarMensajes();
    }
  };
  //#endregion

  //#region Funciones Modal
  const AccionModal = async (value, click = false) => {
    if (click) {
      let row = value.target.closest("tr");
      let detalleId = row.lastChild.innerText;
      let descripcion = row.children[2].innerText;
      let inventario = row.children[5].innerText;
      setDataInventario({
        detalleId: detalleId,
        inventario: inventario,
        descripcion: descripcion,
      });
      setModalInventario(true);
    } else {
      setDataInventario({
        detalleId: value.detalleId,
        inventario: value.inventario,
        descripcion: value.descripcion,
      });
      setModalInventario(true);
    }
  };
  const AbrirModalKey = async (e) => {
    if (e.key === "Enter") {
      let row = document
        .querySelector("#tablaCuadreStock")
        .querySelector("tr.selected-row");
      let detalleId = row.lastChild.innerText;
      let descripcion = row.children[2].innerText;
      let inventario = row.children[5].innerText;
      setDataInventario({
        detalleId: detalleId,
        inventario: inventario,
        descripcion: descripcion,
      });
      setModalInventario(true);
    }
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "Item",
      accessor: "articuloId",
      Cell: ({ row, value }) => {
        if (row.values.stockFinal != row.values.inventario) {
          return (
            <p className="text-center text-yellow-400 font-semibold">{value}</p>
          );
        } else {
          return <p className="text-center">{value}</p>;
        }
      },
    },
    {
      Header: "Marca",
      accessor: "marcaNombre",
      Cell: ({ row, value }) => {
        if (row.values.stockFinal != row.values.inventario) {
          return (
            <p className="text-center text-yellow-400 font-semibold">{value}</p>
          );
        } else {
          return <p className="text-center">{value}</p>;
        }
      },
    },
    {
      Header: "Descripcion",
      accessor: "descripcion",
      Cell: ({ row, value }) => {
        if (row.values.stockFinal != row.values.inventario) {
          return <p className="text-yellow-400 font-semibold">{value}</p>;
        } else {
          return <p className="">{value}</p>;
        }
      },
    },
    {
      Header: "Unidad",
      accessor: "unidadMedidaDescripcion",
      Cell: ({ row, value }) => {
        if (row.values.stockFinal != row.values.inventario) {
          return (
            <p className="text-center text-yellow-400 font-semibold">{value}</p>
          );
        } else {
          return <p className="text-center">{value}</p>;
        }
      },
    },
    {
      Header: "Stock Final",
      accessor: "stockFinal",
      Cell: ({ row, value }) => {
        if (row.values.stockFinal != row.values.inventario) {
          return (
            <p className="text-right text-yellow-400 font-semibold mr-2">
              {Funciones.RedondearNumero(value, 2)}
            </p>
          );
        } else {
          return (
            <p className="text-right font-semibold mr-2">
              {Funciones.RedondearNumero(value, 2)}
            </p>
          );
        }
      },
    },
    {
      Header: "Inventario",
      accessor: "inventario",
      Cell: ({ row, value }) => {
        if (row.values.stockFinal != row.values.inventario) {
          return (
            <div className="flex">
              <p className="w-full text-right text-yellow-400 font-semibold">
                {Funciones.RedondearNumero(value, 2)}
              </p>
              {modo != "Consultar" && (
                <button
                  id={"botonInventario"}
                  onClick={() =>
                    AccionModal({
                      detalleId: row.values.detalleId,
                      descripcion: row.values.descripcion,
                      inventario: row.values.inventario,
                    })
                  }
                  className={
                    Global.BotonBuscar +
                    Global.BotonRegistrar +
                    " ml-2 !px-1.5 !rounded-sm"
                  }
                >
                  <FaPen></FaPen>
                </button>
              )}
            </div>
          );
        } else {
          return (
            <div className="flex">
              <p className="text-right font-semibold w-full">
                {Funciones.RedondearNumero(value, 2)}
              </p>
              {modo != "Consultar" && (
                <button
                  id={"botonInventario"}
                  onClick={() =>
                    AccionModal({
                      detalleId: row.values.detalleId,
                      descripcion: row.values.descripcion,
                      inventario: row.values.inventario,
                    })
                  }
                  className={
                    Global.BotonBuscar +
                    Global.BotonRegistrar +
                    " ml-2 !px-1.5 !rounded-sm"
                  }
                >
                  <FaPen></FaPen>
                </button>
              )}
            </div>
          );
        }
      },
    },
    {
      Header: "P. Unitario",
      accessor: "precioUnitario",
      Cell: ({ row, value }) => {
        if (row.values.stockFinal != row.values.inventario) {
          return (
            <p className="text-right text-yellow-400 font-semibold mr-2">
              {Funciones.RedondearNumero(value, 2)}
            </p>
          );
        } else {
          return (
            <p className="text-right font-semibold mr-2">
              {Funciones.RedondearNumero(value, 2)}
            </p>
          );
        }
      },
    },
    {
      Header: "Can. Falta",
      accessor: "cantidadFalta",
      Cell: ({ row, value }) => {
        if (row.values.stockFinal != row.values.inventario) {
          return (
            <p className="text-right text-yellow-400 font-semibold mr-2">
              {Funciones.RedondearNumero(value, 2)}
            </p>
          );
        } else {
          return (
            <p className="text-right font-semibold mr-2">
              {Funciones.RedondearNumero(value, 2)}
            </p>
          );
        }
      },
    },
    {
      Header: "T. Falta",
      accessor: "totalFalta",
      Cell: ({ row, value }) => {
        if (row.values.stockFinal != row.values.inventario) {
          return (
            <p className="text-right text-yellow-400 font-semibold mr-2">
              {Funciones.RedondearNumero(value, 2)}
            </p>
          );
        } else {
          return (
            <p className="text-right font-semibold mr-2">
              {Funciones.RedondearNumero(value, 2)}
            </p>
          );
        }
      },
    },
    {
      Header: "Can. Sobra",
      accessor: "cantidadSobra",
      Cell: ({ row, value }) => {
        if (row.values.stockFinal != row.values.inventario) {
          return (
            <p className="text-right text-yellow-400 font-semibold mr-2">
              {Funciones.RedondearNumero(value, 2)}
            </p>
          );
        } else {
          return (
            <p className="text-right font-semibold mr-2">
              {Funciones.RedondearNumero(value, 2)}
            </p>
          );
        }
      },
    },
    {
      Header: "T. Sobra",
      accessor: "totalSobra",
      Cell: ({ row, value }) => {
        if (row.values.stockFinal != row.values.inventario) {
          return (
            <p className="text-right text-yellow-400 font-semibold mr-2">
              {Funciones.RedondearNumero(value, 2)}
            </p>
          );
        } else {
          return (
            <p className="text-right font-semibold mr-2">
              {Funciones.RedondearNumero(value, 2)}
            </p>
          );
        }
      },
    },
    {
      Header: "Item",
      accessor: "detalleId",
    },
  ];
  //#endregion

  //#region Render
  return (
    <>
      {Object.entries(dataMoneda).length > 0 && (
        <>
          <ModalCrud
            setModal={setModal}
            objeto={data}
            modo={modo}
            menu={["Almacen", "CuadreStock"]}
            titulo="Cuadre de Stock"
            tamañoModal={[Global.ModalFull, Global.Form + " px-10 "]}
            cerrar={false}
          >
            {tipoMensaje > 0 && (
              <Mensajes
                tipoMensaje={tipoMensaje}
                mensaje={mensaje}
                Click={() => OcultarMensajes()}
              />
            )}
            {/* Cabecera */}
            <div
              className={
                Global.ContenedorBasico + " mb-4 " + Global.FondoContenedor
              }
            >
              <div className={Global.ContenedorInputs}>
                {data.id != undefined ? (
                  <div className={Global.InputMitad}>
                    <label htmlFor="id" className={Global.LabelStyle}>
                      Código de Registro
                    </label>
                    <input
                      type="text"
                      id="id"
                      name="id"
                      placeholder="Código"
                      autoComplete="off"
                      disabled={true}
                      value={data.id ?? ""}
                      className={Global.InputStyle}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <div
                  className={
                    data.id != undefined ? Global.InputMitad : Global.InputFull
                  }
                >
                  <label htmlFor="numero" className={Global.LabelStyle}>
                    Cuadre de Stock N°
                  </label>
                  <input
                    type="text"
                    id="numero"
                    name="numero"
                    placeholder="Número"
                    autoComplete="off"
                    maxLength="10"
                    disabled={true}
                    value={data.numero ?? ""}
                    className={Global.InputStyle}
                  />
                </div>
              </div>
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputTercio}>
                  <label htmlFor="fechaRegistro" className={Global.LabelStyle}>
                    F. Registro
                  </label>
                  <input
                    type="date"
                    id="fechaRegistro"
                    name="fechaRegistro"
                    autoComplete="off"
                    disabled={modo == "Consultar" ? true : false}
                    value={moment(data.fechaRegistro ?? "").format(
                      "yyyy-MM-DD"
                    )}
                    onChange={ValidarData}
                    onBlur={FechaEmision}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputTercio}>
                  <label htmlFor="monedaId" className={Global.LabelStyle}>
                    Moneda
                  </label>
                  <select
                    id="monedaId"
                    name="monedaId"
                    value={data.monedaId ?? ""}
                    onChange={ValidarData}
                    disabled={modo == "Consultar" ? true : false}
                    className={Global.InputStyle}
                  >
                    {dataMoneda.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={Global.InputTercio}>
                  <label htmlFor="tipoCambio" className={Global.LabelStyle}>
                    T. Cambio
                  </label>
                  <input
                    type="number"
                    id="tipoCambio"
                    name="tipoCambio"
                    placeholder="Tipo de Cambio"
                    autoComplete="off"
                    min={0}
                    disabled={modo == "Consultar" ? true : false}
                    value={data.tipoCambio ?? ""}
                    onChange={ValidarData}
                    className={
                      modo != "Consultar"
                        ? Global.InputBoton
                        : Global.InputStyle
                    }
                  />
                  <button
                    id="consultarTipoCambio"
                    className={
                      Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                    }
                    hidden={modo == "Consultar" ? true : false}
                    onClick={() => {
                      GetPorIdTipoCambio(data.fechaEmision);
                    }}
                  >
                    <FaUndoAlt></FaUndoAlt>
                  </button>
                </div>
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label htmlFor="personalId" className={Global.LabelStyle}>
                    Responsable
                  </label>
                  <select
                    id="personalId"
                    name="personalId"
                    value={data.personalId ?? ""}
                    onChange={ValidarData}
                    disabled={modo == "Consultar" ? true : false}
                    className={Global.InputStyle}
                  >
                    {dataVendedor.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={Global.InputTercio}>
                  <label htmlFor="monedaId" className={Global.LabelStyle}>
                    Estado
                  </label>
                  <select
                    id="monedaId"
                    name="monedaId"
                    value={data.monedaId ?? ""}
                    disabled={true}
                    className={Global.InputStyle}
                  >
                    {dataMoneda.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
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
              </div>
            </div>
            {/* Cabecera */}

            {/* Detalles */}
            <div
              className={
                Global.ContenedorBasico +
                Global.FondoContenedor +
                " mb-2 overflow-x-auto"
              }
            >
              <div className={Global.ContenedorInputs}>
                <div className={Global.Input60pct}>
                  <label htmlFor="marca" className={Global.LabelStyle}>
                    Marca
                  </label>
                  <input
                    type="text"
                    id="marca"
                    name="marca"
                    placeholder="Marca"
                    autoComplete="off"
                    autoFocus
                    value={filtro.marca}
                    onChange={ValidarDataFiltro}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputFull}>
                  <label htmlFor="descripcion" className={Global.LabelStyle}>
                    Descripción
                  </label>
                  <input
                    type="text"
                    id="descripcion"
                    name="descripcion"
                    placeholder="Descripción"
                    autoComplete="off"
                    value={filtro.descripcion}
                    onChange={ValidarDataFiltro}
                    className={Global.InputBoton}
                  />
                  <button
                    id="consultarFiltro"
                    onClick={FiltroLocal}
                    className={
                      Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                    }
                  >
                    <FaSearch></FaSearch>
                  </button>
                </div>
              </div>
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <div className={Global.Input + "w-32"}>
                    <div className={Global.CheckStyle}>
                      <RadioButton
                        inputId="todos"
                        name="tipoExistenciaId"
                        value={""}
                        disabled={modo == "Consultar" ? true : false}
                        onChange={(e) => {
                          ValidarDataFiltro(e);
                        }}
                        checked={filtro.tipoExistenciaId === ""}
                      ></RadioButton>
                    </div>
                    <label
                      htmlFor="todos"
                      className={Global.LabelCheckStyle + "rounded-r-none"}
                    >
                      Todos
                    </label>
                  </div>
                  <div className={Global.Input + "w-44"}>
                    <div className={Global.CheckStyle + "rounded-l-none"}>
                      <RadioButton
                        inputId="mercaderia"
                        name="tipoExistenciaId"
                        value={"01"}
                        disabled={modo == "Consultar" ? true : false}
                        onChange={(e) => {
                          ValidarDataFiltro(e);
                        }}
                        checked={filtro.tipoExistenciaId === "01"}
                      ></RadioButton>
                    </div>
                    <label
                      htmlFor="mercaderia"
                      className={Global.LabelCheckStyle + "rounded-r-none"}
                    >
                      Mercadería
                    </label>
                  </div>
                  <div className={Global.InputTercio}>
                    <div className={Global.CheckStyle + "rounded-l-none"}>
                      <RadioButton
                        inputId="productoTerminado"
                        name="tipoExistenciaId"
                        value="02"
                        disabled={modo == "Consultar" ? true : false}
                        onChange={(e) => {
                          ValidarDataFiltro(e);
                        }}
                        checked={filtro.tipoExistenciaId === "02"}
                      ></RadioButton>
                    </div>
                    <label
                      htmlFor="productoTerminado"
                      className={Global.LabelCheckStyle + "rounded-r-none"}
                    >
                      Producto Terminado
                    </label>
                  </div>
                  <div className={Global.InputTercio}>
                    <div className={Global.CheckStyle + "rounded-l-none"}>
                      <RadioButton
                        inputId="materiaPrima"
                        name="tipoExistenciaId"
                        value="03"
                        disabled={modo == "Consultar" ? true : false}
                        onChange={(e) => {
                          ValidarDataFiltro(e);
                        }}
                        checked={filtro.tipoExistenciaId === "03"}
                      ></RadioButton>
                    </div>
                    <label
                      htmlFor="materiaPrima"
                      className={Global.LabelCheckStyle + "rounded-r-none"}
                    >
                      Materia Prima
                    </label>
                  </div>
                  <div className={Global.InputTercio}>
                    <div className={Global.CheckStyle + "rounded-l-none"}>
                      <RadioButton
                        inputId="envasesEmbalajes"
                        name="tipoExistenciaId"
                        value="04"
                        disabled={modo == "Consultar" ? true : false}
                        onChange={(e) => {
                          ValidarDataFiltro(e);
                        }}
                        checked={filtro.tipoExistenciaId === "04"}
                      ></RadioButton>
                    </div>
                    <label
                      htmlFor="envasesEmbalajes"
                      className={Global.LabelCheckStyle + "rounded-r-none"}
                    >
                      Embases y Embalajes
                    </label>
                  </div>
                  <div className={Global.Input + "w-32"}>
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <RadioButton
                        inputId="otros"
                        name="tipoExistenciaId"
                        value="99"
                        disabled={modo == "Consultar" ? true : false}
                        onChange={(e) => {
                          ValidarDataFiltro(e);
                        }}
                        checked={filtro.tipoExistenciaId === "99"}
                      ></RadioButton>
                    </div>
                    <label
                      htmlFor="otros"
                      className={Global.LabelCheckStyle + " !py-1 "}
                    >
                      Otros
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {/* Detalles */}

            {/* Tabla Detalle */}
            <TablaStyle>
              <Table
                id={"tablaCuadreStock"}
                columnas={columnas}
                datos={dataLocal}
                total={total}
                index={index}
                estilos={[
                  "",
                  "",
                  "",
                  "border ",
                  "",
                  "border border-b-0",
                  "border",
                ]}
                Click={(e) => FiltradoPaginado(e)}
                DobleClick={(e) => AccionModal(e, true)}
              />
            </TablaStyle>
            {/* Tabla Detalle */}

            {/*Tabla Footer*/}
            <div className={Global.ContenedorFooter}>
              <div className="flex">
                <div className={Global.FilaVacia}></div>
                <div className={Global.FilaPrecio}>
                  <p className={Global.FilaContenido}>Total Sobra</p>
                </div>
                <div className={Global.FilaImporte}>
                  <p className={Global.FilaContenido}>
                    {data.totalSobra ?? "0.00"}
                  </p>
                </div>
                <div className={Global.UltimaFila}></div>
              </div>
              <div className="flex">
                <div className={Global.FilaVacia}></div>
                <div className={Global.FilaPrecio}>
                  <p className={Global.FilaContenido}>Total Falta</p>
                </div>
                <div className={Global.FilaImporte}>
                  <p className={Global.FilaContenido}>
                    {data.totalFalta ?? "0.00"}
                  </p>
                </div>
                <div className={Global.UltimaFila}></div>
              </div>
              <div className="flex">
                <div className={Global.FilaVacia}></div>
                <div className={Global.FilaPrecio}>
                  <p className={Global.FilaContenido}>Saldo Total</p>
                </div>
                <div className={Global.FilaImporte}>
                  <p className={Global.FilaContenido}>
                    {data.saldoTotal ?? "0.00"}
                  </p>
                </div>
                <div className={Global.UltimaFila}></div>
              </div>
            </div>
            {/*Tabla Footer*/}
          </ModalCrud>
          {modalInventario && (
            <ModalInventario
              setModal={setModalInventario}
              modo={modoInventario}
              objeto={dataInventario}
              setObjeto={setDataInventario}
              foco={document.getElementById("tablaCuadreStock")}
            />
          )}
        </>
      )}
    </>
  );
  //#endregion
};

export default Modal;
