import React from "react";
import styled from "styled-components";
import * as Global from "../Global";
import * as Funciones from "../Funciones/Validaciones";
import {
  useTable,
  useGlobalFilter,
  usePagination,
  useSortBy,
} from "react-table";

//#region Estilos
const Tabla = styled.div`
  overflow: auto;
  border-radius: 5px;
  & .selected-row {
    background: linear-gradient(90deg, #0a5d8d 10%, #093955 50%);
  }
`;
//#endregion

const TableBasic = ({
  id = "tablaBasic",
  columnas,
  datos,
  estilos = ["", "", "", "", "", "", ""],
}) => {
  //#region Columnas y Datos
  const columns = columnas;
  const data = datos;
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

  //#region Render
  return (
    <>
      {/* Tabla */}
      <Tabla>
        <table
          {...getTableProps()}
          id={id}
          className={"w-full text-light focus:outline-none " + estilos[0]}
          tabIndex={0}
          onKeyDown={(e) => Funciones.MoverFlecha(e, "#" + id)}
        >
          <thead className={Global.THeader + estilos[1]}>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className={estilos[2]}>
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
    </>
  );
  //#endregion
};

export default TableBasic;
