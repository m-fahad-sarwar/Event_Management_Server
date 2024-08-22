const express = require("express");
const router = express.Router();
const FavoriteController = require("../controllers/favorite");

router.post("/add", FavoriteController.create_favorite);

router.get("/user/:id", FavoriteController.get_favorite_by_userID);

router.delete("/delete/:id", FavoriteController.delete_favorite);

module.exports = router;
