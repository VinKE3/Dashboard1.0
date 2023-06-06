import React, { useState, useEffect } from "react";
import store from "store2";
import ApiMasy from "../../../api/ApiMasy";
import GetTipoCambio from "../../../components/funciones/GetTipoCambio";
import ModalCrud from "../../../components/modal/ModalCrud";
import FiltroCliente from "../../../components/filtro/FiltroCliente";
import Mensajes from "../../../components/funciones/Mensajes";
import TableBasic from "../../../components/tabla/TableBasic";
import { Checkbox } from "primereact/checkbox";
import moment from "moment";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import * as G from "../../../components/Global";
import * as Funciones from "../../../components/funciones/Validaciones";

//#region Estilos
const DivTabla = styled.div`
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
  & th:nth-child(3),
  & th:nth-child(5),
  & th:nth-child(6) {
    width: 90px;
    min-width: 90px;
    max-width: 90px;
    text-align: center;
  }
  & th:last-child {
    width: 75px;
    min-width: 75px;
    max-width: 75px;
    text-align: center;
  }
`;
//#endregion

const ModalCabecera = ({ setModal, modo, objeto }) => {
  //#region useState
  //Data General
  const [data, setData] = useState(objeto);
  const [dataDetalle] = useState(objeto.detalles);
  const [dataGlobal] = useState(store.session.get("global"));
  //Data General
  //GetTablas
  const [dataMoneda, setDataMoneda] = useState([]);
  const [dataPersonal, setDataPersonal] = useState([]);
  const [dataTipoVenta, setDataTipoVenta] = useState([]);
  const [dataTipoPago, setDataTipoPago] = useState([]);
  const [dataTipoCompra, setDataTipoCompra] = useState([]);
  //GetTablas
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
      TipoCambio(data.fechaEmision);
    }
    GetTablas();
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
  //Data General
  //#endregion

  //#region API
  const GetTablas = async () => {
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
  const TipoCambio = async (fecha) => {
    let tipoCambio = await GetTipoCambio(
      fecha,
      "venta",
      setTipoMensaje,
      setMensaje
    );
    setData((prev) => ({
      ...prev,
      tipoCambio: tipoCambio,
    }));
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
            tamañoModal={[G.ModalFull, G.Form]}
          >
            {tipoMensaje > 0 && (
              <Mensajes
                tipoMensaje={tipoMensaje}
                mensaje={mensaje}
                Click={() =>  Funciones.OcultarMensajes(setTipoMensaje, setMensaje)}
              />
            )}
            {/* Cabecera */}
            <div className={G.ContenedorBasico + " mb-2 " + G.FondoContenedor}>
              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <label htmlFor="numero" className={G.LabelStyle}>
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
                    className={G.InputStyle}
                  />
                </div>
              </div>

              <div className={G.ContenedorInputs}>
                <div className={G.InputMitad}>
                  <label htmlFor="fechaEmision" className={G.LabelStyle}>
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
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputTercio}>
                  <label htmlFor="plazo" className={G.LabelStyle}>
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
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputMitad}>
                  <label htmlFor="fechaVencimiento" className={G.LabelStyle}>
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
                    className={G.InputStyle}
                  />
                </div>
              </div>

              <div className={G.ContenedorInputs}>
                <div className={G.InputMitad}>
                  <label
                    htmlFor="clienteNumeroDocumentoIdentidad"
                    className={G.LabelStyle}
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
                    className={G.InputStyle}
                  />
                </div>

                <div className={G.InputFull}>
                  <label htmlFor="clienteNombre" className={G.LabelStyle}>
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
                    className={G.InputBoton}
                  />
                  <button
                    id="consultarCliente"
                    className={
                      G.BotonBuscar + G.BotonPrimary + " !rounded-none"
                    }
                    hidden={modo == "Consultar"}
                    disabled={checkVarios}
                    onKeyDown={(e) => Funciones.KeyClick(e)}
                    onClick={() => AbrirFiltroCliente()}
                  >
                    <FaSearch></FaSearch>
                  </button>
                  <div className={G.Input + " w-20"}>
                    <div className={G.CheckStyle + G.Anidado}>
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
                    <label htmlFor="varios" className={G.LabelCheckStyle}>
                      Varios
                    </label>
                  </div>
                </div>
              </div>
              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <label htmlFor="clienteDireccion" className={G.LabelStyle}>
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
                    className={G.InputStyle}
                  />
                </div>
              </div>
              <div className={G.ContenedorInputs}>
                <div
                  className={
                    data.tipoDocumentoId == "07" || data.tipoDocumentoId == "08"
                      ? G.InputMitad
                      : G.InputFull
                  }
                >
                  <label htmlFor="personalId" className={G.LabelStyle}>
                    Personal
                  </label>
                  <select
                    id="personalId"
                    name="personalId"
                    value={data.personalId ?? ""}
                    onChange={Data}
                    disabled={modo == "Consultar"}
                    className={G.InputStyle}
                  >
                    {dataPersonal.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={G.ContenedorInputs}>
                <div className={G.InputFull}>
                  <label htmlFor="monedaId" className={G.LabelStyle}>
                    Moneda
                  </label>
                  <select
                    id="monedaId"
                    name="monedaId"
                    disabled={true}
                    className={G.InputStyle}
                    value={data.monedaId ?? ""}
                  >
                    {dataMoneda.map((map) => (
                      <option key={map.id} value={map.id}>
                        {map.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={G.InputFull}>
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
                    disabled={true}
                    value={data.tipoCambio ?? ""}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputFull}>
                  <label htmlFor="total" className={G.LabelStyle}>
                    Total a Pagar
                  </label>
                  <input
                    type="text"
                    id="total"
                    name="total"
                    autoComplete="off"
                    value={data.total ?? ""}
                    disabled={true}
                    className={G.InputStyle}
                  />
                </div>
              </div>

              <div className={G.ContenedorBasico}>
                <p className={G.Subtitulo}>Aval Permanente</p>
                <div className={G.ContenedorInputs}>
                  <div className={G.InputFull}>
                    <label htmlFor="avalNombre" className={G.LabelStyle}>
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
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.InputMitad}>
                    <label
                      htmlFor="avalNumeroDocumentoIdentidad"
                      className={G.LabelStyle}
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
                      className={G.InputStyle}
                    />
                  </div>
                </div>
                <div className={G.ContenedorInputs}>
                  <div className={G.InputFull}>
                    <label htmlFor="avalDomicilio" className={G.LabelStyle}>
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
                      className={G.InputStyle}
                    />
                  </div>
                  <div className={G.InputMitad}>
                    <label htmlFor="avalTelefono" className={G.LabelStyle}>
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
                      className={G.InputStyle}
                    />
                  </div>
                </div>
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
                    value={data.observacion ?? ""}
                    disabled={modo == "Consultar"}
                    onChange={Data}
                    className={G.InputStyle}
                  />
                </div>
              </div>
            </div>
            {/* Cabecera */}

            {/* Tabla Detalle */}
            <DivTabla>
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
            </DivTabla>
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
