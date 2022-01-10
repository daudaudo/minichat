module.exports = {
  content: ["./views/**/*.ejs"],
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