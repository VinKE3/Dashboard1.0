/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FDE047",
        secondary: {
          100: "#1E1F25",
          900: "#131517",
        },
        gris: {
          700: "#131517",
          800: "#1F2937",
        },
        light: "#FFF",
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
};
