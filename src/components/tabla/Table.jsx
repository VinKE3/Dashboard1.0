import React from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import { FaAngleDoubleRight, FaAngleDoubleLeft } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import * as Global from "../Global";
import * as Funciones from "../funciones/Validaciones";

const Table = ({
  id = "tabla",
  columnas,
  datos,
  total,
  index,
  paginas = 50,
  estilos = ["", "", "", "", "", "", ""],
  foco = false,
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
    <div className="h-full w-full flex flex-col rounded ">
      {/* Tabla */}
      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          id={id}
          autoFocus={foco}
          tabIndex={0}
          onKeyDown={(e) => {
            Funciones.MoverFlecha(e, "#" + id);
            KeyDown(e);
          }}
          className={Global.Table + estilos[0]}
        >
          <thead className={Global.THeader + estilos[1]}>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={Global.Th + estilos[3]}
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
      </div>

      {/* Tabla */}

      {/* Footer */}
      <div className={Global.ContenedorTablaFooter}>
        <div className={Global.ContenedorTotalPaginas}>
          {/* Total de registros */}
          <div className="min-w-fit">
            <span className={Global.FooterTexto}>
              {"Total de registros: "}
              <span className="text-primary">{totalPaginas}</span>
            </span>
          </div>
          {/* Total de registros */}
        </div>

        <div className={Global.ContendorPaginacion}>
          {/* Pagina 1 de total */}
          <div className="min-w-fit">
            <span className={Global.FooterTexto}>
              {"Página "}
              <span className="text-primary">{index + 1}</span>
              {" de "}
              <span className="text-primary">{numeroPaginas} </span>
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
            containerClassName={Global.ContendorBotonesPaginacion}
            pageClassName="flex"
            breakClassName="flex align-items-center justify-center"
            pageLinkClassName={Global.BotonPaginacion + Global.BotonPrimary}
            breakLinkClassName={Global.BotonPaginacion + Global.BotonPrimary}
            previousLinkClassName={
              Global.BotonPaginacion + Global.BotonPrimary + " !w-8 rounded-l"
            }
            nextLinkClassName={
              Global.BotonPaginacion + Global.BotonPrimary + " !w-8 rounded-r"
            }
            activeLinkClassName={Global.BotonPaginacionActivo}
          />
          {/* Paginado */}
        </div>
      </div>
      {/* Footer */}
    </div>
  );
  //#endregion
};

export default React.memo(Table);
