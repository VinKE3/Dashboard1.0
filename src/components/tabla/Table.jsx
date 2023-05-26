import React from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import { FaAngleDoubleRight, FaAngleDoubleLeft } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import * as Global from "../Global";
import * as Funciones from "../funciones/Validaciones";

const Tabla = styled.div`
  & .selected-row {
    /* background: linear-gradient(90deg, #d2ae11 0%, #d9ad22 100%); */
    background: linear-gradient(90deg, #1a3e5f 0%, #25358d 100%);
  }
`;

const Table = ({
  id = "tabla",
  columnas,
  datos,
  total,
  index,
  paginas = 50,
  estilos = ["", "", "", "", "", "", ""],
  Click,
  DobleClick = () => {},
  KeyDown = (e) => {},
}) => {
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

  //#region Render
  return (
    <div className="flex flex-col overflow-x-auto rounded md:text-sm">
      {/* Tabla */}
      <Tabla>
        <table
          {...getTableProps()}
          id={id}
          className={"w-full text-light focus:outline-none " + estilos[0]}
          tabIndex={0}
          onKeyDown={(e) => {
            Funciones.MoverFlecha(e, "#" + id);
            KeyDown(e);
          }}
        >
          <thead className={Global.THeader + estilos[1]}>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
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
                  onClick={(e) => Funciones.Seleccionar(e)}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className={Global.Td + estilos[6]}
                        onDoubleClick={DobleClick}
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
      {/* Tabla */}

      {/* Footer */}
      <div className={Global.TFooter}>
        {/* Total de registros */}
        <div className={Global.TotalRegistros}>
          <span className="text-center align-text-bottom font-semibold ">
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
