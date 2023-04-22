import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalBasic from "../../../components/ModalBasic";
import TableBasic from "../../../components/tablas/TableBasic";
import moment from "moment";
import { Checkbox } from "primereact/checkbox";
import { toast } from "react-toastify";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FaSearch, FaPen, FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";
import "primeicons/primeicons.css";
import * as Global from "../../../components/Global";

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
  const [dataTipoDoc, setDataTipoDoc] = useState([]);
  const [tipoMen, setTipoMen] = useState(-1);
  const [men, setMen] = useState([]);
  const [respuesta, setRespuesta] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (tipoMen == 0) {
      setRespuesta(true);
    }
  }, [tipoMen]);
  useEffect(() => {
    if (respuesta) {
      RetornarMensaje();
    }
  }, [respuesta]);
  useEffect(() => {
    if (document.getElementById("tipoDocumentoIdentidadId")) {
      document.getElementById("tipoDocumentoIdentidadId").value =
        data.tipoDocumentoIdentidadId;
    }
  }, [dataTipoDoc]);

  useEffect(() => {
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    if (target.name == "correoElectronico") {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value,
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };
  const Limpiar = async (e) => {
    if (e != null) {
      e.preventDefault();
    }
    setMen([]);
    setTipoMen(-1);
    setRespuesta(false);
  };
  const RetornarMensaje = async () => {
    if (tipoMen == 0) {
      toast.success(men, {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Compra/DocumentoCompra/FormularioTablas`
    );
    console.log(result.data.data.tiposDocumento);
    setDataTipoDoc(result.data.data.tiposDocumento);
  };
  const ConsultarDocumento = async (filtroApi = "") => {
    document.getElementById("consultarApi").hidden = true;
    const res = await ApiMasy.get(`api/Servicio/ConsultarRucDni${filtroApi}`);
    if (res.status == 200) {
      let model = {
        numeroDocumentoIdentidad: res.data.data.numeroDocumentoIdentidad,
        nombre: res.data.data.nombre,
        direccionPrincipal: res.data.data.direccion,
        departamentoId: res.data.data.ubigeo[0],
        provinciaId: res.data.data.ubigeo[1],
        distritoId: res.data.data.ubigeo[2],
      };
      setData({
        ...data,
        numeroDocumentoIdentidad: model.numeroDocumentoIdentidad,
        nombre: model.nombre,
        direccionPrincipal: model.direccionPrincipal,
        departamentoId:
          model.departamentoId == ""
            ? data.departamentoId
            : model.departamentoId,
        provinciaId:
          model.provinciaId == "" ? data.provinciaId : model.provinciaId,
        distritoId: model.distritoId == "" ? data.distritoId : model.distritoId,
      });
      toast.success("Datos extraídos exitosamente", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      document.getElementById("consultarApi").hidden = false;
    } else {
      toast.error(String(res.response.data.messages[0].textos), {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      document.getElementById("consultarApi").hidden = false;
    }
  };

  const ListarDireccion = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ClienteDireccion/ListarPorCliente?clienteId=${data.id}`
    );
    setDataDireccion(result.data.data);
  };
  const GetDireccion = async (id) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/ClienteDireccion/${id}`
    );
    setObjetoDireccion(result.data.data);
  };
  const EnviarClienteDireccion = async () => {
    if (objetoDireccion.id == 0) {
      await Insert(
        ["Mantenimiento", "ClienteDireccion"],
        objetoDireccion,
        setTipoMen,
        setMen
      );
    } else {
      await Update(
        ["Mantenimiento", "ClienteDireccion"],
        objetoDireccion,
        setTipoMen,
        setMen
      );
    }
  };
  //#endregion

  //#region Columnas
  const colDireccion = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Direcciones Secundarias",
      accessor: "direccion",
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
                  onClick={(e) => AgregarDireccion(e, row.values.id)}
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
                      ["Mantenimiento", "ClienteDireccion"],
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
  //#endregion

  //#region Render
  return (
    <>
      {Object.entries(dataTipoDoc).length > 0 && (
        <ModalBasic
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={["Compra", "DocumentoCompra"]}
          titulo="Documentos de Compra"
          tamañoModal={[Global.ModalGrande, Global.FormGrande]}
        >
          <div className={Global.ContenedorVarios}>
            <div className={Global.ContenedorInputTercio}>
              <label htmlFor="id" className={Global.LabelStyle}>
                Tipo Doc.
              </label>
              <select
                id="tipoDocumentoId"
                name="tipoDocumentoId"
                onChange={ValidarData}
                disabled={modo == "Consultar" ? true : false}
                className={Global.InputStyle}
              >
                {dataTipoDoc.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <div className={Global.ContenedorInputTercio}>
              <label htmlFor="serie" className={Global.LabelStyle}>
                DNI
              </label>
              <input
                type="text"
                id="serie"
                name="serie"
                placeholder="Serie"
                maxLength="4"
                autoComplete="off"
                readOnly={modo == "Consultar" ? true : false}
                value={data.serie ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.ContenedorInputTercio}>
              <label htmlFor="numero" className={Global.LabelStyle}>
                DNI
              </label>
              <input
                type="text"
                id="numero"
                name="numero"
                placeholder="numero"
                maxLength="10"
                autoComplete="off"
                readOnly={modo == "Consultar" ? true : false}
                value={data.numero ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
          </div>

          <div className={Global.ContenedorVarios}>
            <div className={Global.ContenedorInputTercio}>
              <label htmlFor="fechaEmision" className={Global.LabelStyle}>
                F. Emisión
              </label>
              <input
                type="date"
                id="fechaEmision"
                name="fechaEmision"
                autoComplete="off"
                readOnly={modo == "Consultar" ? true : false}
                value={moment(data.fechaEmision ?? "").format("yyyy-MM-DD")}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.ContenedorInputTercio}>
              <label htmlFor="fechaContable" className={Global.LabelStyle}>
                F. Contable
              </label>
              <input
                type="date"
                id="fechaContable"
                name="fechaContable"
                autoComplete="off"
                readOnly={modo == "Consultar" ? true : false}
                value={moment(data.fechaContable ?? "").format("yyyy-MM-DD")}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.ContenedorInputTercio}>
              <label htmlFor="fechaVencimiento" className={Global.LabelStyle}>
                F. Vcmto
              </label>
              <input
                type="date"
                id="fechaVencimiento"
                name="fechaVencimiento"
                autoComplete="off"
                readOnly={modo == "Consultar" ? true : false}
                value={moment(data.fechaVencimiento ?? "").format("yyyy-MM-DD")}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
          </div>

          <div className={Global.ContenedorVarios}>
            <div className={Global.ContenedorInputMitad}>
              <label
                htmlFor="proveedorNumeroDocumentoIdentidad"
                className={Global.LabelStyle}
              >
                RUC/DNI:
              </label>
              <input
                type="text"
                id="proveedorNumeroDocumentoIdentidad"
                name="proveedorNumeroDocumentoIdentidad"
                placeholder="N° Documento Identidad"
                autoComplete="off"
                readOnly={modo == "Consultar" ? true : false}
                value={data.proveedorNumeroDocumentoIdentidad ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.ContenedorInputFull}>
              <label htmlFor="proveedorNombre" className={Global.LabelStyle}>
                Proveedor
              </label>
              <input
                type="text"
                id="proveedorNombre"
                name="proveedorNombre"
                placeholder="Proveedor"
                autoComplete="off"
                readOnly={true}
                value={data.proveedorNombre ?? ""}
                onChange={ValidarData}
                className={Global.InputBoton}
              />
              <button
                id="consultar"
                className={Global.BotonBuscar + " !rounded-none"}
                hidden={modo == "Consultar" ? true : false}
              >
                <FaSearch></FaSearch>
              </button>
              <div className={Global.ContenedorInput20pct}>
              <div className={Global.CheckStyle + " !rounded-none"}>
                <Checkbox
                  inputId="isActivo"
                  name="isActivo"
                  readOnly={modo == "Consultar" ? true : false}
                  value={data.isActivo}
                  onChange={(e) => {
                    ValidarData(e);
                  }}
                  checked={data.isActivo ? checked : ""}
                ></Checkbox>
              </div>
              <label
                htmlFor="isActivo"
                className={Global.InputStyle + " !bg-transparent !border-l-0"}
              >
                Varios
              </label>
            </div>
            </div>
          </div>

          <div className={Global.ContenedorVarios}>
            <div className={Global.ContenedorInputTercio}>
              <label htmlFor="fechaNacimiento" className={Global.LabelStyle}>
                Fec. Nac.
              </label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                autoComplete="off"
                readOnly={modo == "Consultar" ? true : false}
                value={moment(data.fechaNacimiento ?? "").format("yyyy-MM-DD")}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.ContenedorInputTercio}>
              <label htmlFor="sexoId" className={Global.LabelStyle}>
                Sexo
              </label>

            </div>
            <div className={Global.ContenedorInputTercio}>
              <label htmlFor="estadoCivilId" className={Global.LabelStyle}>
                Estado Civil
              </label>

            </div>
          </div>

          <div className={Global.ContenedorVarios}>
            <div className={Global.ContenedorInputFull}>
              <label htmlFor="correoElectronico" className={Global.LabelStyle}>
                Correo Electrónico
              </label>
              <input
                type="text"
                id="correoElectronico"
                name="correoElectronico"
                placeholder="Correo Electrónico"
                autoComplete="off"
                readOnly={modo == "Consultar" ? true : false}
                value={data.correoElectronico ?? ""}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.ContenedorInputMitad}>
              <label htmlFor="cargoId" className={Global.LabelStyle}>
                Cargo
              </label>

            </div>
          </div>

          <div className="flex">
            <label htmlFor="observacion" className={Global.LabelStyle}>
              Observación
            </label>
            <input
              type="text"
              id="observacion"
              name="observacion"
              placeholder="Observación"
              autoComplete="off"
              readOnly={modo == "Consultar" ? true : false}
              value={data.observacion ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
          <div className={Global.ContenedorVarios}>
            <div className={Global.ContenedorInputFull}>
              <label htmlFor="entidadBancariaId" className={Global.LabelStyle}>
                E.Bancaria
              </label>

            </div>
            <div className={Global.ContenedorInput60pct}>
              <label
                htmlFor="tipoCuentaBancariaId"
                className={Global.LabelStyle}
              >
                T.Cuenta
              </label>
            </div>
            <div className={Global.ContenedorInputMitad}>
              <label htmlFor="monedaId" className={Global.LabelStyle}>
                Moneda
              </label>

            </div>
          </div>
          <div className="flex">
            <label htmlFor="cuentaCorriente" className={Global.LabelStyle}>
              Cuenta Corriente
            </label>
            <input
              type="text"
              id="cuentaCorriente"
              name="cuentaCorriente"
              placeholder="N° Cuenta Corriente"
              autoComplete="off"
              readOnly={modo == "Consultar" ? true : false}
              value={data.cuentaCorriente ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
          </div>
        </ModalBasic>
      )}
    </>
  );
  //#endregion
};

export default Modal;
