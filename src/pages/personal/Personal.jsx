import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../api/ApiMasy";
import GetPermisos from "../../components/Funciones/GetPermisos";
import BotonBasico from "../../components/BotonesComponent/BotonBasico";
import BotonCRUD from "../../components/BotonesComponent/BotonCRUD";
import Table from "../../components/tablas/Table";
import FiltroBasico from "../../components/filtros/FiltroBasico";
import Modal from "./Modal";
import { ToastContainer } from "react-toastify";
import moment from "moment";
import styled from "styled-components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../components/Global";
//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:last-child {
    text-align: center;
    width: 100px;
    max-width: 100px;
  }
`;
//#endregion

const Personal = () => {
  //#region useState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    nombre: "",
  });
  const [cadena, setCadena] = useState(`&nombreCompleto=${filtro.nombre}`);
  //Modal
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Registrar");
  const [objeto, setObjeto] = useState([]);
  const [respuestaAlert, setRespuestaAlert] = useState(false);
  //Modal
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(`&nombreCompleto=${filtro.nombre}`);
  }, [filtro]);
  useEffect(() => {
    Filtro();
  }, [cadena]);

  useEffect(() => {
    if (visible) {
      if (!modal) {
        Listar(cadena, index + 1);
      }
    }
  }, [modal]);
  useEffect(() => {
    if (respuestaAlert) {
      Listar(cadena, index + 1);
    }
  }, [respuestaAlert]);

  useEffect(() => {
    if (Object.entries(permisos).length > 0) {
      if (
        !permisos[0] &&
        !permisos[1] &&
        !permisos[2] &&
        !permisos[3] &&
        !permisos[4]
      ) {
        setVisible(false);
      } else {
        setVisible(true);
        Listar(cadena, 1);
      }
    }
  }, [permisos]);
  useEffect(() => {
    GetPermisos("Personal", setPermisos);
  }, []);
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Personal/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(
      result.data.data.data.map((res) => ({
        nombreCompleto:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
        ...res,
      }))
    );
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/Personal/${id}`);
    setObjeto(result.data.data);
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
    setIndex(0);
    const newTimer = setTimeout(() => {
      Listar(cadena, 1);
    }, 200);
    setTimer(newTimer);
  };
  const FiltradoPaginado = (e) => {
    setIndex(e.selected);
    Listar(cadena, e.selected + 1);
  };
  //#endregion

  //#region Funciones Modal
  const AbrirModal = async (id, modo = "Registrar") => {
    setModo(modo);
    if (modo == "Registrar") {
      setObjeto({
        id: "00",
        numeroDocumentoIdentidad: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        nombres: "",
        departamentoId: "15",
        provinciaId: "01",
        distritoId: "01",
        direccion: "",
        telefono: "",
        celular: "",
        fechaNacimiento: moment().format("YYYY-MM-DD"),
        sexoId: "V",
        estadoCivilId: "SO",
        correoElectronico: "",
        cargoId: 2,
        observacion: "",
        entidadBancariaId: 1,
        tipoCuentaBancariaId: "AHORRO",
        monedaId: "S",
        cuentaCorriente: "",
        isActivo: true,
      });
    } else {
      await GetPorId(id);
    }
    setModal(true);
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
        Header: "Nombre",
        accessor: "nombreCompleto",
      },
      {
        Header: "DNI",
        accessor: "numeroDocumentoIdentidad",
      },
      {
        Header: "Cargo",
        accessor: "cargoDescripcion",
      },
      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <BotonCRUD
            setRespuestaAlert={setRespuestaAlert}
            permisos={permisos}
            menu={["Mantenimiento", "Personal"]}
            id={row.values.id}
            ClickConsultar={() => AbrirModal(row.values.id, "Consultar")}
            ClickModificar={() => AbrirModal(row.values.id, "Modificar")}
          />
        ),
      },
    ],
    [permisos]
  );
  //#endregion

  //#region Render
  return (
    <>
      {visible ? (
        <>
          <div className="px-2">
            <h2 className={Global.TituloH2}>Personal</h2>

            {/* Filtro*/}
            <FiltroBasico
              textLabel={"Nombre"}
              name={"nombre"}
              maxLength={"200"}
              placeHolder={"Nombre"}
              value={filtro.nombre}
              onChange={ValidarData}
              botonId={"buscar"}
              onClick={Filtro}
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
      ) : (
        <span></span>
      )}
    </>
  );
  //#endregion
};

export default Personal;
