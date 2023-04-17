import React, { useState, useEffect } from "react";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../components/Global";
import ApiMasy from "../../../api/ApiMasy";
import { Accordion, AccordionTab } from "primereact/accordion";
import { SelectButton } from "primereact/selectbutton";
import { useMenu } from "../../../context/ContextMenu";
import { Checkbox } from "primereact/checkbox";
import Mensajes from "../../../components/Mensajes";
import { useCallback } from "react";

const ModalConfiguracion = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const { getMenu, menu } = useMenu();
  const [selectedMenu, setSelectedMenu] = useState("");
  const [value, setValue] = useState([]);
  const botones = [
    { name: "Registrar", value: "registrar", id: "registrar" },
    { name: "Modificar", value: "modificar", id: "modificar" },
    { name: "Eliminar", value: "eliminar", id: "eliminar" },
    { name: "Consultar", value: "consultar", id: "consultar" },
    { name: "Anular", value: "anular", id: "anular" },
  ];
  const [checked, setChecked] = useState(false);
  const [selectedActions, setSelectedActions] = useState({});
  const [dataTipoUsuario, setDataTipoUsuario] = useState([]);
  const [tipoUsuarioId, setTipoUsuarioId] = useState("");
  const [dataPermisos, setDataPermisos] = useState({
    registrar: false,
    modificar: false,
    eliminar: false,
    consultar: false,
    anular: false,
    menuId: "",
    usuarioId: "",
  });

  //#endregion
  const convertirASelectActions = useCallback(() => {
    const permisosValidos = [
      "registrar",
      "modificar",
      "eliminar",
      "consultar",
      "anular",
    ];
    setSelectedActions((prev) => {
      const newSelectedActions = {};
      data.permisos.forEach((permiso) => {
        const per = Object.keys(permiso)
          .filter((p) => permisosValidos.includes(p) && permiso[p])
          .map((p) => p);
        newSelectedActions[permiso.menuId] = per;
      });
      return {
        ...prev,
        ...newSelectedActions,
      };
    });
  }, [data, setSelectedActions]);

  //#region useEffect
  useEffect(() => {
    if (Object.entries(value).length > 0) {
      setData((prevData) => {
        const existingPermiso = prevData.permisos.find(
          (permiso) => permiso.menuId === selectedMenu
        );
        if (existingPermiso) {
          return {
            ...prevData,
            permisos: prevData.permisos.map((permiso) =>
              permiso.menuId === selectedMenu
                ? {
                    ...permiso,
                    registrar: value.includes("registrar"),
                    modificar: value.includes("modificar"),
                    eliminar: value.includes("eliminar"),
                    consultar: value.includes("consultar"),
                    anular: value.includes("anular"),
                  }
                : permiso
            ),
          };
        } else {
          const newPermiso = {
            menuId: selectedMenu,
            usuarioId: data.usuarioId,
            registrar: value.includes("registrar"),
            modificar: value.includes("modificar"),
            eliminar: value.includes("eliminar"),
            consultar: value.includes("consultar"),
            anular: value.includes("anular"),
          };

          return {
            ...prevData,
            permisos: [...prevData.permisos, newPermiso],
          };
        }
      });
    }
  }, [value]);

  // useEffect(() => {
  //   if (Object.entries(value).length > 0) {
  //     setData((prevData) => {
  //       // Check if the user already has permissions for the selected menu
  //       const permissionsExist = prevData.permisos.some(
  //         (permiso) => permiso.menuId === selectedMenu
  //       );

  //       // If the user doesn't have permissions for the selected menu, add a new permission object to the array
  //       if (!permissionsExist) {
  //         const newPermiso = {
  //           menuId: selectedMenu,
  //           usuarioId: data.usuarioId,
  //           registrar: value.includes("registrar"),
  //           modificar: value.includes("modificar"),
  //           eliminar: value.includes("eliminar"),
  //           consultar: value.includes("consultar"),
  //           anular: value.includes("anular"),
  //         };

  //         return {
  //           ...prevData,
  //           permisos: [...prevData.permisos, newPermiso],
  //         };
  //       }

  //       // If the user already has permissions for the selected menu, update the existing permission object
  //       return {
  //         ...prevData,
  //         permisos: prevData.permisos.map((permiso) =>
  //           permiso.menuId === selectedMenu
  //             ? {
  //                 ...permiso,
  //                 registrar: value.includes("registrar"),
  //                 modificar: value.includes("modificar"),
  //                 eliminar: value.includes("eliminar"),
  //                 consultar: value.includes("consultar"),
  //                 anular: value.includes("anular"),
  //               }
  //             : permiso
  //         ),
  //       };
  //     });
  //   }
  // }, [value]);

  useEffect(() => {
    selectedMenu;
    setDataPermisos(data.permisos.find((x) => x.menuId === selectedMenu));
  }, [selectedMenu]);

  useEffect(() => {
    dataPermisos;
  }, [dataPermisos]);

  useEffect(() => {
    data;
    if (Object.entries(data).length > 0) {
      if (document.getElementById("tipoUsuarioId")) {
        document.getElementById("tipoUsuarioId").value = data.tipoUsuarioId;
      }
    }
    console.log(data);
  }, [data]);

  useEffect(() => {
    setTipoUsuarioId(data.tipoUsuarioId);
  }, [data.tipoUsuarioId]);

  useEffect(() => {
    getMenu();
    Tablas();

    data;
    if (Object.entries(data).length > 0) {
      convertirASelectActions();
    } else {
      setSelectedActions({});
    }
  }, []);

  //#endregion

  //#region Funciones
  function uppercase(value) {
    if (value && typeof value === "string") {
      return value.toUpperCase();
    }
    return value;
  }
  const handleInputChange = ({ target }) => {
    const value = uppercase(target.value);
    setData({
      ...data,
      [target.name]: value,
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setValue(botones.map((item) => item.value));
    } else {
      setValue([]);
    }
    setChecked(checked);
    setSelectedActions((prev) => ({
      ...prev,
      [selectedMenu]: checked ? botones.map((item) => item.value) : [],
    }));
    console.log(checked, "checked");
    console.log(value, "value");
    console.log(selectedActions, "selectedActions");
  };

  const handleMenuClick = (event) => {
    setSelectedMenu(event.target.innerText);
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

  return (
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "UsuarioPermiso"]}
      tamañoModal={[Global.ModalFull]}
    >
      <div className={Global.FormTabs}>
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
        <div className="flex">
          <label htmlFor="tipoUsuarioId" className={Global.LabelStyle}>
            Tipo de Usuario
          </label>
          <select
            id="tipoUsuarioId"
            name="tipoUsuarioId"
            onChange={handleInputChange}
            className={Global.SelectStyle}
            value={tipoUsuarioId}
          >
            {dataTipoUsuario.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.descripcion}
              </option>
            ))}
          </select>
        </div>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="menus" className={Global.LabelStyle}>
            Menú:
          </label>
          <input
            type="text"
            id="menus"
            name="menus"
            value={selectedMenu}
            onChange={handleInputChange}
            className={Global.InputStyle}
          />
        </div>

        <div className="card flex justify-content-center gap-3">
          <div>
            <SelectButton
              value={selectedActions[selectedMenu] || []}
              onChange={(e) => {
                setSelectedActions((prev) => ({
                  ...prev,
                  [selectedMenu]: e.value,
                }));
                setValue(e.value);
                setChecked(e.value.length === botones.length);
              }}
              optionLabel="name"
              options={botones}
              multiple
            />
          </div>
          <div className="mt-2 ml-2 flex gap-2">
            <div>
              <Checkbox
                onChange={(e) => {
                  setChecked(e.checked);
                  handleSelectAll(e.checked);
                }}
                checked={checked}
              ></Checkbox>
            </div>
            <div>
              <label>Todos</label>
            </div>
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
                      className="hover:text-primary p-1 border-b"
                      key={item.id}
                    >
                      <button type="button" onClick={handleMenuClick}>
                        {item.nombre}
                      </button>
                    </li>
                  ))}
                </ul>
              </AccordionTab>
            </Accordion>
          </div>
        </div>
      </div>
    </ModalBasic>
  );
};

export default ModalConfiguracion;
