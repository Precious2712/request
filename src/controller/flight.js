////////////////////////////////////////////////
const Flight = require("../model/flight");

const createFlight = async (req, res) => {
  try {
    const {airline, flightNumber, origin, destination, departureTime, arrivalTime, price, seatsAvailable} = req.body
    if (!airline || !flightNumber || !origin || !destination || !departureTime || !arrivalTime || !price || !seatsAvailable) {
      res.status(400).json({
        message: 'Eroor creating fields'
      })
    }
    const flight = await Flight.create({
      airline: airline,
      flightNumber: flightNumber,
      origins: origin,
      destination: destination,
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      price: price,
      seatsAvailable: seatsAvailable
    });
    res.status(201).json(
      { message: "Flight created", 
        data: flight
      }
    );
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

const getFlights = async (req, res) => {
  try {
    const { airline, flightNumber, origin, destination, departureTime, arrivalTime, price, seatsAvailable } = req.query;

    if (!airline || !flightNumber || !origin || !destination || !departureTime || !arrivalTime || !price || !seatsAvailable) {
      res.status(400).json({
        message: 'No result found'
      })
    }
    const query = {};

    // if (origin) query.origin = origin;
    // if (destination) query.destination = destination;

    if (origin) {
      query.origin = origin
    }
    if (destination) {
      query.destination = destination
    }
    if(airline) {
      query.airline = airline
    }
    if (flightNumber) {
      query.flightNumber = flightNumber
    }
    if (departureTime) {
      query.departureTime =departureTime
    }

    const flights = await Flight.findOne(query);
    res.status(200).json({
      data: flights
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  createFlight,
  getFlights
};