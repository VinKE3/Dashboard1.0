import { useState, useEffect } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import * as Global from "../../../Components/Global";
import Ubigeo from "../../../Components/filtros/Ubigeo";
import moment from "moment";
import { Checkbox } from "primereact/checkbox";
import { toast } from "react-toastify";
import ApiMasy from "../../../api/ApiMasy";

const Empresa = () => {
  const [dataGeneral, setDataGeneral] = useState({
    id: "string",
    numeroDocumentoIdentidad: "string",
    nombre: "string",
    direccion: "string",
    departamentoId: "string",
    provinciaId: "string",
    distritoId: "string",
    telefono: "string",
    celular: "string",
    correoElectronico: "string",
    observacion: "string",
    concarEmpresaId: "string",
    concarEmpresaNombre: "string",
    concarUsuarioVenta: "string",
    concarUsuarioCompra: "string",
    concarUsuarioPago: "string",
    concarUsuarioCobro: "string",
    filtroFechaInicio: "2023-03-30T15:29:23.945Z",
    filtroFechaFin: "2023-03-30T15:29:23.945Z",
    anioHabilitado1: 2022,
    anioHabilitado2: 2023,
    mesesHabilitados: "string",
    porcentajesIGV: [
      {
        porcentaje: 0,
        default: true,
      },
    ],
    porcentajesRetencion: [
      {
        porcentaje: 0,
        default: true,
      },
    ],
    porcentajesDetraccion: [
      {
        porcentaje: 0,
        default: true,
      },
    ],
    porcentajesPercepcion: [
      {
        porcentaje: 0,
        default: true,
      },
    ],
  });
  const [dataUbigeo, setDataUbigeo] = useState([]);
  const [checkboxes, setCheckboxes] = useState({
    checked: true,
    enero: true,
    febrero: true,
    marzo: true,
    abril: true,
    mayo: true,
    junio: true,
    julio: true,
    agosto: true,
    septiembre: true,
    octubre: true,
    noviembre: true,
    diciembre: true,
  });
  const [checkboxes2, setCheckboxes2] = useState({
    checked: true,
    enero: true,
    febrero: true,
    marzo: true,
    abril: true,
    mayo: true,
    junio: true,
    julio: true,
    agosto: true,
    septiembre: true,
    octubre: true,
    noviembre: true,
    diciembre: true,
  });

  useEffect(() => {
    dataUbigeo;
    if (Object.keys(dataUbigeo).length > 0) {
      setDataGeneral({
        ...dataGeneral,
        departamentoId: dataUbigeo.departamentoId,
        provinciaId: dataUbigeo.provinciaId,
        distritoId: dataUbigeo.distritoId,
      });
    }
  }, [dataUbigeo]);

  const ValidarData = async ({ target }) => {
    if (target.name == "correoElectronico") {
      setDataGeneral((prevState) => ({
        ...prevState,
        [target.name]: target.value,
      }));
    } else {
      setDataGeneral((prevState) => ({
        ...prevState,
        [target.name]: target.value.toUpperCase(),
      }));
    }
  };

  const handleCheckAll = (e) => {
    const newChecked = e.target.checked;
    setCheckboxes({
      checked: newChecked,
      enero: newChecked,
      febrero: newChecked,
      marzo: newChecked,
      abril: newChecked,
      mayo: newChecked,
      junio: newChecked,
      julio: newChecked,
      agosto: newChecked,
      septiembre: newChecked,
      octubre: newChecked,
      noviembre: newChecked,
      diciembre: newChecked,
    });
  };
  const handleCheck = (name, value) => {
    setCheckboxes((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleCheckAll2 = (e) => {
    const newChecked = e.target.checked;
    setCheckboxes2({
      checked: newChecked,
      enero: newChecked,
      febrero: newChecked,
      marzo: newChecked,
      abril: newChecked,
      mayo: newChecked,
      junio: newChecked,
      julio: newChecked,
      agosto: newChecked,
      septiembre: newChecked,
      octubre: newChecked,
      noviembre: newChecked,
      diciembre: newChecked,
    });
  };

  const handleCheck2 = (name, value) => {
    setCheckboxes2((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="card">
      <TabView>
        <TabPanel
          header="Datos Principales"
          leftIcon="pi pi-user mr-2"
          style={{ color: "white" }}
        >
          <div className="grid gap-y-3 md:gap-x-2">
            <div className={Global.ContenedorVarios}>
              <div className={Global.ContenedorInput96}>
                <label
                  htmlFor="numeroDocumentoIdentidad"
                  className={Global.LabelStyle}
                >
                  Número Doc
                </label>
                <input
                  type="text"
                  id="numeroDocumentoIdentidad"
                  name="numeroDocumentoIdentidad"
                  autoComplete="off"
                  placeholder="Número Documento Identidad"
                  value={dataGeneral.numeroDocumentoIdentidad}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.ContenedorInputFull}>
                <label htmlFor="nombre" className={Global.LabelStyle}>
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  autoComplete="off"
                  placeholder="Nombre"
                  value={dataGeneral.nombre}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
            <div className={Global.ContenedorVarios}>
              <div className={Global.ContenedorInput96}>
                <label htmlFor="telefono" className={Global.LabelStyle}>
                  Teléfono
                </label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  autoComplete="off"
                  placeholder="Teléfono"
                  value={dataGeneral.telefono}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.ContenedorInputFull}>
                <label
                  htmlFor="correoElectronico"
                  className={Global.LabelStyle}
                >
                  Correo
                </label>
                <input
                  type="text"
                  id="correoElectronico"
                  name="correoElectronico"
                  autoComplete="off"
                  placeholder="Correo"
                  value={dataGeneral.correoElectronico}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
            <div className={Global.ContenedorVarios}>
              <div className={Global.ContenedorInput96}>
                <label htmlFor="celular" className={Global.LabelStyle}>
                  Celular
                </label>
                <input
                  type="text"
                  id="celular"
                  name="celular"
                  autoComplete="off"
                  placeholder="Celular"
                  value={dataGeneral.celular}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.ContenedorInputFull}>
                <label htmlFor="observacion" className={Global.LabelStyle}>
                  Observacion
                </label>
                <input
                  type="text"
                  id="observacion"
                  name="observacion"
                  autoComplete="off"
                  placeholder="Observacion"
                  value={dataGeneral.observacion}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
            <div className="flex">
              <label htmlFor="direccion" className={Global.LabelStyle}>
                Dirección
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                autoComplete="off"
                placeholder="Dirección"
                value={dataGeneral.direccion}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
            </div>
            <Ubigeo
              setDataUbigeo={setDataUbigeo}
              id={["departamentoId", "provinciaId", "distritoId"]}
              dato={{
                departamentoId: dataGeneral.departamentoId,
                provinciaId: dataGeneral.provinciaId,
                distritoId: dataGeneral.distritoId,
              }}
            ></Ubigeo>
            <div className={Global.ContenedorVarios}>
              <div className={Global.ContenedorInput96}>
                <label htmlFor="concarEmpresaId" className={Global.LabelStyle}>
                  Id Concar
                </label>
                <input
                  type="text"
                  id="concarEmpresaId"
                  name="concarEmpresaId"
                  autoComplete="off"
                  placeholder="Número Concar Id"
                  value={dataGeneral.concarEmpresaId}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.ContenedorInputFull}>
                <label
                  htmlFor="concarEmpresaNombre"
                  className={Global.LabelStyle}
                >
                  Empresa Concar
                </label>
                <input
                  type="text"
                  id="concarEmpresaNombre"
                  name="concarEmpresaNombre"
                  autoComplete="off"
                  placeholder="Empresa Concar"
                  value={dataGeneral.nombre}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
            <div className={Global.ContenedorVarios}>
              <div className={Global.ContenedorInputFull}>
                <label
                  htmlFor="concarUsuarioVenta"
                  className={Global.LabelStyle}
                >
                  Usuario Venta
                </label>
                <input
                  type="text"
                  id="concarUsuarioVenta"
                  name="concarUsuarioVenta"
                  autoComplete="off"
                  placeholder="Usuario Venta"
                  value={dataGeneral.concarUsuarioVenta}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.ContenedorInputFull}>
                <label
                  htmlFor="concarUsuarioCompra"
                  className={Global.LabelStyle}
                >
                  Usuario Compra
                </label>
                <input
                  type="text"
                  id="concarUsuarioCompra"
                  name="concarUsuarioCompra"
                  autoComplete="off"
                  placeholder="Usuario Compra"
                  value={dataGeneral.concarUsuarioCompra}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
            <div className={Global.ContenedorVarios}>
              <div className={Global.ContenedorInputFull}>
                <label
                  htmlFor="concarUsuarioPago"
                  className={Global.LabelStyle}
                >
                  Usuario Pago
                </label>
                <input
                  type="text"
                  id="concarUsuarioPago"
                  name="concarUsuarioPago"
                  autoComplete="off"
                  placeholder="Usuario Pago"
                  value={dataGeneral.concarUsuarioVenta}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.ContenedorInputFull}>
                <label
                  htmlFor="concarUsuarioCobro"
                  className={Global.LabelStyle}
                >
                  Usuario Cobro
                </label>
                <input
                  type="text"
                  id="concarUsuarioCobro"
                  name="concarUsuarioCobro"
                  autoComplete="off"
                  placeholder="Usuario Cobro"
                  value={dataGeneral.concarUsuarioCompra}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
            <div className={Global.ContenedorInputFull}>
              <h1 className=" uppercase font-bold">Filtro de Fechas</h1>
            </div>
            <div className={Global.ContenedorVarios}>
              <div className={Global.ContenedorInputFull}>
                <label
                  htmlFor="filtroFechaInicio"
                  className={Global.LabelStyle}
                >
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  id="filtroFechaInicio"
                  name="filtroFechaInicio"
                  autoComplete="off"
                  placeholder="Fecha Inicio"
                  value={moment(dataGeneral.filtroFechaInicio).format(
                    "yyyy-MM-DD"
                  )}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
              <div className={Global.ContenedorInputFull}>
                <label htmlFor="filtroFechaFin" className={Global.LabelStyle}>
                  Fecha Fin
                </label>
                <input
                  type="date"
                  id="filtroFechaFin"
                  name="filtroFechaFin"
                  autoComplete="off"
                  placeholder="Fecha Fin"
                  value={moment(dataGeneral.filtroFechaFin).format(
                    "yyyy-MM-DD"
                  )}
                  onChange={ValidarData}
                  className={Global.InputStyle}
                />
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel
          header="Habilitar Periodo"
          leftIcon="pi pi-calendar mr-2"
          style={{ color: "white" }}
        >
          <div className={Global.ContenedorInputFull}>
            <label htmlFor="anioHabilitado1" className={Global.LabelStyle}>
              Año 1
            </label>
            <input
              type="number"
              id="anioHabilitado1"
              name="anioHabilitado1"
              autoComplete="off"
              placeholder="año"
              value={dataGeneral.anioHabilitado1}
              onChange={ValidarData}
              className={Global.InputStyle}
            />
            <div className="flex mt-2 gap-2 ml-2">
              <label>Todos</label>
              <Checkbox
                onChange={handleCheckAll}
                checked={checkboxes.checked}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4 ml-2">
            <div className="flex gap-3">
              <Checkbox
                onChange={(e) => handleCheck("enero", e.target.checked)}
                checked={checkboxes.enero}
              />
              <label>Enero</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                onChange={(e) => handleCheck("febrero", e.target.checked)}
                checked={checkboxes.febrero}
              />
              <label>Febrero</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                onChange={(e) => handleCheck("marzo", e.target.checked)}
                checked={checkboxes.marzo}
              />
              <label>Marzo</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                onChange={(e) => handleCheck("abril", e.target.checked)}
                checked={checkboxes.abril}
              />
              <label>Abril</label>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4 ml-2">
            <div className="flex gap-3">
              <Checkbox
                onChange={(e) => handleCheck("mayo", e.target.checked)}
                checked={checkboxes.mayo}
              />
              <label>Mayo</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                onChange={(e) => handleCheck("junio", e.target.checked)}
                checked={checkboxes.junio}
              />
              <label>Junio</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                onChange={(e) => handleCheck("julio", e.target.checked)}
                checked={checkboxes.julio}
              />
              <label>Julio</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                onChange={(e) => handleCheck("agosto", e.target.checked)}
                checked={checkboxes.agosto}
              />
              <label>Agosto</label>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4 ml-2">
            <div className="flex gap-3">
              <Checkbox
                onChange={(e) => handleCheck("septiembre", e.target.checked)}
                checked={checkboxes.septiembre}
              />
              <label>Septiembre</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                onChange={(e) => handleCheck("octubre", e.target.checked)}
                checked={checkboxes.octubre}
              />
              <label>Octubre</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                onChange={(e) => handleCheck("noviembre", e.target.checked)}
                checked={checkboxes.noviembre}
              />
              <label>Noviembre</label>
            </div>
            <div className="flex gap-3">
              <Checkbox
                onChange={(e) => handleCheck("diciembre", e.target.checked)}
                checked={checkboxes.diciembre}
              />
              <label>Diciembre</label>
            </div>
          </div>
          <div className="mt-4">
            <div className={Global.ContenedorInputFull}>
              <label htmlFor="anioHabilitado2" className={Global.LabelStyle}>
                Año 2
              </label>
              <input
                type="number"
                id="anioHabilitado2"
                name="anioHabilitado2"
                autoComplete="off"
                placeholder="año"
                value={dataGeneral.anioHabilitado2}
                onChange={ValidarData}
                className={Global.InputStyle}
              />
              <div className="flex mt-2 gap-2 ml-2">
                <label>Todos</label>
                <Checkbox
                  onChange={handleCheckAll2}
                  checked={checkboxes2.checked}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4 ml-2">
              <div className="flex gap-3">
                <Checkbox
                  onChange={(e) => handleCheck2("enero", e.target.checked)}
                  checked={checkboxes2.enero}
                />
                <label>Enero</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  onChange={(e) => handleCheck2("febrero", e.target.checked)}
                  checked={checkboxes2.febrero}
                />
                <label>Febrero</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  onChange={(e) => handleCheck2("marzo", e.target.checked)}
                  checked={checkboxes2.marzo}
                />
                <label>Marzo</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  onChange={(e) => handleCheck2("abril", e.target.checked)}
                  checked={checkboxes2.abril}
                />
                <label>Abril</label>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4 ml-2">
              <div className="flex gap-3">
                <Checkbox
                  onChange={(e) => handleCheck2("mayo", e.target.checked)}
                  checked={checkboxes2.mayo}
                />
                <label>Mayo</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  onChange={(e) => handleCheck2("junio", e.target.checked)}
                  checked={checkboxes2.junio}
                />
                <label>Junio</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  onChange={(e) => handleCheck2("julio", e.target.checked)}
                  checked={checkboxes2.julio}
                />
                <label>Julio</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  onChange={(e) => handleCheck2("agosto", e.target.checked)}
                  checked={checkboxes2.agosto}
                />
                <label>Agosto</label>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4 ml-2">
              <div className="flex gap-3">
                <Checkbox
                  onChange={(e) => handleCheck2("septiembre", e.target.checked)}
                  checked={checkboxes2.septiembre}
                />
                <label>Septiembre</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  onChange={(e) => handleCheck2("octubre", e.target.checked)}
                  checked={checkboxes2.octubre}
                />
                <label>Octubre</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  onChange={(e) => handleCheck2("noviembre", e.target.checked)}
                  checked={checkboxes2.noviembre}
                />
                <label>Noviembre</label>
              </div>
              <div className="flex gap-3">
                <Checkbox
                  onChange={(e) => handleCheck2("diciembre", e.target.checked)}
                  checked={checkboxes2.diciembre}
                />
                <label>Diciembre</label>
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>
      <div className="mt-2">
        <button className={Global.BotonOkModal} type="button">
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default Empresa;
