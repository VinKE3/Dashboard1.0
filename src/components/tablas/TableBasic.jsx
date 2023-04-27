import React from "react";
import styled from "styled-components";
import * as Global from "../Global";
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useSortBy,
} from "react-table";

const Tabla = styled.div`
  & .selected-row {
    background: linear-gradient(90deg, #d2ae11 0%, #d9ad22 100%);
    color: #000;
  }
`;

const TableBasic = ({
  columnas,
  datos,
  estilos = ["", "", "", "", "", "", ""],
}) => {
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
    <div className="flex flex-col overflow-x-auto shadow-md rounded md:text-sm">
      {/* Tabla */}
      <Tabla>
        <table
          {...getTableProps()}
          id="tabla"
          className={"w-full text-light " + estilos[0]}
        >
          <thead className={Global.THeader + estilos[1]}>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className={estilos[2]}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={"p-2 " + estilos[3]}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()} className={Global.TBody + estilos[4]}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className={Global.Tr + estilos[5]}
                  onClick={(e) => Seleccionar(e)}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className={Global.Td + estilos[6]}
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
