/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.vue", "./src/**/*.jsx"],
  theme: {
    extend: {
      //TODO añadi colores primarios y secundarios
      colors: {
        primary: "#EE6C4D",
        secondary: {
          100: "#1E1F25",
          900: "#131517",
        }
    },
  },
},
  plugins: [],
};
