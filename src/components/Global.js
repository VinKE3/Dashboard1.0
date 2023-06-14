//#region Padre
export var ContenedorPadre = "h-auto w-full px-2 ";
//#endregion

//#region Modal
export var FondoModal =
  "flex justify-center items-center fixed inset-0 z-50 outline-none bg-neutral-700/60 ";
export var ModalContent =
  "w-full h-full flex flex-col rounded-lg overflow-y-auto bg-gradient-to-b from-neutral-900 to-neutral-800 ";
//Tamaños de Modal
export var ModalFull = "h-full w-full ";
export var ModalGrande = "h-full w-full lg:h-[85%] lg:max-w-7xl ";
export var ModalMediano = "h-full w-full lg:h-[75%] max-h-full lg:max-w-4xl ";
export var ModalPequeño = "h-full w-full md:h-fit md:max-w-2xl lg:max-w-3xl ";
//Tamaños de Modal

export var ModalHeader =
  "flex items-center justify-between pt-3 pb-1.5 px-5 rounded-tt ";
export var ModalBody = "h-full w-full overflow-y-auto overflow-x-hidden ";
export var ModalFooter =
  "flex items-center justify-end gap-x-2 py-2 px-5 rounded-bt ";
export var Form = "w-full h-full py-1.5 px-5 ";
//#endregion

//#region Contendores Inputs
export var ContenedorBasico =
  "grid gap-y-1.5 md:gap-y-2 md:gap-x-2 py-3 px-2 rounded-lg border border-gray-700 overflow-y-auto ";
export var ContenedorFiltro =
  "grid gap-y-1 md:gap-x-2 p-0 mb-2 overflow-y-auto ";
export var FondoContenedor = "bg-contenedor shadow-md shadow-gray-700/60 ";
export var ContenedorInputs =
  "flex flex-col md:flex-row gap-y-1.5 md:gap-x-2 overflow-x-auto ";
export var ContenedorInputsFiltro =
  "flex flex-col sm:flex-row sm:justify-between gap-y-1.5 md:gap-y-2 sm:gap-x-2 my-2 ";
export var ContenedorRow = "flex flex-row gap-y-3 gap-x-2 ";
export var ContenedorBotonesSubModal = "py-1 gap-x-2 flex items-center justify-start ";
export var Input = "flex min-w-min ";
export var InputFull = "flex w-full min-w-min ";
export var InputMitad = "flex min-w-min md:w-1/2";
export var InputTercio = "flex min-w-min md:w-4/12";
export var Input20pct = "flex min-w-min md:w-1/5";
export var Input25pct = "flex min-w-min md:w-1/3";
export var Input33pct = "flex min-w-min md:w-1/4";
export var Input40pct = "flex min-w-min md:w-2/5";
export var Input42pct = "flex min-w-min md:w-5/12";
export var Input60pct = "flex min-w-min md:w-3/5";
export var Input66pct = "flex min-w-min md:w-2/3";
export var Input75pct = "flex min-w-min md:w-3/4";
export var Input80pct = "flex min-w-min md:w-4/5";
export var Input96 = "flex min-w-min md:w-96";
export var Input72 = "flex min-w-min md:w-72";
export var Input56 = "flex min-w-min md:w-56";
export var Input48 = "flex min-w-min md:w-48";
export var Input36 = "flex min-w-min md:w-36";
export var InputsFiltro = "flex flex-1 overflow-hidden ";
//#endregion

//#region Inputs
export var LabelStyle =
  "px-3 inline-flex items-center text-mini font-semibold border border-r-0 rounded-l-md bg-label border-gray-600 text-light focus:bg-slate-800 focus:outline-none focus:border-blue-500 ";
export var LabelCheckStyle =
  "w-full flex-1 inline-flex items-center py-1.5 pr-2.5 pl-1 text-mini font-semibold leading-normal rounded-r-lg border border-l-0 border-gray-600 bg-disabled text-light cursor-pointer ";
