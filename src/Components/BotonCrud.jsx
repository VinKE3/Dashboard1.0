import { Icon } from "../Components/Icon";
import "../assets/Styles/Componentes/BotonCRUD.css";

const BotonCrud = ({ botonClass, botonIconClass, botonIcon, botonText }) => {
  const abrirModal = () => {
    alert(botonText);
  };

  return (
    <button onClick={abrirModal} className={"boton-crud " + botonClass}>
      <Icon css={"boton-crud-icon " + botonIconClass} icon={botonIcon} />

      <span>{botonText}</span>
    </button>
  );
};

export default BotonCrud;
