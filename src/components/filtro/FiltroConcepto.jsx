import moment from "moment";
import { RadioButton } from "primereact/radiobutton";
import React, { useEffect, useMemo, useState } from "react";
import { FaCheck, FaSearch } from "react-icons/fa";
import styled from "styled-components";
import ApiMasy from "../../api/ApiMasy";
import * as G from "../Global";
import * as Funciones from "../funciones/Validaciones";
import ModalBasic from "../modal/ModalBasic";
import TableBasic from "../tabla/TableBasic";

//#region Estilos
const DivTabla = styled.div`
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
  }
`;
//#endregion

const FiltroConcepto = ({ setModal, setObjeto, foco, modo = "EG" }) => {
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
  const modoConsulta = modo == "EG" ? "CuentaPorPagar" : "CuentaPorCobrar";
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
  const HandleData = async ({ target }) => {
    setFiltro((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };
  const ValidarTipo = async ({ target }) => {
    setFiltro((prev) => ({
      ...prev,
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
  const KeyTabla = async (e, click = false) => {
    if (e.key === "Enter") {
      let row = document
        .querySelector("#tablaFiltroConcepto")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        await GetPorId(id);
      }
    }
    if (e.key == "Escape") {
      foco.focus();
      setModal(false);
    }
    if (click) {
      let row = e.target.closest("tr");
      let id = row.firstChild.innerText;
      await GetPorId(id);
    }
  };
  //#endregion

  //#region API
  const Listar = async (f = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Finanzas/${modoConsulta}/ListarPendientes?pagina=${pagina}${f}`
    );
    setDatos(result.data.data.data);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Finanzas/${modoConsulta}/${id}`);
    const fila = datos.find((map) => map.id == id);
    let documentoRelacionado = "";

    if (modo == "EG") {
      if (
        fila.id.includes("LC") ||
        fila.id.includes("CF") ||
        fila.id.includes("CH")
      ) {
        documentoRelacionado = fila.documentoRelacionado;
      }
    }

    setObjeto({
      id: result.data.data.id,
      fechaEmision: result.data.data.fechaEmision,
      fechaVencimiento: result.data.data.fechaVencimiento,
      fechaContable: result.data.data.fechaContable,
      numeroDocumento: fila.numeroDocumento,
      concepto: fila.descripcion,
      clienteId: result.data.data.clienteId,
      clienteNombre: result.data.data.clienteNombre,
      monedaId: result.data.data.monedaId,
      saldo: result.data.data.saldo,
      abono: result.data.data.saldo,
      total: result.data.data.total,

      //Mov. Bancario
      documentoRelacionado: documentoRelacionado,
      //Mov. Bancario
    });
    foco.focus();
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
        Header: "Documento / Razón Social",
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
        Header: " ",
        Cell: ({ row }) => (
          <div className="flex justify-center">
            <button
              id="boton"
              onClick={(e) => GetPorId(row.values.id, e)}
              className={G.BotonModalBase + G.BotonVerde + "border-none"}
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
        titulo={
          modo == "EG"
            ? "Buscar Cuentas por Pagar"
            : "Buscar Cuentas por Cobrar"
        }
        foco={foco}
        tamañoModal={[G.ModalMediano, G.Form]}
        childrenFooter={
          <>
            <button
              className={G.BotonModalBase + G.BotonCerrarModal}
              type="button"
              onClick={() => setModal(false)}
            >
              CERRAR
            </button>
          </>
        }
      >
        {
          <div className={G.ContenedorBasico}>
            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <div className={G.InputFull}>
                  <div className={G.CheckStyle}>
                    <RadioButton
                      inputId="todos"
                      name="tipoDocumentoId"
                      autoFocus
                      value=""
                      onChange={ValidarTipo}
                      checked={tipo === ""}
                    />
                  </div>
                  <label
                    htmlFor="todos"
                    className={G.LabelCheckStyle + "rounded-r-none"}
                  >
                    Todos
                  </label>
                </div>
                <div className={G.InputFull}>
                  <div className={G.CheckStyle + G.Anidado}>
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
                    className={G.LabelCheckStyle + "rounded-r-none"}
                  >
                    Factura
                  </label>
                </div>
                <div className={G.InputFull}>
                  <div className={G.CheckStyle + G.Anidado}>
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
                    className={G.LabelCheckStyle + "rounded-r-none"}
                  >
                    Nota Credito
                  </label>
                </div>
                <div className={G.InputFull}>
                  <div className={G.CheckStyle + G.Anidado}>
                    <RadioButton
                      inputId="letraCambio"
                      name="tipoDocumentoId"
                      value="LC"
                      onChange={ValidarTipo}
                      checked={tipo === "LC"}
                    />
                  </div>
                  <label htmlFor="letraCambio" className={G.LabelCheckStyle}>
                    Letra de Cambio
                  </label>
                </div>
              </div>
            </div>
            <div className={G.ContenedorInputs}>
              <div className={G.InputFull}>
                <label htmlFor="numeroDocumento" className={G.LabelStyle}>
                  Número de Documento
                </label>
                <input
                  type="text"
                  id="numeroDocumento"
                  name="numeroDocumento"
                  placeholder="Número de Documento"
                  autoComplete="off"
                  autoFocus
                  onChange={HandleData}
                  className={G.InputBoton}
                />
                <button
                  id="consultarCuentas"
                  onClick={Filtro}
                  className={G.BotonBuscar + G.Anidado + G.BotonPrimary}
                >
                  <FaSearch></FaSearch>
                </button>
              </div>
            </div>

            {/* Tabla */}
            <DivTabla>
              <TableBasic
                id={"tablaFiltroConcepto"}
                columnas={columnas}
                datos={datos}
                DobleClick={(e) => KeyTabla(e, true)}
                KeyDown={(e) => KeyTabla(e)}
              />
            </DivTabla>
            {/* Tabla */}
          </div>
        }
      </ModalBasic>
    </>
  );
  //#endregion
};

export default FiltroConcepto;
