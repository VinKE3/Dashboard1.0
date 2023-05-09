import React, { useState, useEffect } from "react";
import ModalCrud from "../../../components/ModalCrud";
import * as Global from "../../../components/Global";
import { Checkbox } from "primereact/checkbox";
import moment from "moment";
import ApiMasy from "../../../api/ApiMasy";
import FiltroProveedor from "../../../components/filtros/FiltroProveedor";
import FiltroOrdenCompra from "../../../components/filtros/FiltroOrdenCompra";
import { FaSearch, FaUndoAlt } from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import Mensajes from "../../../components/Mensajes";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(3) {
    width: 90px;
  }
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;
//#endregion

const Modal = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataDetalle, setDataDetalle] = useState(objeto.detalles);
  const [checked, setChecked] = useState(true);
  const [checked2, setChecked2] = useState(true);
  const [personal, setPersonal] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [dataProveedor, setDataProveedor] = useState([]);
  const [dataOC, setDataOC] = useState([]);
  const [modalProv, setModalProv] = useState(false);
  const [modalOC, setModalOC] = useState(false);
  const [tipoMensaje, setTipoMensaje] = useState(-1);
  const [mensaje, setMensaje] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    checked;
    checked2;
  }, [checked, checked2]);

  useEffect(() => {
    if (Object.keys(dataProveedor).length > 0) {
      setData({
        ...data,
        proveedorId: dataProveedor.proveedorId,
        proveedorNumeroDocumentoIdentidad:
          dataProveedor.proveedorNumeroDocumentoIdentidad,
        proveedorDireccion: dataProveedor.proveedorDireccion ?? "",
      });
    }
  }, [dataProveedor]);

  useEffect(() => {
    if (Object.keys(dataOC).length > 0) {
      setData({
        ...data,
        ordenesCompraRelacionadas: dataOC.ordenesCompraRelacionadas,
      });
    }
  }, [dataOC]);

  useEffect(() => {
    if (modo != "Registrar") {
      GetPorId(data.proveedorId);
    }
    GetTablas();
  }, []);

  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    if (target.name != "varios") {
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
    } else {
      if (target.checked) {
        setDataProveedor((prevState) => ({
          ...prevState,
          proveedorId: "000000",
          proveedorNumeroDocumentoIdentidad: "00000000000",
          proveedorDireccion: null,
          proveedorNombre: "CLIENTES VARIOS",
        }));
      } else {
        setDataProveedor((prevState) => ({
          ...prevState,
          proveedorId: "",
          proveedorNumeroDocumentoIdentidad: "",
          proveedorDireccion: "",
          proveedorNombre: "",
        }));
      }
    }
  };

  const OcultarMensajes = () => {
    setMensaje([]);
    setTipoMensaje(-1);
  };
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

  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/Proveedor/${id}`);
    setDataProveedor({
      proveedorId: result.data.data.id,
      proveedorNumeroDocumentoIdentidad:
        result.data.data.numeroDocumentoIdentidad,
      proveedorDireccion: result.data.data.direccionPrincipal,
      proveedorNombre: result.data.data.nombre,
    });
  };

  //#endregion

  //#region  Render
  return (
    <>
      {Object.entries(personal).length > 0 && (
        <>
          <ModalCrud
            setModal={setModal}
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

            <div
              className={
                Global.ContenedorBasico + Global.FondoContenedor + " mb-3"
              }
            >
              <div className={Global.ContenedorInputs}>
                <div className={Global.Input60pct}>
                  <label htmlFor="serie" className={Global.LabelStyle}>
                    Código
                  </label>
                  <input
                    type="text"
                    id="serie"
                    name="serie"
                    maxLength="2"
                    autoComplete="off"
                    placeholder="00"
                    readOnly={modo == "Registrar" ? false : true}
                    value={data.serie}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
                <div className={Global.Input60pct}>
                  <label htmlFor="numero" className={Global.LabelStyle}>
                    Numero
                  </label>
                  <input
                    type="text"
                    id="numero"
                    name="numero"
                    maxLength="2"
                    autoComplete="off"
                    placeholder="00"
                    readOnly={modo == "Registrar" ? false : true}
                    value={data.numero}
                    onChange={ValidarData}
                    className={Global.InputStyle}
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
                    value={moment(data.fechaEmision ?? "").format("yyyy-MM-DD")}
                    onChange={ValidarData}
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
                    autoComplete="off"
                    readOnly={modo == "Consultar" ? true : false}
                    value={data.clienteNombre}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  />
                </div>
              </div>
              <div className={Global.ContenedorInputs}>
                <div className={Global.InputFull}>
                  <label htmlFor="personalId" className={Global.LabelStyle}>
                    Personal
                  </label>
                  <select
                    id="personalId"
                    name="personalId"
                    readOnly={modo == "Consultar" ? true : false}
                    value={data.personalId}
                    onChange={ValidarData}
                    className={Global.InputStyle}
                  >
                    {personal.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.personalId}
                      </option>
                    ))}
                  </select>
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
                    className={Global.InputStyle}
                  />
                </div>
              </div>
            </div>
          </ModalCrud>
        </>
      )}
      {modalProv && (
        <FiltroProveedor setModal={setModalProv} setObjeto={setDataProveedor} />
      )}
      {modalOC && (
        <FiltroOrdenCompra
          setModal={setModalOC}
          id={data.proveedorId}
          setObjeto={setDataOC}
          objeto={data.ordenesCompraRelacionadas}
        />
      )}
    </>
  );
  //#endregion
};

export default Modal;
