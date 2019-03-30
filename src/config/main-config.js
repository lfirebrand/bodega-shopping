require("dotenv").config();
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");
const bodyParser = require("body-parser");
const passportConfig = require("./passport-config");

module.exports = {
  init(app, express) {
    app.set("views", viewsFolder);
    app.set("view engine", "ejs");
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, "..", "assets")));
    passportConfig.init(app);
    // app.use(
    //   session({
    //     secret: process.env.cookieSecret,
    //     resave: false,
    //     saveUninitialized: false,
    //     cookie: { maxAge: 1.21e9 }
    //   })
    // );

    app.use((req, res, next) => {
      res.locals.currentUser = req.user;
      next();
    });
  }
};
