import React, { useState, useEffect, useMemo } from "react";
import ApiMasy from "../../api/ApiMasy";
import ModalBasic from "../Modal/ModalBasic";
import TableBasic from "../Tabla/TableBasic";
import { FaSearch, FaCheck } from "react-icons/fa";
import styled from "styled-components";
import moment from "moment";
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
    width: 100px;
    text-align: center;
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
const TablaDetalle = styled.div`
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

const FiltroLetraVenta = ({ setModal, id, setObjeto, foco }) => {
  //#region useState
  const [data, setData] = useState([]);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    numero: "",
  });
  const [cadena, setCadena] = useState(`&numero=${filtro.numero}`);
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(`&numero=${filtro.numero}`);
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
      `api/Venta/LetraCambioVenta/ListarPendientes?pagina=${pagina}&clienteId=${id}${filtro}`
    );
    setData(result.data.data.data);
  };
  const GetPorId = async (id) => {
    const model = data.find((registro) => registro.id == id);
    setObjeto({
      id: model.id,
      numeroDocumento: model.numeroDocumento,
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
        Header: "Emisión",
        accessor: "fechaEmision",
        Cell: ({ value }) => {
          return (
            <p className="text-center">{moment(value).format("DD/MM/YYYY")}</p>
          );
        },
      },
      {
        Header: "Documento",
        accessor: "numeroDocumento",
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
          return <p className="text-right font-semibold">{value}</p>;
        },
      },
      {
        Header: " ",
        Cell: ({ row }) => (
          <div className="flex justify-center">
            <button
              id="boton"
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

  //#region Render
  return (
    <>
      <ModalBasic
        setModal={setModal}
        objeto={[]}
        modo={""}
        menu={["", ""]}
        titulo="Buscar Letra"
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
                <label htmlFor="numero" className={Global.LabelStyle}>
                  Número de Documento
                </label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  placeholder="Número de Documento"
                  autoComplete="off"
                  autoFocus
                  onChange={ValidarData}
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
              <TableBasic columnas={columnas} datos={data} />
            </TablaStyle>
            {/* Tabla */}
          </div>
        }
      </ModalBasic>
    </>
  );
  //#endregion
};

export default FiltroLetraVenta;
