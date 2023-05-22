import React from "react";
import styled from "styled-components";
import * as Global from "../Global";
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

  //#region Funciones
  const SeleccionarFila = (e) => {
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
      let row = document.querySelector("#tablaBasic tr.selected-row");
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
      } else {
        //Valida si tiene al menos una fila para seleccionar
        if (e.target.children[1].children[0] != undefined) {
          e.target.children[1].children[0].classList.add("selected-row");
        }
      }
    } else if (e.keyCode == 13) {
      //Acciona el evento click al presionar enter
      let row = document.querySelector("#tablaBasic tr.selected-row");
      if (row != null) {
        row.classList.remove("selected-row");
        row.querySelector("#boton").click();
      }
    }
  };
  //#endregion

  //#region Render
  return (
    <>
      {/* Tabla */}
      <Tabla>
        <table
          {...getTableProps()}
          id="tablaBasic"
          className={"w-full text-light focus:outline-none " + estilos[0]}
          tabIndex={0}
          onKeyDown={(e) => MoverFlecha(e)}
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
                  onClick={(e) => SeleccionarFila(e)}
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
