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
  const [data, setData] = useState([]);
  const [dataModal, setdataModal] = useState([]);
  const { getMenu, menu } = useMenu();
  const [selectedMenu, setSelectedMenu] = useState("");
  const [value, setValue] = useState(null);
  const botones = [
    { name: "registrar", value: "registrar", id: "registrar" },
    { name: "modificar", value: "modificar", id: "modificar" },
    { name: "eliminar", value: "eliminar", id: "eliminar" },
    { name: "consultar", value: "consultar", id: "consultar" },
    { name: "anular", value: "anular", id: "anular" },
  ];
  const [checked, setChecked] = useState(false);
  const [checkedMenus, setCheckedMenus] = useState(
    Array(menu.length).fill(false)
  );
  const [selectedActions, setSelectedActions] = useState({});
  //#endregion

  //#region useEffect
  useEffect(() => {
    objeto;
    setData(objeto);
  }, [objeto]);

  useEffect(() => {
    data;
  }, [data]);

  useEffect(() => {
    dataModal;
    document.getElementById("tiposUsuarioId").value = data.tiposUsuarioId;
  }, [dataModal]);

  useEffect(() => {
    getMenu();
  }, []);

  useEffect(() => {
    Tablas();
  }, []);

  useEffect(() => {
    setChecked(false);
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
    console.log(data);
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
    setData({
      ...data,
      [event.target.innerText]: botones.map((item) => item.value),
    });
    console.log(data);
  };
  const handleSelectAllActions = () => {
    setValue(botones.map((item) => item.value));
    setData({
      ...data,
      [selectedMenu]: botones.map((item) => item.value),
    });
    console.log(data);
  };

  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/UsuarioPermiso/FormularioTablas`
    );
    setdataModal(result.data.data.tiposUsuario);
  };

  const ObtenerUsuarios = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/UsuarioPermiso/ObtenerUsuarios`
    );
    setdataModal(result.data.data);
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
          <label htmlFor="tiposUsuarioId" className={Global.LabelStyle}>
            Tipo de Usuario
          </label>
          <select
            id="tiposUsuarioId"
            name="tiposUsuarioId"
            onChange={handleInputChange}
            className={Global.SelectStyle}
          >
            {dataModal.map((usuario) => (
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
            id="menuId"
            name="menuId"
            value={selectedMenu}
            onChange={handleMenuClick}
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
                      id="menuId"
                      onChange={handleMenuClick}
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
