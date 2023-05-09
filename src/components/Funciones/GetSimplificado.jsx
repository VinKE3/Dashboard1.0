import ApiMasy from "../../api/ApiMasy";

const GetSimplificado = async () => {
  const result = await ApiMasy.get(`api/Empresa/Configuracion/GetSimplificado`);
  return result.data.data;
};

export default GetSimplificado;