import React from "react";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
//agrego props para poder recibir la función onClickButton
const BotonCerrarMenu = ({ onClickButton, showMenu }) => {
  return (
    <button
      onClick={onClickButton} // onClickButton es una función que se encuentra en Sidebar.jsx
      className="xl:hidden fixed bottom-4 right-4 bg-primary text-black p-3 rounded-full z-50"
    >
      {showMenu ? <RiCloseLine /> : <RiMenu3Line />}
    </button>
  );
};

export default BotonCerrarMenu;
