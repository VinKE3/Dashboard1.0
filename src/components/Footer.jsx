import React from "react";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

const Footer = () => {
  return (
    <footer className="h-full p-3 items-center ">
      <div className="flex items-center font-semibold">
        <span>© 2023 - </span>
        <span className="text-primary">MASY DATA SERVICE E.I.R.L.</span>
      </div>
    </footer>
  );
};

export default Footer;
