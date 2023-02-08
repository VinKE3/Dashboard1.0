import React from "react";

const Sidebar = () => {
  return (
    <div className="xl:h-[100vh] overflow-y-scroll fixed xl:static w-full h-full -left-full top-0 bg-secondary-100 p-8">
      <h1 className="uppercase text-center text-xl font-bold mb-10">
        cikron <span className="text-primario text-4xl font-bold">.</span>
      </h1>
    </div>
  );
};

export default Sidebar;
