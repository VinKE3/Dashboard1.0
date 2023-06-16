import React from "react";
import Reporte from "../../../components/funciones/Reporte";
import ModalBasic from "../../../components/modal/ModalBasic";
import * as G from "../../../components/Global";

const ReporteDeProveedores = ({ setModal }) => {
  //#region  API
  const Enviar = async (origen = 1) => {
    let model = await Reporte(`Informes/Sistema/ReporteProveedores`, origen);
    const enlace = document.createElement("a");
    enlace.href = model.url;
    enlace.download = model.fileName;
    enlace.click();
    enlace.remove();
  };
  //#endregion

  //#region  Render
  return (
    <ModalBasic
      setModal={setModal}
      titulo="Informe de Proveedores"
      habilitarFoco={false}
      tamañoModal={[G.ModalPequeño + " !max-w-xl", G.Form]}
      childrenFooter={
        <>
          <button
            type="button"
            autoFocus
            onClick={() => Enviar(1)}
            className={G.BotonModalBase + G.BotonRojo}
          >
            PDF
          </button>
          <button
            type="button"
            onClick={() => Enviar(2)}
            className={G.BotonModalBase + G.BotonVerde}
          >
            EXCEL
          </button>
          <button
            type="button"
            onClick={() => setModal(false)}
            className={G.BotonModalBase + G.BotonCerrarModal}
          >
            CERRAR
          </button>
        </>
      }
    />
  );
  //#endregion
};

export default ReporteDeProveedores;
