import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "../service/ProductService";

const Tabla = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    ProductService.getProductsMini().then((data) => setProducts(data));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <DataTable
      value={products}
      responsiveLayout="scroll"
      className="bg-secondary-900"
    >
      <Column className="bg-secondary-100" field="code" header="Code"></Column>
      <Column field="name" header="Name"></Column>
      <Column field="category" header="Category"></Column>
      <Column field="quantity" header="Quantity"></Column>
    </DataTable>
  );
};

export default Tabla;
