const express = require("express");
const router = express.Router();

const { createFlight,
    searchAndFilter,
    getAllFlight
} = require("../controller/flight");

const verifyCurrentUser = require('../middleware/verifyCurrentUser');

router.post("/search-flights", createFlight);
router.get("/flights", searchAndFilter);
router.get("/getAllFlight", getAllFlight)

module.exports = router;