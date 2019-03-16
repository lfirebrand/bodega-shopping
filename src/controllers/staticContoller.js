module.exports = {
  index(req, res, next) {
    res.render("static/index", { title: "Welcome to Bodega" });
  },

  about(req, res, next) {
    res.render("static/about", { h1: "About" });
  }
};
