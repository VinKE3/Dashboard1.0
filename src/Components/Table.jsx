import React from "react";

import { useMemo } from "react";

import {
  useTable,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useFilters,
} from "react-table";

import FiltroGlobal from "./FiltroGlobal";
import FiltroColumna from "./FiltroColumna";
import "../assets/Styles/Componentes/Table.css";

function Table({ columnas, datos, propsFiltro }) {
  const columns = useMemo(() => columnas, []);

  const data = useMemo(() => datos, []);

  const defaultColumn = React.useMemo(
    () => ({
      Filter: FiltroColumna,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    prepareRow,
    setPageSize,
    state,
    setGlobalFilter,
    preGlobalFilteredRows,
  } = useTable(
    { columns, data, defaultColumn },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <div>
      {/* Filtro Global */}
      <FiltroGlobal
        textLabel={propsFiltro.textLabel}
        inputPlaceHolder={propsFiltro.inputPlaceHolder}
        inputId={propsFiltro.inputId}
        inputName={propsFiltro.inputName}
        inputMax={propsFiltro.inputMax}
        botonId={propsFiltro.botonId}
        filter={globalFilter}
        setFilter={setGlobalFilter}
      />

      {/* La tabla */}
      <table {...getTableProps()}>
        <thead className="head sticky">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " ⇊"
                        : " ⇈"
                      : "  "}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row); //Prepara la fila para pintarla en el DOM
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* El total de registros */}
      <div className="border-2 p-2">
        5/01/2023
        <span>Total de Registros: {preGlobalFilteredRows.length} </span>
        <div className="inline">
          <span>
            Página{" "}
            <strong>
              {pageIndex + 1} de {pageOptions.length}
            </strong>
          </span>

          <span>
            | Ir a la página:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const pageNumber = e.target.value
                  ? Number(e.target.value) - 1
                  : 0;
                gotoPage(pageNumber);
              }}
              className="text-black w-10 mr-5"
            />
          </span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="text-black"
          >
            {[10, 25, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {" "}
                {pageSize}
                {" filas"}
              </option>
            ))}
          </select>

          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="btn btn-secondary"
          >
            {"<<"}
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="btn btn-secondary"
          >
            Anterior
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="btn btn-secondary"
          >
            Siguiente
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="btn btn-secondary"
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Table;
