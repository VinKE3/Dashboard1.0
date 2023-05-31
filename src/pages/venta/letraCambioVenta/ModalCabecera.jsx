import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import FiltroCliente from "../../../components/filtro/FiltroCliente";
import Mensajes from "../../../components/funciones/Mensajes";
import TableBasic from "../../../components/tabla/TableBasic";
import { toast } from "react-toastify";
import { Checkbox } from "primereact/checkbox";
import moment from "moment";
import { FaSearch, FaUndoAlt } from "react-icons/fa";
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
  & th:nth-child(3) {
    width: 90px;
    text-align: center;
  }
  & th:nth-child(5),
  & th:nth-child(6) {
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

const ModalCabecera = ({ setModal, modo, objeto }) => {
  //#region useState
  //Data General
  const [data, setData] = useState(objeto);
  const [dataDetalle, setDataDetalle] = useState(objeto.detalles);
  const [dataGlobal] = useState(store.session.get("global"));
  //Data General
  //Tablas
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataPersonal, setDataPersonal] = useState([]);
  const [dataTipoVenta, setDataTipoVenta] = useState([]);
  const [dataTipoPago, setDataTipoPago] = useState([]);
  const [dataTipoCompra, setDataTipoCompra] = useState([]);
  //Tablas
  //Data Modales Ayuda
  const [dataCliente, setDataCliente] = useState([]);
  //Data Modales Ayuda
  //Modales de Ayuda
  const [modalCliente, setModalCliente] = useState(false);
  //Modales de Ayuda

  const [checkVarios, setCheckVarios] = useState(false);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (Object.keys(dataCliente).length > 0) {
      Cliente();
    }
  }, [dataCliente]);
  useEffect(() => {
    setData({ ...data, detalles: dataDetalle });
  }, [dataDetalle]);
  useEffect(() => {
    if (modo == "Nuevo") {
      GetPorIdTipoCambio(data.fechaEmision);
    }
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
  //Data General
  const Data = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
    if (target.name == "fechaEmision") {
      await FechaVencimiento({ name: "fechaEmision" }, target.value);
    }
  };
  const ClientesVarios = async ({ target }) => {
    if (target.checked) {
      //Obtiene el personal default de Clientes Varios
      let personal = dataGlobal.cliente.personal.find(
        (map) => map.default == true
      );
      //Obtiene el personal default de Clientes Varios

      setDataCliente((prevState) => ({
        ...prevState,
        clienteId: dataGlobal.cliente.id,
        clienteNumeroDocumentoIdentidad:
          dataGlobal.cliente.numeroDocumentoIdentidad,
        clienteNombre: dataGlobal.cliente.nombre,
        clienteDireccion: dataGlobal.cliente.direccionPrincipal,
        personalId: personal.personalId,
      }));
    } else {
      setDataCliente((prevState) => ({
        ...prevState,
        clienteId: "",
        clienteTipoDocumentoIdentidadId: "",
        clienteNumeroDocumentoIdentidad: "",
        clienteNombre: "",
        clienteDireccionId: 0,
        clienteDireccion: "",
        personalId: dataGlobal.personalId,
        direcciones: [],
      }));
      setDataClienteDirec([]);
    }
  };
  const FechaVencimiento = async ({ target }, emision = null) => {
    let fechaHoy = moment().format("YYYY-MM-DD");
    let fechaRetorno, fecha;
    if (target != undefined) {
      fecha = moment(data.fechaEmision)
        .add(target.value, "days")
        .format("YYYY-MM-DD");
      fechaRetorno = fecha == undefined ? fechaHoy : fecha;
      setData((prev) => ({
        ...prev,
        plazo: target.value,
        fechaVencimiento: fechaRetorno,
      }));
      return;
    }
    if (emision != null) {
      fecha = moment(emision).add(data.plazo, "days").format("YYYY-MM-DD");
      fechaRetorno = fecha == undefined ? fechaHoy : fecha;
      setData((prev) => ({
        ...prev,
        plazo: data.plazo,
        fechaVencimiento: fechaRetorno,
        fechaEmision: emision,
      }));
      return;
    }
  };
  const Cliente = async () => {
    setData({
      ...data,
      clienteId: dataCliente.clienteId,
      clienteNumeroDocumentoIdentidad:
        dataCliente.clienteNumeroDocumentoIdentidad,
      clienteNombre: dataCliente.clienteNombre,
      clienteDireccion: dataCliente.clienteDireccion,
      personalId:
        dataCliente.personalId == ""
          ? dataGlobal.personalId
          : dataCliente.personalId,
    });
  };
  const OcultarMensajes = () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
  //Data General
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Venta/LetraCambioVenta/FormularioTablas`
    );
    setDataPersonal(
      result.data.data.personal.map((res) => ({
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
        tipoCambio: result.data.data.precioCompra,
      });
      toast.info(
        "El tipo de cambio del día " +
          moment(data.fechaEmision).format("DD/MM/YYYY") +
          " es: " +
          result.data.data.precioCompra,
        {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
      OcultarMensajes();
    }
  };
  //#endregion

  //#region Funciones Modal
  const AbrirFiltroCliente = async () => {
    setModalCliente(true);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "documentoCompraId",
      accessor: "documentoCompraId",
    },
    {
      Header: "Item",
      accessor: "detalleId",
      Cell: ({ value }) => {
        return <p className="text-center">{value}</p>;
      },
    },
    {
      Header: "Emisión",
      accessor: "documentoCompraFechaEmision",
      Cell: ({ value }) => {
        return (
          <p className="text-center">{moment(value).format("DD/MM/YY")}</p>
        );
      },
    },
    {
      Header: "Concepto",
      accessor: "concepto",
    },
    {
      Header: "Saldo",
      accessor: "saldo",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-1.5">
            {Funciones.RedondearNumero(value, 4)}
          </p>
        );
      },
    },
    {
      Header: "Importe",
      accessor: "abono",
      Cell: ({ value }) => {
        return (
          <p className="text-right font-semibold pr-2.5">
            {Funciones.RedondearNumero(value, 4)}
          </p>
        );
      },
    },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <div className="flex item-center justify-center"></div>
      ),
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
            menu={["Venta", "LetraCambioVenta"]}
            titulo="Letra de Cambio Venta"
            cerrar={false}
            foco={document.getElementById("tablaLetraCambioVenta")}
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
                Global.ContenedorBasico + " mb-2 " + Global.FondoContenedor
              }
            >
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label htmlFor="numero" className={Global.LabelStyle}>
                    N° Letra
                  </label>
                  <input
                    type="text"
                    id="numero"
                    name="numero"
                    placeholder="N° Letra"
                    autoComplete="off"
                    disabled={true}
                    value={data.numero ?? ""}
                    onChange={Data}
                    className={Global.InputStyle}
                  />
                </div>
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputMitad}>
                  <label htmlFor="fechaEmision" className={Global.LabelStyle}>
                    Emisión
                  </label>
                  <input
                    type="date"
                    id="fechaEmision"
                    name="fechaEmision"
                    autoComplete="off"
                    autoFocus
                    disabled={modo == "Consultar"}
                    value={moment(data.fechaEmision).format("yyyy-MM-DD") ?? ""}
                    onChange={Data}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputTercio}>
                  <label htmlFor="plazo" className={Global.LabelStyle}>
                    Plazo
                  </label>
                  <input
                    type="number"
                    id="plazo"
                    name="plazo"
                    placeholder="Plazo"
                    autoComplete="off"
                    min={0}
                    disabled={modo == "Consultar"}
                    value={data.plazo ?? ""}
                    onChange={FechaVencimiento}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputMitad}>
                  <label
                    htmlFor="fechaVencimiento"
                    className={Global.LabelStyle}
                  >
                    Vencimiento
                  </label>
                  <input
                    type="date"
                    id="fechaVencimiento"
                    name="fechaVencimiento"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={
                      moment(data.fechaVencimiento).format("yyyy-MM-DD") ?? ""
                    }
                    onChange={Data}
                    className={Global.InputStyle}
                  />
                </div>
              </div>

              <div className={Global.ContenedorInputs}>
                <div className={Global.InputMitad}>
                  <label
                    htmlFor="clienteNumeroDocumentoIdentidad"
                    className={Global.LabelStyle}
                  >
                    RUC/DNI:
                  </label>
                  <input
                    type="text"
                    id="clienteNumeroDocumentoIdentidad"
                    name="clienteNumeroDocumentoIdentidad"
                    placeholder="N° Documento Identidad"
                    autoComplete="off"
                    disabled={true}
                    value={data.clienteNumeroDocumentoIdentidad ?? ""}
                    onChange={Data}
                    className={Global.InputStyle}
                  />
                </div>

                <div className={Global.InputFull}>
                  <label htmlFor="clienteNombre" className={Global.LabelStyle}>
                    Cliente
                  </label>
                  <input
                    type="text"
                    id="clienteNombre"
                    name="clienteNombre"
                    placeholder="Buscar Cliente"
                    autoComplete="off"
                    disabled={true}
                    value={data.clienteNombre ?? ""}
                    onChange={Data}
                    className={Global.InputBoton}
                  />
                  <button
                    id="consultarCliente"
                    className={
                      Global.BotonBuscar +
                      Global.BotonPrimary +
                      " !rounded-none"
                    }
                    hidden={modo == "Consultar"}
                    disabled={checkVarios}
                    onKeyDown={(e) => Funciones.KeyClick(e)}
                    onClick={() => AbrirFiltroCliente()}
                  >
                    <FaSearch></FaSearch>
                  </button>
                  <div className={Global.Input + " w-20"}>
                    <div className={Global.CheckStyle + Global.Anidado}>
                      <Checkbox
                        inputId="varios"
                        name="varios"
                        disabled={modo == "Consultar"}
                        onChange={(e) => {
                          setCheckVarios(e.checked);
                          ClientesVarios(e);
                        }}
                        checked={checkVarios}
                      ></Checkbox>
                    </div>
                    <label htmlFor="varios" className={Global.LabelCheckStyle}>
                      Varios
                    </label>
                  </div>
                </div>
              </div>
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label
                    htmlFor="clienteDireccion"
                    className={Global.LabelStyle}
                  >
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="clienteDireccion"
                    name="clienteDireccion"
                    placeholder="Dirección"
                    autoComplete="off"
                    disabled={modo == "Consultar"}
                    value={data.clienteDireccion ?? ""}
                    onChange={Data}
                    className={Global.InputStyle}
                  />
                </div>
              </div>
              <div className={Global.ContenedorInputs}>
                <div
                  className={
                    data.tipoDocumentoId == "07" || data.tipoDocumentoId == "08"
                      ? Global.InputMitad
                      : Global.InputFull
                  }
                >
                  <label htmlFor="personalId" className={Global.LabelStyle}>
                    Personal
                  </label>
                  <select
                    id="personalId"
                    name="personalId"
                    value={data.personalId ?? ""}
                    onChange={Data}
                    disabled={modo == "Consultar"}
                    className={Global.InputStyle}
                  >
                    {dataPersonal.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label htmlFor="monedaId" className={Global.LabelStyle}>
                    Moneda
                  </label>
                  <select
                    id="monedaId"
                    name="monedaId"
                    disabled={true}
                    className={Global.InputStyle}
                    value={data.monedaId ?? ""}
                  >
                    {dataMoneda.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={Global.InputFull}>
                  <label htmlFor="tipoCambio" className={Global.LabelStyle}>
                    Tipo Cambio
                  </label>
                  <input
                    type="number"
                    id="tipoCambio"
                    name="tipoCambio"
                    placeholder="Tipo de Cambio"
                    autoComplete="off"
                    min={0}
                    disabled={true}
                    value={data.tipoCambio ?? ""}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.InputFull}>
                  <label htmlFor="total" className={Global.LabelStyle}>
                    Total a Pagar
                  </label>
                  <input
                    type="text"
                    id="total"
                    name="total"
                    autoComplete="off"
                    value={data.total ?? ""}
                    disabled={true}
                    className={Global.InputStyle}
                  />
                </div>
              </div>

              <div className={Global.ContenedorBasico}>
                <p className={Global.Subtitulo}>Aval Permanente</p>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label htmlFor="avalNombre" className={Global.LabelStyle}>
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="avalNombre"
                      name="avalNombre"
                      placeholder="Nombre Aval"
                      autoComplete="off"
                      disabled={modo == "Consultar"}
                      value={data.avalNombre ?? ""}
                      onChange={Data}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputMitad}>
                    <label
                      htmlFor="avalNumeroDocumentoIdentidad"
                      className={Global.LabelStyle}
                    >
                      D.N.I
                    </label>
                    <input
                      type="text"
                      id="avalNumeroDocumentoIdentidad"
                      name="avalNumeroDocumentoIdentidad"
                      placeholder="N° Documento Aval"
                      autoComplete="off"
                      maxLength={14}
                      disabled={modo == "Consultar"}
                      value={data.avalNumeroDocumentoIdentidad ?? ""}
                      onChange={Data}
                      className={Global.InputStyle}
                    />
                  </div>
                </div>
                <div className={Global.ContenedorInputs}>
                  <div className={Global.InputFull}>
                    <label
                      htmlFor="avalDomicilio"
                      className={Global.LabelStyle}
                    >
                      Domicilio
                    </label>
                    <input
                      type="text"
                      id="avalDomicilio"
                      name="avalDomicilio"
                      placeholder="Domicilio Aval"
                      autoComplete="off"
                      disabled={modo == "Consultar"}
                      value={data.avalDomicilio ?? ""}
                      onChange={Data}
                      className={Global.InputStyle}
                    />
                  </div>
                  <div className={Global.InputMitad}>
                    <label htmlFor="avalTelefono" className={Global.LabelStyle}>
                      Teléfono
                    </label>
                    <input
                      type="text"
                      id="avalTelefono"
                      name="avalTelefono"
                      placeholder="Teléfono Aval"
                      autoComplete="off"
                      maxLength={15}
                      disabled={modo == "Consultar"}
                      value={data.avalTelefono ?? ""}
                      onChange={Data}
                      className={Global.InputStyle}
                    />
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
                    value={data.observacion ?? ""}
                    disabled={modo == "Consultar"}
                    onChange={Data}
                    className={Global.InputStyle}
                  />
                </div>
              </div>
            </div>
            {/* Cabecera */}

            {/* Tabla Detalle */}
            <TablaStyle>
              <TableBasic
                columnas={columnas}
                datos={dataDetalle}
                estilos={[
                  "",
                  "",
                  "",
                  "border",
                  "",
                  "border border-b-0",
                  "border",
                ]}
              />
            </TablaStyle>
            {/* Tabla Detalle */}
          </ModalCrud>
        </>
      )}
      {modalCliente && (
        <FiltroCliente
          setModal={setModalCliente}
          setObjeto={setDataCliente}
          foco={document.getElementById("clienteDireccion")}
        />
      )}
    </>
  );
  //#endregion
};

export default ModalCabecera;
