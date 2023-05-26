import { useEffect, useState, useMemo } from "react";
import store from "store2";
import ApiMasy from "../../api/ApiMasy";
import ModalBasic from "../modal/ModalBasic";
import TableBasic from "../tabla/TableBasic";
import { FaSearch, FaCheck } from "react-icons/fa";
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
    width: 120px;
  }
  & th:last-child {
    width: 40px;
    text-align: center;
  }
`;
//#endregion

const FiltroCliente = ({ setModal, setObjeto, foco }) => {
  //#region useState
  const [datos, setDatos] = useState([]);
  const [timer, setTimer] = useState(null);
  const [filtro, setFiltro] = useState({
    numeroDocumentoIdentidad: "",
    nombre: "",
  });
  const [cadena, setCadena] = useState(
    `&numeroDocumentoIdentidad=${filtro.numeroDocumentoIdentidad}&nombre=${filtro.nombre}`
  );
  //#endregion

  //#region useEffect;
  useEffect(() => {
    setCadena(
      `&numeroDocumentoIdentidad=${filtro.numeroDocumentoIdentidad}&nombre=${filtro.nombre}`
    );
  }, [filtro]);
  useEffect(() => {
    Filtro();
  }, [cadena]);
  useEffect(() => {
    Listar(cadena, 1);
  }, []);
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
  const Key = async (e) => {
    if (e.key == "Escape") {
      foco.focus();
      setModal(false);
    }
  };
  const KeyTabla = async (e, click = false) => {
    if (e.key === "Enter") {
      let row = document
        .querySelector("#tablaFiltroCliente")
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
  const Listar = async (f = "", pagina = 1) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Cliente/Listar?pagina=${pagina}${f}`
    );
    setDatos(result.data.data.data.filter((res) => res.id !== "000000"));
  };
  const GetPorId = async (id) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Cliente/${id}?incluirReferencias=${true}`
    );
    let personalId;
    let personalDefault = result.data.data.personal.find(
      (map) => map.default == true
    );
    if (personalDefault == undefined) {
      //Obtiene el personal del usuario logeado
      personalId = store.session.get("personalId");
    } else {
      //Asigna el personal por default del cliente
      personalId = personalDefault.personalId;
    }

    setObjeto({
      clienteId: result.data.data.id,
      clienteTipoDocumentoIdentidadId:
        result.data.data.tipoDocumentoIdentidadId,
      clienteNumeroDocumentoIdentidad:
        result.data.data.numeroDocumentoIdentidad,
      clienteNombre: result.data.data.nombre,
      clienteDireccionId: result.data.data.direccionPrincipalId,
      clienteDireccion: result.data.data.direccionPrincipal,
      direcciones: result.data.data.direcciones,
      personalId: personalId,
      tipoVentaId: result.data.data.tipoVentaId,
      tipoCobroId: result.data.data.tipoCobroId,
      //Cotizacion
      clienteTelefono: result.data.data.telefono,
      contactos: result.data.data.contactos,
      //Cotizacion
      //Retencion

      //Retencion
    });
    foco.focus();
    setModal(false);
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
        Header: "N° Documento",
        accessor: "numeroDocumentoIdentidad",
      },
      {
        Header: "Nombre",
        accessor: "nombre",
      },
      {
        Header: " ",
        Cell: ({ row }) => (
          <button
            id="boton"
            onClick={() => GetPorId(row.values.id)}
            className={
              Global.BotonModalBase + Global.BotonAgregar + "border-none"
            }
          >
            <FaCheck></FaCheck>
          </button>
        ),
      },
    ],
    [datos]
  );
  //#endregion

  //#region Render
  return (
    <>
      <ModalBasic
        setModal={setModal}
        objeto={[]}
        modo={""}
        menu={["", ""]}
        titulo="Consultar Clientes"
        tamañoModal={[Global.ModalMediano, Global.Form]}
        childrenFooter={
          <>
            {/* <button
              className={
                Global.BotonOkModal + " flex items-center justify-center"
              }
              type="button"
            >
              <FaPlus></FaPlus>
              <p className="pl-2">Nuevo</p>
            </button> */}
            <button
              type="button"
              onClick={() => setModal(false)}
              className={Global.BotonModalBase + Global.BotonCancelarModal}
            >
              CERRAR
            </button>
          </>
        }
      >
        {
          <div className={Global.ContenedorBasico}>
            <div className={Global.ContenedorInputs + "mb-2"}>
              <div className={Global.Input60pct}>
                <label
                  htmlFor="numeroDocumentoIdentidad"
                  className={Global.LabelStyle}
                >
                  N° Documento
                </label>
                <input
                  type="text"
                  id="numeroDocumentoIdentidad"
                  name="numeroDocumentoIdentidad"
                  placeholder="N° Documento"
                  autoComplete="off"
                  autoFocus
                  value={filtro.numeroDocumentoIdentidad}
                  onChange={ValidarData}
                  onKeyDown={(e) => Key(e)}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.InputFull}>
                <label htmlFor="nombre" className={Global.LabelStyle}>
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Nombre"
                  autoComplete="off"
                  value={filtro.nombre}
                  onChange={ValidarData}
                  onKeyDown={(e) => Key(e)}
                  className={Global.InputStyle}
                />
                {/* <button
                  id="consultarClienteFiltro"
                  onClick={Filtro}
                  className={
                    Global.BotonBuscar + Global.Anidado + Global.BotonPrimary
                  }
                >
                  <FaSearch></FaSearch>
                </button> */}
              </div>
            </div>

            {/* Tabla */}
            <TablaStyle>
              <TableBasic
                id="tablaFiltroCliente"
                columnas={columnas}
                datos={datos}
                DobleClick={(e) => KeyTabla(e, true)}
                KeyDown={(e) => KeyTabla(e)}
              />
            </TablaStyle>
            {/* Tabla */}
          </div>
        }
      </ModalBasic>
    </>
  );
  //#endregion
};

export default FiltroCliente;
