const express = require("express");
const router = express.Router();
const RatingController = require("../controllers/rating");

router.post("/add", RatingController.create_Rating);

// router.get("/get", RatingController.get_Rating);

// router.get("/get/by/product/:id",RatingController.get_rating_by_productID);

router.get("/get/:id",RatingController.get_rating);

// router.get("/get/avg/store/:id",RatingController.get_avg_rating_of_store);

router.put("/edit/:id", RatingController.edit_Rating);

router.delete("/delete/:id", RatingController.delete_Rating);

module.exports = router;
