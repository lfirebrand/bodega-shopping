const express = require("express");
const router = express.Router();

const itemController = require("../controllers/itemController");
const helper = require("../auth/helpers");

router.get("/lists/:listId/items/new", itemController.new);
router.get("/lists/:listId/items/:id", itemController.show);
router.get("/lists/:listId/items/:id/edit", itemController.edit);
router.post(
  "/lists/:listId/items/create",
  helper.ensureAuthenticated,
  itemController.create
);
router.post("/lists/:listId/items/:id/destroy", itemController.destroy);
router.post("/lists/:listId/items/:id/update", itemController.update);

module.exports = router;
