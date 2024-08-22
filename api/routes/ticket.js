const express = require("express");
const router = express.Router();
const Controller = require('../controllers/ticket');

router.post("/add", Controller.addTicket);
router.get("/get/all", Controller.getAllTickets);
router.get("/get/by/user/:id", Controller.getByUserTicket);
router.put("/edit/:id", Controller.edit);
router.delete("/delete/:id", Controller.delete);

module.exports = router;
