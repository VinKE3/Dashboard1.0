import React, { useState, useEffect, useMemo } from "react";
import ApiMasy from "../../api/ApiMasy";
import ModalBasic from "../ModalBasic";
import TableBasic from "../tablas/TableBasic";
import { RadioButton } from "primereact/radiobutton";
import { FaSearch, FaCheck } from "react-icons/fa";
import styled from "styled-components";
import moment from "moment";
import * as Global from "../Global";
import * as Funciones from "../Funciones";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2),
  & th:nth-child(3) {
    width: 90px;
    text-align: center;
  }
  & th:nth-child(5) {
    width: 35px;
    text-align: center;
  }
  & th:nth-child(6) {
    width: 85px;
    text-align: right;
  }

  & th:last-child {
    width: 60px;
    text-align: center;
    color: transparent;
  }
`;
//#endregion

const FiltroConcepto = ({ setModal, setObjeto }) => {
  //#region useState
  const [datos, setDatos] = useState([]);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    numeroDocumento: "",
    tipoDocumentoId: "",
  });
  const [cadena, setCadena] = useState(
    `&numeroDocumento=${filtro.numeroDocumento}&tipoDocumentoId=${filtro.tipoDocumentoId}`
  );
  const [tipo, setTipo] = useState("");
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(
      `&numeroDocumento=${filtro.numeroDocumento}&tipoDocumentoId=${filtro.tipoDocumentoId}`
    );
  }, [filtro]);
  useEffect(() => {
    Filtro();
  }, [cadena]);
  useEffect(() => {
    Listar(cadena, 1);
  }, []);
  //#endregion

  //#region Funciones Filtrado
  const ValidarData = async ({ target }) => {
    setFiltro((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));
  };
  const ValidarTipo = async ({ target }) => {
    setFiltro((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));
    setTipo(target.value);
  };
  const Filtro = async () => {
    clearTimeout(timer);
    const newTimer = setTimeout(() => {
      Listar(cadena, 1);
    }, 200);
    setTimer(newTimer);
  };
  //#endregion

  //#region API
  const Listar = async (f = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Finanzas/CuentaPorPagar/ListarPendientes?pagina=${pagina}${f}`
    );
    setDatos(result.data.data.data);
  };
  const GetPorId = async (id) => {
    const model = datos.find((registro) => registro.id == id);
    let documentoRelacionado = "";
    if (
      model.id.includes("LC") ||
      model.id.includes("CF") ||
      model.id.includes("CH")
    ) {
      documentoRelacionado = model.documentoRelacionado;
    }
    setObjeto({
      id: model.id,
      concepto: model.descripcion,
      fechaContable: model.fechaContable,
      fechaEmision: model.fechaEmision,
      fechaVencimiento: model.fechaVencimiento,
      monedaId: model.monedaId,
      numeroDocumento: model.numeroDocumento,
      saldo: model.saldo,
      abono: model.saldo,
      //Mov. Bancario
      documentoRelacionado: documentoRelacionado,
      //Mov. Bancario
    });
    setModal(false);
  };
  //#endregion

  //#region Columnas
  const columnas = useMemo(
    () => [
      {
        Header: "id",
        accessor: "id",
      },
      {
        Header: "Emisión",
        accessor: "fechaEmision",
        Cell: ({ value }) => {
          return (
            <p className="text-center">{moment(value).format("DD/MM/YYYY")}</p>
          );
        },
      },
      {
        Header: "Vcmto.",
        accessor: "fechaVencimiento",
        Cell: ({ value }) => {
          return (
            <p className="text-center">{moment(value).format("DD/MM/YYYY")}</p>
          );
        },
      },
      {
        Header: "Proveedor",
        accessor: "descripcion",
      },
      {
        Header: "M",
        accessor: "monedaId",
        Cell: ({ value }) => {
          return <p className="text-center">{value == "S" ? "S/." : "US$"}</p>;
        },
      },
      {
        Header: "Saldo",
        accessor: "saldo",
        Cell: ({ value }) => {
          return (
            <p className="text-right font-bold">
              {Funciones.RedondearNumero(value, 4)}
            </p>
          );
        },
      },
      {
        Header: "-",
        Cell: ({ row }) => (
          <div className="flex justify-center">
            <button
              onClick={(e) => GetPorId(row.values.id, e)}
              className={
                Global.BotonModalBase + Global.BotonAgregar + "border-none"
              }
            >
              <FaCheck></FaCheck>
            </button>
          </div>
        ),
      },
    ],
    [datos]
  );
  //#endregion
  
  //#region Render
  return (
    <>
      <ModalBasic
        setModal={setModal}
        objeto={[]}
        modo={""}
        menu={["", ""]}
        titulo="Buscar Concepto"
        tamañoModal={[Global.ModalMediano, Global.Form]}
        childrenFooter={
          <>
            <button
              className={Global.BotonModalBase + Global.BotonCancelarModal}
              type="button"
              onClick={() => setModal(false)}
            >
              CERRAR
            </button>
          </>
        }
      >
        {
          <div className={Global.ContenedorBasico}>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <div className={Global.InputFull}>
                  <div className={Global.CheckStyle}>
                    <RadioButton
                      inputId="todos"
                      name="tipoDocumentoId"
                      value=""
                      onChange={ValidarTipo}
                      checked={tipo === ""}
                    />
                  </div>
                  <label
                    htmlFor="todos"
                    className={Global.LabelCheckStyle + "rounded-r-none"}
                  >
                    Todos
                  </label>
                </div>
                <div className={Global.InputFull}>
                  <div className={Global.CheckStyle + Global.Anidado}>
                    <RadioButton
                      inputId="factura"
                      name="tipoDocumentoId"
                      value="01"
                      onChange={ValidarTipo}
                      checked={tipo === "01"}
                    />
                  </div>
                  <label
                    htmlFor="factura"
                    className={Global.LabelCheckStyle + "rounded-r-none"}
                  >
                    Factura
                  </label>
                </div>
                <div className={Global.InputFull}>
                  <div className={Global.CheckStyle + Global.Anidado}>
                    <RadioButton
                      inputId="notaCredito"
                      name="tipoDocumentoId"
                      value="07"
                      onChange={ValidarTipo}
                      checked={tipo === "07"}
                    />
                  </div>
                  <label
                    htmlFor="notaCredito"
                    className={Global.LabelCheckStyle + "rounded-r-none"}
                  >
                    Nota Credito
                  </label>
                </div>
                <div className={Global.InputFull}>
                  <div className={Global.CheckStyle + Global.Anidado}>
                    <RadioButton
                      inputId="letraCambio"
                      name="tipoDocumentoId"
                      value="LC"
                      onChange={ValidarTipo}
                      checked={tipo === "LC"}
                    />
                  </div>
                  <label
                    htmlFor="letraCambio"
                    className={Global.LabelCheckStyle}
                  >
                    Letra de Cambio
                  </label>
                </div>
              </div>
            </div>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="numeroDocumento" className={Global.LabelStyle}>
                  Número de Documento
                </label>
                <input
                  type="text"
                  id="numeroDocumento"
                  name="numeroDocumento"
                  placeholder="Número de Documento"
                  onChange={ValidarData}
                  autoComplete="off"
                  className={Global.InputBoton}
                />
                <button
                  id="consultar"
                  onClick={Filtro}
                  className={
                    Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                  }
                >
                  <FaSearch></FaSearch>
                </button>
              </div>
            </div>

            {/* Tabla */}
            <TablaStyle>
              <TableBasic columnas={columnas} datos={datos} />
            </TablaStyle>
            {/* Tabla */}
          </div>
        }
      </ModalBasic>
    </>
  );
  //#endregion
};

export default FiltroConcepto;
