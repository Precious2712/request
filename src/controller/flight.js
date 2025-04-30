const Search = require('../model/flight');
const moment = require('moment');

const createFlight = async (req, res) => {
    try {
        const {
            tripType,
            departureAirport,
            destinationAirport,
            departureDate,
            returnDate,
            passenger
        } = req.body;

        if (!tripType || !destinationAirport || !departureAirport || !departureDate || !passenger) {
            return res.status(400).json({
                message: 'Required fields: tripType, departureAirport, destinationAirport, departureDate, passenger'
            });
        }

        if (!['one-way', 'round-trip'].includes(tripType)) {
            return res.status(400).json({
                message: 'tripType must be either "one-way" or "round-trip"'
            });
        }

        if (tripType === 'round-trip' && !returnDate) {
            return res.status(400).json({
                message: 'returnDate is required for round-trip flights'
            });
        }

        const parsedDeparture = moment(departureDate, 'YYYY-MM-DD hh:mmA').toDate();
        let parsedReturn = null;

        if (tripType === 'round-trip') {
            parsedReturn = moment(returnDate, 'YYYY-MM-DD hh:mmA').toDate();

            if (parsedReturn <= parsedDeparture) {
                return res.status(400).json({
                    message: 'returnDate must be after departureDate'
                });
            }
        }

        const flightSearch = await Search.create({
            tripType,
            departureAirport,
            destinationAirport,
            departureDate: parsedDeparture,
            returnDate: tripType === 'round-trip' ? parsedReturn : null,
            passenger
        });

        res.status(201).json({
            message: 'Flight search created successfully',
            data: flightSearch
        });

    } catch (error) {
        console.error('Error creating flight search:', error);
        res.status(500).json({
            message: 'An error occurred while creating flight search',
            error: error.message
        });
    }
};

const searchAndFilter = async (req, res) => {
    try {
        const { departureAirport, destinationAirport, departureDate, returnDate, passenger, tripType } = req.query;
        let query = {};

        if (!passenger || !tripType || !departureAirport || !destinationAirport) {
            return res.status(400).json({
                message: 'No record found in database'
            });
        }

        const cleanAirportName = (name) => {
            if (!name) return null;
            return name.replace(/\s*\(.*?\)\s*/g, '').trim().toLowerCase();
        };

        if (departureAirport) {
            const cleanName = cleanAirportName(departureAirport);
            query.departureAirport = { 
                $regex: cleanName, 
                $options: "i" 
            };
        }

        if (destinationAirport) {
            const cleanName = cleanAirportName(destinationAirport);
            query.destinationAirport = { 
                $regex: cleanName, 
                $options: "i" 
            };
        }

        if (departureDate) {
            const parsedDate = moment(departureDate, 'YYYY-MM-DD').startOf('day').toDate();
            query.departureDate = { 
                $gte: parsedDate,
                $lt: moment(parsedDate).endOf('day').toDate()
            };
        }

        if (returnDate) {
            const parsedDate = moment(returnDate, 'YYYY-MM-DD').startOf('day').toDate();
            query.returnDate = { 
                $gte: parsedDate,
                $lt: moment(parsedDate).endOf('day').toDate()
            };
        }

        // if (passenger) {
        //     query.passenger = passenger.toString();
        // }

        if (typeof passenger === 'number') {
            query.passenger = passenger.toString();
        }        

        if (tripType) {
            query.tripType = tripType.toLowerCase(); 
        }

        const result = await Search.find(query);

        res.status(200).json({
            result,
            count: result.length,
            message: "Flights fetched successfully"
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            message: 'An error occurred while searching flights',
            error: error.message
        });
    }
};

const getAllFlight = async (req, res) => {
    try {
        const allFlight = await Search.find();
        if (!allFlight) {
            return res.status(400).json({
                message: 'no record of flight found'
            })
        }
        res.status(201).json({
            message: 'All flight database',
            data: allFlight
        })
    } catch (error) {
        res.status(400).json({
            message: 'An error has occur',
            err: error.message
        })
    }
}

module.exports = {
    createFlight,
    searchAndFilter,
    getAllFlight
}