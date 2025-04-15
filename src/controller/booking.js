// controller/bookingController.js
const Booking = require('../model/booking');
const Flight = require('../model/flight');

const createBooking = async (req, res) => {
  try {
    const { userId, flightId, seats } = req.body;

    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ message: "Flight not found" });

    if (flight.seatsAvailable < seats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    const totalPrice = flight.price * seats;

    const booking = await Booking.create({
      user: userId,
      flight: flightId,
      seatsBooked: seats,
      totalPrice
    });

    // Update available seats
    flight.seatsAvailable -= seats;
    await flight.save();

    res.status(201).json({ message: "Booking successful", booking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ user: userId })
      .populate("flight")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

module.exports = {
  createBooking,
  getUserBookings
};
