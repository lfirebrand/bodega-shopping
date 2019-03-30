const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/users/sign_up", userController.signUp);
router.get("/users/sign_in", userController.signInForm);
router.get("/users/sign_out", userController.signOut);
router.post("/users", userController.create);
router.post("/users/sign_in", userController.signIn);

module.exports = router;
