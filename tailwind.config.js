module.exports = {
  purge: ["./src/**/*.js", "./src/**/**/*.js"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: {
          background: "#fafafa",
          base: "#616161",
        },
      },
      screens: {
        mobiles: { max: "700px" },
        tablets: "701px",
      },
      fontSize: {
        small: ["0.5rem", "0.875rem"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
