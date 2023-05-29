import { toast } from "react-toastify";

export const RedondearNumero = (number, precision) => {
  let shift = function (number, exponent) {
    let numArray = ("" + number).split("e");
    return +(
      numArray[0] +
      "e" +
      (numArray[1] ? +numArray[1] + exponent : exponent)
    );
  };
  precision = precision === undefined ? 0 : precision;
  return shift(Math.round(shift(number, +precision)), -precision);
};

export const FormatoNumero = (x) => {
  let parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

export const IsNumeroValido = (
  dato,
  permitirCero = true,
  permitirNegativos = false
) => {
  let numero = parseFloat(dato);

  if (isNaN(numero)) {
    return "El número es requerido.";
  }
  if (!permitirCero && numero === 0) {
    return "El número ingresado debe ser mayor a cero (0.00).";
  }
  if (!permitirNegativos && numero < 0) {
    return "El número ingresado no puede ser negativo.";
  }
  return "";
};

export const ConvertirPreciosAMoneda = async (
  tipo,
  objeto,
  monedaId,
  tipoCambio,
  precisionRedondeo = 2
) => {
  let model = {
    precioCompra: 0,
    precioVenta1: 0,
    precioVenta2: 0,
    precioVenta3: 0,
    precioVenta4: 0,
  };
  //Validaciones
  if (monedaId != "D" && monedaId != "S") {
    toast.error("No es posible hacer la conversión a la moneda ingresada", {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    return null;
  }
  if (tipoCambio == 0) {
    toast.error(
      "No es posible hacer la conversión si el tipo de cambio es cero (0.00)",
      {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      }
    );
    return null;
  }
  //Validaciones

  //Calculo
  if (monedaId == "D") {
    if (tipo == "compra") {
      model.precioCompra = RedondearNumero(
        objeto.precioCompra / tipoCambio,
        precisionRedondeo
      );
    } else {
      model.precioCompra = RedondearNumero(
        objeto.precioCompra / tipoCambio,
        precisionRedondeo
      );
      model.precioVenta1 = RedondearNumero(
        objeto.precioVenta1 / tipoCambio,
        precisionRedondeo
      );
      model.precioVenta2 = RedondearNumero(
        objeto.precioVenta2 / tipoCambio,
        precisionRedondeo
      );
      model.precioVenta3 = RedondearNumero(
        objeto.precioVenta3 / tipoCambio,
        precisionRedondeo
      );
      model.precioVenta4 = RedondearNumero(
        objeto.precioVenta4 / tipoCambio,
        precisionRedondeo
      );
    }
  } else {
    //MONEDA SOLES
    if (tipo == "compra") {
      model.precioCompra = RedondearNumero(
        objeto.precioCompra * tipoCambio,
        precisionRedondeo
      );
    } else {
      model.precioCompra = RedondearNumero(
        objeto.precioCompra * tipoCambio,
        precisionRedondeo
      );
      model.precioVenta1 = RedondearNumero(
        objeto.precioVenta1 * tipoCambio,
        precisionRedondeo
      );
      model.precioVenta2 = RedondearNumero(
        objeto.precioVenta2 * tipoCambio,
        precisionRedondeo
      );
      model.precioVenta3 = RedondearNumero(
        objeto.precioVenta3 * tipoCambio,
        precisionRedondeo
      );
      model.precioVenta4 = RedondearNumero(
        objeto.precioVenta4 * tipoCambio,
        precisionRedondeo
      );
    }
  }
  //Calculo

  //Retorno
  return model;
};

export const Seleccionar = (e) => {
  let row = e.target.closest("tr");
  if (row != null) {
    if (row.classList.contains("selected-row")) {
      row.classList.remove("selected-row");
    } else {
      document.querySelectorAll("*").forEach((map) => {
        map.classList.remove("selected-row");
      });
      row.classList.add("selected-row");
    }
  }
};
export const MoverFlecha = async (e, id) => {
  if (e.keyCode == 40 || e.keyCode == 38) {
    let row = document.querySelector(id).querySelector("tr.selected-row");
    if (row != null) {
      let filaAnterior = row.previousElementSibling;
      let filaSiguiente = row.nextElementSibling;
      if (e.keyCode == 40) {
        if (filaSiguiente != null) {
          row.classList.remove("selected-row");
          filaSiguiente.classList.add("selected-row");
          if (filaAnterior != null) {
            filaAnterior.scrollIntoView();
          }
        }
      } else if (e.keyCode == 38) {
        if (filaAnterior != null) {
          row.classList.remove("selected-row");
          filaAnterior.classList.add("selected-row");
          if (filaAnterior != null) {
            filaAnterior.scrollIntoView();
          }
        }
      }
    } else {
      if (e.target.tagName == "TABLE") {
        let tr = document.querySelector(id).getElementsByTagName("tr");
        tr[1].classList.add("selected-row");
        tr.scrollIntoView();
      }
    }
  }
};
export const KeyClick = (e) => {
  if (e.key == "Enter") {
    e.target.click();
  }
};
export const CerrarModal = async (e) => {
  if (e.key == "Escape") {
    return false;
  }
};
//#endregion
