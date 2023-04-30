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
import * as Global from "../../../components/Global";
import store from "store2";
import GetUsuarioId from "../../../components/CRUD/GetUsuarioId";
//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:nth-child(6) {
    text-align: right;
    width: 90px;
  }
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;
//#endregion

const CuentasCorrientes = () => {
  //#region useState
  const [visible, setVisible] = useState(false);
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

  //#region useEffect;
  useEffect(() => {
    if (visible) {
      if (!modal) {
        Listar("", index + 1);
      }
    }
  }, [modal]);
  useEffect(() => {
    if (respuestaAlert) {
      Listar("", index + 1);
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
        Listar("", 1);
      }
    }
  }, [permisos]);
  useEffect(() => {
    if (store.session.get("usuario") == "AD") {
      setVisible(true);
      setPermisos([true, true, true, true, true]);
      Listar("", 1);
    } else {
      GetPermisos();
    }
  }, []);
  //#endregion

  //#region Funciones API
  const Listar = async (filtro = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/CuentaCorriente/Listar?pagina=${pagina}${filtro}`
    );
    let model = result.data.data.data.map((res) => ({
      id: res.empresaId + res.cuentaCorrienteId,
      empresaId: res.empresaId,
      cuentaCorrienteId: res.cuentaCorrienteId,
      entidadBancariaNombre: res.entidadBancariaNombre,
      entidadBancariaTipo: res.entidadBancariaTipo,
      monedaId: res.monedaId,
      numero: res.numero,
      saldoFinal: res.saldoFinal,
      tipoCuentaDescripcion: res.tipoCuentaDescripcion,
    }));
    setDatos(model);
    setTotal(result.data.data.total);
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(`api/Mantenimiento/CuentaCorriente/${id}`);
    setObjeto(result.data.data);
  };
  const GetPermisos = async () => {
    const result = await GetUsuarioId(
      store.session.get("usuarioId"),
      "CuentaCorriente"
    );
    setPermisos([
      result.registrar,
      result.modificar,
      result.eliminar,
      result.consultar,
      result.anular,
    ]);
  };
  //#endregion

  //#region Funciones Filtrado
  const FiltradoPaginado = (e) => {
    let filtro = document.getElementById("numero").value;
    let boton = e.selected + 1;
    setIndex(e.selected);
    if (filtro == "") {
      Listar("", boton);
    } else {
      Listar(`&numero=${filtro}`, boton);
    }
  };
  const onChange = async (e) => {
    clearTimeout(timer);
    let f = e.target.value;
    setFiltro(`&numero=${f}`);
    if (f != "") setIndex(0);
    const newTimer = setTimeout(() => {
      if (f == "") {
        Listar("", index + 1);
      } else {
        Listar(`&numero=${f}`, index + 1);
      }
    }, 200);
    setTimer(newTimer);
  };
  const onClick = () => {
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
      setObjeto({
        id: "0100",
        cuentaCorrienteId: "0000",
        empresaId: "01",
        entidadBancaria: "",
        entidadBancariaId: 1,
        moneda: "",
        monedaId: "S",
        numero: "",
        observacion: "",
        tipoCuentaDescripcion: "CORRIENTE",
      });
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
    },
    {
      Header: "Saldo Final",
      accessor: "saldoFinal",
      Cell: ({ value }) => <span className="flex justify-end">{value}</span>,
    },
    {
      Header: "Acciones",
      Cell: ({ row }) => (
        <BotonCRUD
          setRespuestaAlert={setRespuestaAlert}
          permisos={permisos}
          menu={["Mantenimiento", "CuentaCorriente"]}
          id={row.values.id}
          ClickConsultar={() => AbrirModal(row.values.id, "Consultar")}
          ClickModificar={() => AbrirModal(row.values.id, "Modificar")}
        />
      ),
    },
  ];
  //#endregion

  //#region Render
  return (
    <>
      {visible ? (
        <>
          <div className="px-2">
            <h2 className={Global.TituloH2}>Cuentas Corrientes</h2>

            {/* Filtro*/}
            <FiltroBasico
              textLabel={"Número de Cuenta"}
              placeHolder={"Número de Cuenta"}
              name={"numero"}
              maxLength={"40"}
              botonId={"buscar"}
              onClick={onClick}
              onChange={onChange}
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

export default CuentasCorrientes;
