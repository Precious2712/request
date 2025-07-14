const express = require('express');
const router = express.Router();

const { createBooking,
    getUserBooking,
    deleteFlightById
} = require('../controller/booking');
const verifyCurrentUser = require('../middleware/verifyCurrentUser');

router.post('/bookings', verifyCurrentUser, createBooking);
router.get('/getUserBooking/:id', verifyCurrentUser,  getUserBooking);
router.delete('/deleteFlight/:id', verifyCurrentUser, deleteFlightById);

module.exports = router;