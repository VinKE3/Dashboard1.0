import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useSortBy,
} from "react-table";

const BotonPaginacion = styled.button`
  padding: 4px 5px;
  font-weight: 500;
  color: #000;
  background-color: #fde047;
  border: 1px solid #161616;
  transition: 0.5s;

  &:first-child,
  &:last-child {
    padding: 7px;
    padding-left: 8px;
    padding-right: 8px;
  }

  &:nth-child(2) {
    border-left: none;
    border-right: none;
  }

  &:last-child {
    border-left: none;
  }

  &:hover {
    background-color: #d0bb04;
  }
  &:disabled {
    color: #fff;
    background-color: #ee8100;
    opacity: 0.7;
  }
`;

function Table({ columnas, datos, total }) {
  //#region Columnas y Datos
  const columns = columnas;
  const data = datos;
  //#endregion

  //#region useState
  const [pagina, setPagina] = useState(0);
  //#endregion

  //#region useEffect

  useEffect(() => {
    pagina && console.log(pagina);
  }, [pagina]);
  useEffect(() => {
    Paginas();
  }, []);
  //#endregion

  //#region Funcion Paginado
  const Paginas = async () => {
    if (total > 50) {
      setPagina(total / 50);
    }
  };
  //#endregion

  //#region Obtiene props React Table
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
  } = useTable(
    { columns, data, initialState: { pageSize: 25 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  //#endregion

  //#region Paginacion
  const { pageIndex, pageSize } = state;
  //#endregion

  //#region Render
  return (
    <div className="flex flex-col mt-2 overflow-x-auto shadow-md rounded md:text-sm ">
      {/* Div Mostrar filas y Filtro global */}
      <div className="flex align-items-center justify-between">
        {/* Div Mostrar Filas */}
        <div className="flex overflow-hidden rounded-t-lg">
          <label className="inline-flex items-center px-3 text-gray-900 bg-gray-200 dark:bg-gray-800 dark:text-gray-300 font-bold">
            Mostrar:
          </label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="rounded-none bg-gray-50 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {[10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {" "}
                {pageSize}
                {" filas"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <table {...getTableProps()} className=" bg-white">
        <thead className="text-left bg-gray-800">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="text-white">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="py-2 px-6"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()} className="text-white bg-secondary-100">
          {page.map((row) => {
            prepareRow(row); //Prepara la fila para pintarla en el DOM
            return (
              <tr
                {...row.getRowProps()}
                className="border-b border-secondary-900 hover:bg-gray-700"
              >
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className="py-2 px-6 text-left whitespace-nowrap"
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

      {/* Footer */}
      <div className="py-2 px-4 flex flex-col sm:flex-row align-items-center justify-center bg-black text-white">
        {/* Total de registros */}
        <div className="py-1 flex flex-1 align-items-center justify-center">
          <span className="text-base sm:text-sm">
            {pageSize > total ? (
              <strong>
                Mostrando los primeros {total} resultados de {total} en total
              </strong>
            ) : (
              <strong>
                Mostrando los primeros {pageSize} resultados de {total} en total
              </strong>
            )}
          </span>
        </div>

        <div className="py-1 px-3 flex align-items-center justify-center">
          <span className="text-base sm:text-sm">
            Página <strong>{pageIndex + 1} </strong>
            de <strong>{pageOptions.length} </strong>
          </span>
        </div>
        {/* Paginación */}
        <div className="flex align-items-center justify-center">
          <BotonPaginacion
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            <FaAngleDoubleLeft></FaAngleDoubleLeft>
          </BotonPaginacion>
          <BotonPaginacion
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            Anterior
          </BotonPaginacion>
          <BotonPaginacion onClick={() => nextPage()} disabled={!canNextPage}>
            Siguiente
          </BotonPaginacion>
          <BotonPaginacion
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            <FaAngleDoubleRight></FaAngleDoubleRight>
          </BotonPaginacion>
        </div>
      </div>
    </div>
  );
  //#endregion
}

export default Table;
