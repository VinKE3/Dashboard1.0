import { useEffect, useMemo, useState } from "react";
import { FaCheck } from "react-icons/fa";
import styled from "styled-components";
import ApiMasy from "../../api/ApiMasy";
import * as G from "../Global";
import FiltroBasico from "../filtro/FiltroBasico";
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
  & th:nth-child(2) {
    width: 135px;
  }
  & th:nth-child(4) {
    width: 30px;
    text-align: center;
  }
  & th:nth-child(5) {
    width: 80px;
    text-align: right;
  }
  & th:last-child {
    width: 90px;
    text-align: center;
  }
`;
//#endregion
const FiltroFacturaCompra = ({ setModal, id, setObjeto, foco }) => {
  //#region useState
  const [data, setData] = useState([]);
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
    setCadena(`&numeroDocumento=${filtro.numeroDocumento}`);
  }, [filtro]);
  useEffect(() => {
    Filtro();
  }, [cadena]);
  useEffect(() => {
    Listar(cadena, 1);
  }, []);
  //#endregion

  //#region Funciones
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Compra/DocumentoCompra/ListarPendientes?pagina=${pagina}&proveedorId=${id}${filtro}`
    );
    setData(result.data.data.data);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Compra/DocumentoCompra/${id}`);
    setObjeto({
      ...result.data.data,
      accion: "agregar",
    });
    foco.focus();
    setModal(false);
  };
  //#endregion

  //#region Funciones Filtrado
  const HandleData = async ({ target }) => {
    setFiltro((prev) => ({
      ...prev,
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
        .querySelector("#tablaFiltroFacturaCompra")
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

  //#region Columnas
  const columnas = useMemo(
    () => [
      {
        Header: "id",
        accessor: "id",
      },
      {
        Header: "Documento",
        accessor: "numeroDocumento",
      },
      {
        Header: "Razón Social",
        accessor: "proveedorNombre",
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
          <div className="flex justify-center">
            <button
              onClick={() => GetPorId(row.values.id)}
              className={G.BotonModalBase + G.BotonVerde + " border-none "}
            >
              <FaCheck></FaCheck>
            </button>
          </div>
        ),
      },
    ],
    [data]
  );

  //#endregion
  return (
    <>
      <ModalBasic
        setModal={setModal}
        titulo="Consultar Facturas"
        foco={foco}
        tamañoModal={[G.ModalMediano, G.Form]}
        childrenFooter={
          <button
            type="button"
            onClick={() => setModal(false)}
            className={G.BotonModalBase + G.BotonCerrarModal}
          >
            CERRAR
          </button>
        }
      >
        {
          <>
            <div className={G.ContenedorBasico + G.FondoContenedor}>
              {/* Filtro*/}
              <FiltroBasico
                textLabel={"N° Documento"}
                placeHolder={"N° Documento"}
                name={"numeroDocumento"}
                maxLength={"20"}
                value={filtro.numeroDocumento}
                onChange={HandleData}
                botonId={"buscar"}
                onClick={Filtro}
              />
              {/* Filtro*/}

              {/* Tabla */}
              <DivTabla>
                <TableBasic
                  id={"tablaFiltroFacturaCompra"}
                  columnas={columnas}
                  datos={data}
                  DobleClick={(e) => KeyTabla(e, true)}
                  KeyDown={(e) => KeyTabla(e)}
                />
              </DivTabla>
              {/* Tabla */}
            </div>
          </>
        }
      </ModalBasic>
    </>
  );
};

export default FiltroFacturaCompra;
