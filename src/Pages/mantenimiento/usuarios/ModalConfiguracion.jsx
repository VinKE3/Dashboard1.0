import React, { useState, useEffect } from "react";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../Components/Global";
import ApiMasy from "../../../api/ApiMasy";
import { Accordion, AccordionTab } from "primereact/accordion";
import { SelectButton } from "primereact/selectbutton";
import { useMenu } from "../../../context/ContextMenu";
import { Checkbox } from "primereact/checkbox";

const ModalConfiguracion = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState([]);
  const [dataModal, setdataModal] = useState([]);
  const { getMenu, menu, nombre } = useMenu();
  const [selectedMenu, setSelectedMenu] = useState("");
  const [value, setValue] = useState(null);
  const items = [
    { name: "Registrar", value: "Registrar" },
    { name: "Modificar", value: "Modificar" },
    { name: "Eliminar", value: "Eliminar" },
    { name: "Consultar", value: "Consultar" },
    { name: "Anular", value: "Anular" },
  ];
  const [checked, setChecked] = useState(false);
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

  //#endregion

  //#region Funciones
  function uppercase(value) {
    if (value && typeof value === "string") {
      return value.toUpperCase();
    }
    return value;
  }

  const handleChange = ({ target }) => {
    const value = uppercase(target.value);
    setData({ ...data, [target.name]: value });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setValue(items.map((item) => item.value));
    } else {
      setValue(null);
    }
  };
  const handleClick = (event) => {
    const { innerText } = event.target;
    setSelectedMenu(innerText);
  };
  //#endregion
  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/UsuarioPermiso/FormularioTablas`
    );
    setdataModal(result.data.data.tiposUsuario);
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
      <div className={Global.ContenedorInputFull}>
        <label htmlFor="tiposUsuarioId" className={Global.LabelStyle}>
          Tipo de Usuario
        </label>
        <select
          id="tiposUsuarioId"
          name="tiposUsuarioId"
          onChange={handleChange}
          className={Global.SelectStyle}
        >
          {dataModal.map((forma) => (
            <option key={forma.id} value={forma.id}>
              {forma.descripcion}
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
          onChange={handleChange}
          className={Global.InputStyle}
        />
      </div>

      <div className="card flex justify-content-center gap-3">
        <div>
          <SelectButton
            value={value}
            onChange={(e) => setValue(e.value)}
            optionLabel="name"
            options={items}
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
                  <li className="hover:text-primary p-1 border-b" key={item.id}>
                    <button type="button" onClick={handleClick}>
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
};

export default ModalConfiguracion;
