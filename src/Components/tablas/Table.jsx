import React from "react";
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
  background-color: #eee;
  border: 1px solid #919191;
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
    background-color: #d6d6d6;
  }
  &:disabled {
    color: #010;
    opacity: 0.5;
  }
`;
///

function Table({ columnas, datos, total }) {
  const columns = columnas;
  const data = datos;
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
  const { pageIndex, pageSize } = state;

  return (
    <div className="flex flex-col mt-2 overflow-x-auto shadow-md rounded text-sm ">
      {/* Div Mostrar filas y Filtro global */}
      <div className="flex align-items-center justify-between ">
        {/* Div Mostrar Filas */}
        <div className="flex overflow-hidden">
          <label className="px-3 py-1 bg-gray-700">Mostrar:</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="bg-white py-1 pr-5 text-black"
          >
            {[10, 25, 50, 100].map((pageSize) => (
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
        <thead className="bg-black">
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
        <div className="flex flex-1">
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

        <div className="py-1 px-3">
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
            className="text-black"
          >
            <FaAngleDoubleLeft></FaAngleDoubleLeft>
          </BotonPaginacion>
          <BotonPaginacion
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="text-black"
          >
            Anterior
          </BotonPaginacion>
          <BotonPaginacion
            className="text-black"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            Siguiente
          </BotonPaginacion>
          <BotonPaginacion
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="text-black"
          >
            <FaAngleDoubleRight></FaAngleDoubleRight>
          </BotonPaginacion>
        </div>

        {/* <div>
          <span>
            Ir a la página:{" "}
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
        </div> */}
      </div>
    </div>
  );
}

export default Table;
