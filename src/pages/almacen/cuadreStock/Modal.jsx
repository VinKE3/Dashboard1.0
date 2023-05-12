import React, { useState, useEffect, useMemo } from "react";
import ModalBasic from "../../../components/ModalBasic";
import * as Global from "../../../components/Global";
import { Fieldset } from "primereact/fieldset";
import { RadioButton } from "primereact/radiobutton";
import moment from "moment";
import ApiMasy from "../../../api/ApiMasy";
import Table from "../../../components/tablas/Table";
import styled from "styled-components";
import ModalCrud from "../../../components/ModalCrud";

//#region Estilos
const TablaStyle = styled.div`
  & th:first-child {
    display: none;
  }
  & tbody td:first-child {
    display: none;
  }
  & th:last-child {
    width: 130px;
    text-align: center;
  }
`;

const Modal = ({ setModal, setRespuestaModal, modo, objeto, detalle }) => {
  //#region useState
  const [data, setData] = useState(objeto);
  const [datos, setDatos] = useState(detalle);
  const [moneda, setMoneda] = useState([]);
  const [vendedor, setVendedor] = useState([]);
  const [tipo, setTipo] = useState("todos");
  const [total, setTotal] = useState(0);

  //#endregion

  //#region useEffect
  useEffect(() => {
    data;
    datos;
  }, [data, datos]);

  useEffect(() => {
    GetTablas();
  }, []);

  //#endregion

  //#region Funciones
  const ValidarData = async ({ target }) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value.toUpperCase(),
    }));
  };

  const GetTablas = async () => {
    const result = await ApiMasy(`/api/almacen/cuadreStock/FormularioTablas`);
    setMoneda(result.data.data.monedas);
    let model = result.data.data.vendedores.map((res) => ({
      responsableId: res.apellidoPaterno + res.apellidoMaterno + res.nombres,
      ...res,
    }));
    setVendedor(model);
    setTotal(datos.length);
  };

  //#endregion

  //#region Funciones Filtrado
  const FiltradoPaginado = (e) => {
    // let fechaInicio = document.getElementById("fechaInicio").value;
    // let fechaFin = document.getElementById("fechaFin").value;
    // let boton = e.selected + 1;
    // setIndex(e.selected);
    // if (
    //   fechaInicio ==
    //     moment().subtract(2, "years").startOf("year").format("yyyy-MM-DD") &&
    //   fechaFin == moment(new Date()).format("yyyy-MM-DD")
    // ) {
    //   Listar("", boton);
    // } else {
    //   Listar(`&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, boton);
    // }
    console.log(e);
  };

  //#endregion

  //#region Columnas y Selects
  const columnas = [
    {
      Header: "id",
      accessor: "articuloId",
    },
    {
      Header: "Marca",
      accessor: "marcaNombre",
    },
    {
      Header: "Descripcion",
      accessor: "descripcion",
    },
    {
      Header: "U.Medida",
      accessor: "unidadMedidaDescripcion",
    },
    {
      Header: "Stock Final",
      accessor: "stockFinal",
    },
    {
      Header: "Inventario",
      accessor: "inventario",
    },
    {
      Header: "P.Unitario",
      accessor: "precioUnitario",
    },
    {
      Header: "Cant.Falta",
      accessor: "cantidadFalta",
    },
    {
      Header: "Total Falta",
      accessor: "totalFalta",
    },
    {
      Header: "Cant.Sobra",
      accessor: "cantidadSobra",
    },
    {
      Header: "Total Sobra",
      accessor: "totalSobra",
    },
    {
      Header: "Cant.Saldo",
      accessor: "cantidadSaldo",
    },
    {
      Header: "Total Saldo",
      accessor: "totalSaldo",
    },
  ];

  const tiposExistencia = {
    todos: "",
    mercaderia: "01",
    terminados: "02",
    materia: "03",
    envasesEmbalajes: "04",
    otros: "05",
  };

  const filtrarDatos = (tipo) => {
    if (tipo === "todos") {
      setDatos(detalle);
    } else {
      const datosFiltrados = detalle.filter(
        (dato) => dato.tipoExistenciaId === tiposExistencia[tipo]
      );
      setDatos(datosFiltrados);
    }
    setTipo(tipo);
  };

  // Función para manejar el cambio en el valor del radiobutton
  const handleTipoChange = (e) => {
    setTipo(e.value);

    // Si el valor es "todos", mostramos todos los registros, sin aplicar filtro
    if (e.value === "todos") {
      setDatos(detalle);
    } else {
      // Aplicamos el filtro por tipoExistenciaId al estado actualizado de los datos (filtrados por marca)
      const datosFiltrados = datos.filter(
        (registro) => registro.tipoExistenciaId === e.value
      );
      setDatos(datosFiltrados);
    }
  };

  // Función para manejar la búsqueda por marca
  const handleMarcaChange = (e) => {
    const valorBusqueda = e.target.value.toLowerCase();
    const datosFiltrados = detalle.filter((registro) =>
      registro.marcaNombre.toLowerCase().includes(valorBusqueda)
    );
    setDatos(datosFiltrados);
  };

  // Función para manejar la búsqueda por descripción
  const handleDescripcionChange = (e) => {
    const valorBusqueda = e.target.value.toLowerCase();
    const datosFiltrados = detalle.filter((registro) =>
      registro.descripcion.toLowerCase().includes(valorBusqueda)
    );
    setDatos(datosFiltrados);
  };
  //#endregion

  //#region  Render
  return (
    <ModalCrud
      setModal={setModal}
      setRespuestaModal={setRespuestaModal}
      objeto={data}
      modo={modo}
      menu={["Almacen", "CuadreStock"]}
      tamañoModal={[Global.ModalFull, Global.Form]}
      titulo={"Cuadre de Stock"}
      cerrar={false}
    >
      <div className="gap-3 grid">
        <div className={Global.ContenedorBasico}>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <label htmlFor="id" className={Global.LabelStyle}>
                Código De Registro
              </label>
              <input
                type="text"
                id="id"
                name="id"
                maxLength="2"
                autoComplete="off"
                placeholder="00"
                readOnly={true}
                value={data.id}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.InputFull}>
              <label htmlFor="numero" className={Global.LabelStyle}>
                Cuadre de Stock
              </label>
              <input
                type="text"
                id="numero"
                name="numero"
                autoComplete="off"
                placeholder="Cuadre de Stock"
                readOnly={true}
                value={data.numero}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
          </div>
        </div>
        <div className={Global.ContenedorBasico}>
          <div className={Global.ContenedorInputs + " pb-3"}>
            <div className={Global.InputFull}>
              <label htmlFor="fechaRegistro" className={Global.LabelStyle}>
                Fecha Registro
              </label>
              <input
                type="date"
                id="fechaRegistro"
                name="fechaRegistro"
                maxLength="2"
                autoComplete="off"
                readOnly={modo == "Consultar" ? true : false}
                value={moment(data.fechaRegistro).format("yyyy-MM-DD")}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.InputFull}>
              <label htmlFor="numero" className={Global.LabelStyle}>
                Moneda
              </label>
              <select
                id="moneda"
                name="moneda"
                readOnly={modo == "Consultar" ? true : false}
                value={data.moneda}
                onChange={ValidarData}
                className={Global.InputStyle}
              >
                {moneda.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <div className={Global.InputFull}>
              <label htmlFor="tipoCambio" className={Global.LabelStyle}>
                Tipo De Cambio
              </label>
              <input
                type="text"
                id="tipoCambio"
                name="tipoCambio"
                autoComplete="off"
                placeholder="Cuadre de Stock"
                readOnly={modo == "Consultar" ? true : false}
                value={data.tipoCambio}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
          </div>
          <div className={Global.ContenedorInputs + " pb-3"}>
            <div className={Global.Input42pct}>
              <label htmlFor="responsableId" className={Global.LabelStyle}>
                Vendedores
              </label>
              <select
                id="responsableId"
                name="responsableId"
                readOnly={modo == "Consultar" ? true : false}
                value={data.responsableId}
                onChange={ValidarData}
                className={Global.InputStyle}
              >
                {vendedor.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.responsableId}
                  </option>
                ))}
              </select>
            </div>
            <div className={Global.InputFull}>
              <label htmlFor="observacion" className={Global.LabelStyle}>
                Observación
              </label>
              <input
                type="text"
                id="observacion"
                name="observacion"
                autoComplete="off"
                placeholder="Observacion"
                readOnly={modo == "Consultar" ? true : false}
                value={data.observacion}
                onChange={ValidarData}
                className={Global.InputStyle}
              ></input>
            </div>
          </div>
        </div>
        <div className={Global.ContenedorBasico}>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <label htmlFor="totalSobra" className={Global.LabelStyle}>
                Total Sobra
              </label>
              <input
                type="text"
                id="totalSobra"
                name="totalSobra"
                autoComplete="off"
                placeholder="00"
                readOnly={true}
                value={data.totalSobra}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.InputFull}>
              <label htmlFor="totalFalta" className={Global.LabelStyle}>
                Total Sobra
              </label>
              <input
                type="text"
                id="totalFalta"
                name="totalFalta"
                autoComplete="off"
                placeholder="00"
                readOnly={true}
                value={data.totalFalta}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.InputFull}>
              <label htmlFor="saldoTotal" className={Global.LabelStyle}>
                Saldo Total
              </label>
              <input
                type="text"
                id="saldoTotal"
                name="saldoTotal"
                autoComplete="off"
                placeholder="00"
                readOnly={true}
                value={data.saldoTotal}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
          </div>
        </div>
        <div className={Global.ContenedorBasico}>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputMitad}>
              <label htmlFor="marca" className={Global.LabelStyle}>
                Marca
              </label>
              <input
                type="text"
                id="marca"
                name="marca"
                autoComplete="off"
                placeholder="Marca"
                onChange={handleMarcaChange}
                className={Global.InputStyle}
              />
            </div>
            <div className={Global.InputMitad}>
              <label htmlFor="descripcion" className={Global.LabelStyle}>
                Descripcion
              </label>
              <input
                type="text"
                id="descripcion"
                name="descripcion"
                autoComplete="off"
                placeholder="Descripcion"
                onChange={handleDescripcionChange}
                className={Global.InputStyle}
              />
            </div>
          </div>
        </div>
        <div className={Global.ContenedorBasico}>
          <div className={Global.ContenedorInputs}>
            <div className={Global.InputFull}>
              <div className={Global.LabelStyle}>
                <RadioButton
                  inputId="todos"
                  name="todos"
                  value="todos"
                  onChange={(e) => filtrarDatos(e.target.value)}
                  checked={tipo === "todos"}
                />
              </div>
              <label htmlFor="todos" className={Global.InputStyle}>
                Todos
              </label>
            </div>
            <div className={Global.InputFull}>
              <div className={Global.LabelStyle}>
                <RadioButton
                  inputId="mercaderia"
                  name="mercaderia"
                  value="mercaderia"
                  onChange={(e) => filtrarDatos(e.target.value)}
                  checked={tipo === "mercaderia"}
                />
              </div>
              <label htmlFor="mercaderia" className={Global.InputStyle}>
                Mercaderia
              </label>
            </div>
            <div className={Global.InputFull}>
              <div className={Global.LabelStyle}>
                <RadioButton
                  inputId="terminados"
                  name="terminados"
                  value="terminados"
                  onChange={(e) => filtrarDatos(e.target.value)}
                  checked={tipo === "terminados"}
                />
              </div>
              <label htmlFor="terminados" className={Global.InputStyle}>
                Productos Terminados
              </label>
            </div>
            <div className={Global.InputFull}>
              <div className={Global.LabelStyle}>
                <RadioButton
                  inputId="materia"
                  name="materia"
                  value="materia"
                  onChange={(e) => filtrarDatos(e.target.value)}
                  checked={tipo === "materia"}
                />
              </div>
              <label htmlFor="materia" className={Global.InputStyle}>
                Materia Prima
              </label>
            </div>
            <div className={Global.InputFull}>
              <div className={Global.LabelStyle}>
                <RadioButton
                  inputId="envasesEmbalajes"
                  name="envasesEmbalajes"
                  value="envasesEmbalajes"
                  onChange={(e) => filtrarDatos(e.target.value)}
                  checked={tipo === "envasesEmbalajes"}
                />
              </div>
              <label htmlFor="envasesEmbalajes" className={Global.InputStyle}>
                Envases y Embalajes
              </label>
            </div>
            <div className={Global.InputFull}>
              <div className={Global.LabelStyle}>
                <RadioButton
                  inputId="otros"
                  name="otros"
                  value="otros"
                  onChange={(e) => filtrarDatos(e.target.value)}
                  checked={tipo === "otros"}
                />
              </div>

              <label htmlFor="otros" className={Global.InputStyle}>
                Otros
              </label>
            </div>
          </div>
        </div>
      </div>
      <TablaStyle>
        <Table
          columnas={columnas}
          datos={datos}
          total={total}
          //   index={index}
          Click={(e) => FiltradoPaginado(e)}
        ></Table>
      </TablaStyle>
    </ModalCrud>
  );
  //#endregion
};

export default Modal;
