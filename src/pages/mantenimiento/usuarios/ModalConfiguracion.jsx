import React, { useState, useEffect } from "react";
import ModalBasic from "../../../components/ModalBasic";
import ApiMasy from "../../../api/ApiMasy";
import * as Global from "../../../components/Global";
import { Checkbox } from "primereact/checkbox";
import { Accordion, AccordionTab } from "primereact/accordion";
import { SelectButton } from "primereact/selectbutton";
import { useMenu } from "../../../context/ContextMenu";
import Mensajes from "../../../components/Mensajes";
import { useCallback } from "react";

const ModalConfiguracion = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [dataTipoUsuario, setDataTipoUsuario] = useState([]);
  const [permisos, setPermisos] = useState({}); //Listado general de permisos
  const [selectedMenu, setSelectedMenu] = useState(""); //Menu seleccionado
  const [selectedButton, setSelectedButton] = useState([]); //Listado de botones seleccionados
  const [checked, setChecked] = useState(false);
  const { getMenu, menu } = useMenu();
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (selectedMenu != "") {
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
          const model = {
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
            permisos: [...prevData.permisos, model],
          };
        }
      });
    }
  }, [selectedButton]);

  useEffect(() => {
    if (Object.entries(data).length > 0) {
      if (document.getElementById("tipoUsuarioId")) {
        document.getElementById("tipoUsuarioId").value = data.tipoUsuarioId;
      }
    }
  }, [dataTipoUsuario]);

  useEffect(() => {
    getMenu();
    Tablas();
    data;
    ListadoPermisos();
  }, []);
  //#endregion

  //#region Funciones
  const listaBotones = [
    { name: "Registrar", value: "registrar", id: "registrar" },
    { name: "Modificar", value: "modificar", id: "modificar" },
    { name: "Eliminar", value: "eliminar", id: "eliminar" },
    { name: "Consultar", value: "consultar", id: "consultar" },
    { name: "Anular", value: "anular", id: "anular" },
  ];
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
    setData({
      ...data,
      [target.name]: uppercase(target.value),
    });
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
  function uppercase(value) {
    if (value && typeof value === "string") {
      return value.toUpperCase();
    }
    return value;
  }
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
        <ModalBasic
          setModal={setModal}
          setRespuestaModal={setRespuestaModal}
          objeto={data}
          modo={modo}
          menu={["Mantenimiento", "UsuarioPermiso"]}
          titulo="Configuración de Permisos"
          tamañoModal={[Global.ModalGrande, Global.FormGrande]}
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

          <div className={Global.ContenedorVarios}>
            <div className={Global.ContenedorInputMitad}>
              <label htmlFor="tipoUsuarioId" className={Global.LabelStyle}>
                Tipo de Usuario
              </label>
              <select
                id="tipoUsuarioId"
                name="tipoUsuarioId"
                onChange={ValidarData}
                className={Global.InputStyle}
              >
                {dataTipoUsuario.map((tipoUsuario) => (
                  <option key={tipoUsuario.id} value={tipoUsuario.id}>
                    {tipoUsuario.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <div className={Global.ContenedorInputMitad}>
              <label htmlFor="menus" className={Global.LabelStyle}>
                Menú:
              </label>
              <input
                type="text"
                id="menus"
                name="menus"
                value={selectedMenu}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
          </div>

          <div className="flex justify-between py-2">
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

            <div className="flex max-h-11">
              <div className={Global.CheckStyle}>
                <Checkbox
                  inputId="all"
                  onChange={(e) => {
                    setChecked(e.checked);
                    ValidarCheckTodos(e.checked);
                  }}
                  checked={checked}
                ></Checkbox>
              </div>
              <label htmlFor="all" className={Global.LabelCheckStyle}>
                Todos
              </label>
            </div>
          </div>

          <div>
            <div className="card mt-4">
              <Accordion>
                <AccordionTab
                  header={
                    <div className="flex align-items-center">
                      <span className=" vertical-align-middle">Menus</span>
                      <i className="pi pi-cog ml-2"></i>
                    </div>
                  }
                >
                  <ul>
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
            </div>
          </div>
        </ModalBasic>
      )}
    </>
  );
  //#endregion
};

export default ModalConfiguracion;
