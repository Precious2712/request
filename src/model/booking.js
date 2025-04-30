const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  nationality: { type: String, required: true },
  passportNumber: { type: String, required: true },
  passportExpiry: { type: Date, required: true },
  seatPreference: { type: String, required: true },
  mealPreference: { type: String }
});

const contactSchema = new mongoose.Schema({
  phone: { type: String, required: true },
});

const flightBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tripType: { type: String, enum: ['one-way', 'round-trip'], required: true },
  availableAirline: { type: String, enum: ['Emirate', 'Qatar-Airways', 'SkyWest Airlines', 'British Airways', 'Delta Air Lines', 'Singapore Airlines', 'AirAsia'], required: true },
  departureAirport: { type: String, required: true },
  destinationAirport: { type: String, required: true },
  departureDate: { type: Date, required: true },
  returnDate: { type: Date },
  passengers: [passengerSchema],
  contactInfo: contactSchema,
  addOns: {
    extraLuggage: { type: Boolean, default: false },
    travelInsurance: { type: Boolean, default: false },
    hotelBooking: { type: Boolean, default: false }
  },

},
  {
    timestamps: true
  });

const flightBooking = mongoose.model('FlightBooking', flightBookingSchema)

module.exports = flightBooking