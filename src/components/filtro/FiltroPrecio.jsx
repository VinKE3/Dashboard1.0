import { useState } from "react";
import ModalBasic from "../modal/ModalBasic";
import { FaCheck } from "react-icons/fa";
import * as Global from "../Global";

const FiltroPrecio = ({ setModal, objeto, setObjeto, foco }) => {
  //#region useState
  const [datos] = useState(objeto);
  //#endregion

  //#region useEffect;
  //#endregion

  //#region API
  const GetPorId = async (precio) => {
    setObjeto({
      precioUnitario: precio,
    });
    foco.focus();
    setModal(false);
  };
  //#endregion

  //#region Render
  return (
    <>
      <ModalBasic
        setModal={setModal}
        objeto={[]}
        modo={""}
        menu={["", ""]}
        titulo="Consultar Precios"
        tamañoModal={[Global.ModalPequeño, Global.Form]}
        childrenFooter={
          <>
            <button
              className={Global.BotonModalBase + Global.BotonCancelarModal}
              type="button"
              onClick={() => setModal(false)}
            >
              CERRAR
            </button>
          </>
        }
      >
        {
          <div className={Global.ContenedorBasico}>
            {/*Tabla Footer*/}
            <div className={Global.ContenedorFooter}>
              <div className="flex">
                <div className={Global.FilaVacia}>
                  <p className={Global.FilaContenido}>Precio 1</p>
                </div>
                <div className={Global.FilaImporte + "py-1.5"}>
                  <p className={Global.FilaContenido}>
                    {datos.precioVenta1 ?? "0"}
                  </p>
                </div>
                <div className={Global.UltimaFila + "py-1.5"}>
                  <button
                    onClick={() => GetPorId(datos.precioVenta1)}
                    className={
                      Global.BotonModalBase +
                      Global.BotonAgregar +
                      "border-none"
                    }
                  >
                    <FaCheck></FaCheck>
                  </button>
                </div>
              </div>
              <div className="flex">
                <div className={Global.FilaVacia}>
                  <p className={Global.FilaContenido}>Precio 2</p>
                </div>
                <div className={Global.FilaImporte + "py-1.5"}>
                  <p className={Global.FilaContenido}>
                    {datos.precioVenta2 ?? "0"}
                  </p>
                </div>
                <div className={Global.UltimaFila + "py-1.5"}>
                  <button
                    onClick={() => GetPorId(datos.precioVenta2)}
                    className={
                      Global.BotonModalBase +
                      Global.BotonAgregar +
                      "border-none"
                    }
                  >
                    <FaCheck></FaCheck>
                  </button>
                </div>
              </div>
              <div className="flex">
                <div className={Global.FilaVacia}>
                  <p className={Global.FilaContenido}>Precio 3</p>
                </div>
                <div className={Global.FilaImporte + "py-1.5"}>
                  <p className={Global.FilaContenido}>
                    {datos.precioVenta3 ?? "0"}
                  </p>
                </div>
                <div className={Global.UltimaFila + "py-1.5"}>
                  <button
                    onClick={() => GetPorId(datos.precioVenta3)}
                    className={
                      Global.BotonModalBase +
                      Global.BotonAgregar +
                      "border-none"
                    }
                  >
                    <FaCheck></FaCheck>
                  </button>
                </div>
              </div>
              <div className="flex">
                <div className={Global.FilaVacia}>
                  <p className={Global.FilaContenido}>Precio 4</p>
                </div>
                <div className={Global.FilaImporte + "py-1.5"}>
                  <p className={Global.FilaContenido}>
                    {datos.precioVenta4 ?? "0"}
                  </p>
                </div>
                <div className={Global.UltimaFila + "py-1.5"}>
                  <button
                    onClick={() => GetPorId(datos.precioVenta4)}
                    className={
                      Global.BotonModalBase +
                      Global.BotonAgregar +
                      "border-none"
                    }
                  >
                    <FaCheck></FaCheck>
                  </button>
                </div>
              </div>
            </div>
            {/*Tabla Footer*/}
          </div>
        }
      </ModalBasic>
    </>
  );
  //#endregion
};

export default FiltroPrecio;
