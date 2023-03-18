import React, { useState, useEffect } from "react";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../Components/Global";
import ApiMasy from "../../../api/ApiMasy";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useMenu } from "../../../context/ContextMenu";

const ModalConfiguracion = ({ setModal, setRespuestaModal, modo, objeto }) => {
  //#region useState
  const [data, setData] = useState([]);
  const { getMenu, menu, nombre } = useMenu();
  console.log(nombre);
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
    getMenu();
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
  //#endregion

  //#regiona Api

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
      <div className={Global.ContenedorVarios}>
        <div className={Global.ContenedorInput56}>
          <label htmlFor="id" className={Global.LabelStyle}>
            Código
          </label>
          <input
            type="text"
            id="id"
            name="id"
            placeholder="id"
            defaultValue={data.id}
            onChange={handleChange}
            className={Global.InputStyle}
          />
        </div>
        <div className={Global.ContenedorInputFull}>
          <label htmlFor="nombre" className={Global.LabelStyle}>
            Descripción
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            placeholder="nombre"
            defaultValue={data.nombre}
            onChange={handleChange}
            className={Global.InputStyle}
          />
        </div>
      </div>
      <div className="card">
        <Accordion activeIndex={0}>
          <AccordionTab
            header={
              <div className="flex align-items-center text-green-500">
                <i className="pi pi-calendar mr-2"></i>
                <span className="vertical-align-middle">Header I</span>
              </div>
            }
          >
            <ul>
              {menu.map((item) => (
                <li key={item.id}>{item.nombre}</li>
              ))}
            </ul>
          </AccordionTab>
          <AccordionTab
            header={
              <div className="flex align-items-center">
                <i className="pi pi-user mr-2"></i>
                <span className="vertical-align-middle">Header II</span>
              </div>
            }
          >
            <p className="m-0">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
              eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci
              velit, sed quia non numquam eius modi.
            </p>
          </AccordionTab>
          <AccordionTab
            header={
              <div className="flex align-items-center">
                <i className="pi pi-search mr-2"></i>
                <span className="vertical-align-middle">Header III</span>
                <i className="pi pi-cog ml-2"></i>
              </div>
            }
          >
            <p className="m-0">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui
              blanditiis praesentium voluptatum deleniti atque corrupti quos
              dolores et quas molestias excepturi sint occaecati cupiditate non
              provident, similique sunt in culpa qui officia deserunt mollitia
              animi, id est laborum et dolorum fuga. Et harum quidem rerum
              facilis est et expedita distinctio. Nam libero tempore, cum soluta
              nobis est eligendi optio cumque nihil impedit quo minus.
            </p>
          </AccordionTab>
        </Accordion>
      </div>
    </ModalBasic>
  );
};

export default ModalConfiguracion;