export var InputStyle =
  "block w-full flex-1 py-1.5 px-2.5 text-mini border rounded-none rounded-r-lg bg-input border-gray-600 placeholder-gray-400 text-light focus:bg-gray-800 focus:outline-none focus:border-blue-500 selection:bg-blue-500 selection:text-black ";
export var InputBoton =
  "block w-full py-1.5 px-2.5 flex-1 text-mini border rounded-none bg-input border-gray-600 placeholder-gray-400 text-light focus:bg-gray-800 focus:outline-none focus:border-blue-500 selection:bg-blue-500 selection:text-black ";
export var CheckStyle =
  "flex inline-flex items-center pl-3 pr-1 text-mini font-semibold rounded-l-md border border-r-0 bg-disabled border-gray-600 text-light ";
export var Anidado = "!border-l-0 rounded-l-none ";
export var SinBorde = "!border-none  ";
export var Disabled = "!bg-gray-800/90 ";
//#endregion

//#region  Acordion
export var AcordionUl =
  "mb-2 hover:text-primary border-b hover:border-primary cursor-pointer ";
//#endregion

//#region Titulos H
export var TituloH2 = "py-2 text-xl md:text-2xl font-bold text-light ";
export var TituloH4 = "mb-1 py-2 text-xl font-bold text-light ";
export var TituloModal = "text-xl md:text-2xl font-semibold text-light ";
export var Subtitulo = "m-0 p-0 pl-1 text-lg font-bold text-light";
export var TituloUsuario = "font-bold text-light text-xl pb-1.5";
//#endregion

//#region Botones
export var ContenedorBotones = "sticky top-2 z-20 flex gap-2 ";
export var BotonModalBase =
  "px-5 py-1.5 text-sm font-semibold rounded transition-all duration-150 uppercase ";
export var BotonOkModal =
  "text-light bg-gradient-to-b from-gray-600 to-gray-700 hover:bg-gradient-to-b hover:from-primary hover:to-yellow-600 hover:text-black focus:bg-gradient-to-b focus:from-primary focus:to-yellow-600 focus:text-black focus:border-blue-500 ";
export var BotonCerrarModal =
  " !py-1 border-2 background-transparent hover:bg-gradient-to-b hover:from-red-700 hover:to-red-600 text-red-500 hover:text-light border-red-600 focus:bg-gradient-to-b focus:from-red-700 focus:to-red-600 focus:text-light focus:border-blue-500 ";

export var BotonBasico =
  "flex mb-2 flex items-center justify-center text-mini font-semibold uppercase rounded-md outline-none overflow-hidden focus:outline-none ease-linear transition-all duration-150 text-light focus:bg-gradient-to-b focus:from-gray-500 focus:to-gray-700 focus:shadow ";
export var BotonTexto =
  "w-full h-full sm:flex sm:items-center sm:justify-center hidden sm:pr-3 text-mini";
export var BotonBuscar = "px-3 rounded-none rounded-r-lg ";
export var BotonPrimary =
  "text-light bg-gradient-to-b from-yellow-400 to-yellow-600 text-light hover:bg-gradient-to-b hover:from-yellow-300 hover:to-yellow-600 focus:bg-gradient-to-b focus:from-blue-600 focus:to-blue-900 ";
export var BotonNaranja =
  "text-light bg-gradient-to-b from-orange-600 to-orange-800 text-light hover:bg-gradient-to-b hover:from-orange-300 hover:to-orange-600 focus:bg-gradient-to-b focus:from-blue-600 focus:to-blue-900 ";
export var BotonMorado =
  "text-light bg-gradient-to-b from-purple-600 to-purple-900 text-light hover:bg-gradient-to-b hover:from-purple-300 hover:to-purple-600 focus:bg-gradient-to-b focus:from-blue-600 focus:to-blue-900 ";
export var BotonRosa =
  "text-light bg-gradient-to-b from-pink-600 to-pink-900 text-light hover:bg-gradient-to-b hover:from-pink-300 hover:to-pink-600 focus:bg-gradient-to-b focus:from-blue-600 focus:to-blue-900 ";
