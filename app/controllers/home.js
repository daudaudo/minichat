function home(req, res, next) {
  res.render('index', {
    title: 'Express'
  });
}

module.exports = {
  home
};