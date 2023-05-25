import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../api/ApiMasy";
import ModalBasic from "../Modal/ModalBasic";
import TableBasic from "../Tabla/TableBasic";
import FiltroBasico from "../Filtro/FiltroBasico";
import { FaCheck } from "react-icons/fa";
import styled from "styled-components";
import * as Global from "../Global";
//#region Estilos
const TablaStyle = styled.div`
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
  const ValidarData = async ({ target }) => {
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
              className={
                Global.BotonModalBase + Global.BotonAgregar + " border-none "
              }
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
        objeto={[]}
        modo={""}
        menu={["", ""]}
        titulo="Consultar Facturas"
        tamañoModal={[Global.ModalMediano, Global.Form]}
        childrenFooter={
          <button
            className={Global.BotonModalBase + Global.BotonCancelarModal}
            type="button"
            onClick={() => setModal(false)}
          >
            CERRAR
          </button>
        }
      >
        {
          <>
            <div className={Global.ContenedorBasico + Global.FondoContenedor}>
              {/* Filtro*/}
              <FiltroBasico
                textLabel={"N° Documento"}
                placeHolder={"N° Documento"}
                name={"numeroDocumento"}
                maxLength={"20"}
                value={filtro.numeroDocumento}
                onChange={ValidarData}
                botonId={"buscar"}
                onClick={Filtro}
              />
              {/* Filtro*/}

              {/* Tabla */}
              <TablaStyle>
                <TableBasic columnas={columnas} datos={data} />
              </TablaStyle>
              {/* Tabla */}
            </div>
          </>
        }
      </ModalBasic>
    </>
  );
};

export default FiltroFacturaCompra;
