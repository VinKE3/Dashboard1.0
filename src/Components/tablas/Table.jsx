import React from "react";
import styled from "styled-components";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useFilters,
} from "react-table";
import FiltroColumna from "../filtros/FiltroColumna";

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
`;
///

function Table({ columnas, datos /*, propsFiltro*/ }) {
  const columns = columnas;
  const data = datos;
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
    <div className="flex flex-col mt-2 overflow-x-auto shadow-md rounded text-sm ">
      {/* Div Mostrar filas y Filtro global */}
      <div className="flex align-items-center justify-between ">
        {/* Div Mostrar Filas */}
        <div className="flex overflow-hidden">
          <label className="px-3 py-1 bg-gray-700">Mostrar:</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="py-1 pr-5 text-black"
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

        {/* <FiltroBasico
          textLabel={propsFiltro.textLabel}
          inputPlaceHolder={propsFiltro.inputPlaceHolder}
          inputId={propsFiltro.inputId}
          inputName={propsFiltro.inputName}
          inputMax={propsFiltro.inputMax}
          botonId={propsFiltro.botonId}
          filter={globalFilter}
          setFilter={setGlobalFilter}
        /> */}
      </div>

      {/* Tabla */}
      <table {...getTableProps()} className=" bg-white">
        <thead className="bg-gray-700">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="text-white">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="py-2 px-6"
                >
                  {column.render("Header")}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()} className="text-gray-600 ">
          {page.map((row) => {
            prepareRow(row); //Prepara la fila para pintarla en el DOM
            return (
              <tr
                {...row.getRowProps()}
                className="border-b border-gray-200 hover:bg-gray-300"
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
      <div className="py-2 px-4 flex flex-col sm:flex-row align-items-center justify-center bg-white text-gray-700">
        {/* Total de registros */}
        <div className="flex flex-1">
          <span className="text-base sm:text-sm">
            Total de registros: <strong>{preGlobalFilteredRows.length} </strong>
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
