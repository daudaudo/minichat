module.exports = {
  content: ["./views/**/*.ejs", "./public/**/*.js"],
  theme: {
    extend: {},
    minHeight: (theme) => ({
      auto: 'auto',
      ...theme('spacing'),
    }),
    minWidth: (theme) => ({
      auto: 'auto',
      ...theme('spacing'),
      ...theme('screens'),
    }),
  },
  plugins: [],
}