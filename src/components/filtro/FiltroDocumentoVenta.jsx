import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../api/ApiMasy";
import ModalBasic from "../modal/ModalBasic";
import TableBasic from "../tabla/TableBasic";
import { FaCheck } from "react-icons/fa";
import styled from "styled-components";
import * as G from "../Global";
import moment from "moment";

//#region Estilos
const DivTabla = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:last-child {
    width: 40px;
    text-align: center;
  }
`;
//#endregion

const FiltroDocumentoVenta = ({ setModal, setObjeto, foco }) => {
  //#region useState
  const [datos, setDatos] = useState([]);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    numeroDocumento: "",
  });
  const [cadena, setCadena] = useState(
    `&numeroDocumento=${filtro.numeroDocumento}`
  );
  //#endregion

  //#region useEffect;
  useEffect(() => {
    datos;
    console.log(datos);
  }, [datos]);
  useEffect(() => {
    setCadena(`&numeroDocumento=${filtro.numeroDocumento}`);
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
    setFiltro((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));
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
        .querySelector("#tablaFiltroDocumentoVenta")
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
      `api/Venta/DocumentoVenta/ListarPendientesCaja?pagina=${pagina}${f}`
    );
    setDatos(result.data.data.data);
  };
  const GetPorId = async (id) => {
    const model = datos.find((registro) => registro.id === id);
    setObjeto({
      id: model.id,
      fechaEmision: model.fechaEmision,
      numeroDocumento: model.numeroDocumento,
      clienteNombre: model.clienteNombre,
      monedaId: model.monedaId,
      total: model.total,
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
          return <p>{moment(value).format("DD/MM/YYYY")}</p>;
        },
      },
      {
        Header: "N° Documento",
        accessor: "numeroDocumento",
      },
      {
        Header: "Cliente Nombre",
        accessor: "clienteNombre",
      },
      {
        Header: "M",
        accessor: "monedaId",
        Cell: ({ value }) => {
          return <p className="text-center">{value == "S" ? "S/." : "US$"}</p>;
        },
      },
      {
        Header: "Total",
        accessor: "total",
        Cell: ({ value }) => {
          return <p className="text-right font-semibold">{value}</p>;
        },
      },
      {
        Header: " ",
        Cell: ({ row }) => (
          <button
            id="boton"
            onClick={() => GetPorId(row.values.id)}
            className={G.BotonModalBase + G.BotonVerde + "border-none"}
          >
            <FaCheck></FaCheck>
          </button>
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
        titulo="Consultar Dcoumento de Venta"
        foco={foco}
        tamañoModal={[G.ModalMediano, G.Form]}
        childrenFooter={
          <>
            {/* <button
              className={
                G.BotonOkModal + " flex items-center justify-center"
              }
              type="button"
            >
              <FaPlus></FaPlus>
              <p className="pl-2">Nuevo</p>
            </button> */}
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
                <label htmlFor="numeroDocumento" className={G.LabelStyle}>
                  N° Documento
                </label>
                <input
                  type="text"
                  id="numeroDocumento"
                  name="numeroDocumento"
                  placeholder="N° Documento"
                  autoComplete="off"
                  autoFocus
                  value={filtro.numeroDocumento}
                  onChange={HandleData}
                  className={G.InputStyle}
                />
              </div>
            </div>

            {/* Tabla */}
            <DivTabla>
              <TableBasic
                id={"tablaFiltroDocumentoVenta"}
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

export default FiltroDocumentoVenta;
