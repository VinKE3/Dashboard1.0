import React, { useState } from "react";
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useSortBy,
} from "react-table";
import { FaAngleDoubleRight, FaAngleDoubleLeft } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import * as Global from "../Global";

const Tabla = styled.div`
  & .selected-row {
    /* background: linear-gradient(90deg, #d2ae11 0%, #d9ad22 100%); */
    background: linear-gradient(90deg, #1a3e5f 0%, #25358d 100%);
  }
`;

const Table = ({ columnas, datos, total, index, Click }) => {
  //#region useState
  const columns = columnas;
  const data = datos;
  const totalPaginas = total;
  // const indexPaginas = index;
  const itemsPerPage = 50;
  const paginado = parseInt(Math.ceil(totalPaginas / itemsPerPage));
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

  //#region Funciones
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
  const MoverFlecha = async (e) => {
    if (e.keyCode == 40 || e.keyCode == 38) {
      let row = document
        .querySelector("#tabla")
        .querySelector("tr.selected-row");

      if (row != null) {
        let filaAnterior = row.previousElementSibling;
        let filaSiguiente = row.nextElementSibling;
        if (e.keyCode == 40) {
          if (filaSiguiente != null) {
            row.classList.remove("selected-row");
            filaSiguiente.classList.add("selected-row");
          }
        } else if (e.keyCode == 38) {
          if (filaAnterior != null) {
            row.classList.remove("selected-row");
            filaAnterior.classList.add("selected-row");
          }
        }
      }
    }
  };
  //#endregion

  //#region Render
  return (
    <div className="flex flex-col overflow-x-auto shadow-md rounded md:text-sm">
      {/* Tabla */}
      <Tabla>
        <table
          {...getTableProps()}
          id="tabla"
          className="w-full text-light focus:outline-none "
          tabIndex={0}
          onKeyDown={(e) => MoverFlecha(e)}
        >
          <thead className={Global.THeader}>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={"p-2 "}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()} className={Global.TBody}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className={Global.Tr}
                  onClick={(e) => Seleccionar(e)}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()} className={Global.Td}>
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
      <div className="py-1 flex flex-col sm:flex-row align-items-center justify-center bg-secondary-900 text-light text-base">
        {/* Total de registros */}
        <div className="min-w-fit py-1 sm:py-3 sm:px-3 flex flex-1 align-items-center justify-center sm:justify-start">
          <span className="text-center align-text-bottom ">
            {"Total de registros: "}
            <span className="font-bold text-primary">{totalPaginas}</span>
          </span>
        </div>
        {/* Pagina 1 de total */}
        <div className="min-w-fit py-1 sm:py-3 sm:px-3 flex align-items-center justify-center">
          <span className="text-center align-text-bottom">
            {"Página "}
            <span className="font-bold text-primary">{index + 1}</span>
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
          pageLinkClassName={Global.BotonPaginacion}
          breakLinkClassName={Global.BotonPaginacion}
          nextLinkClassName={Global.BotonPaginacionFlechas}
          previousLinkClassName={Global.BotonPaginacionFlechas}
          activeLinkClassName={Global.BotonPaginacionActivo}
        />
      </div>
    </div>
  );
  //#endregion
};

export default React.memo(Table);
