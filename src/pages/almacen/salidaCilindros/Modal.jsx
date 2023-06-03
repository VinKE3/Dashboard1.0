import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalCrud from "../../../components/modal/ModalCrud";
import TableBasic from "../../../components/tabla/TableBasic";
import moment from "moment";
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
  & th:nth-child(4),
  & th:nth-child(5) {
    width: 100px;
    min-width: 100px;
    max-width: 100px;
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
  const [dataDetalle] = useState(objeto.detalles);
  //Data General
  //Tablas
  const [dataPersonal, setDataPersonal] = useState([]);
  const [dataTipoSalida, setDataTipoSalida] = useState([]);
  //Tablas
  //#endregion

  //#region useEffect
  useEffect(() => {
    Tablas();
  }, []);

  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy(
      `/api/Almacen/SalidaCilindros/FormularioTablas`
    );
    setDataPersonal(
      result.data.data.personal.map((res) => ({
        personalId: res.apellidoPaterno + res.apellidoMaterno + res.nombres,
        ...res,
      }))
    );
    setDataTipoSalida(result.data.data.tiposSalida);
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
      Header: " ",
      Cell: () => {
        return "";
      },
    },
  ];
  //#endregion

  //#region Render
  return (
    <>
      {Object.entries(dataPersonal).length > 0 && (
        <ModalCrud
          setModal={setModal}
          setRespuestaModal={setRespuestaModal}
          objeto={data}
          modo={modo}
          menu={["Almacen", "SalidaCilindros"]}
          titulo="Salida de Cilindros"
          cerrar={false}
          foco={document.getElementById("tablaSalidaCilindro")}
          tamañoModal={[G.ModalFull, G.Form]}
        >
          <div
            className={
              G.ContenedorBasico + G.FondoContenedor + " mb-2"
            }
          >
            <div className={G.ContenedorInputs}>
              <div className={G.InputTercio}>
                <label htmlFor="serie" className={G.LabelStyle}>
                  Serie
                </label>
                <input
                  type="text"
                  id="serie"
                  name="serie"
                  placeholder="Serie"
                  autoComplete="off"
                  disabled={true}
                  value={data.serie ?? ""}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputTercio}>
                <label htmlFor="numero" className={G.LabelStyle}>
                  Número
                </label>
                <input
                  type="text"
                  id="numero"
                  placeholder="Número"
                  name="numero"
                  autoComplete="off"
                  disabled={true}
                  value={data.numero ?? ""}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputTercio}>
                <label htmlFor="fechaEmision" className={G.LabelStyle}>
                  Fecha
                </label>
                <input
                  type="date"
                  id="fechaEmision"
                  name="fechaEmision"
                  autoComplete="off"
                  disabled={true}
                  value={moment(data.fechaEmision).format("yyyy-MM-DD") ?? ""}
                  className={G.InputStyle}
                />
              </div>
            </div>
            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label htmlFor="numeroFactura" className={G.LabelStyle}>
                  N° Factura
                </label>
                <input
                  type="text"
                  id="numeroFactura"
                  name="numeroFactura"
                  autoComplete="off"
                  disabled={true}
                  value={data.numeroFactura ?? ""}
                  onChange={ValidarData}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputFull}>
                <label htmlFor="numeroGuia" className={G.LabelStyle}>
                  N° Guia
                </label>
                <input
                  type="text"
                  id="numeroGuia"
                  name="numeroGuia"
                  autoComplete="off"
                  value={data.numeroGuia ?? ""}
                  disabled={true}
                  onChange={ValidarData}
                  className={G.InputStyle}
                />
              </div>

              <div className={G.InputFull}>
                <label htmlFor="tipoSalidaId" className={G.LabelStyle}>
                  Tipo Salida
                </label>
                <select
                  id="tipoSalidaId"
                  name="tipoSalidaId"
                  disabled={modo == "Consultar"}
                  onChange={ValidarData}
                  value={data.tipoSalidaId ?? ""}
                  className={
                    modo == "Consultar"
                      ? G.InputStyle + G.Disabled
                      : G.InputStyle
                  }
                >
                  {dataTipoSalida.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label htmlFor="clienteId" className={G.LabelStyle}>
                  Cliente
                </label>
                <input
                  type="text"
                  id="clienteId"
                  name="clienteId"
                  autoComplete="off"
                  disabled={true}
                  value={data.clienteId ?? ""}
                  onChange={ValidarData}
                  className={G.InputStyle}
                />
              </div>
              <div className={G.InputFull}>
                <label htmlFor="personalId" className={G.LabelStyle}>
                  Personal
                </label>
                <select
                  id="personalId"
                  name="personalId"
                  disabled={true}
                  value={data.personalId ?? ""}
                  onChange={ValidarData}
                  className={G.InputStyle}
                >
                  {dataPersonal.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.personalId}
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
                  autoComplete="off"
                  placeholder="Observación"
                  disabled={modo == "Consultar"}
                  value={data.observacion ?? ""}
                  onChange={ValidarData}
                  className={G.InputStyle}
                />
              </div>
            </div>
          </div>
          {/* Tabla Detalle */}
          <DivTabla>
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
          </DivTabla>
          {/* Tabla Detalle */}
        </ModalCrud>
      )}
    </>
  );
  //#endregion
};

export default Modal;
