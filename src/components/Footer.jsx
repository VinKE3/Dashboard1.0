import React from "react";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

const Footer = () => {
  return (
    <footer className="p-3 px-6 items-center !bg-secondary-900">
      <div className="flex items-center font-semibold">
        <span>© 2023 - </span>
        <span className="text-primary">MASY DATA SERVICE E.I.R.L.</span>
      </div>
    </footer>
  );
};

export default Footer;
