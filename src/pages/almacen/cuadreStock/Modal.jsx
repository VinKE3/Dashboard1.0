import React, { useState, useEffect, useMemo } from "react";
import ApiMasy from "../../../api/ApiMasy";
import Put from "../../../components/funciones/Put";
import GetTipoCambio from "../../../components/funciones/GetTipoCambio";
import ModalInventario from "./ModalInventario";
import ModalCrud from "../../../components/modal/ModalCrud";
import Mensajes from "../../../components/funciones/Mensajes";
import Table from "../../../components/tabla/Table";
import { toast } from "react-toastify";
import { RadioButton } from "primereact/radiobutton";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import moment from "moment";
import { FaUndoAlt, FaPen } from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import * as G from "../../../components/Global";
import * as Funciones from "../../../components/funciones/Validaciones";

//#region Estilos
const DivTabla = styled.div`
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
    min-width: 85px;
    width: 85px;
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
  //Data General
  //GetTablas
  const [dataVendedor, setDataVendedor] = useState([]);
  const [dataMoneda, setDataMoneda] = useState([]);
  //GetTablas
  //Modales de Ayuda
  const [modalInventario, setModalInventario] = useState(false);
  const [modoInventario] = useState("Nuevo");
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
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  const [loading, setLoading] = useState(false);
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
      TipoCambio(data.fechaRegistro);
    }
    GetTablas();
  }, []);
  //#endregion

  //#region Funciones Filtrado
  const HandleFiltro = async ({ target }) => {
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
  const HandleData = async ({ target }) => {
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
      toast.warn("Pulse el botón para recalcular el stock.", {
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
  const GetTablas = async () => {
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
    if (modo == "Nuevo") {
      //Datos Iniciales
      let vendedores = result.data.data.vendedores.find((map) => map);
      let monedas = result.data.data.monedas.find((map) => map);
      //Datos Iniciales
      setData((prev) => ({
        ...prev,
        responsableId: vendedores.id,
        monedaId: monedas.id,
      }));
    }
  };
  const TipoCambio = async (fecha) => {
    let tipoCambio = await GetTipoCambio(
      fecha,
      "compra",
      setTipoMensaje,
      setMensaje
    );
    setData((prev) => ({
      ...prev,
      tipoCambio: tipoCambio,
    }));
  };
  const Recalculo = async (fecha) => {
    //Almacena el detalle
    let dataDetalleMod = Object.assign([], dataDetalle);
    //Almacena el detalle
    setLoading(true);
    const result = await Put(
      "Almacen/CuadreStock/RecalcularStock",
      setRefrescar,
      {
        fecha: fecha,
        articulos: dataDetalle.map((map) => {
          return {
            lineaId: map.lineaId,
            subLineaId: map.subLineaId,
            articuloId: map.articuloId,
            stock: map.stockFinal,
          };
        }),
      },
      ["Cuadre recalculado exitosamente"],
      false
    );

    //Mapeamos lo que retorna el api
    result.data.data.articulos.map((res) => {
      //Modifica registro en base al id
      dataDetalleMod = dataDetalleMod.map((map) => {
        if (
          map.articuloId == res.articuloId &&
          map.lineaId == res.lineaId &&
          map.subLineaId == res.subLineaId
        ) {
          //Calculos
          let inventario = modo == "Nuevo" ? res.stock : map.inventario;
          let stockFinal = res.stock;
          let cantidad = stockFinal - inventario;
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
            stockFinal: Funciones.RedondearNumero(stockFinal, 2),
            inventario: Funciones.RedondearNumero(inventario, 2),
            cantidadSobra: Math.abs(
              Funciones.RedondearNumero(cantidadSobra, 2)
            ),
            cantidadFalta: Math.abs(
              Funciones.RedondearNumero(cantidadFalta, 2)
            ),
            totalSobra: Math.abs(Funciones.RedondearNumero(totalSobra, 2)),
            totalFalta: Math.abs(Funciones.RedondearNumero(totalFalta, 2)),
          };
        } else {
          return map;
        }
      });
      //Modifica registro en base al id
    });
    //Mapeamos lo que retorna el api
    setDataDetalle(dataDetalleMod);
    setLoading(false);
  };
  //#endregion

  //#region Funciones Modal
  const AccionModal = async (value, click = false) => {
    if (modo != "Consultar") {
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
    }
  };
  // const ModalKey = async (e) => {
  //   if (e.key === "Enter") {
  //     let row = document
  //       .querySelector("#tablaCuadreStockModal")
  //       .querySelector("tr.selected-row");
  //     let detalleId = row.lastChild.innerText;
  //     let descripcion = row.children[2].innerText;
  //     let inventario = row.children[5].innerText;
  //     setDataInventario({
  //       detalleId: detalleId,
  //       inventario: inventario,
  //       descripcion: descripcion,
  //     });
  //     setModalInventario(true);
  //   }
  // };
  //#endregion

  //#region Columnas
  const columnas = useMemo(
    () => [
      {
        Header: "Item",
        accessor: "articuloId",
        Cell: ({ row, value }) => {
          if (row.values.stockFinal != row.values.inventario) {
            return (
              <p className="text-center text-yellow-400 font-semibold">
                {value}
              </p>
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
              <p className="text-center text-yellow-400 font-semibold">
                {value}
              </p>
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
              <p className="text-center text-yellow-400 font-semibold">
                {value}
              </p>
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
                      G.BotonBuscar +
                      G.BotonAzul +
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
                      G.BotonBuscar +
                      G.BotonAzul +
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
    ],
    [dataDetalle]
  );
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
            foco={document.getElementById("tablaCuadreStock")}
            tamañoModal={[G.ModalFull, G.Form + " px-10 "]}
            cerrar={false}
          >
            {tipoMensaje > 0 && (
              <Mensajes
                tipoMensaje={tipoMensaje}
                mensaje={mensaje}
                Click={() =>
                  Funciones.OcultarMensajes(setTipoMensaje, setMensaje)
                }
              />
            )}
            {/* Cabecera */}
            <div className={G.ContenedorBasico + " mb-4 " + G.FondoContenedor}>
              <div className={G.ContenedorInputs}>
                {data.id != undefined ? (
                  <div className={G.InputMitad}>
                    <label htmlFor="id" className={G.LabelStyle}>
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
                      className={G.InputStyle}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <div
                  className={data.id != undefined ? G.InputMitad : G.InputFull}
                >
                  <label htmlFor="numero" className={G.LabelStyle}>
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
                    className={G.InputStyle}
                  />
                </div>
              </div>
              <div className={G.ContenedorInputs}>
                <div className={G.InputTercio}>
                  <label htmlFor="fechaRegistro" className={G.LabelStyle}>
                    Fecha Registro
                  </label>
                  <input
                    type="date"
                    id="fechaRegistro"
                    name="fechaRegistro"
                    autoComplete="off"
                    autoFocus
                    disabled={modo == "Consultar"}
                    value={moment(data.fechaRegistro ?? "").format(
                      "yyyy-MM-DD"
                    )}
                    onChange={HandleData}
                    onBlur={FechaEmision}
                    className={G.InputBoton}
                  />
                  <button
                    id="consultarRecalculo"
                    className={G.BotonBuscar + G.Anidado + G.BotonPrimary}
                    hidden={modo == "Consultar"}
                    onClick={() => {
                      Recalculo(data.fechaRegistro);
                    }}
                  >
                    <FaUndoAlt></FaUndoAlt>
                  </button>
                </div>
                <div className={G.InputTercio}>
                  <label htmlFor="monedaId" className={G.LabelStyle}>
                    Moneda
                  </label>
                  <select
                    id="monedaId"
                    name="monedaId"
                    value={data.monedaId ?? ""}
                    onChange={HandleData}
                    disabled={modo == "Consultar"}
                    className={G.InputStyle}
                  >
                    {dataMoneda.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={G.InputTercio}>
                  <label htmlFor="tipoCambio" className={G.LabelStyle}>
                    Tipo Cambio
                  </label>
                  <input
                    type="number"
                    id="tipoCambio"
                    name="tipoCambio"
                    placeholder="Tipo de Cambio"
                    autoComplete="off"
                    min={0}
                    disabled={modo == "Consultar"}
                    value={data.tipoCambio ?? ""}
                    onChange={HandleData}
                    className={
                      modo != "Consultar" ? G.InputBoton : G.InputStyle
                    }
                  />
                  <button
                    id="consultarTipoCambio"
                    className={G.BotonBuscar + G.Anidado + G.BotonPrimary}
                    hidden={modo == "Consultar"}
                    onClick={() => {
                      TipoCambio(data.fechaEmision);
                    }}
                  >
                    <FaUndoAlt></FaUndoAlt>
                  </button>
                </div>
              </div>

              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <label htmlFor="responsableId" className={G.LabelStyle}>
                    Responsable
                  </label>
                  <select
                    id="responsableId"
                    name="responsableId"
                    value={data.responsableId ?? ""}
                    onChange={HandleData}
                    disabled={modo == "Consultar"}
                    className={G.InputStyle}
                  >
                    {dataVendedor.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={G.InputTercio}>
                  <label htmlFor="monedaId" className={G.LabelStyle}>
                    Estado
                  </label>
                  <select
                    id="monedaId"
                    name="monedaId"
                    value={data.monedaId ?? ""}
                    disabled={true}
                    className={G.InputStyle}
                  >
                    {dataMoneda.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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
            {/* Cabecera */}

            {/* Detalles */}
            <div
              className={
                G.ContenedorBasico + G.FondoContenedor + " mb-2 overflow-x-auto"
              }
            >
              <div className={G.ContenedorInputs}>
                <div className={G.Input60pct}>
                  <label htmlFor="marca" className={G.LabelStyle}>
                    Marca
                  </label>
                  <input
                    type="text"
                    id="marca"
                    name="marca"
                    placeholder="Marca"
                    autoComplete="off"
                    autoFocus={modo == "Modificar"}
                    value={filtro.marca}
                    onChange={HandleFiltro}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputFull}>
                  <label htmlFor="descripcion" className={G.LabelStyle}>
                    Descripción
                  </label>
                  <input
                    type="text"
                    id="descripcion"
                    name="descripcion"
                    placeholder="Descripción"
                    autoComplete="off"
                    value={filtro.descripcion}
                    onChange={HandleFiltro}
                    className={G.InputStyle}
                  />
                </div>
              </div>
              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <div className={G.Input + "w-32"}>
                    <div className={G.CheckStyle}>
                      <RadioButton
                        inputId="todos"
                        name="tipoExistenciaId"
                        value={""}
                        disabled={modo == "Consultar"}
                        onChange={(e) => {
                          HandleFiltro(e);
                        }}
                        checked={filtro.tipoExistenciaId === ""}
                      ></RadioButton>
                    </div>
                    <label
                      htmlFor="todos"
                      className={G.LabelCheckStyle + "rounded-r-none"}
                    >
                      Todos
                    </label>
                  </div>
                  <div className={G.Input + "w-44"}>
                    <div className={G.CheckStyle + "rounded-l-none"}>
                      <RadioButton
                        inputId="mercaderia"
                        name="tipoExistenciaId"
                        value={"01"}
                        disabled={modo == "Consultar"}
                        onChange={(e) => {
                          HandleFiltro(e);
                        }}
                        checked={filtro.tipoExistenciaId === "01"}
                      ></RadioButton>
                    </div>
                    <label
                      htmlFor="mercaderia"
                      className={G.LabelCheckStyle + "rounded-r-none"}
                    >
                      Mercadería
                    </label>
                  </div>
                  <div className={G.InputTercio}>
                    <div className={G.CheckStyle + "rounded-l-none"}>
                      <RadioButton
                        inputId="productoTerminado"
                        name="tipoExistenciaId"
                        value="02"
                        disabled={modo == "Consultar"}
                        onChange={(e) => {
                          HandleFiltro(e);
                        }}
                        checked={filtro.tipoExistenciaId === "02"}
                      ></RadioButton>
                    </div>
                    <label
                      htmlFor="productoTerminado"
                      className={G.LabelCheckStyle + "rounded-r-none"}
                    >
                      Producto Terminado
                    </label>
                  </div>
                  <div className={G.InputTercio}>
                    <div className={G.CheckStyle + "rounded-l-none"}>
                      <RadioButton
                        inputId="materiaPrima"
                        name="tipoExistenciaId"
                        value="03"
                        disabled={modo == "Consultar"}
                        onChange={(e) => {
                          HandleFiltro(e);
                        }}
                        checked={filtro.tipoExistenciaId === "03"}
                      ></RadioButton>
                    </div>
                    <label
                      htmlFor="materiaPrima"
                      className={G.LabelCheckStyle + "rounded-r-none"}
                    >
                      Materia Prima
                    </label>
                  </div>
                  <div className={G.InputTercio}>
                    <div className={G.CheckStyle + "rounded-l-none"}>
                      <RadioButton
                        inputId="envasesEmbalajes"
                        name="tipoExistenciaId"
                        value="04"
                        disabled={modo == "Consultar"}
                        onChange={(e) => {
                          HandleFiltro(e);
                        }}
                        checked={filtro.tipoExistenciaId === "04"}
                      ></RadioButton>
                    </div>
                    <label
                      htmlFor="envasesEmbalajes"
                      className={G.LabelCheckStyle + "rounded-r-none"}
                    >
                      Embases y Embalajes
                    </label>
                  </div>
                  <div className={G.Input + "w-32"}>
                    <div className={G.CheckStyle + G.Anidado}>
                      <RadioButton
                        inputId="otros"
                        name="tipoExistenciaId"
                        value="99"
                        disabled={modo == "Consultar"}
                        onChange={(e) => {
                          HandleFiltro(e);
                        }}
                        checked={filtro.tipoExistenciaId === "99"}
                      ></RadioButton>
                    </div>
                    <label
                      htmlFor="otros"
                      className={G.LabelCheckStyle + " !py-1 "}
                    >
                      Otros
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {/* Detalles */}

            {/* Tabla Detalle */}
            <DivTabla>
              <Table
                id={"tablaCuadreStockModal"}
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
            </DivTabla>
            {/* Tabla Detalle */}

            {/*Tabla Footer*/}
            <div className={G.ContenedorFooter}>
              <div className="flex">
                <div className={G.FilaFooter + G.FilaVacia}></div>
                <div className={G.FilaFooter + G.FilaPrecio}>
                  <p className={G.FilaContenido}>Total Sobra</p>
                </div>
                <div className={G.FilaFooter + G.FilaImporte}>
                  <p className={G.FilaContenido}>{data.totalSobra ?? "0.00"}</p>
                </div>
                <div className={G.FilaFooter + G.UltimaFila}></div>
              </div>
              <div className="flex">
                <div className={G.FilaFooter + G.FilaVacia}></div>
                <div className={G.FilaFooter + G.FilaPrecio}>
                  <p className={G.FilaContenido}>Total Falta</p>
                </div>
                <div className={G.FilaFooter + G.FilaImporte}>
                  <p className={G.FilaContenido}>{data.totalFalta ?? "0.00"}</p>
                </div>
                <div className={G.FilaFooter + G.UltimaFila}></div>
              </div>
              <div className="flex">
                <div className={G.FilaFooter + G.FilaVacia}></div>
                <div className={G.FilaFooter + G.FilaPrecio}>
                  <p className={G.FilaContenido}>Saldo Total</p>
                </div>
                <div className={G.FilaFooter + G.FilaImporte}>
                  <p className={G.FilaContenido}>{data.saldoTotal ?? "0.00"}</p>
                </div>
                <div className={G.FilaFooter + G.UltimaFila}></div>
              </div>
            </div>
            {/*Tabla Footer*/}
          </ModalCrud>
          <Dialog
            showHeader={false}
            closeOnEscape={false}
            closable={false}
            modal={true}
            visible={loading}
            pt={{
              root: { className: "w-12" },
              content: { className: "p-4 flex items-center justify-center" },
            }}
          >
            <ProgressSpinner
              pt={{
                spinner: { style: { animationDuration: "0s" } },
                circle: {
                  style: {
                    stroke: "#F59E0B",
                    strokeWidth: 3,
                    animation: "none",
                  },
                },
              }}
            ></ProgressSpinner>
            <p className="pt-4 font-semibold">Recalculando</p>
          </Dialog>
          {modalInventario && (
            <ModalInventario
              setModal={setModalInventario}
              modo={modoInventario}
              objeto={dataInventario}
              setObjeto={setDataInventario}
              foco={document.getElementById("tablaCuadreStockModal")}
            />
          )}
        </>
      )}
    </>
  );
  //#endregion
};

export default Modal;
