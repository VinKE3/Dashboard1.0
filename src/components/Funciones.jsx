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
