const userQueries = require("../db/queries.users.js");
const passport = require("passport");

module.exports = {
  signUp(req, res, next) {
    res.render("users/sign_up");
  },
  create(req, res, next) {
    let newUser = {
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    userQueries.createUser(newUser, (err, user) => {
      if (err) {
        console.log("error");
        res.redirect("/users/sign_up");
      } else {
        passport.authenticate("local")(req, res, () => {
          console.log("it totes worked! booyah!");
          res.redirect("/lists");
        });
      }
    });
  },
  signInForm(req, res, next) {
    res.render("users/sign_in");
  },
  signIn(req, res, next) {
    passport.authenticate("local")(req, res, function() {
      if (!req.user) {
        console.log("Sign in failed. Please try again.");
        res.redirect("/");
      } else {
        console.log("Successfully signed in!");
        res.redirect("/lists");
      }
    });
  },
  signOut(req, res, next) {
    req.logout();
    res.redirect("/");
  }
};
