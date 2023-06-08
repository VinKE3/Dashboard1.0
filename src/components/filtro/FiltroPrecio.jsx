import { useState } from "react";
import ModalBasic from "../modal/ModalBasic";
import { FaCheck } from "react-icons/fa";
import * as G from "../Global";
import * as Funciones from "../funciones/Validaciones";

const FiltroPrecio = ({ setModal, objeto, setObjeto, foco }) => {
  //#region useState
  const [datos] = useState(objeto);
  //#endregion

  //#region useEffect;
  //#endregion

  //#region API
  const GetPorId = async (precio) => {
    setObjeto({
      precioUnitario: Funciones.RedondearNumero(precio, 2),
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
        titulo="Consultar Precios"
        tamañoModal={[G.ModalPequeño, G.Form]}
        childrenFooter={
          <>
            <button
              className={G.BotonModalBase + G.BotonCerrarModal}
              type="button"
              onClick={() => setModal(false)}
            >
              CERRAR
            </button>
          </>
        }
      >
        {
          <div className={G.ContenedorBasico + " !p-0"}>
            {/*Tabla Footer*/}
            <div className={G.ContenedorFooter}>
              <div className="flex">
                <div className={G.FilaFooter + G.FilaVacia}>
                  <p className={G.FilaContenido}>Precio 1</p>
                </div>
                <div className={G.FilaFooter + G.FilaImporte}>
                  <p className={G.FilaContenido}>{datos.precioVenta1 ?? "0"}</p>
                </div>
                <div className={G.FilaFooter + G.UltimaFila + " py-1.5"}>
                  <button
                    onClick={() => GetPorId(datos.precioVenta1)}
                    className={G.BotonModalBase + G.BotonVerde + "border-none"}
                  >
                    <FaCheck></FaCheck>
                  </button>
                </div>
              </div>
              <div className="flex">
                <div className={G.FilaFooter + G.FilaVacia}>
                  <p className={G.FilaContenido}>Precio 2</p>
                </div>
                <div className={G.FilaFooter + G.FilaImporte}>
                  <p className={G.FilaContenido}>{datos.precioVenta2 ?? "0"}</p>
                </div>
                <div className={G.FilaFooter + G.UltimaFila + " py-1.5"}>
                  <button
                    onClick={() => GetPorId(datos.precioVenta2)}
                    className={G.BotonModalBase + G.BotonVerde + "border-none"}
                  >
                    <FaCheck></FaCheck>
                  </button>
                </div>
              </div>
              <div className="flex">
                <div className={G.FilaFooter + G.FilaVacia}>
                  <p className={G.FilaContenido}>Precio 3</p>
                </div>
                <div className={G.FilaFooter + G.FilaImporte}>
                  <p className={G.FilaContenido}>{datos.precioVenta3 ?? "0"}</p>
                </div>
                <div className={G.FilaFooter + G.UltimaFila + " py-1.5"}>
                  <button
                    onClick={() => GetPorId(datos.precioVenta3)}
                    className={G.BotonModalBase + G.BotonVerde + "border-none"}
                  >
                    <FaCheck></FaCheck>
                  </button>
                </div>
              </div>
              <div className="flex">
                <div className={G.FilaFooter + G.FilaVacia}>
                  <p className={G.FilaContenido}>Precio 4</p>
                </div>
                <div className={G.FilaFooter + G.FilaImporte}>
                  <p className={G.FilaContenido}>{datos.precioVenta4 ?? "0"}</p>
                </div>
                <div className={G.FilaFooter + G.UltimaFila + " py-1.5"}>
                  <button
                    onClick={() => GetPorId(datos.precioVenta4)}
                    className={G.BotonModalBase + G.BotonVerde + "border-none"}
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
