
const express = require("express");
const router = express.Router();
const { createFlight, getFlights } = require("../controller/flight");

router.post("/flights", createFlight);
router.get("/flights", getFlights);

module.exports = router;