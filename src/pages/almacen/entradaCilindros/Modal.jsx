import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/ModalCrud";
import FiltroSalidaCilindros from "../../../components/filtros/FiltroSalidaCilindros";
import Mensajes from "../../../components/Mensajes";
import TableBasic from "../../../components/tablas/TableBasic";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Checkbox } from "primereact/checkbox";
import moment from "moment";
import { FaPlus, FaSearch, FaPen, FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import * as Global from "../../../components/Global";
import * as Funciones from "../../../components/Funciones";
//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    align-items: center;
    text-align: center;
  }
  & th:nth-child(4) {
    align-items: center;
    text-align: center;
  }
  & th:nth-child(5) {
    align-items: center;
    text-align: center;
  }
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;
//#endregion

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  //?Data General
  const [data, setData] = useState(objeto);
  const [dataDetalle, setDataDetalle] = useState(objeto.detalles);
  //?checkboxes
  const [checked, setChecked] = useState(true);
  const [checked2, setChecked2] = useState(true);
  //?Tablas
  const [personal, setPersonal] = useState([]);
  //?Data Modales Filtro
  const [dataPersonal, setDataPersonal] = useState([]);
  const [dataArt, setDataArt] = useState({
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
  //?Modales Filtro
  const [modalSalidaCilindros, setModalSalidaCilindros] = useState(false);
  //?Data Ayuda
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [detalleId, setDetalleId] = useState(dataDetalle.length + 1);
  const [mensaje, setMensaje] = useState([]);
  const [refrescar, setRefrescar] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    data;
    console.log(data, "DATADATADATA");
  }, [data]);

  useEffect(() => {
    if (Object.keys(dataPersonal).length > 0) {
      //Cabecera
      GuiaRelacionada();
      //Cabecera
      //Detalles
      DetallesGuias(dataPersonal.accion);
      //Detalles
      OcultarMensajes();
    }
  }, [dataPersonal]);

  useEffect(() => {
    setData({ ...data, detalles: dataDetalle });
  }, [dataDetalle]);

  useEffect(() => {
    if (refrescar) {
      ActualizarImportesTotales();
      setRefrescar(false);
    }
  }, [refrescar]);

  useEffect(() => {
    GetTablas();
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
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  const Numeracion = async (e) => {
    if (e.target.name == "numero") {
      let num = e.target.value;
      if (num.length < 10) {
        num = ("0000000000" + num).slice(-10);
      }
      setData((prevState) => ({
        ...prevState,
        numero: num,
      }));
    }
    if (e.target.name == "serie") {
      let num = e.target.value;
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
    if (dataPersonal.cliente && dataPersonal.cliente.nombre) {
      setData({
        ...data,
        clienteId: dataPersonal.clienteId,
        clienteNombre: dataPersonal.cliente.nombre,
        guiasRelacionadas: [
          ...data.guiasRelacionadas,
          dataPersonal.guiasRelacionadas,
        ],
      });
    }
  };
  const handlePersonalChange = async (e) => {
    if (dataDetalle.length > 0) {
      Swal.fire({
        title: "¿Estas seguro de cambiar de personal? Los detalles se perderan",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          setDataDetalle([]);
          setDataArt({
            id: "00000006",
            lineaId: "00",
            subLineaId: "00",
            articuloId: "0006",
            unidadMedidaId: "1",
            marcaId: 0,
            descripcion: "CILINDROS",
            cantidad: 0,
            unidadMedidaDescripcion: "UND",
          });
        } else {
          setData((prevState) => ({
            ...prevState,
            personalId: data.personalId,
            personalNombre: data.personalNombre,
          }));
        }
      });
    }
    setData({
      ...data,
      personalId: e.target.value,
    });
  };

  const OcultarMensajes = () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  //#endregion

  //#region Articulos
  const ValidarDataArt = async ({ target }) => {
    setDataArt((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  //#endregion

  //#region Funciones Detalles
  const ValidarDetalle = async () => {
    //valida Descripcion
    if (dataArt.descripcion == undefined) {
      return [false, "La descripción no puede estar vacía"];
    }
    //Valida Cantidad
    if (dataArt.cantidad <= 0) {
      return [false, "La cantidad no puede ser 0"];
    }
    return [true, ""];
  };
  const AgregarDetalleArticulo = async () => {
    //Obtiene resultado de Validación
    let resultado = await ValidarDetalle();
    if (resultado[0]) {
      //Si tiene detalleId entonces modifica registro
      if (dataArt.detalleId != undefined) {
        let dataDetalleMod = dataDetalle.map((map) => {
          if (map.id == dataArt.id) {
            return {
              id: dataArt.id,
              detalleId: dataArt.detalleId,
              lineaId: dataArt.lineaId,
              subLineaId: dataArt.subLineaId,
              articuloId: dataArt.articuloId,
              marcaId: dataArt.marcaId,
              descripcion: dataArt.descripcion,
              unidadMedidaDescripcion: dataArt.unidadMedidaDescripcion,
              unidadMedidaId: dataArt.unidadMedidaId,
              cantidad: Funciones.RedondearNumero(dataArt.cantidad, 2),
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
            id: dataArt.id,
            detalleId: detalleId,
            lineaId: dataArt.lineaId,
            subLineaId: dataArt.subLineaId,
            articuloId: dataArt.articuloId,
            marcaId: dataArt.marcaId,
            descripcion: dataArt.descripcion,
            unidadMedidaDescripcion: dataArt.unidadMedidaDescripcion,
            unidadMedidaId: dataArt.unidadMedidaId,
            cantidad: Funciones.RedondearNumero(dataArt.cantidad, 2),
          },
        ]);
        setDetalleId(detalleId + 1);
        setRefrescar(true);
      }
      //Luego de añadir el artículo se limpia
      setDataArt([]);
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
    setDataArt(dataDetalle.find((map) => map.id === id));
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
      setDataDetalle(nuevoDetalle);
    }
    let guiasRelacionadas = data.guiasRelacionadas.filter(
      (map) => map.id !== id
    );
    setData({
      ...data,
      guiasRelacionadas: guiasRelacionadas,
    });
    setRefrescar(true);
  };
  const DetallesGuias = async (accion) => {
    //Recorre los detalles que nos retorna el Filtro Orden de Compra
    let detalleEliminado = dataDetalle;
    //Contador para asignar el detalleId
    let contador = dataDetalle.length;
    dataPersonal.detalles.map((dataPersonalDetalleMap) => {
      contador++;
      //?Verifica con los detalles ya seleccionados si coincide algún registro por el id
      let dataDetalleExiste = dataDetalle.find((map) => {
        return map.id == dataPersonalDetalleMap.id;
      });
      //Validamos si la accion es Agregar o Eliminar
      if (accion == "agregar") {
        //Si dataDetalleExiste es undefined hace el PUSH
        console.log(dataDetalleExiste == undefined, "1era condicion");
        if (dataDetalleExiste == undefined) {
          //Toma el valor actual de contador para asignarlo
          let i = contador;
          setDataDetalle((prev) => [
            ...prev,
            {
              detalleId: i,
              id: dataPersonal.id,
              lineaId: dataPersonalDetalleMap.lineaId,
              subLineaId: dataPersonalDetalleMap.subLineaId,
              articuloId: dataPersonalDetalleMap.articuloId,
              unidadMedidaId: dataPersonalDetalleMap.unidadMedidaId,
              marcaId: dataPersonalDetalleMap.marcaId,
              descripcion: "CILINDROS DE" + "  " + dataPersonal.numeroGuia,
              cantidad: dataPersonalDetalleMap.cantidad,
              unidadMedidaDescripcion:
                dataPersonalDetalleMap.unidadMedidaDescripcion,
              salidaCilindrosId: dataPersonal.id,
            },
          ]);
          //Asigna el valor final de contador y le agrega 1
          setDetalleId(contador + 1);
        } else {
          //Modifica registro en base al id
          let dataDetalleMod = dataDetalle.map((map) => {
            if (map.id == dataDetalleExiste.id) {
              //Calculos
              let cantidad =
                dataDetalleExiste.cantidad + dataPersonalDetalleMap.cantidad;
              //Calculos
              return {
                detalleId: dataDetalleExiste.detalleId,
                id: dataPersonal.id,
                lineaId: dataPersonalDetalleMap.lineaId,
                subLineaId: dataPersonalDetalleMap.subLineaId,
                articuloId: dataPersonalDetalleMap.articuloId,
                unidadMedidaId: dataPersonalDetalleMap.unidadMedidaId,
                marcaId: dataPersonalDetalleMap.marcaId,
                descripcion: "CILINDROS DE" + "  " + dataPersonal.numeroGuia,
                cantidad: cantidad,
                unidadMedidaDescripcion:
                  dataPersonalDetalleMap.unidadMedidaDescripcion,
                salidaCilindrosId: dataPersonal.id,
              };
            } else {
              return map;
            }
          });
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
              (map) => map.id !== dataDetalleExiste.id
            );
            //Si el resultado es 0 entonces se elimina por completo el registro

            //Toma el valor actual de contador para asignarlo
            let i = 1;
            if (detalleEliminado.length > 0) {
              setDataDetalle(
                detalleEliminado.map((map) => {
                  return {
                    ...map,
                    detalleId: i++,
                  };
                })
              );
              setDetalleId(i);
            } else {
              //Asgina directamente a 1
              setDetalleId(detalleEliminado.length + 1);
              setDataDetalle(detalleEliminado);
            }
            setRefrescar(true);
          } else {
            //Si la resta es mayor a 0 entonces restamos al detalle encontrado
            let dataDetalleEliminar = dataDetalle.map((map) => {
              if (map.id == dataDetalleExiste.id) {
                //Calculos
                let cantidad =
                  dataDetalleExiste.cantidad - dataPersonalDetalleMap.cantidad;
                //Calculos
                return {
                  detalleId: dataDetalleExiste.detalleId,
                  id: dataPersonalDetalleMap.id,
                  lineaId: dataPersonalDetalleMap.lineaId,
                  subLineaId: dataPersonalDetalleMap.subLineaId,
                  articuloId: dataPersonalDetalleMap.articuloId,
                  unidadMedidaId: dataPersonalDetalleMap.unidadMedidaId,
                  marcaId: dataPersonalDetalleMap.marcaId,
                  descripcion: "CILINDROS DE" + "  " + dataPersonal.numeroGuia,
                  cantidad: cantidad,
                  unidadMedidaDescripcion:
                    dataPersonalDetalleMap.unidadMedidaDescripcion,
                  salidaCilindrosId: dataPersonalDetalleMap.salidaCilindrosId,
                };
              } else {
                return map;
              }
            });
            setDataDetalle(dataDetalleEliminar);
          }
        }
      }
      setRefrescar(true);
    });
  };
  //?Calculos de Cilindros
  const ActualizarImportesTotales = async () => {
    //suma de la cantidad de cilindros
    let cantidadCilindros = 0;
    dataDetalle.map((map) => {
      cantidadCilindros += map.cantidad;
    });
    setData((prevState) => ({
      ...prevState,
      totalCilindros: cantidadCilindros,
    }));
  };
  //Calculos
  //#endregion

  //#region  API
  const GetTablas = async () => {
    const result = await ApiMasy(
      `/api/almacen/EntradaCilindros/FormularioTablas`
    );
    let model = result.data.data.personal.map((res) => ({
      personalId: res.apellidoPaterno + res.apellidoMaterno + res.nombres,
      ...res,
    }));
    setPersonal(model);
  };
  //#endregion

  //#region Funciones Modal
  const AbrirFiltroCilindro = async () => {
    setModalSalidaCilindros(true);
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
        return <p className="text-center font-semibold">{value}</p>;
      },
    },
    {
      Header: "Cantidad",
      accessor: "cantidad",
      Cell: ({ value }) => {
        return (
          <p className="text-center font-semibold pr-1.5">
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
                  onClick={() => CargarDetalle(row.values.id)}
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
      {Object.entries(personal).length > 0 && (
        <>
          <ModalCrud
            setModal={setModal}
            setRespuestaModal={setRespuestaModal}
            objeto={data}
            modo={modo}
            menu={["Almacen", "EntradaCilindros"]}
            tamañoModal={[Global.ModalGrande, Global.Form]}
            titulo="Entrada de Cilindros"
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
                <div className={Global.Input60pct}>
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
                    disabled={modo == "Registrar" ? false : true}
                    value={data.serie ?? ""}
                    onChange={ValidarData}
                    onBlur={(e) => Numeracion(e)}
                    className={
                      modo == "Registrar"
                        ? Global.InputStyle
                        : Global.InputStyle
                    }
                  />
                </div>
                <div className={Global.Input60pct}>
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
                    disabled={modo == "Registrar" ? false : true}
                    value={data.numero ?? ""}
                    onChange={ValidarData}
                    onBlur={(e) => Numeracion(e)}
                    className={
                      modo == "Registrar"
                        ? Global.InputStyle
                        : Global.InputStyle
                    }
                  />
                </div>
                <div className={Global.Input60pct}>
                  <div className={Global.LabelStyle}>
                    <Checkbox
                      inputId="isSobrante"
                      name="isSobrante"
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.isSobrante}
                      onChange={(e) => {
                        setChecked(e.checked);
                        ValidarData(e);
                      }}
                      checked={data.isSobrante ? checked : ""}
                    />
                  </div>
                  <label htmlFor="isSobrante" className={Global.InputStyle}>
                    <div className="text-red-500 font-bold"> Sobrante</div>
                  </label>
                </div>
                <div className={Global.Input60pct}>
                  <div className={Global.LabelStyle}>
                    <Checkbox
                      inputId="isVenta"
                      name="isVenta"
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.isVenta}
                      onChange={(e) => {
                        setChecked2(e.checked);
                        ValidarData(e);
                      }}
                      checked={data.isVenta ? checked2 : ""}
                    />
                  </div>
                  <label htmlFor="isVenta" className={Global.InputStyle}>
                    <div className="text-green-500 font-bold"> Venta</div>
                  </label>
                </div>
              </div>
              <div className={Global.ContenedorBasico + Global.FondoContenedor}>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.Input40pct}>
                    <label htmlFor="fechaEmision" className={Global.LabelStyle}>
                      Fecha Emisión
                    </label>
                    <input
                      type="date"
                      id="fechaEmision"
                      name="fechaEmision"
                      maxLength="2"
                      autoComplete="off"
                      readOnly={modo == "Consultar" ? true : false}
                      value={moment(data.fechaEmision ?? "").format(
                        "yyyy-MM-DD"
                      )}
                      onChange={ValidarData}
                      className={
                        modo == "Consultar"
                          ? Global.InputStyle + Global.Disabled
                          : Global.InputStyle
                      }
                    />
                  </div>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="clienteNombre"
                      className={Global.LabelStyle}
                    >
                      Cliente
                    </label>
                    <input
                      type="text"
                      id="clienteNombre"
                      name="clienteNombre"
                      autoComplete="off"
                      readOnly={modo == "Consultar" ? true : false}
                      value={data.clienteNombre}
                      onChange={ValidarData}
                      className={
                        modo == "Consultar"
                          ? Global.InputStyle + Global.Disabled
                          : Global.InputStyle
                      }
                    />
                  </div>
                </div>

                <div className={Global.InputFull}>
                  <label htmlFor="personalId" className={Global.LabelStyle}>
                    Personal
                  </label>
                  <select
                    id="personalId"
                    name="personalId"
                    disabled={modo == "Consultar" ? true : false}
                    value={data.personalId}
                    onChange={handlePersonalChange}
                    className={Global.InputBoton}
                  >
                    {personal.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.personalId}
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor="buscarCilindro"
                    className={Global.LabelStyle + Global.Anidado}
                  >
                    Buscar Guia
                  </label>
                  <button
                    id="consultarFactura"
                    className={
                      Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                    }
                    hidden={modo == "Consultar" ? true : false}
                    onClick={() => AbrirFiltroCilindro()}
                  >
                    <FaSearch></FaSearch>
                  </button>
                </div>
                <div className={Global.InputFull}>
                  <label htmlFor="observacion" className={Global.LabelStyle}>
                    Observación
                  </label>
                  <input
                    type="text"
                    id="observacion"
                    name="observacion"
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
                    value={data.observacion}
                    onChange={ValidarData}
                    className={
                      modo == "Consultar"
                        ? Global.InputStyle + Global.Disabled
                        : Global.InputStyle
                    }
                  />
                </div>
              </div>
            </div>
            {/* Cabecera */}

            {/* Detalles */}
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
                    readOnly={true}
                    autoComplete="off"
                    value={dataArt.descripcion ?? ""}
                    onChange={ValidarDataArt}
                    className={Global.InputStyle + Global.Disabled}
                  />
                </div>
                <div className={Global.Input25pct}>
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
                    value={dataArt.unidadMedidaDescripcion ?? ""}
                    onChange={ValidarDataArt}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.Input25pct}>
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
                    disabled={modo == "Consultar" ? true : false}
                    value={dataArt.cantidad ?? ""}
                    onChange={ValidarDataArt}
                    className={Global.InputBoton + Global.Anidado}
                  />
                </div>
                <button
                  id="enviarDetalle"
                  className={
                    Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                  }
                  hidden={modo == "Consultar" ? true : false}
                  onClick={() => AgregarDetalleArticulo()}
                >
                  <FaPlus></FaPlus>
                </button>
              </div>
            </div>
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
                  <p className={Global.FilaContenido}>Total Cilindros</p>
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
      {modalSalidaCilindros && (
        <FiltroSalidaCilindros
          setModal={setModalSalidaCilindros}
          id={data.personalId}
          setObjeto={setDataPersonal}
          objeto={data.guiasRelacionadas}
          foco={document.getElementById("observacion")}
        />
      )}
    </>
  );
  //#endregion
};

export default Modal;
