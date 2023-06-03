import React, { useState, useEffect } from "react";
import ModalCrud from "../../../components/modal/ModalCrud";
import ApiMasy from "../../../api/ApiMasy";
import * as G from "../../../components/Global";
import { Checkbox } from "primereact/checkbox";
import { Accordion, AccordionTab } from "primereact/accordion";
import { SelectButton } from "primereact/selectbutton";
import { useMenu } from "../../../context/ContextMenu";
import Mensajes from "../../../components/funciones/Mensajes";
import { useCallback } from "react";
import { ScrollTop } from "primereact/scrolltop";
const ModalConfiguracion = ({ setModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataTipoUsuario, setDataTipoUsuario] = useState([]);
  const [permisos, setPermisos] = useState({}); //Listado general de permisos
  const [selectedMenu, setSelectedMenu] = useState(""); //Menu seleccionado
  const [selectedButton, setSelectedButton] = useState([]); //Listado de botones seleccionados
  const [checked, setChecked] = useState(false);
  const { getMenu, menu } = useMenu();
  const [listaBotones, setListaBotones] = useState([
    { name: "Registrar", value: "registrar", id: "registrar", disabled: false },
    { name: "Modificar", value: "modificar", id: "modificar", disabled: false },
    { name: "Eliminar", value: "eliminar", id: "eliminar", disabled: false },
    { name: "Consultar", value: "consultar", id: "consultar", disabled: false },
    { name: "Anular", value: "anular", id: "anular", disabled: false },
  ]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    PermisosTipoUsuario(data.tipoUsuarioId);
  }, [data.tipoUsuarioId]);

  useEffect(() => {
    if (selectedButton.length > 0 && selectedMenu !== "") {
      setData((prevData) => {
        const model = prevData.permisos.find(
          (permiso) => permiso.menuId === selectedMenu
        );
        if (model) {
          return {
            ...prevData,
            permisos: prevData.permisos.map((permiso) =>
              permiso.menuId === selectedMenu
                ? {
                    ...permiso,
                    registrar: selectedButton.includes("registrar"),
                    modificar: selectedButton.includes("modificar"),
                    eliminar: selectedButton.includes("eliminar"),
                    consultar: selectedButton.includes("consultar"),
                    anular: selectedButton.includes("anular"),
                  }
                : permiso
            ),
          };
        } else {
          const newModel = {
            menuId: selectedMenu,
            usuarioId: data.usuarioId,
            registrar: selectedButton.includes("registrar"),
            modificar: selectedButton.includes("modificar"),
            eliminar: selectedButton.includes("eliminar"),
            consultar: selectedButton.includes("consultar"),
            anular: selectedButton.includes("anular"),
          };
          return {
            ...prevData,
            permisos: [...prevData.permisos, newModel],
          };
        }
      });
    }
  }, [selectedButton, selectedMenu]);

  useEffect(() => {
    getMenu();
    Tablas();
    ListadoPermisos();
  }, []);

  //#endregion

  //#region Funciones
  const listaPermisos = [
    "registrar",
    "modificar",
    "eliminar",
    "consultar",
    "anular",
  ];
  const ListadoPermisos = useCallback(() => {
    setPermisos((prev) => {
      const model = {};
      data.permisos.forEach((permiso) => {
        const per = Object.keys(permiso)
          .filter((p) => listaPermisos.includes(p) && permiso[p])
          .map((p) => p);
        model[permiso.menuId] = per;
      });
      return {
        ...prev,
        ...model,
      };
    });
  }, [data, setPermisos]);

  const ValidarData = ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };
  const ValidarCheckTodos = (check) => {
    if (check) {
      setSelectedButton(listaBotones.map((item) => item.value));
    } else {
      setSelectedButton([]);
    }
    setChecked(check);
    setPermisos((prev) => ({
      ...prev,
      [selectedMenu]: check ? listaBotones.map((item) => item.value) : [],
    }));
  };
  const ValidarMenu = (e) => {
    setSelectedMenu(e.target.innerText);
  };
  const PermisosTipoUsuario = (tipoUsuario) => {
    let update = [];
    // //? MANTENIMIENTO
    if (data.tipoUsuarioId === "MA") {
      const habilitarPermisosDeTodosLosMenus = data.permisos.map((permiso) => ({
        ...permiso,
        registrar: true,
        modificar: true,
        eliminar: true,
        consultar: true,
        anular: false,
      }));
      update = listaBotones.map((boton) => ({
        ...boton,
        disabled: true,
      }));
      setData((prevData) => ({
        ...prevData,
        permisos: habilitarPermisosDeTodosLosMenus,
      }));
      setSelectedButton(["registrar", "modificar", "eliminar", "consultar"]);
    }
    //? ADMINISTRADOR
    else if (tipoUsuario === "AD") {
      const habilitarPermisosDeTodosLosMenus = data.permisos.map((permiso) => ({
        ...permiso,
        registrar: true,
        modificar: true,
        eliminar: true,
        consultar: true,
        anular: true,
      }));
      update = listaBotones.map((boton) => ({
        ...boton,
        disabled: true,
      }));
      setData((prevData) => ({
        ...prevData,
        permisos: habilitarPermisosDeTodosLosMenus,
      }));
      setSelectedButton([
        "registrar",
        "modificar",
        "eliminar",
        "consultar",
        "anular",
      ]);
    }

    // //? CONSULTA
    else if (data.tipoUsuarioId === "CO") {
      update = listaBotones.map((boton) => ({
        ...boton,
        disabled: true,
      }));
      const habilitarPermisosDeTodosLosMenus = data.permisos.map((permiso) => ({
        ...permiso,
        registrar: false,
        modificar: false,
        eliminar: false,
        consultar: true,
        anular: false,
      }));
      setData((prevData) => ({
        ...prevData,
        permisos: habilitarPermisosDeTodosLosMenus,
      }));
      setSelectedButton(["consultar"]);
    }
    //?NO PERMISOS
    else if (tipoUsuario === "NO") {
      update = listaBotones.map((boton) => ({
        ...boton,
        disabled: true,
      }));
      const borrarPermisosDeTodosLosMenus = data.permisos.map((permiso) => ({
        ...permiso,
        registrar: false,
        modificar: false,
        eliminar: false,
        consultar: false,
        anular: false,
      }));
      setData((prevData) => ({
        ...prevData,
        permisos: borrarPermisosDeTodosLosMenus,
      }));
      setSelectedButton([]);
    }
    //?PERSONALIZADO
    else if (tipoUsuario === "PE") {
      update = listaBotones.map((boton) => ({
        ...boton,
        disabled: false,
      }));
    }
    setListaBotones(update);
  };
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/UsuarioPermiso/FormularioTablas`
    );
    setDataTipoUsuario(result.data.data.tiposUsuario);
  };
  //#endregion

  //#region Render
  return (
    <>
      {Object.entries(dataTipoUsuario).length > 0 && (
        <ModalCrud
          setModal={setModal}
          objeto={data}
          modo={modo}
          menu={["Mantenimiento", "UsuarioPermiso"]}
          titulo="Configuración de Permisos"
          tamañoModal={[G.ModalMediano, G.Form]}
          foco={document.getElementById("nickFiltro")}
        >
          <Mensajes
            tipoMensaje={2}
            mensaje={[
              "NO CONFIGURADO: No contiene ningún permiso (no configurable).",
              "ADMINISTRADOR: Se le concede todos los permisos (no configurable).",
              "MANTENIMIENTO: Se le concede todos los permisos, excepto el Anular (no configurable).",
              "CONSULTA: Se le concede los permisos de Consultar y Refrescar (no configurable).",
              "PERSONALIZADO: Se le concede los permisos asignados de la parte inferior (configurable).",
            ]}
            cerrar={false}
          />

          <div className={G.ContenedorBasico}>
            <div className={G.ContenedorInputs}>
              <div className={G.InputMitad}>
                <label htmlFor="tipoUsuarioId" className={G.LabelStyle}>
                  Tipo de Usuario
                </label>
                <select
                  id="tipoUsuarioId"
                  name="tipoUsuarioId"
                  value={data.tipoUsuarioId ?? ""}
                  autoFocus
                  onChange={ValidarData}
                  className={G.InputStyle}
                >
                  {dataTipoUsuario.map((map) => (
                    <option key={map.id} value={map.id}>
                      {map.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div className={G.InputMitad}>
                <label htmlFor="menus" className={G.LabelStyle}>
                  Menú:
                </label>
                <input
                  type="text"
                  id="menus"
                  name="menus"
                  value={selectedMenu}
                  onChange={ValidarData}
                  className={G.InputStyle}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <SelectButton
                value={permisos[selectedMenu] || []}
                optionLabel="name"
                options={listaBotones}
                multiple
                onChange={(e) => {
                  setPermisos((prev) => ({
                    ...prev,
                    [selectedMenu]: e.value,
                  }));
                  setSelectedButton(e.value);
                  setChecked(e.value.length === listaBotones.length);
                }}
              />

              <div className={G.Input}>
                <div className={G.CheckStyle}>
                  <Checkbox
                    disabled={data.tipoUsuarioId != "PE"}
                    inputId="all"
                    onChange={(e) => {
                      setChecked(e.checked);
                      ValidarCheckTodos(e.checked);
                    }}
                    checked={checked}
                  />
                </div>
                <label htmlFor="all" className={G.LabelCheckStyle}>
                  Todos
                </label>
              </div>
            </div>
            <div className="card mt-4 ">
              <div style={{ width: "auto", height: "500px", overflow: "auto" }}>
                <Accordion>
                  <AccordionTab
                    header={
                      <div className="flex align-items-center">
                        <span className=" vertical-align-middle">Menus</span>
                        <i className="pi pi-cog ml-2"></i>
                      </div>
                    }
                  >
                    <ul className="overflow-y-auto">
                      {menu.map((item) => (
                        <li
                          className="mb-2 hover:text-primary border-b hover:border-primary cursor-pointer"
                          key={item.id}
                          onClick={ValidarMenu}
                        >
                          <button type="button" onClick={ValidarMenu}>
                            {item.nombre}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </AccordionTab>
                </Accordion>
                <ScrollTop
                  target="parent"
                  threshold={100}
                  className="w-2rem h-2rem border-round-md bg-primary"
                  icon="pi pi-arrow-up text-base"
                />
              </div>
            </div>
          </div>
        </ModalCrud>
      )}
    </>
  );
  //#endregion
};

export default ModalConfiguracion;
