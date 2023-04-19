import React from "react";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

const Footer = () => {
  return (
    <footer className="p-3 border-t items-center">
      <nav className="flex items-center justify-between">
        <h1 className="font-bold just">
          © 2023 -{" "}
          <span className="text-primary">MASY DATA SERVICE E.I.R.L.</span>
        </h1>
      </nav>
    </footer>
  );
};

export default Footer;
