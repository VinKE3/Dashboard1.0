import React from "react";

const Almacen = () => {
  return (
    <div>
      <form>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
          />
        </div>
        <div className="form-group">
          <label htmlFor="direccion">Dirección</label>
          <input
            type="text"
            className="form-control"
            id="direccion"
            name="direccion"
          />
        </div>
      </form>
    </div>
  );
};

export default Almacen;
