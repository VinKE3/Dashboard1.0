import React, { useState, useEffect } from "react";
import ApiMasy from "../../api/ApiMasy";
import ModalBasic from "../ModalBasic";
import TableBasic from "../tablas/TableBasic";
import { FaSearch } from "react-icons/fa";
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
  const [filtro, setFiltro] = useState("");
  const [filtroDescripcion, setFiltroDescripcion] = useState("");
  //#endregion

  //#region useEffect;
  useEffect(() => {
    Listar("", 1);
  }, []);

  //#endregion

  //#region Funciones Filtrado
  const FiltradoDescripcion = async (e) => {
    let descripcion = e.target.value;
    clearTimeout(timer);
    setFiltro(`descripcion=${descripcion}`, 1);
    setFiltroDescripcion(descripcion); // Actualizar el estado filtroDescripcion
    const newTimer = setTimeout(() => {
      if (descripcion == "") {
        Listar("", 1);
      } else {
        Listar(`descripcion=${descripcion}`, 1);
      }
    }, 200);
    setTimer(newTimer);
  };

  const FiltradoButton = () => {
    if (filtro == "") {
      Listar("", 1);
    } else {
      Listar(filtro, 1);
    }
  };
  //#endregion

  //#region API
  const Listar = async (filtro = filtroActual, pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Finanzas/CuentaPorPagar/ListarPendientes?pagina=${pagina}${filtro}`
    );
    const datosFiltrados = result.data.data.data.filter((dato) =>
      dato.descripcion.toLowerCase().includes(filtroDescripcion.toLowerCase())
    );
    setDatos(datosFiltrados);
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
    console.log(model, "FILTRO CONCEPTO");
    setModal(false);
  };

  const columnas = [
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
  ];
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
              className={Global.BotonModalBase +Global.BotonCancelarModal}
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
                <label htmlFor="descripcion" className={Global.LabelStyle}>
                  Proveedor
                </label>
                <input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  placeholder="Descripción"
                  onChange={FiltradoDescripcion}
                  autoComplete="off"
                  className={Global.InputBoton}
                />
                <button
                  id="consultar"
                  onClick={FiltradoButton}
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
