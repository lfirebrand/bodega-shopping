const purchaseQueries = require("../db/queries.purchases.js");

module.exports = {
  create(req, res, next) {
    if (req.user) {
      purchaseQueries.createPurchase(req, (err, purchase) => {
        if (err) {
          console.log("Error");
        }
      });
    } else {
      console.log("You must be signed in.");
    }
    res.redirect(req.headers.referer);
  },

  destroy(req, res, next) {
    if (req.user) {
      purchaseQueries.deletePurchase(req, (err, purchase) => {
        if (err) {
          console.log("Error");
        }
        res.redirect(req.headers.referer);
      });
    } else {
      req.flash("notice", "You must be signed in to do that.");
      res.redirect(req.headers.referer);
    }
  }
};
