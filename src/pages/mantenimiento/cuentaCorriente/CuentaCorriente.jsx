import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import ApiMasy from "../../../api/ApiMasy";
import * as G from "../../../components/Global";
import BotonBasico from "../../../components/boton/BotonBasico";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import FiltroBasico from "../../../components/filtro/FiltroBasico";
import Delete from "../../../components/funciones/Delete";
import GetPermisos from "../../../components/funciones/GetPermisos";
import Table from "../../../components/tabla/Table";
import Modal from "./Modal";

//#region Estilos
const DivTabla = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(5) {
    text-align: center;
    width: 60px;
  }
  & th:nth-child(6) {
    text-align: right;
    width: 100px;
  }
  & th:last-child {
    text-align: center;
    width: 100px;
    max-width: 100px;
  }
`;
//#endregion

const CuentaCorriente = () => {
  //#region useState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    numero: "",
  });
  const [cadena, setCadena] = useState(`&numero=${filtro.numero}`);
  //Modal
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Nuevo");
  const [objeto, setObjeto] = useState([]);
  const [listar, setListar] = useState(false);
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(`&numero=${filtro.numero}`);
  }, [filtro]);
  useEffect(() => {
    if (visible) {
      Filtro();
    }
  }, [cadena]);

  useEffect(() => {
    if (visible) {
      if (!modal) {
        Listar(cadena, index + 1);
      }
    }
  }, [modal]);
  useEffect(() => {
    if (listar) {
      setListar(false);
      Listar(cadena, index + 1);
    }
  }, [listar]);

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
    GetPermisos("CuentaCorriente", setPermisos);
  }, []);
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/CuentaCorriente/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(
      result.data.data.data.map((res) => ({
        id: res.empresaId + res.cuentaCorrienteId,
        ...res,
      }))
    );
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/CuentaCorriente/${id}`);
    setObjeto(result.data.data);
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
    setIndex(0);
    const newTimer = setTimeout(() => {
      Listar(cadena, 1);
    }, 200);
    setTimer(newTimer);
  };
  const FiltroBoton = async () => {
    setFiltro({
      numero: "",
    });
    setIndex(0);
    document.getElementById("numero").focus();
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
          empresaId: "",
          cuentaCorrienteId: "",
          entidadBancariaId: 0,
          numero: "",
          tipoCuentaDescripcion: "",
          monedaId: "",
          observacion: "",
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
        .querySelector("#tablaCuentaCorriente")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        AccionModal(id, "Modificar");
      }
    }
    if (e.key === "Delete") {
      let row = document
        .querySelector("#tablaCuentaCorriente")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        Delete("Mantenimiento/CuentaCorriente", id, setListar);
      }
    }
    if (e.key === "c") {
      let row = document
        .querySelector("#tablaCuentaCorriente")
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
        Header: "Código",
        accessor: "id",
      },
      {
        Header: "Número Cuenta",
        accessor: "numero",
      },
      {
        Header: "Tipo Cuenta",
        accessor: "tipoCuentaDescripcion",
      },
      {
        Header: "Entidad Bancaria",
        accessor: "entidadBancariaNombre",
      },
      {
        Header: "M",
        accessor: "monedaId",
        Cell: ({ value }) => {
          return <p className="text-center">{value == "S" ? "S/." : "US$"}</p>;
        },
      },
      {
        Header: "Saldo Final",
        accessor: "saldoFinal",
        Cell: ({ value }) => <p className="text-right">{value}</p>,
      },
      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <BotonCRUD
            setListar={setListar}
            permisos={permisos}
            menu={"Mantenimiento/CuentaCorriente"}
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
          <div className={G.ContenedorPadre}>
            <h2 className={G.TituloH2}>Cuentas Corrientes</h2>

            {/* Filtro*/}
            <FiltroBasico
              textLabel={"Número de Cuenta"}
              placeHolder={"Número de Cuenta"}
              name={"numero"}
              maxLength={"40"}
              value={filtro.numero}
              onChange={HandleData}
              botonId={"buscar"}
              onClick={FiltroBoton}
            />
            {/* Filtro*/}

            {/* Boton */}
            {permisos[0] && (
              <BotonBasico
                botonText="Nuevo"
                botonClass={G.BotonAzul}
                botonIcon={faPlus}
                click={() => AccionModal()}
                contenedor=""
              />
            )}
            {/* Boton */}

            {/* Tabla */}
            <DivTabla>
              <Table
                id={"tablaCuentaCorriente"}
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

export default CuentaCorriente;
