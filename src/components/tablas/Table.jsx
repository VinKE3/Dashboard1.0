import React from "react";
import { useTable, usePagination, useSortBy } from "react-table";
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

const Table = ({ columnas, datos, total, index, Click, paginas = 50 }) => {
  //#region useState
  const columns = columnas;
  const data = datos;
  const totalPaginas = total;
  const cantidadRegistros = paginas;
  const numeroPaginas = parseInt(Math.ceil(totalPaginas / cantidadRegistros));
  //#endregion

  //#region Funciones
  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    useTable(
      { columns, data, initialState: { pageSize: paginas } },
      useSortBy,
      usePagination
    );
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
    <div className="flex flex-col overflow-x-auto rounded md:text-sm">
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
      {/* Tabla */}

      {/* Footer */}
      <div className={Global.TFooter}>
        {/* Total de registros */}
        <div className={Global.TotalRegistros}>
          <span className="text-center align-text-bottom ">
            {"Total de registros: "}
            <span className="font-bold text-primary">{totalPaginas}</span>
          </span>
        </div>
        {/* Total de registros */}

        {/* Pagina 1 de total */}
        <div className="min-w-fit py-1 sm:py-3 sm:px-3 flex align-items-center justify-center">
          <span className="text-center align-text-bottom">
            {"Página "}
            <span className="font-bold text-primary">{index + 1}</span>
            {" de "}
            <span className="font-bold text-primary">{numeroPaginas} </span>
          </span>
        </div>
        {/* Pagina 1 de total */}

        {/* Paginado */}
        <ReactPaginate
          pageRangeDisplayed={2}
          onPageChange={Click}
          pageCount={
            totalPaginas == 0
              ? 1
              : parseInt(Math.ceil(totalPaginas / cantidadRegistros))
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
        {/* Paginado */}
      </div>
      {/* Footer */}
    </div>
  );
  //#endregion
};

export default React.memo(Table);
