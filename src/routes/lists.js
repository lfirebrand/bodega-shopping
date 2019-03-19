const express = require("express");
const router = express.Router();

const listController = require("../controllers/listController");

router.get("/lists", listController.index);
router.get("/lists/new", listController.new);

module.exports = router;
