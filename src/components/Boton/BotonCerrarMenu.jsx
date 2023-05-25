import React from "react";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";

const BotonCerrarMenu = ({ onClickButton, showMenu }) => {
  return (
    <button
      onClick={onClickButton}
      className="xl:hidden fixed bottom-2 right-4 bg-gradient-to-b from-yellow-300 to-yellow-500 text-black p-3 rounded-full z-50"
    >
      {showMenu ? <RiCloseLine /> : <RiMenu3Line />}
    </button>
  );
};

export default BotonCerrarMenu;
