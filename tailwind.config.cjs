/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.vue", "./src/**/*.jsx"],
  theme: {
    extend: {
      //aca añadi colores primarios y secundarios
      colors: {
        primario: "#FDE047",
        secondary: {
          100: "#1E1F25",
          900: "#131517",
        },
      },
    },
  },
  plugins: [],
};
