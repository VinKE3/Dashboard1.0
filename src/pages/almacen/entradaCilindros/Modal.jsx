import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import FiltroCilindro from "../../../components/filtro/FiltroCilindro";
import Mensajes from "../../../components/funciones/Mensajes";
import TableBasic from "../../../components/tabla/TableBasic";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Checkbox } from "primereact/checkbox";
import moment from "moment";
import { FaPlus, FaSearch, FaPen, FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import * as Global from "../../../components/Global";
import * as Funciones from "../../../components/funciones/Validaciones";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    width: 40px;
    text-align: center;
  }
  & th:nth-child(4),
  & th:nth-child(5) {
    width: 130px;
    min-width: 130px;
    max-width: 130px;
    text-align: center;
  }
  & th:last-child {
    width: 75px;
    min-width: 90px;
    max-width: 90px;
    text-align: center;
  }
`;
//#endregion

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  //Data General
  const [data, setData] = useState(objeto);
  const [dataDetalle, setDataDetalle] = useState(objeto.detalles); //Data General
  //Tablas
  const [dataPersonal, setDataPersonal] = useState([]);
  //Tablas

  //Data Modales Filtro
  const [dataCilindro, setDataCilindro] = useState([]);
  const [dataCabecera, setDataCabecera] = useState({
    id: "00000006",
    lineaId: "00",
    subLineaId: "00",
    articuloId: "0006",
    unidadMedidaId: "1",
    marcaId: 1,
    descripcion: "CILINDROS",
    cantidad: 0,
    unidadMedidaDescripcion: "UND",
  });
  //Data Modales Filtro

  //Modales Filtro
  const [modalCilindro, setModalCilindro] = useState(false);
  //Modales Filtro

  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [detalleId, setDetalleId] = useState(dataDetalle.length + 1);
  const [mensaje, setMensaje] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (Object.keys(dataCilindro).length > 0) {
      //Cabecera
      GuiaRelacionada();
      //Cabecera
      //Detalles
      DetallesGuias(dataCilindro.accion);
      //Detalles
      OcultarMensajes();
    }
  }, [dataCilindro]);
  useEffect(() => {
    setData({ ...data, detalles: dataDetalle });
  }, [dataDetalle]);
  useEffect(() => {
    if (refrescar) {
      ActualizarTotales();
      setRefrescar(false);
    }
  }, [refrescar]);
  useEffect(() => {
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    if (target.name == "isSobrante" || target.name == "isVenta") {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.checked,
      }));
    } else {
      if (target.name == "personalId") {
        let model = target.value;
        if (dataDetalle.length > 0) {
          Swal.fire({
            title: "¿Confirma cambiar de Personal? Los detalles se perderán",
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
              Personal(model);
            } else {
              setData((prevState) => ({
                ...prevState,
                personalId: data.personalId,
              }));
            }
          });
          return;
        }
      }

      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  const Numeracion = async ({ target }) => {
    if (target.name == "numero") {
      let num = target.value;
      if (num.length < 10) {
        num = ("0000000000" + num).slice(-10);
      }
      setData((prevState) => ({
        ...prevState,
        numero: num,
      }));
    }
    if (target.name == "serie") {
      let num = target.value;
      if (num.length < 4) {
        num = ("0000000000" + num).slice(-4);
      }
      setData((prevState) => ({
        ...prevState,
        serie: num,
      }));
    }
  };
  const GuiaRelacionada = async () => {
    if (dataCilindro.accion == "agregar") {
      setData({
        ...data,
        clienteId: dataCilindro.clienteId,
        clienteNombre: dataCilindro.cliente.nombre,
        //Anidar
        guiasRelacionadas: [
          ...data.guiasRelacionadas,
          dataCilindro.guiasRelacionadas,
        ],
        //Anidar
      });
    } else {
      if (Object.entries(dataCilindro.guiasRelacionadas).length == 0) {
        setData({
          ...data,
          clienteId: "",
          clienteNombre: "",
          //Anidar
          guiasRelacionadas: dataCilindro.guiasRelacionadas || [],
          //Anidar
        });
        //Detalles
        setDataDetalle([]);
        //Detalles
      } else {
        setData({
          ...data,
          //Anidar
          guiasRelacionadas: dataCilindro.guiasRelacionadas || [],
          //Anidar
        });
      }
    }
  };
  const Personal = async (value) => {
    const result = await ApiMasy.get(`api/Mantenimiento/Articulo/00000006`);
    setDataDetalle([]);
    setDataCabecera({
      id: result.data.data.id,
      lineaId: result.data.data.lineaId,
      subLineaId: result.data.data.subLineaId,
      articuloId: result.data.data.articuloId,
      unidadMedidaId: result.data.data.unidadMedidaId,
      marcaId: result.data.data.marcaId,
      descripcion: result.data.data.descripcion,
      cantidad: 0,
      unidadMedidaDescripcion: result.data.data.unidadMedidaDescripcion,
    });
    setData((prevState) => ({
      ...prevState,
      personalId: value,
      clienteId: "",
      clienteNombre: "",
      guiasRelacionadas: [],
    }));
  };
  const OcultarMensajes = () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  //#endregion

  //#region Cabecera
  const ValidarCabecera = async ({ target }) => {
    setDataCabecera((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  //#endregion

  //#region Funciones Detalles
  const ValidarDetalle = async () => {
    //valida Descripcion
    if (dataCabecera.descripcion == undefined) {
      return [false, "Seleccione un Item"];
    }
    //Valida Cantidad
    if (Funciones.IsNumeroValido(dataCabecera.cantidad, false) != "") {
      document.getElementById("cantidad").focus();
      return [
        false,
        "Cantidad: " + Funciones.IsNumeroValido(dataCabecera.cantidad, false),
      ];
    }
    return [true, ""];
  };
  const AgregarDetalle = async () => {
    //Obtiene resultado de Validación
    let resultado = await ValidarDetalle();
    if (resultado[0]) {
      //Si tiene detalleId entonces modifica registro
      if (dataCabecera.detalleId != undefined) {
        let dataDetalleMod = dataDetalle.map((map) => {
          if (map.id == dataCabecera.id) {
            return {
              detalleId: dataCabecera.detalleId,
              salidaCilindrosId: dataCabecera.id,
              lineaId: dataCabecera.lineaId,
              subLineaId: dataCabecera.subLineaId,
              articuloId: dataCabecera.articuloId,
              marcaId: dataCabecera.marcaId,
              descripcion: dataCabecera.descripcion,
              unidadMedidaDescripcion: dataCabecera.unidadMedidaDescripcion,
              unidadMedidaId: dataCabecera.unidadMedidaId,
              cantidad: Funciones.RedondearNumero(dataCabecera.cantidad, 2),
            };
          } else {
            return map;
          }
        });
        setDataDetalle(dataDetalleMod);
        setRefrescar(true);
      } else {
        setDataDetalle((prev) => [
          ...prev,
          {
            detalleId: detalleId,
            salidaCilindrosId: dataCabecera.id,
            lineaId: dataCabecera.lineaId,
            subLineaId: dataCabecera.subLineaId,
            articuloId: dataCabecera.articuloId,
            marcaId: dataCabecera.marcaId,
            descripcion: dataCabecera.descripcion,
            unidadMedidaDescripcion: dataCabecera.unidadMedidaDescripcion,
            unidadMedidaId: dataCabecera.unidadMedidaId,
            cantidad: Funciones.RedondearNumero(dataCabecera.cantidad, 2),
          },
        ]);
        setDetalleId(detalleId + 1);
        setRefrescar(true);
      }
      //Luego de añadir el artículo se limpia
      setDataCabecera([]);
    } else {
      //NO cumple validación
      if (resultado[1] != "") {
        toast.error(resultado[1], {
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
    }
  };
  const CargarDetalle = async (id) => {
    setDataCabecera(dataDetalle.find((map) => map.id === id));
  };
  const EliminarDetalle = async (id) => {
    let i = 1;
    let nuevoDetalle = dataDetalle.filter((map) => map.id !== id);
    if (nuevoDetalle.length > 0) {
      setDataDetalle(
        nuevoDetalle.map((map) => {
          return {
            ...map,
            detalleId: i++,
          };
        })
      );
      setDetalleId(i);
    } else {
      //Asgina directamente a 1
      setDetalleId(nuevoDetalle.length + 1);
      //Asgina directamente a 1
      setDataDetalle(nuevoDetalle);
    }

    //Anidar Documentos
    let guiasRelacionadas = data.guiasRelacionadas.filter(
      (map) => map.id !== id
    );
    setData({
      ...data,
      guiasRelacionadas: guiasRelacionadas,
    });
    //Anidar Documentos

    setRefrescar(true);
  };
  const DetallesGuias = async (accion) => {
    //Recorre los detalles que nos retorna el Filtro Orden de Compra
    let detalleEliminado = dataDetalle;
    //Contador para asignar el detalleId
    let contador = dataDetalle.length;
    //Almacena el detalle modificado sumando o restando
    let dataDetalleMod = Object.assign([], dataDetalle);
    let dataDetalleEliminar = dataDetalle;
    //Almacena el detalle modificado sumando o restando

    //Mapea los detalles
    dataCilindro.detalles.map((dataPersonalDetalleMap) => {
      contador++;
      //Verifica con los detalles ya seleccionados si coincide algún registro por el id
      let dataDetalleExiste = dataDetalle.find((map) => {
        return map.salidaCilindrosId == dataCilindro.id;
      });
      //Verifica con los detalles ya seleccionados si coincide algún registro por el id

      //Validamos si la accion es Agregar o Eliminar
      if (accion == "agregar") {
        //Si dataDetalleExiste es undefined hace el PUSH
        if (dataDetalleExiste == undefined) {
          //Toma el valor actual de contador para asignarlo
          let i = contador;
          //Toma el valor actual de contador para asignarlo

          //Agrega nuevo
          setDataDetalle((prev) => [
            ...prev,
            {
              detalleId: i,
              lineaId: dataPersonalDetalleMap.lineaId,
              salidaCilindrosId: dataCilindro.id,
              subLineaId: dataPersonalDetalleMap.subLineaId,
              articuloId: dataPersonalDetalleMap.articuloId,
              unidadMedidaId: dataPersonalDetalleMap.unidadMedidaId,
              marcaId: dataPersonalDetalleMap.marcaId,
              descripcion: "CILINDRO DE" + "  " + dataCilindro.numeroGuia,
              cantidad: dataPersonalDetalleMap.cantidad,
              unidadMedidaDescripcion:
                dataPersonalDetalleMap.unidadMedidaDescripcion,
            },
          ]);
          //Agrega nuevo

          //Asigna el valor final de contador y le agrega 1
          setDetalleId(contador + 1);
          //Asigna el valor final de contador y le agrega 1
        } else {
          //Modifica registro en base al id
          dataDetalleMod = dataDetalleMod.map((map) => {
            if (map.salidaCilindrosId == dataDetalleExiste.salidaCilindrosId) {
              //Calculos
              let cantidad =
                dataDetalleExiste.cantidad + dataPersonalDetalleMap.cantidad;
              //Calculos
              return {
                detalleId: dataDetalleExiste.detalleId,
                salidaCilindrosId: dataPersonalDetalleMap.salidaCilindrosId,
                lineaId: dataPersonalDetalleMap.lineaId,
                subLineaId: dataPersonalDetalleMap.subLineaId,
                articuloId: dataPersonalDetalleMap.articuloId,
                unidadMedidaId: dataPersonalDetalleMap.unidadMedidaId,
                marcaId: dataPersonalDetalleMap.marcaId,
                descripcion: dataDetalleExiste.descripcion,
                cantidad: cantidad,
                unidadMedidaDescripcion:
                  dataPersonalDetalleMap.unidadMedidaDescripcion,
              };
            } else {
              return map;
            }
          });
          //Modifica registro en base al id

          setDataDetalle(dataDetalleMod);
        }
      } else {
        //ELIMINAR
        if (dataDetalleExiste != undefined) {
          //Validamos por la cantidad
          if (
            dataDetalleExiste.cantidad - dataPersonalDetalleMap.cantidad ==
            0
          ) {
            //Si el resultado es 0 entonces se elimina por completo el registro
            detalleEliminado = detalleEliminado.filter(
              (map) =>
                map.salidaCilindrosId !== dataDetalleExiste.salidaCilindrosId
            );
            //Si el resultado es 0 entonces se elimina por completo el registro

            //Toma el valor actual de contador para asignarlo
            let i = 1;
            //Toma el valor actual de contador para asignarlo

            if (detalleEliminado.length > 0) {
              //Asigna el detalle Filtrado
              setDataDetalle(
                detalleEliminado.map((map) => {
                  return {
                    ...map,
                    detalleId: i++,
                  };
                })
              );
              //Asigna el detalle Filtrado

              setDetalleId(i);
            } else {
              //Asgina directamente a 1
              setDetalleId(detalleEliminado.length + 1);
              //Asgina directamente a 1
              setDataDetalle(detalleEliminado);
            }
            setRefrescar(true);
          } else {
            //Si la resta es mayor a 0 entonces restamos al detalle encontrado

            //Modifica registro en base al id
            dataDetalleEliminar = dataDetalleEliminar.map((map) => {
              if (
                map.salidaCilindrosId == dataDetalleExiste.salidaCilindrosId
              ) {
                //Calculos
                let cantidad =
                  dataDetalleExiste.cantidad - dataPersonalDetalleMap.cantidad;
                //Calculos
                return {
                  detalleId: dataDetalleExiste.detalleId,
                  salidaCilindrosId: dataPersonalDetalleMap.salidaCilindrosId,
                  lineaId: dataPersonalDetalleMap.lineaId,
                  subLineaId: dataPersonalDetalleMap.subLineaId,
                  articuloId: dataPersonalDetalleMap.articuloId,
                  unidadMedidaId: dataPersonalDetalleMap.unidadMedidaId,
                  marcaId: dataPersonalDetalleMap.marcaId,
                  descripcion: dataDetalleExiste.descripcion,
                  cantidad: cantidad,
                  unidadMedidaDescripcion:
                    dataPersonalDetalleMap.unidadMedidaDescripcion,
                };
              } else {
                return map;
              }
            });
            //Modifica registro en base al id

            setDataDetalle(dataDetalleEliminar);
          }
        }
        //ELIMINAR
      }
      //Validamos si la accion es Agregar o Eliminar
      setRefrescar(true);
    });
    //Mapea los detalles
  };
  //Calculos de Cilindros
  const ActualizarTotales = async () => {
    //Suma de la cantidad de cilindros
    let total = dataDetalle.reduce((i, map) => {
      return i + map.cantidad;
    }, 0);

    setData((prevState) => ({
      ...prevState,
      totalCilindros: Funciones.RedondearNumero(total, 2),
    }));
  };
  //Calculos
  //#endregion

  //#region  API
  const Tablas = async () => {
    const result = await ApiMasy(
      `/api/Almacen/EntradaCilindros/FormularioTablas`
    );
    setDataPersonal(
      result.data.data.personal.map((res) => ({
        personalId: res.apellidoPaterno + res.apellidoMaterno + res.nombres,
        ...res,
      }))
    );
  };
  //#endregion

  //#region Funciones Modal
  const AbrirFiltroCilindro = async () => {
    setModalCilindro(true);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Item",
      accessor: "detalleId",
      Cell: ({ value }) => {
        return <p className="text-center">{value}</p>;
      },
    },
    {
      Header: "Descripción",
      accessor: "descripcion",
    },
    {
      Header: "Unidad",
      accessor: "unidadMedidaDescripcion",
      Cell: ({ value }) => {
        return <p className="text-right pr-2.5 font-semibold">{value}</p>;
      },
    },
    {
      Header: "Cantidad",
      accessor: "cantidad",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-4">
            {Funciones.RedondearNumero(value, 4)}
          </p>
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
                  id="boton"
                  className="p-0 px-1"
                  title="Click para modificar registro"
                  onClick={() => CargarDetalle(row.values.id)}
                >
                  <FaPen></FaPen>
                </button>
              </div>

              <div className={Global.TablaBotonEliminar}>
                <button
                  id="boton-eliminar"
                  onClick={() => {
                    EliminarDetalle(row.values.id);
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

  //#region  Render
  return (
    <>
      {Object.entries(dataPersonal).length > 0 && (
        <>
          <ModalCrud
            setModal={setModal}
            setRespuestaModal={setRespuestaModal}
            objeto={data}
            modo={modo}
            menu={["Almacen", "EntradaCilindros"]}
            titulo="Entrada de Cilindros"
            cerrar={false}
            foco={document.getElementById("tablaEntradaCilindro")}
            tamañoModal={[Global.ModalFull, Global.Form]}
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
                Global.ContenedorBasico + Global.FondoContenedor + " mb-3"
              }
            >
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputTercio}>
                  <label htmlFor="serie" className={Global.LabelStyle}>
                    Serie
                  </label>
                  <input
                    type="text"
                    id="serie"
                    name="serie"
                    placeholder="Serie"
                    autoComplete="off"
                    maxLength="4"
                    autoFocus
                    disabled={modo == "Nuevo" ? false : true}
                    value={data.serie ?? ""}
                    onChange={ValidarData}
                    onBlur={(e) => Numeracion(e)}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputTercio}>
                  <label htmlFor="numero" className={Global.LabelStyle}>
                    Número
                  </label>
                  <input
                    type="text"
                    id="numero"
                    name="numero"
                    placeholder="Número"
                    autoComplete="off"
                    maxLength="10"
                    disabled={modo == "Nuevo" ? false : true}
                    value={data.numero ?? ""}
                    onChange={ValidarData}
                    onBlur={(e) => Numeracion(e)}
                    className={
                      modo == "Nuevo" ? Global.InputStyle : Global.InputStyle
                    }
                  />
                </div>
                <div className={Global.InputTercio}>
                  <div className={Global.InputMitad}>
                    <div className={Global.CheckStyle}>
                      <Checkbox
                        inputId="isSobrante"
                        name="isSobrante"
                        disabled={modo == "Consultar"}
                        value={data.isSobrante ?? ""}
                        onChange={(e) => {
                          ValidarData(e);
                        }}
                        checked={data.isSobrante ? true : ""}
                      />
                    </div>
                    <label
                      htmlFor="isSobrante"
                      className={Global.LabelCheckStyle + "rounded-r-none"}
                    >
                      Sobrante
                    </label>
                  </div>
                  <div className={Global.InputMitad}>
                    <div className={Global.CheckStyle + "rounded-l-none"}>
                      <Checkbox
                        inputId="isVenta"
                        name="isVenta"
                        disabled={modo == "Consultar"}
                        value={data.isVenta ?? ""}
                        onChange={(e) => {
                          ValidarData(e);
                        }}
                        checked={data.isVenta ? true : ""}
                      />
                    </div>
                    <label htmlFor="isVenta" className={Global.LabelCheckStyle}>
                      Venta
                    </label>
                  </div>
                </div>
              </div>
              <div className={Global.ContenedorInputs}>
                <div className={Global.Input40pct}>
                  <label htmlFor="fechaEmision" className={Global.LabelStyle}>
                    F. Emisión
                  </label>
                  <input
                    type="date"
                    id="fechaEmision"
                    name="fechaEmision"
                    autoComplete="off"
                    autoFocus={modo == "Modificar"}
                    disabled={modo == "Consultar"}
                    value={moment(data.fechaEmision ?? "").format("yyyy-MM-DD")}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputFull}>
                  <label htmlFor="personalId" className={Global.LabelStyle}>
                    Personal
                  </label>
                  <select
                    id="personalId"
                    name="personalId"
                    disabled={modo == "Consultar"}
                    value={data.personalId}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  >
                    {dataPersonal.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.personalId}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label htmlFor="clienteNombre" className={Global.LabelStyle}>
                    Cliente
                  </label>
                  <input
                    type="text"
                    id="clienteNombre"
                    name="clienteNombre"
                    placeholder="Cliente"
                    autoComplete="off"
                    disabled={true}
                    value={data.clienteNombre ?? ""}
                    className={Global.InputBoton}
                  />
                  <button
                    id="consultarFactura"
                    className={
                      Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                    }
                    hidden={modo == "Consultar"}
                    onKeyDown={(e) => Funciones.KeyClick(e)}
                    onClick={() => AbrirFiltroCilindro()}
                  >
                    <FaSearch></FaSearch>
                  </button>
                </div>
              </div>

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
                  disabled={modo == "Consultar"}
                  value={data.observacion ?? ""}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
            {/* Cabecera */}

            {/* Detalles */}
            {modo != "Consultar" && (
              <div
                className={
                  Global.ContenedorBasico + Global.FondoContenedor + " mb-2"
                }
              >
                <div className={Global.ContenedorInputs}>
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
                      disabled={true}
                      value={dataCabecera.descripcion ?? ""}
                      onChange={ValidarCabecera}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputTercio}>
                    <label
                      htmlFor="unidadMedidaDescripcion"
                      className={Global.LabelStyle}
                    >
                      Unidad
                    </label>
                    <input
                      type="text"
                      id="unidadMedidaDescripcion"
                      name="unidadMedidaDescripcion"
                      placeholder="Unidad Medida"
                      autoComplete="off"
                      disabled={true}
                      value={dataCabecera.unidadMedidaDescripcion ?? ""}
                      onChange={ValidarCabecera}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputTercio}>
                    <label htmlFor="cantidad" className={Global.LabelStyle}>
                      Cantidad
                    </label>
                    <input
                      type="number"
                      id="cantidad"
                      name="cantidad"
                      placeholder="Cantidad"
                      autoComplete="off"
                      min={0}
                      disabled={modo == "Consultar"}
                      value={dataCabecera.cantidad ?? ""}
                      onChange={ValidarCabecera}
                      className={Global.InputBoton + Global.Anidado}
                    />
                    <button
                      id="enviarDetalle"
                      className={
                        Global.BotonBuscar +
                        Global.Anidado +
                        Global.BotonPrimary
                      }
                      hidden={modo == "Consultar"}
                      onKeyDown={(e) => Funciones.KeyClick(e)}
                      onClick={() => AgregarDetalle()}
                    >
                      <FaPlus></FaPlus>
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Detalles */}

            {/* Tabla Detalle */}
            <TablaStyle>
              <TableBasic
                columnas={columnas}
                datos={dataDetalle}
                estilos={[
                  "",
                  "",
                  "",
                  "border ",
                  "",
                  "border border-b-0",
                  "border",
                ]}
              />
            </TablaStyle>
            {/* Tabla Detalle */}

            {/*Tabla Footer*/}
            <div className={Global.ContenedorFooter}>
              <div className="flex">
                <div className={Global.FilaVacia}></div>
                <div className={Global.FilaPrecio}>
                  <p className={Global.FilaContenido}>Total</p>
                </div>
                <div className={Global.FilaImporte}>
                  <p className={Global.FilaContenido}>
                    {data.totalCilindros ?? "0.00"}
                  </p>
                </div>
                <div className={Global.UltimaFila}></div>
              </div>
            </div>
            {/*Tabla Footer*/}
          </ModalCrud>
        </>
      )}
      {modalCilindro && (
        <FiltroCilindro
          setModal={setModalCilindro}
          id={data.personalId}
          setObjeto={setDataCilindro}
          objeto={data.guiasRelacionadas}
          foco={document.getElementById("observacion")}
        />
      )}
    </>
  );
  //#endregion
};

export default Modal;