export var BotonAzul =
  "text-light bg-gradient-to-b from-blue-600 to-blue-800 hover:bg-gradient-to-b hover:from-blue-400 hover:to-blue-600 ";
export var BotonVerde =
  "text-light bg-gradient-to-b from-green-600 to-green-800 hover:bg-gradient-to-b hover:from-green-400 hover:to-green-700 ";
export var BotonRojo =
  "text-light bg-gradient-to-b from-red-600 to-red-800 hover:bg-gradient-to-b hover:from-red-500 hover:to-red-700 ";
export var BotonHeader =
  "bg-gradient-to-b from-yellow-400 to-yellow-600 hover:bg-gradient-to-b hover:from-yellow-300 hover:to-yellow-700 !text-gray-800 ";
export var CerrarModal =
  "p-1 ml-auto bg-transparent border-0 hover:text-red-500 text-light float-right text-xl md:text-2xl leading-none font-semibold outline-none focus:outline-none ";
//#endregion

//#region Tabla
export var Table = "w-full text-light focus:outline-none ";

//#region Filas
export var THeader =
  "text-mini font-semibold text-left bg-gradient-to-b from-neutral-800 to-neutral-900 ";
export var TBody = "text-mini bg-gradient-to-b from-input to-disabled ";
export var Th = "px-1 py-1 md:py-2 ";
export var Tr = "border-b border-gray-600 ";
export var Td = "px-1 py-1 md:py-2 text-left select-none ";
//#endregion

//#region Botones Fila
export var TablaBotonConsultar =
  "w-4 mr-2 scale-110 transform hover:text-green-500 hover:scale-125";
export var TablaBotonModificar =
  "w-4 mr-2 transform hover:text-orange-500 hover:scale-125";
export var TablaBotonEliminar =
  "w-4 mr-2 transform hover:text-red-500 hover:scale-125";
//#endregion

//#region Footer

export var ContenedorTablaFooter =
  "min-h-min w-full p-2 flex flex-col sm:flex-row items-center justify-center sm:justify-between text-light ";
export var ContenedorTotalPaginas =
  "w-auto gap-x-5 flex items-center justify-between text-mini ";
export var FooterTexto =
  "text-center align-text-bottom font-semibold uppercase";

//#region Paginacion
export var ContendorPaginacion =
  "gap-y-1 sm:gap-y-0 gap-x-3 flex flex-col sm:flex-row items-center justify-center sm:justify-end flex-wrap text-mini ";
export var ContendorBotonesPaginacion =
  "w-auto flex items-center justify-center sm:justify-end flex-wrap ";
export var BotonPaginacion =
  "w-10 h-9 flex items-center justify-center text-sm !text-black font-bold ";
export var BotonPaginacionActivo =
  "!bg-transparent !bg-gradient-to-b !from-gray-700 !to-gray-600 !text-white ";
//#endregion

//#region Footer Detalle
export var ContenedorFooter =
  "flex flex-col overflow-x-auto border border-gray-200 bg-gradient-to-t from-input to-disabled ";
export var FilaFooter =
  "py-0.5 flex items-center justify-end border border-gray-400 ";
export var FilaVacia = "w-full sm:px-5 flex items-center justify-end";
export var FilaPrecio = "min-w-[180px] ";
export var FilaImporte = "min-w-[90px] ";
export var FilaInput = "min-w-[180px] pr-4 ";
export var UltimaFila =
  "w-auto px-2 sm:min-w-[75px] flex items-center justify-center";
export var FilaContenido =
  "pr-4 text-sm text-p-align-right font-semibold text-light ";
export var FilaContenidoSelect =
  "min-w-[45px] ml-2 bg-gray-700 rounded-md font-semibold ";
export var FilaMovArticulo =
  "min-w-[100px] flex items-center justify-end border border-gray-400 ";
export var FilaContenidoMovArt =
  "pr-4 text-p-align-right font-bold text-light ";
//#endregion

//#endregion

//#endregion

//#region Mensajes
export var MensajeInformacion =
  "Cualquier registro, modificación o eliminación de direcciones será guardado automáticamente en la base de datos, usar con precaución.";
//#endregion
