import React from "react";
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useSortBy,
} from "react-table";
import { FaAngleDoubleRight, FaAngleDoubleLeft } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import styled from "styled-components";

const Tabla = styled.div`
  & .selected-row {
    background-color: #f8bc0a;
    color: #000;
  }
`;

const Table = ({ columnas, datos, total, index, Click }) => {
  //#region Columnas y Datos
  const columns = columnas;
  const data = datos;
  const totalPaginas = total;
  const indexPaginas = index;
  const itemsPerPage = 50;
  const paginado = parseInt(Math.ceil(totalPaginas / itemsPerPage));
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
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
  } = useTable(
    { columns, data, initialState: { pageSize: 50 } },
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
    <div className="flex flex-col mt-2 overflow-x-auto shadow-md rounded md:text-sm">
      {/* Div Mostrar filas */}
      {/* <div className="flex align-items-center justify-between"> */}
      {/* Div Mostrar Filas */}
      {/* <div className="flex overflow-hidden rounded-t-lg">
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
      </div> */}

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
      {/* Footer */}
      <div className="py-1 flex flex-col sm:flex-row align-items-center justify-center bg-secondary-900 text-light text-base sm:text-sm">
        {/* Total de registros */}
        <div className="min-w-fit py-1 sm:py-3 sm:px-3 flex flex-1 align-items-center justify-center sm:justify-start">
          <span className="text-center align-text-bottom">
            {"Total de registros: "}
            <span className="font-bold text-primary">{totalPaginas}</span>
          </span>
        </div>
        {/* Pagina 1 de total */}
        <div className="min-w-fit py-1 sm:py-3 sm:px-3 flex align-items-center justify-center">
          <span className="text-center align-text-bottom">
            {"Página "}
            <span className="font-bold text-primary">{indexPaginas + 1}</span>
            {" de "}
            <span className="font-bold text-primary">{paginado} </span>
          </span>
        </div>
        {/* Paginado */}
        <ReactPaginate
          pageRangeDisplayed={2}
          onPageChange={Click}
          pageCount={
            totalPaginas == 0
              ? 1
              : parseInt(Math.ceil(totalPaginas / itemsPerPage))
          }
          forcePage={index}
          nextLabel={<FaAngleDoubleRight className="text-lg" />}
          previousLabel={<FaAngleDoubleLeft className="text-lg" />}
          breakLabel="..."
          renderOnZeroPageCount={null}
          containerClassName="flex align-items-center justify-center flex-wrap font-bold text-black"
          pageClassName="flex"
          breakClassName="flex align-items-center justify-center"
          previousClassName="flex"
          nextClassName="flex"
          pageLinkClassName="px-3 py-2 mx-1 my-1 bg-yellow-400 hover:bg-yellow-500 text-center rounded-md"
          breakLinkClassName="px-2 py-2 mx-1 my-1 bg-yellow-400 hover:bg-yellow-500 text-center rounded-md"
          nextLinkClassName="px-2 py-2 mx-1 my-1 bg-yellow-400 hover:bg-yellow-500 text-center rounded-md"
          previousLinkClassName="px-2 py-2 mx-1 my-1 bg-yellow-400 hover:bg-yellow-500 rounded-md"
          activeLinkClassName="bg-gray-400 text-light"
        />
      </div>
    </div>
  );
  //#endregion
};

export default Table;
