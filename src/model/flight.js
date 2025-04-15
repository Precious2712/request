// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const searchSchema = new Schema({
//   departure: {
//     type: String,
//     required: [true, 'Departure is required'],
//     trim: true,
//   },
//   arrival: {
//     type: String,
//     required: [true, 'Arrival is required'],
//     trim: true,
//   },
//   date: {
//     type: Date,
//     required: [true, 'Departure date is required'],
//   },
//   returnDate: {
//     type: Date,
//     required: false,
//   },
//   passenger: {
//     type: Number,
//     required: [true, 'Passenger count is required'],
//     min: [1, 'At least one passenger required'],
//   },
//   travelClass: {
//     type: String,
//     enum: ['economy', 'business', 'first'],
//     default: 'economy',
//   }
// }, { timestamps: true });

// const Search = mongoose.model('Search', searchSchema);
// module.exports = Search

// const mongoose = require('mongoose');
// const {Schema} = mongoose

const flightSchema = new Schema({
  airline: { type: String, required: true },
  flightNumber: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  price: { type: Number, required: true },
  seatsAvailable: { type: Number, required: true }
}, { timestamps: true });

const flight = mongoose.model(flightSchema, 'flight');

module.exports = flight