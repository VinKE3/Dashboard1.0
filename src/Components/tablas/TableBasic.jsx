import React from "react";
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useSortBy,
} from "react-table";

const TableBasic = ({ columnas, datos }) => {
  //#region Columnas y Datos
  const columns = columnas;
  const data = datos;
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
      <table {...getTableProps()} id="tabla" className="text-light">
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
                className="border-b border-secondary-900 hover:bg-gray-500"
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
    </div>
  );
  //#endregion
};

export default TableBasic;
