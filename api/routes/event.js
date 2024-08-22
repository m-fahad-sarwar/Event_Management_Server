const express = require("express");
const router = express.Router();
const EventController = require('../controllers/event');

router.post("/add", EventController.addEvent);
router.get("/get/all", EventController.getAllEvents);
router.get("/get/:id", EventController.getSingleEvent);
router.get("/get/by/user/:userID", EventController.getByUser);
router.post("/get/by/near/location", EventController.get_by_near_location);
router.put("/edit/:id", EventController.edit);
router.delete("/delete/:id", EventController.delete);

module.exports = router;
