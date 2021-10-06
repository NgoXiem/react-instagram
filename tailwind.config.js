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
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
