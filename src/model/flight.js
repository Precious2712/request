const mongoose = require('mongoose');
const { Schema } = mongoose

const searchFlight = new Schema({
  tripType: {
    type: String,
    enum: ['one-way', 'round-trip'],
    required: true
  },
  departureAirport: {
    type: String,
    required: [true, 'this field is required']
  },
  destinationAirport: {
    type: String,
    required: [true, 'this field is required']
  },
  departureDate: {
    type: Date,
    required: [true, 'this field is required']
  },
  returnDate: {
    type: Date
  },
  passenger: {
    type: Number,
    required: [true, 'this field is required']
  }
})

const Search = mongoose.model('search-flights', searchFlight);

module.exports = Search