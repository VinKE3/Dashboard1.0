import React, { useState, useEffect } from "react";
import ApiMasy from "../../api/ApiMasy";
import ModalBasic from "../ModalBasic";
import TableBasic from "../tablas/TableBasic";
import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import moment from "moment";
import * as Global from "../Global";
import { RadioButton } from "primereact/radiobutton";
import * as Funciones from "../Funciones";
import { useMemo } from "react";
import { da } from "date-fns/locale";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
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
  //#endregion

  //#region API
  const Listar = async (f = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Finanzas/CuentaPorPagar/ListarPendientes?pagina=${pagina}${f}`
    );
    setDatos(result.data.data.data);
  };

  const GetConcepto = async (id, e) => {
    e.preventDefault();
    const model = datos.find((registro) => registro.id == id);
    setObjeto({
      concepto: model.descripcion,
      fechaContable: model.fechaContable,
      fechaEmision: model.fechaEmision,
      fechaVencimiento: model.fechaVencimiento,
      id: model.id,
      monedaId: model.monedaId,
      numeroDocumento: model.numeroDocumento,
      saldo: model.saldo,
      abono: model.saldo,
    });
    setModal(false);
  };

  const columnas = useMemo(
    () => [
      {
        Header: "id",
        accessor: "id",
      },
      {
        Header: "Fecha Emisión",
        accessor: "fechaEmision",
        Cell: ({ value }) => {
          return moment(value).format("DD/MM/YYYY");
        },
      },
      {
        Header: "Fecha Vencimiento",
        accessor: "fechaVencimiento",
        Cell: ({ value }) => {
          return moment(value).format("DD/MM/YYYY");
        },
      },
      {
        Header: "Proveedor",
        accessor: "descripcion",
      },
      {
        Header: "Moneda",
        accessor: "monedaId",
      },
      {
        Header: "Saldo",
        accessor: "saldo",
      },
      {
        Header: "-",
        Cell: ({ row }) => (
          <div className="flex justify-center">
            <button
              onClick={(e) => GetConcepto(row.values.id, e)}
              className={
                Global.BotonBasic + Global.BotonRegistrar + " !px-3 !py-1.5"
              }
            >
              <FaSearch></FaSearch>
            </button>
          </div>
        ),
      },
    ],
    [datos]
  );
  //#endregion
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
              className={Global.BotonCancelarModal}
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
                <div className={Global.LabelStyle}>
                  <RadioButton
                    inputId="todos"
                    name="tipoDocumentoId"
                    value=""
                    onChange={ValidarTipo}
                    checked={tipo === ""}
                  />
                </div>
                <label htmlFor="todos" className={Global.InputStyle}>
                  Todos
                </label>
              </div>
              <div className={Global.InputFull}>
                <div className={Global.LabelStyle}>
                  <RadioButton
                    inputId="factura"
                    name="tipoDocumentoId"
                    value="01"
                    onChange={ValidarTipo}
                    checked={tipo === "01"}
                  />
                </div>
                <label htmlFor="factura" className={Global.InputStyle}>
                  Factura
                </label>
              </div>
              <div className={Global.InputFull}>
                <div className={Global.LabelStyle}>
                  <RadioButton
                    inputId="notaCredito"
                    name="tipoDocumentoId"
                    value="07"
                    onChange={ValidarTipo}
                    checked={tipo === "07"}
                  />
                </div>
                <label htmlFor="notaCredito" className={Global.InputStyle}>
                  Nota Credito
                </label>
              </div>
              <div className={Global.InputFull}>
                <div className={Global.LabelStyle}>
                  <RadioButton
                    inputId="letraCambio"
                    name="tipoDocumentoId"
                    value="LC"
                    onChange={ValidarTipo}
                    checked={tipo === "LC"}
                  />
                </div>
                <label htmlFor="letraCambio" className={Global.InputStyle}>
                  Letra de Cambio
                </label>
              </div>
            </div>
            <div className={Global.ContenedorInputs}>
              <div className={Global.InputFull}>
                <label htmlFor="numeroDocumento" className={Global.LabelStyle}>
                  Numero de Documento
                </label>
                <input
                  type="text"
                  id="numeroDocumento"
                  name="numeroDocumento"
                  placeholder="Descripción"
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
};

export default FiltroConcepto;
