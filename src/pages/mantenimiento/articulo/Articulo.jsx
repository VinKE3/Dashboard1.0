import { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import FiltroBasico from "../../../components/filtros/FiltroBasico";
import Table from "../../../components/tablas/Table";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import Modal from "./Modal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/ContextAuth";
import * as Global from "../../../components/Global";
import GetUsuarioId from "../../../components/CRUD/GetUsuarioId";
import store from "store2";
import { Checkbox } from "primereact/checkbox";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2) {
    width: 150px;
  }
  & th:nth-child(3) {
    width: 300px;
  }
  //?lo oculte porque la api trae todo null
  & th:nth-child(4) {
    display: none;
  }
  & tbody td:nth-child(4) {
    display: none;
  }
  //?
  & th:nth-child(5) {
    width: 200px;
  }
  & th:nth-child(6) {
    width: 200px;
  }
  & th:nth-child(7) {
    width: 200px;
  }
  & th:nth-child(8) {
    width: 150px;
  }
  & th:nth-child(9) {
    text-align: center;
  }
  & th:nth-child(10) {
    text-align: center;
  }
  & th:nth-child(11) {
    text-align: center;
  }
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;

const Articulo = () => {
  //#region useState
  const { usuario, usuarioId } = useAuth();
  const [datos, setDatos] = useState([]);
  const [objeto, setObjeto] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Registrar");
  const [respuestaAlert, setRespuestaAlert] = useState(false);

  //#endregion

  //#region useEffect
  useEffect(() => {
    if (store.session.get("usuario") == "AD") {
      setPermisos([true, true, true, true, true]);
      Listar(filtro, 1);
    } else {
      //?Consulta a la Api para traer los permisos
      GetPermisos();
      Listar(filtro, 1);
    }
  }, [usuario]);

  useEffect(() => {
    filtro;
  }, [filtro]);
  useEffect(() => {
    total;
  }, [total]);
  useEffect(() => {
    index;
  }, [index]);

  useEffect(() => {
    modo;
  }, [modo]);
  useEffect(() => {
    if (!modal) {
      Listar(filtro, index + 1);
    }
  }, [modal]);
  useEffect(() => {
    if (respuestaAlert) {
      Listar(filtro, index + 1);
    }
  }, [respuestaAlert]);

  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Articulo/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/Articulo/${id}`);
    setObjeto(result.data.data);
  };
  const GetPermisos = async () => {
    const permiso = await GetUsuarioId(usuarioId, "Articulo");
    setPermisos([
      permiso.registrar,
      permiso.modificar,
      permiso.eliminar,
      permiso.consultar,
      permiso.anular,
    ]);
  };
  //#endregion

  //#region Funciones Filtrado
  const FiltradoPaginado = (e) => {
    let filtro = document.getElementById("descripcion").value;
    let boton = e.selected + 1;
    setIndex(e.selected);
    if (filtro == "") {
      Listar("", boton);
    } else {
      Listar(`&descripcion=${filtro}`, boton);
    }
  };
  const FiltradoKeyPress = async (e) => {
    clearTimeout(timer);
    let f = e.target.value;
    setFiltro(`&descripcion=${f}`);
    if (f != "") setIndex(0);
    const newTimer = setTimeout(() => {
      if (f == "") {
        Listar("", index + 1);
      } else {
        Listar(`&descripcion=${f}`, index + 1);
      }
    }, 200);
    setTimer(newTimer);
  };
  const FiltradoButton = () => {
    setIndex(0);
    if (filtro == "") {
      Listar("", 1);
    } else {
      Listar(filtro, 1);
    }
  };
  //#endregion

  //#region Funciones Modal
  const AbrirModal = async (id, modo = "Registrar") => {
    setModo(modo);
    if (modo == "Registrar") {
      let model = {
        lineaId: -1,
        subLineaId: -1,
        articuloId: "",
        tipoExistenciaId: -1,
        unidadMedidaId: -1,
        marcaId: -1,
        descripcion: "",
        observacion: "",
        codigoBarras: "",
        peso: 0,
        monedaId: -1,
        precioCompra: 0,
        precioCompraDescuento: 0,
        precioVenta1: 0,
        precioVenta2: 0,
        precioVenta3: 0,
        precioVenta4: 0,
        porcentajeUtilidad1: 0,
        porcentajeUtilidad2: 0,
        porcentajeUtilidad3: 0,
        porcentajeUtilidad4: 0,
        stock: 0,
        stockMinimo: 0,
        precioIncluyeIGV: true,
        activarCostoDescuento: false,
        isActivo: true,
        controlarStock: true,
        actualizarPrecioCompra: true,
      };
      setObjeto(model);
    } else {
      await GetPorId(id);
    }
    setModal(true);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "Código",
      accessor: "id",
      Cell: ({ value }) => <span className="w-2/12">{value}</span>,
    },
    {
      Header: "Código de Barras",
      accessor: "codigoBarras",
    },
    {
      Header: "Descripción",
      accessor: "descripcion",
    },
    {
      Header: "Unidad de Medida",
      accessor: "unidadMedidaAbreviatura",
    },
    {
      Header: "Stock",
      accessor: "stock",
    },
    {
      Header: "Moneda",
      accessor: "monedaId",
    },
    {
      Header: "Precio de Compra",
      accessor: "precioCompra",
    },
    {
      Header: "Precio de Venta",
      accessor: "precioVenta",
    },
    {
      Header: "S",
      accessor: "controlarStock",
      Cell: ({ value }) => {
        return value ? (
          <div className="flex justify-center">
            {" "}
            <Checkbox checked={true} />
          </div>
        ) : (
          <div className="flex justify-center">
            {" "}
            <Checkbox checked={false} />
          </div>
        );
      },
    },
    {
      Header: "A.P",
      accessor: "actualizarPrecio",
      Cell: ({ value }) => {
        return value ? (
          <div className="flex justify-center">
            {" "}
            <Checkbox checked={true} />
          </div>
        ) : (
          <div className="flex justify-center">
            {" "}
            <Checkbox checked={false} />
          </div>
        );
      },
    },
    {
      Header: "A",
      accessor: "isActivo",
      Cell: ({ value }) => {
        return value ? (
          <div className="flex justify-center">
            {" "}
            <Checkbox checked={true} />
          </div>
        ) : (
          <div className="flex justify-center">
            {" "}
            <Checkbox checked={false} />
          </div>
        );
      },
    },

    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <BotonCRUD
          setRespuestaAlert={setRespuestaAlert}
          permisos={permisos}
          menu={["Mantenimiento", "Articulo"]}
          id={row.values.id}
          ClickConsultar={() => AbrirModal(row.values.id, "Consultar")}
          ClickModificar={() => AbrirModal(row.values.id, "Modificar")}
        /> //?Se envia el id de la fila
      ),
    },
  ];
  //#endregion

  //#region Render
  return (
    <>
      <div className="px-2">
        <h2 className={Global.TituloH2}>Artículos</h2>

        {/* Filtro*/}
        <FiltroBasico
          textLabel={"Descripción"}
          inputPlaceHolder={"Descripción"}
          inputId={"descripcion"}
          inputName={"descripcion"}
          inputMax={"200"}
          botonId={"buscar"}
          FiltradoButton={FiltradoButton}
          FiltradoKeyPress={FiltradoKeyPress}
        />
        {/* Filtro*/}

        {/* Boton */}
        {permisos[0] && (
          <BotonBasico
            botonText="Registrar"
            botonClass={Global.BotonRegistrar}
            botonIcon={faPlus}
            click={() => AbrirModal()}
          />
        )}
        {/* Boton */}

        {/* Tabla */}
        <TablaStyle>
          <Table
            columnas={columnas}
            datos={datos}
            total={total}
            index={index}
            Click={(e) => FiltradoPaginado(e)}
          />
        </TablaStyle>
        {/* Tabla */}
      </div>

      {modal && <Modal setModal={setModal} modo={modo} objeto={objeto} />}
      <ToastContainer />
    </>
  );
  //#endregion
};

export default Articulo;
