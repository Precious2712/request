// route/bookingRoutes.js
const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings } = require('../controller/booking');

router.post('/bookings', createBooking);
router.get('/bookings/:userId', getUserBookings);

module.exports = router;
