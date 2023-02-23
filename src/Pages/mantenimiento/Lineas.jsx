import React from "react";
import { useEffect } from "react";
import ApiMasy from "../../api/ApiMasy";

const Lineas = () => {
  const getLista = async () => {
    const lista = await ApiMasy.get(`api/Mantenimiento/Linea/Listar`);
    console.log(lista);
  };

  useEffect(() => {
    getLista();
  }, []);
  return <div>Lineas</div>;
};

export default Lineas;
