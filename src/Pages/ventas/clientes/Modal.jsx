import React, { useState, useEffect } from "react";
import ApiMasy from "../../../api/ApiMasy";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../Components/Global";
import { Tabs } from "flowbite-react";
import styled from "styled-components";
import { FaSearch } from "react-icons/fa";

const TabsStyle = styled.div`
  & button {
    color: #fff;
    font-size: 15px;
    font-weight: 500;
    border-bottom: 2px solid transparent;
    transition: all ease 0.2s;
  }
  & button:focus {
    color: #ffe600;
    border-bottom: 2px solid #ffe600;
  }
  & button:hover {
    transition: ease 0.4s;
    color: #000;
    background-color: #ffe600;
  }
`;

const Modal = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState([]);
  const [dataModal, setdataModal] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    objeto;
    setData(objeto);
  }, [objeto]);
  useEffect(() => {
    dataModal;
  }, [dataModal]);
  useEffect(() => {
    data;
  }, [data]);
  useEffect(() => {
    Tablas();
  }, []);
  //#endregion

  //#region Funciones
  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };
  function uppercase(e) {
    e.target.value = e.target.value.toUpperCase();
  }
  //#endregion

  //#region API
  const Tablas = async () => {
    const result = await ApiMasy.get(
      `api/Mantenimiento/Cliente/FormularioTablas`
    );
    setdataModal(result.data.data);
  };
  //#endregion

  //#region Render
  return (
    <ModalBasic
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Mantenimiento", "Cliente"]}
      tamañoModal={[Global.ModalFull, Global.FormTabs]}
    >
      <TabsStyle>
        <Tabs.Group aria-label="Default tabs" style="underline">
          <Tabs.Item active={true} title="Datos Principales">
            <div className={Global.ContenedorVarios}>
              <div className={Global.ContenedorInputMitad}>
                <label htmlFor="id" className={Global.LabelStyle}>
                  Número Doc
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  placeholder="Número Documento Identidad"
                  readOnly={modo == "Consultar" ? true : false}
                  // defaultValue={}
                  onChange={handleChange}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.ContenedorInputMitad}>
                <label htmlFor="id" className={Global.LabelStyle}>
                  Número Doc
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  placeholder="Número Documento Identidad"
                  readOnly={modo == "Consultar" ? true : false}
                  // defaultValue={}
                  onChange={handleChange}
                  className={Global.InputBoton}
                />
                <button
                  id="consultarTipoCambio"
                  hidden={modo == "Consultar" ? true : false}
                  // onClick={(e) => ValidarConsulta(e)}
                  className={Global.BotonBuscar}
                >
                  <FaSearch></FaSearch>
                </button>
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item title="Direcciones">Dashboard content</Tabs.Item>
          <Tabs.Item title="Contactos">Settings content</Tabs.Item>
        </Tabs.Group>
      </TabsStyle>
    </ModalBasic>
  );
  //#endregion
};

export default Modal;
