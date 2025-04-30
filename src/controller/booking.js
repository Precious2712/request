const flightBooking = require('../model/booking');
const User = require('../model/auth');
const { parse } = require('date-fns');

const createBooking = async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: 'No user found' });
    }
    const {
      tripType,
      availableAirline,
      departureAirport,
      destinationAirport,
      departureDate,
      returnDate,
      passengers,
      contactInfo,
      addOns
    } = req.body;

    if (!tripType || !availableAirline || !departureAirport ||
      !destinationAirport || !departureDate || !passengers || !contactInfo) {
      return res.status(400).json({ message: 'Please make sure all required fields are filled' });
    }

    if (!Array.isArray(passengers) || passengers.length === 0) {
      return res.status(400).json({ message: 'At least one passenger is required' });
    }

    if (!contactInfo.phone) {
      return res.status(400).json({ message: 'Complete contact information is required' });
    }

    if (tripType === 'round-trip' && !returnDate) {
      return res.status(400).json({ message: 'Return date is required for round trips' });
    }

    // Parse with date-fns
    const parsedDeparture = parse(departureDate, 'yyyy-MM-dd hh:mma', new Date());
    const parsedReturn = returnDate ? parse(returnDate, 'yyyy-MM-dd hh:mma', new Date()) : null;

    const bookFlight = await flightBooking.create({
      userId: _id,
      tripType,
      availableAirline,
      departureAirport,
      destinationAirport,
      departureDate: parsedDeparture,
      returnDate: parsedReturn,
      passengers: passengers.map(p => ({
        ...p,
        dob: p.dob ? parse(p.dob, 'yyyy-MM-dd', new Date()) : null,
        passportExpiry: p.passportExpiry ? parse(p.passportExpiry, 'yyyy-MM-dd', new Date()) : null
      })),
      contactInfo,
      addOns: addOns || {
        extraLuggage: false,
        travelInsurance: false,
        hotelBooking: false
      }
    });
    console.log(bookFlight, 'book');

    res.status(201).json({
      message: 'Flight booked successfully',
      data: bookFlight
    });

  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({
      message: 'An error has occurred',
      error: error.message
    });
  }
};

const getUserBooking = async (req, res) => {
  const { id } = req.params
  try {
    const booking = await flightBooking.find({ userId: id });
    res.status(201).json({
      message: 'user flight booking',
      data: booking
    })
  } catch (error) {
    console.log('error', error);
    res.status(400).json({
      message: 'An eror has occur',
      errors: error.message
    })
  }

}

module.exports = {
  createBooking,
  getUserBooking
}