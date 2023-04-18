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
  };
  const handleMenuClick = (event) => {
    setSelectedMenu(event.target.innerText);
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
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "UsuarioPermiso"]}
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
        <div className={Global.ContenedorInputMitad}>
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
      </div>

      <div className="flex justify-between py-2">
        <SelectButton
          value={selectedActions[selectedMenu] || []}
          optionLabel="name"
          options={botones}
          multiple
          onChange={(e) => {
            setSelectedActions((prev) => ({
              ...prev,
              [selectedMenu]: e.value,
            }));
            setValue(e.value);
            setChecked(e.value.length === botones.length);
          }}
        />

        <div className="flex max-h-11">
          <div className={Global.CheckStyle}>
            <Checkbox
              inputId="all"
              onChange={(e) => {
                setChecked(e.checked);
                handleSelectAll(e.checked);
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
                    onClick={handleMenuClick}
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
    </ModalBasic>
  );
  //#endregion
};

export default ModalConfiguracion;
