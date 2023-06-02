import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../api/ApiMasy";
import GetPermisos from "../../components/funciones/GetPermisos";
import Delete from "../../components/funciones/Delete";
import BotonBasico from "../../components/boton/BotonBasico";
import BotonCRUD from "../../components/boton/BotonCRUD";
import Table from "../../components/tabla/Table";
import FiltroBasico from "../../components/filtro/FiltroBasico";
import { Checkbox } from "primereact/checkbox";
import Modal from "./Modal";
import { ToastContainer } from "react-toastify";
import moment from "moment";
import styled from "styled-components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../components/Global";
//#region Estilos
const DivTabla = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(5) {
    width: 35px;
    text-align: center;
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
  const [modo, setModo] = useState("Nuevo");
  const [objeto, setObjeto] = useState([]);
  const [eliminar, setEliminar] = useState(false);
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
    if (eliminar) {
      Listar(cadena, index + 1);
    }
  }, [eliminar]);

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
  const FiltroBoton = async () => {
    setFiltro({
      nombre: "",
    });
    setIndex(0);
    document.getElementById("nombre").focus();
  };
  const FiltradoPaginado = (e) => {
    setIndex(e.selected);
    Listar(cadena, e.selected + 1);
  };
  //#endregion

  //#region Funciones Modal
  const AccionModal = async (value, modo = "Nuevo", click = false) => {
    setModo(modo);
    if (click) {
      let row = value.target.closest("tr");
      let id = row.firstChild.innerText;
      await GetPorId(id);
    } else {
      if (modo == "Nuevo") {
        setObjeto({
          id: "",
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
        await GetPorId(value);
      }
    }
    setModal(true);
  };
  const ModalKey = async (e) => {
    if (e.key === "n") {
      AccionModal();
    }
    if (e.key === "Enter") {
      let row = document
        .querySelector("#tablaPersonal")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Modificar");
      }
    }
    if (e.key === "Delete") {
      let row = document
        .querySelector("#tablaPersonal")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        Delete(["Mantenimiento", "Cliente"], id, setEliminar);
      }
    }
    if (e.key === "c") {
      let row = document
        .querySelector("#tablaPersonal")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Consultar");
      }
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
        Header: "A",
        accessor: "isActivo",
        Cell: ({ value }) => {
          return (
            <div className="flex justify-center">
              <Checkbox checked={value} />
            </div>
          );
        },
      },
      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <BotonCRUD
            setEliminar={setEliminar}
            permisos={permisos}
            menu={["Mantenimiento", "Personal"]}
            id={row.values.id}
            ClickConsultar={() => AccionModal(row.values.id, "Consultar")}
            ClickModificar={() => AccionModal(row.values.id, "Modificar")}
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
           <div className={Global.ContenedorPadre}>
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
              onClick={FiltroBoton}
            />
            {/* Filtro*/}

            {/* Boton */}
            {permisos[0] && (
              <BotonBasico
                botonText="Nuevo"
                botonClass={Global.BotonRegistrar}
                botonIcon={faPlus}
                click={() => AccionModal()}
                contenedor=""
              />
            )}
            {/* Boton */}

            {/* Tabla */}
            <DivTabla>
              <Table
                id={"tablaPersonal"}
                columnas={columnas}
                datos={datos}
                total={total}
                index={index}
                Click={(e) => FiltradoPaginado(e)}
                DobleClick={(e) => AccionModal(e, "Consultar", true)}
                KeyDown={(e) => ModalKey(e)}
              />
            </DivTabla>
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
