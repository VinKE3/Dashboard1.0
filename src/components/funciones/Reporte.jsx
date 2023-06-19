import { toast } from "react-toastify";
import Api from "../../api/Api";
import ApiMasy from "../../api/ApiMasy";

const Reporte = async (menu, origen, cadena = "") => {
  const result = await Api.get(`api/${menu}?formato=${origen}${cadena}`);
  if (result.name == "AxiosError") {
    const res = await ApiMasy.get(`api/${menu}?formato=${origen}${cadena}`);
    res.textos.map((map) => {
      toast.error(map, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    });
    return null;
  } else {
    let url = URL.createObjectURL(result.data);
    let archivo = await GetNombreArchivo(
      result.headers.get("content-disposition")
    );
    return { url: url, fileName: archivo };
  }
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

export default Reporte;