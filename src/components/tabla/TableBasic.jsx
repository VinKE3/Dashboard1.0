import React from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import styled from "styled-components";
import * as G from "../Global";
import * as Funciones from "../funciones/Validaciones";

//#region Estilos
const Tabla = styled.div`
  overflow: auto;
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
  Click = (e) => {},
  DobleClick = () => {},
  KeyDown = (e) => {},
}) => {
  //#region Columnas y Datos
  const columns = columnas;
  const data = datos;
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

  //#region Render
  return (
    <>
      {/* Tabla */}
      <Tabla>
        <table
          {...getTableProps()}
          id={id}
          className={G.Table + estilos[0]}
          tabIndex={0}
          onKeyDown={(e) => {
            Funciones.MoverFlecha(e, "#" + id);
            KeyDown(e);
          }}
        >
          <thead className={G.THeader + estilos[1]}>
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                className={G.Tr + estilos[2]}
              >
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={G.Th + estilos[3]}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()} className={G.TBody + estilos[4]}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className={G.Tr + estilos[5]}
                  onClick={(e) => {
                    Funciones.Seleccionar(e);
                    Click(e);
                  }}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className={G.Td + estilos[6]}
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
    </>
  );
  //#endregion
};

export default TableBasic;
