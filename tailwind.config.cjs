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
        label: "#1F2836",
        input: "#343E4F",
        disabled: "#192331",
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
};
