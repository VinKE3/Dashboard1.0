import { useEffect, useState } from "react";
import ModalBasic from "../modal/ModalBasic";
import * as Global from "../Global";

const ModalImprimir = ({ setModal, objeto, foco }) => {
  //#region useState
  const [pdf, setPdf] = useState(objeto);
  const [fileName, setFileName] = useState([]);
  //#endregion

  //#region useEffect;
  useEffect(() => {
    PasarDatos();
  }, []);
  //#endregion

  //#region Funciones
  const PasarDatos = async () => {
    let model = await GetNombreArchivo(pdf.headers.get("content-disposition"));
    setFileName(model);
    setPdf(URL.createObjectURL(pdf.data));
  };
  const GetNombreArchivo = async (disposition) => {
    let filename = "PDF";
    if (disposition && disposition.indexOf("attachment") !== -1) {
      let filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      let matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, "");
      }
    }
    return filename;
  };
  const Key = async (e) => {
    if (e.key == "Escape") {
      foco.focus();
      setModal(false);
    }
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
        titulo={"Reporte " + fileName.slice(0, fileName.length - 4)}
        cerrar={false}
        tamañoModal={[Global.ModalFull, Global.Form]}
        childrenFooter={
          <>
            <a
              id="enlace"
              href={pdf}
              download={fileName}
              className={
                Global.BotonModalBase +
                Global.BotonAgregar +
                " !text-light border-none"
              }
            >
              DESCARGAR
            </a>
            <button
              type="button"
              onClick={() => setModal(false)}
              onKeyDown={(e) => Key(e)}
              autoFocus
              className={Global.BotonModalBase + Global.BotonCancelarModal}
            >
              CERRAR
            </button>
          </>
        }
      >
        {
          <>
            <iframe
              typeof="application/pdf"
              width={"100%"}
              height={"100%%"}
              id="hola"
              src={pdf}
            ></iframe>
          </>
        }
      </ModalBasic>
    </>
  );
  //#endregion
};

export default ModalImprimir;
