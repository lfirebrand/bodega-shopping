const express = require("express");
const router = express.Router();
const staticController = require("../controllers/staticContoller");

router.get("/", staticController.index);
router.get("/about", staticController.about);

module.exports = router;
