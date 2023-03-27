import React, { useState, useEffect } from "react";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../Components/Global";
import ApiMasy from "../../../api/ApiMasy";
import { Accordion, AccordionTab } from "primereact/accordion";
import { SelectButton } from "primereact/selectbutton";
import { useMenu } from "../../../context/ContextMenu";
import { Checkbox } from "primereact/checkbox";
import Mensajes from "../../../components/Mensajes";

const ModalConfiguracion = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState({
    usuarioId: "001",
    tipoUsuarioId: "AD",
    permisos: [
      {
        usuarioId: "001",
        menuId: "Linea",
        registrar: true,
        modificar: true,
        eliminar: true,
        consultar: true,
        anular: false,
      },
      {
        usuarioId: "001",
        menuId: "Sublinea",
        registrar: true,
        modificar: true,
        eliminar: false,
        consultar: true,
        anular: true,
      },
    ],
  });
  const { getMenu, menu } = useMenu();
  const [selectedMenu, setSelectedMenu] = useState("");
  const [value, setValue] = useState(null);
  const botones = [
    { name: "Registrar", value: "registrar", id: "registrar", active: true },
    { name: "Modificar", value: "modificar", id: "modificar", active: true },
    { name: "Eliminar", value: "eliminar", id: "eliminar", active: true },
    { name: "Consultar", value: "consultar", id: "consultar", active: true },
    { name: "Anular", value: "anular", id: "anular", active: true },
  ];
  const [checked, setChecked] = useState(false);
  const [checkedMenus, setCheckedMenus] = useState(
    Array(menu.length).fill(false)
  );
  const [selectedActions, setSelectedActions] = useState({});
  const [dataTipoUsuario, setDataTipoUsuario] = useState([]);
  const [dataPermisos, setDataPermisos] = useState([]);
  //#endregion

  //#region useEffect

  useEffect(() => {
    data;
    if (document.getElementById("tipoUsuarioId")) {
      document.getElementById("tipoUsuarioId").value = data.tipoUsuarioId;
    }
    setDataPermisos(data.permisos);
  }, [data]);

  useEffect(() => {
    getMenu();
    Tablas();
    data;
    TipoUsuario(data.id);
  }, []);

  useEffect(() => {
    setChecked(false);
    setCheckedMenus(Array(menu.length).fill(false));
  }, [selectedMenu]);

  useEffect(() => {
    if (selectedMenu) {
      setValue(selectedActions[selectedMenu] || []);
      setChecked(selectedActions[selectedMenu]?.length === botones.length);
    }
  }, [selectedActions, selectedMenu]);

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
    setData({
      ...data,
      [selectedMenu]: checked ? botones.map((item) => item.value) : [],
    });
    console.log(data);
  };

  const handleMenuClick = (event) => {
    const index = menu.findIndex(
      (menu) => menu.nombre === event.target.innerText
    );
    setCheckedMenus((prev) => {
      const newArr = [...prev];
      newArr[index] = !newArr[index];
      return newArr;
    });
    setSelectedMenu(event.target.innerText);
    handleSelectAllActions();

    //?Obtenego los botones activos basados en la información de data
    const botonesActivos = getBotonesActivos(event.target.innerText);

    //?Actualizo el estado de selectedActions con los botones activos
    setSelectedActions((prev) => ({
      ...prev,
      [event.target.innerText]: botonesActivos.map((boton) => boton.value),
    }));

    //?Actualizo el estado de value con los valores de los botones activos
    setValue(botonesActivos.map((boton) => boton.value));

    //?Verifico si todos los botones están activos y actualizar el estado de checked
    setChecked(botonesActivos.every((boton) => boton.active));
  };

  const handleSelectAllActions = () => {
    setValue(botones.map((item) => item.value));
    setData({
      ...data,
      [selectedMenu]: botones.map((item) => item.value),
    });
  };

  const getBotonesActivos = (menuId) => {
    const permiso = data.permisos.find((permiso) => permiso.menuId === menuId);
    if (permiso) {
      return botones.map((boton) => ({
        ...boton,
        active: permiso[boton.value],
      }));
    } else {
      return botones;
    }
  };

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/UsuarioPermiso/FormularioTablas`
    );
    setDataTipoUsuario(result.data.data.tiposUsuario);
  };

  const TipoUsuario = async (id) => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/UsuarioPermiso/Listar?usuarioId=${id}`
    );
    setData(result.data.data);
  };

  //#endregion

  return (
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "Usuario"]}
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
          >
            {dataTipoUsuario.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.descripcion}
              </option>
            ))}
          </select>
        </div>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="menuId" className={Global.LabelStyle}>
            Menú:
          </label>
          <input
            type="text"
            readOnly={true}
            value={selectedMenu}
            onChange={handleMenuClick}
            className={Global.InputStyle}
          />
        </div>

        <div className="card flex justify-content-center gap-3">
          <div>
            <SelectButton
              id="botones"
              name="botones"
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
              options={getBotonesActivos(selectedMenu)}
              multiple
              active={selectedActions[selectedMenu] || []}
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
                    <span className=" vertical-align-middle">
                      Mantenimiento
                    </span>
                    <i className="pi pi-cog ml-2"></i>
                  </div>
                }
              >
                <ul>
                  {menu.map((item) => (
                    <li
                      className="hover:text-primary p-1 border-b"
                      key={item.id}
                      name="menuId"
                      onClick={handleMenuClick}
                    >
                      <button type="button">{item.nombre}</button>
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
