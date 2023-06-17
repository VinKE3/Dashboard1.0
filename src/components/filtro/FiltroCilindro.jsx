import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import styled from "styled-components";
import Swal from "sweetalert2";
import ApiMasy from "../../api/ApiMasy";
import * as G from "../Global";
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
    width: 70px;
    text-align: center;
  }
  & th:nth-child(3) {
    width: 140px;
  }
  & th:nth-child(5) {
    width: 140px;
    text-align: center;
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
    width: 90px;
    text-align: center;
  }
`;
//#endregion

const FiltroCilindro = ({ setModal, id, objeto, setObjeto, foco }) => {
  //#region useState
  const [data, setData] = useState([]);
  const [dataGuiasSeleccionada] = useState(objeto);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    fechaInicio: moment()
      .subtract(2, "years")
      .startOf("year")
      .format("yyyy-MM-DD"),
    fechaFin: moment(new Date()).format("yyyy-MM-DD"),
  });
  const [cadena, setCadena] = useState(
    `&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`
  );
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(`&fechaInicio=${filtro.fechaInicio}&fechaFin=${filtro.fechaFin}`);
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
        .querySelector("#tablaFiltroCilindro")
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
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Almacen/SalidaCilindros/ListarPendientes?pagina=${pagina}&personalId=${id}${filtro}`
    );
    setData(result.data.data.data);
  };
  const GetPorId = async (id) => {
    let existe;
    //Valida si hay un elemento que coincida por el id
    if (Object.entries(objeto).length > 0) {
      existe = objeto.find((map) => map.id == id);
    }
    //Si no existe entonces pasa los datos
    if (existe == undefined) {
      const result = await ApiMasy.get(
        `api/Almacen/SalidaCilindros/${id}?incluirReferencias=true`
      );
      setObjeto({
        ...result.data.data,
        guiasRelacionadas: {
          id: result.data.data.id,
          numeroDocumento: result.data.data.numeroGuia,
        },
        accion: "agregar",
      });
      foco.focus();
      setModal(false);
    } else {
      //Si existe manda la alerta
      toast.error("Ya existe el elemento seleccionado", {
        position: "bottom-right",
        autoClose: 1800,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };
  //#endregion

  //#region Funciones
  const EliminarFila = async (id) => {
    let model = dataGuiasSeleccionada.filter((map) => map.id != id);
    const res = await ApiMasy.get(`api/Almacen/SalidaCilindros/${id}`);
    Swal.fire({
      title: "Eliminar selección",
      icon: "warning",
      iconColor: "#F7BF3A",
      showCancelButton: true,
      color: "#fff",
      background: "#171B23",
      confirmButtonColor: "#3B8407",
      confirmButtonText: "Confirmar",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setObjeto({
          id: res.data.data.id,
          detalles: res.data.data.detalles,
          guiasRelacionadas: model,
          accion: "Eliminar",
        });
        setModal(false);
      }
    });
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
        Header: "Fecha",
        accessor: "fechaEmision",
        Cell: ({ value }) => {
          return (
            <p className="text-center">{moment(value).format("DD/MM/YY")}</p>
          );
        },
      },
      {
        Header: "Documento",
        accessor: "numeroDocumento",
      },
      {
        Header: "Cliente",
        accessor: "clienteNombre",
      },
      {
        Header: "Total Cilindros",
        accessor: "totalCilindros",
        Cell: ({ value }) => {
          return <p className="text-center font-semibold">{value}</p>;
        },
      },
      {
        Header: " ",
        Cell: ({ row }) => (
          <div className="flex justify-center">
            <button
              id="boton"
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
  const columnSeleccion = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Documento",
      accessor: "numeroDocumento",
    },
    {
      Header: " ",
      Cell: ({ row }) => (
        <div className="flex justify-center">
          <button
            id="boton"
            onClick={() => EliminarFila(row.values.id)}
            className={G.BotonModalBase + G.BotonRojo + "border-none"}
          >
            <FaTrash></FaTrash>
          </button>
        </div>
      ),
    },
  ];
  //#endregion

  //#region Render
  return (
    <>
      <ModalBasic
        setModal={setModal}
        titulo="Consultar Documentos"
        foco={foco}
        tamañoModal={[G.ModalMediano, G.Form]}
        childrenFooter={
          <>
            <button
              type="button"
              onClick={() => setModal(false)}
              className={G.BotonModalBase + G.BotonCerrarModal}
            >
              CERRAR
            </button>
          </>
        }
      >
        {
          <>
            <div className={G.ContenedorBasico + G.FondoContenedor + " mb-2"}>
              <div className={G.ContenedorInputs + " mb-2"}>
                <div className={G.InputMitad}>
                  <label htmlFor="fechaInicio" className={G.LabelStyle}>
                    Desde
                  </label>
                  <input
                    type="date"
                    id="fechaInicio"
                    name="fechaInicio"
                    autoComplete="off"
                    autoFocus
                    value={filtro.fechaInicio}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                </div>
                <div className={G.InputMitad}>
                  <label htmlFor="fechaFin" className={G.LabelStyle}>
                    Hasta
                  </label>
                  <input
                    type="date"
                    id="fechaFin"
                    name="fechaFin"
                    autoComplete="off"
                    value={filtro.fechaFin}
                    onChange={HandleData}
                    className={G.InputStyle}
                  />
                  {/* <button
                    id="consultar"
                    onClick={Filtro}
                    className={
                      G.BotonBuscar + G.Anidado + G.BotonPrimary
                    }
                  >
                    <FaSearch></FaSearch>
                  </button> */}
                </div>
              </div>
              {Object.entries(dataGuiasSeleccionada).length > 0 && (
                <div className={G.ContenedorBasico + G.FondoContenedor}>
                  <p className=" px-1 text-base text-light font-bold">
                    SELECCIONADOS
                  </p>
                  {/* Tabla */}
                  <TablaDetalle>
                    <TableBasic
                      columnas={columnSeleccion}
                      datos={dataGuiasSeleccionada}
                    />
                  </TablaDetalle>
                  {/* Tabla */}
                </div>
              )}
              {/* Tabla */}
              <DivTabla>
                <TableBasic
                  id={"tablaFiltroCilindro"}
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
  //#endregion
};

export default FiltroCilindro;
