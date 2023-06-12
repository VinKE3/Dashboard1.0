/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FDE047",
        secondary: {
          100: "#1E1F25",
          200: "#0A090B",
          300: "#171B23",
          900: "#131517",
        },
        light: "#FFF",
        label: "#1B1F23",
        input: "#282C32",
        disabled: "#1B1F23",
        contenedor: "#1C1D21",
      },
      fontSize: {
        mini: "13px",
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
};
