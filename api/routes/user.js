const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");

router.get("/get/all", UserController.get_users);

router.get("/get/by/email/:email", UserController.get_user_by_email);

router.post("/signup", UserController.signup);

router.get("/send-email/:email", UserController.sendEmailCode);

router.get("/send-reset-pass/:email", UserController.sendResetPassCode);

router.put('/reset/password/:email', UserController.resetPassword);

router.post("/login", UserController.login);

router.patch("/edit/:id", UserController.edit_user);

router.patch("/changePassword/:id", UserController.changePassword);

router.delete("/delete/:email/:id", UserController.delete_user);

module.exports = router;
