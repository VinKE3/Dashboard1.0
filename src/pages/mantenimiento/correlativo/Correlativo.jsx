import { useEffect, useState, useMemo } from "react";
import ApiMasy from "../../../api/ApiMasy";
import GetPermisos from "../../../components/funciones/GetPermisos";
import Delete from "../../../components/funciones/Delete";
import BotonBasico from "../../../components/boton/BotonBasico";
import BotonCRUD from "../../../components/boton/BotonCRUD";
import Table from "../../../components/tabla/Table";
import Modal from "./Modal";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";
//#region Estilos
const TablaStyle = styled.div`
  & th:nth-child(3) {
    width: 150px;
  }
  & th:last-child {
    text-align: center;
    width: 100px;
    max-width: 100px;
  }
`;
//#endregion

const Correlativo = () => {
  //#region useState
  const [permisos, setPermisos] = useState([false, false, false, false, false]);
  const [visible, setVisible] = useState(false);
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  //Modal
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Nuevo");
  const [objeto, setObjeto] = useState([]);
  const [eliminar, setEliminar] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (visible) {
      if (!modal) {
        Listar("", index + 1);
      }
    }
  }, [modal]);
  useEffect(() => {
    if (eliminar) {
      Listar("", index + 1);
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
        Listar("", 1);
      }
    }
  }, [permisos]);
  useEffect(() => {
    GetPermisos("Correlativo", setPermisos);
  }, []);
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Correlativo/Listar?pagina=${pagina}${filtro}`
    );
    setDatos(result.data.data.data);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (tipoDocumentoId, serie) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Correlativo/${tipoDocumentoId}/${serie}`
    );
    setObjeto(result.data.data);
  };
  //#endregion

  //#region Funciones Filtrado
  const FiltradoPaginado = (e) => {
    setIndex(e.selected);
    Listar("", e.selected + 1);
  };
  //#endregion

  //#region Funciones Modal
  const AccionModal = async (value, serie, modo = "Nuevo", click = false) => {
    setModo(modo);
    if (click) {
      let row = value.target.closest("tr");
      let id = row.firstChild.innerText;
      let serie = row.children[2].innerText;
      await GetPorId(id, serie);
    } else {
      if (modo == "Nuevo") {
        setObjeto({
          tipoDocumentoId: "01",
          tipoDocumentoDescripcion: "",
          serie: "",
          numero: 0,
        });
      } else {
        await GetPorId(value, serie);
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
        .querySelector("#tablaCorrelativo")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        let serie = row.children[2].innerText;
        AccionModal(id, serie, "Modificar");
      }
    }
    if (e.key === "c") {
      let row = document
        .querySelector("#tablaCorrelativo")
        .querySelector("tr.selected-row");
      if (row != null) {
        let id = row.firstChild.innerText;
        let serie = row.children[2].innerText;
        AccionModal(id, serie, "Consultar");
      }
    }
  };
  //#endregion

  //#region Columnas
  const columnas = useMemo(
    () => [
      {
        Header: "Tipo Documento",
        accessor: "tipoDocumentoId",
      },
      {
        Header: "Descripción",
        accessor: "tipoDocumentoDescripcion",
      },
      {
        Header: "Serie",
        accessor: "serie",
      },
      {
        Header: "Número",
        accessor: "numero",
      },
      {
        Header: "Acciones",
        Cell: ({ row }) => (
          <BotonCRUD
            setEliminar={setEliminar}
            permisos={permisos}
            menu={["Mantenimiento", "Correlativo"]}
            id={""}
            ClickConsultar={() =>
              AccionModal(
                row.values.tipoDocumentoId,
                row.values.serie,
                "Consultar"
              )
            }
            ClickModificar={() =>
              AccionModal(
                row.values.tipoDocumentoId,
                row.values.serie,
                "Modificar"
              )
            }
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
            <h2 className={Global.TituloH2}>Correlativos</h2>

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
            <TablaStyle>
              <Table
                id={"tablaCorrelativo"}
                columnas={columnas}
                datos={datos}
                total={total}
                index={index}
                foco={true}
                Click={(e) => FiltradoPaginado(e)}
                DobleClick={(e) => AccionModal(e, null, "Consultar", true)}
                KeyDown={(e) => ModalKey(e)}
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

export default Correlativo;
