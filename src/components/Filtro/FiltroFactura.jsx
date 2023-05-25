import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../api/ApiMasy";
import ModalBasic from "../Modal/ModalBasic";
import TableBasic from "../Tabla/TableBasic";
import FiltroBasico from "../Filtro/FiltroBasico";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaTrash, FaCheck } from "react-icons/fa";
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

const FiltroFactura = ({ setModal, objeto, setObjeto, foco }) => {
  //#region useState
  const [data, setData] = useState([]);
  const [dataFacturaSeleccionada] = useState(objeto);
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
      `api/Venta/DocumentoVenta/ListarSimplificado?Pagina=${pagina}${filtro}`
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
      const result = await ApiMasy.get(`api/Venta/DocumentoVenta/${id}`);
      setObjeto({
        clienteId: result.data.data.clienteId,
        clienteNumeroDocumentoIdentidad:
          result.data.data.clienteNumeroDocumentoIdentidad,
        clienteNombre: result.data.data.clienteNombre,
        clienteDireccionId: result.data.data.clienteDireccionId,
        clienteDireccion: result.data.data.clienteDireccion ?? "",
        personalId: result.data.data.personalId,
        monedaId: result.data.data.monedaId,
        observacion: result.data.data.observacion,
        detalles: result.data.data.detalles,
        documentoRelacionadoId: result.data.data.id,
        documentosRelacionados: {
          id: result.data.data.id,
          numeroDocumento: result.data.data.numeroDocumento,
        },
        accion: "agregar",
      });
      foco.focus();
      setModal(false);
    } else {
      //Si existe manda la alerta
      toast.error("Ya existe el elemento seleccionado", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };
  const EliminarFila = async (id) => {
    let model = dataFacturaSeleccionada.filter((map) => map.id !== id);
    const res = await ApiMasy.get(`api/Venta/DocumentoVenta/${id}`);
    Swal.fire({
      title: "Eliminar selección",
      icon: "warning",
      iconColor: "#F7BF3A",
      showCancelButton: true,
      color: "#fff",
      background: "#1a1a2e",
      confirmButtonColor: "#eea508",
      confirmButtonText: "Aceptar",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setObjeto({
          detalles: res.data.data.detalles,
          documentosRelacionados: model,
          accion: "eliminar",
        });
        setModal(false);
      }
    });
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
            onClick={() => EliminarFila(row.values.id)}
            className={
              Global.BotonModalBase + Global.BotonEliminar + "border-none"
            }
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
            {/* Tabla Seleccion*/}
            {Object.entries(dataFacturaSeleccionada).length > 0 && (
              <div
                className={
                  Global.ContenedorBasico + Global.FondoContenedor + " mb-2"
                }
              >
                <p className=" px-1 text-base text-light font-bold">
                  SELECCIONADOS
                </p>
                {/* Tabla */}
                <TablaDetalle>
                  <TableBasic
                    columnas={columnSeleccion}
                    datos={dataFacturaSeleccionada}
                  />
                </TablaDetalle>
                {/* Tabla */}
              </div>
            )}
            {/* Tabla Seleccion*/}

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
  //#endregion
};

export default FiltroFactura;
