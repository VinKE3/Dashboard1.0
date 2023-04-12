import React from "react";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";

const BotonCerrarMenu = ({ onClickButton, showMenu }) => {
  return (
    <button
      onClick={onClickButton}
      className="xl:hidden fixed bottom-4 right-4 bg-primary text-black p-3 rounded-full z-50"
    >
      {showMenu ? <RiCloseLine /> : <RiMenu3Line />}
    </button>
  );
};

export default BotonCerrarMenu;
