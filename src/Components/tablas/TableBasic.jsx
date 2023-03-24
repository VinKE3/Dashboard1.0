import React from "react";
import styled from "styled-components";
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useSortBy,
} from "react-table";

const Tabla = styled.div`
  & .selected-row {
    background-color: #f8bc0a;
    color: #000;
  }
`;

const TableBasic = ({ columnas, datos }) => {
  //#region Columnas y Datos
  const columns = columnas;
  const data = datos;
  //#endregion

  //#region Fila Seleccionable
  const Seleccionar = (e) => {
    if (e.target.tagName == "DIV") {
      let padre = e.target.parentNode.parentNode;
      if (padre.tagName == "TD") {
        let hijo = padre.parentNode;
        if (hijo.classList.contains("selected-row")) {
          hijo.classList.remove("selected-row");
        } else {
          document.querySelectorAll("*").forEach((f) => {
            f.classList.remove("selected-row");
          });
          hijo.classList.add("selected-row");
        }
      } else {
        if (padre.classList.contains("selected-row")) {
          padre.classList.remove("selected-row");
        } else {
          document.querySelectorAll("*").forEach((f) => {
            f.classList.remove("selected-row");
          });
          padre.classList.add("selected-row");
        }
      }
    }
    if (e.target.tagName == "TD") {
      if (e.target.parentNode.classList.contains("selected-row")) {
        e.target.parentNode.classList.remove("selected-row");
      } else {
        document.querySelectorAll("*").forEach((f) => {
          f.classList.remove("selected-row");
        });
        e.target.parentNode.classList.add("selected-row");
      }
    }
  };
  //#endregion

  //#region Obtiene props React Table
  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    useTable(
      { columns, data, initialState: { pageSize: 50 } },
      useGlobalFilter,
      useSortBy,
      usePagination
    );
  //#endregion

  //#region Render
  return (
    <div className="flex flex-col mt-2 overflow-x-auto shadow-md rounded md:text-sm">
      {/* Tabla */}
      <Tabla>
        <table {...getTableProps()} id="tabla" className="w-full text-light">
          <thead className="text-left bg-gris-800">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="py-2 px-2"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()} className="bg-secondary-100">
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="border-b border-secondary-900"
                  onClick={(e) => Seleccionar(e)}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className="py-2 px-2 text-left "
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Tabla>
    </div>
  );
  //#endregion
};

export default TableBasic;
