import React, { useState } from "react";
import ModalBasic from "../../../components/modal/ModalBasic";
import ApiMasy from "../../../api/ApiMasy";
import { useEffect } from "react";
import * as Global from "../../../components/Global";
import BotonBasico from "../../../components/boton/BotonBasico";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const ReporteVendedoresClientes = ({ setModal }) => {
  const [data, setData] = useState({
    personalId: "",
  });

  const [personal, setPersonal] = useState([]);
  useEffect(() => {
    data;
    console.log(data);
  }, [data]);

  useEffect(() => {
    Personal();
  }, []);

  const ValidarData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };

  const Personal = async () => {
    const result = await ApiMasy.get(`api/Mantenimiento/Personal/Listar`);
    setPersonal(
      result.data.data.data.map((res) => ({
        id: res.id,
        personal:
          res.apellidoPaterno + " " + res.apellidoMaterno + " " + res.nombres,
      }))
    );
  };

  const Imprimir = async () => {
    console.log("Imprimir");
  };
  return (
    <>
      <ModalBasic titulo="Reporte de Vendedores y Cliente" setModal={setModal}>
        <div
          className={Global.ContenedorBasico + Global.FondoContenedor + " mb-2"}
        >
          <div className={Global.InputFull}>
            <label htmlFor="personalId" className={Global.LabelStyle}>
              Personal
            </label>
            <select
              id="personalId"
              name="personalId"
              autoFocus
              value={data.personalId ?? ""}
              onChange={ValidarData}
              className={Global.InputStyle}
            >
              <option key={-1} value={""}>
                {"--TODOS--"}
              </option>
              {personal.map((personal) => (
                <option key={personal.id} value={personal.id}>
                  {personal.personal}
                </option>
              ))}
            </select>
          </div>
          <div className={Global.ContenedorInputs}>
            <div className="mt-2">
              <BotonBasico
                botonText="ACEPTAR"
                botonClass={Global.BotonAgregar}
                botonIcon={faPlus}
                click={() => Imprimir()}
              />
            </div>
          </div>
        </div>
      </ModalBasic>
    </>
  );
};

export default ReporteVendedoresClientes;
