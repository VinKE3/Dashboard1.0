import { useEffect, useState } from "react";
import ApiMasy from "../../../api/ApiMasy";
import BotonBasico from "../../../components/BotonesComponent/BotonBasico";
import BotonCRUD from "../../../components/BotonesComponent/BotonCRUD";
import Table from "../../../components/tablas/Table";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import Modal from "./Modal";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../../../context/ContextAuth";
import "react-toastify/dist/ReactToastify.css";
import * as Global from "../../../components/Global";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(2){
    width: 150px;
  }
  & th:nth-child(4){
    width: 150px;
  }
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;
//#endregion

const Correlativos = () => {
  //#region useState
  const { usuario } = useAuth();
  const [datos, setDatos] = useState([]);
  const [total, setTotal] = useState(0);
  const [index, setIndex] = useState(0);
  const [permisos, setPermisos] = useState([true, true, true, true]);
  const [objeto, setObjeto] = useState([]);
  const [modal, setModal] = useState(false);
  const [modo, setModo] = useState("Registrar");
  const [respuestaAlert, setRespuestaAlert] = useState(false);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (usuario == "AD") {
      setPermisos([true, true, true, true]);
      Listar("", 1);
    } else {
      //Consulta a la Api para traer los permisos
    }
  }, [usuario]);
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
      Listar("", index + 1);
    }
  }, [modal]);
  useEffect(() => {
    if (respuestaAlert) {
      Listar("", index + 1);
    }
  }, [respuestaAlert]);
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
    let boton = e.selected + 1;
    setIndex(e.selected);
    Listar("", boton);
  };
  //#endregion

  //#region Funciones Modal
  const AbrirModal = async (tipoDocumentoId, serie, modo = "Registrar") => {
    setModo(modo);
    if (modo == "Registrar") {
      setObjeto({
        tipoDocumentoId: "01",
        tipoDocumentoDescripcion: "",
        serie: "",
        numero: 0,
      });
    } else {
      await GetPorId(tipoDocumentoId, serie);
    }
    setModal(true);
  };
  //#endregion

  //#region Columnas
  const columnas = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Tipo de Documento",
      accessor: "tipoDocumentoId",
    },
    {
      Header: "Tipo de Documento Descripción",
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
          setRespuestaAlert={setRespuestaAlert}
          permisos={permisos}
          menu={["Mantenimiento", "Correlativos"]}
          id={row.values.id}
          ClickConsultar={() =>
            AbrirModal(
              row.values.tipoDocumentoId,
              row.values.serie,
              "Consultar"
            )
          }
          ClickModificar={() =>
            AbrirModal(
              row.values.tipoDocumentoId,
              row.values.serie,
              "Modificar"
            )
          }
        />
      ),
    },
  ];
  //#endregion

  //#region Render
  return (
    <>
      <div className="px-2">
        <h2 className={Global.TituloH2}>Correlativos</h2>

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

export default Correlativos;
