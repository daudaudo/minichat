module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {},
    minHeight: (theme) => ({
      auto: 'auto',
      ...theme('spacing'),
    })
  },
  plugins: [],
}