import React from "react";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import moment from "moment/moment";
const Footer = () => {
  return (
    <footer className="h-full p-3 items-center ">
      <div className="flex items-center font-semibold">
        <p className="pr-1">{`© ${moment().format("YYYY")} - `}</p>
        <p className="text-primary">{" MASY DATA SERVICE E.I.R.L."}</p>
      </div>
    </footer>
  );
};

export default Footer;
