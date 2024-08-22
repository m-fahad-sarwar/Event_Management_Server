const express = require("express");
const router = express.Router();
const Controller = require('../controllers/favourite');

router.post("/add", Controller.addFavourite);
router.get("/get/all", Controller.getAllFavourites);
router.get("/get/by/user/:id", Controller.getByUserFavourite);
router.put("/edit/:id", Controller.edit);
router.delete("/delete/:id", Controller.delete);

module.exports = router;
