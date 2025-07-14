require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")

const app = express();
app.use(express.json());
app.use(cors());

const port = 4000
// require('./src/nodemailer/mailer');

// let db = {
//     id: Number,
//     name: String,
//     age: Number,
//     email: String,
//     phoneNumber: Number
// }

// const feature = [
//     {
//         id: "1",
//         name: "Feature 1",
//         description: "This is feature 1",
//         status: "Active"
//     },
//     {
//         id: "2",
//         name: "Feature 2",
//         description: "This is feature 2",
//         status: "Inactive"
//     },
//     {
//         id: "3",
//         name: "Feature 3",
//         description: "This is feature 3",
//         status: "Active"
//     },
//     {
//         id: "4",
//         name: "Feature 4",
//         description: "This is feature 4",
//         status: "Inactive"
//     },
//     {
//         id: "5",
//         name: "Feature 5",
//         description: "This is feature 5",
//         status: "Active"
//     }
// ]

// app.get("/", (req, res) => {
//     const { name } = req.query;

//     if (name) {
//         // Filter features where name contains the query string (case insensitive)
//         const foundFeatures = feature.filter(el =>
//             el.name.toLowerCase().includes(name.toLowerCase())
//         );

//         if (foundFeatures.length === 0) {
//             return res.status(404).json({ message: "No matching features found" });
//         }

//         return res.status(200).json({
//             message: "Matching features found",
//             data: foundFeatures
//         });
//     }

//     res.status(200).json({
//         message: "All features",
//         data: feature
//     });
// });

// app.get("/:id", (req, res) => {
//     const { id } = req.params;
//     const foundFeature = feature.find((el) => el.id === id);
//     if (!foundFeature) {
//         return res.status(404).json({
//             message: "Feature not found"
//         })
//     }
//     res.status(200).json({
//         message: "Feature found",
//         data: foundFeature
//     });
//     console.log("Feature found", foundFeature);
// })

// app.post("/", (req, res) => {
//     db = req.body
//     res.json(db);
//     console.log('data:', db);

// })

// app.patch("/:id", (req, res) => {
//     const { id } = req.params;
//     const updates = req.body;

//     const featureIndex = feature.findIndex(el => el.id === id);

//     if (featureIndex === -1) {
//         return res.status(404).json({
//             message: "Feature not found"
//         });
//     }

//     // Get the existing feature
//     const existingFeature = feature[featureIndex];

//     // Validate the updates - only allow certain fields to be updated
//     const allowedUpdates = ['name', 'description', 'status'];
//     const isValidUpdate = Object.keys(updates).every(key => allowedUpdates.includes(key));

//     if (!isValidUpdate) {
//         return res.status(400).json({
//             message: "Invalid updates! Only name, description, and status can be updated"
//         });
//     }

//     const updatedFeature = {
//         ...existingFeature,
//         ...updates
//     };

//     feature[featureIndex] = updatedFeature;

//     res.status(200).json({
//         message: "Feature updated successfully",
//         data: updatedFeature
//     });
// });

// app.put("/:id", (req, res) => {
//     const { id } = req.params;
//     const updatedData = req.body;

//     if (!updatedData.name || !updatedData.description || !updatedData.status) {
//         return res.status(400).json({
//             message: "Missing required fields (name, description, status)"
//         });
//     }

//     const featureIndex = feature.findIndex(el => el.id === id);

//     if (featureIndex === -1) {
//         return res.status(404).json({
//             message: "Feature not found"
//         });
//     }

//     feature[featureIndex] = {
//         id, 
//         name: updatedData.name,
//         description: updatedData.description,
//         status: updatedData.status
//     };

//     res.status(200).json({
//         message: "Feature fully updated (PUT)",
//         data: feature[featureIndex]
//     });
// });

// app.delete("/:id", (req, res) => {
//     const { id } = req.params;
//     const index = feature.findIndex((el) => el.id === id);

//     if (index === -1) {
//         return res.status(404).json({
//             message: "Feature not found"
//         });
//     }

//     const deletedFeature = feature.splice(index, 1)[0];

//     res.status(200).json({
//         message: "Feature deleted successfully",
//         data: deletedFeature 
//     });
// });

const users = require("./src/route/autth");
const uploadImage = require('./src/route/upload');
const booking = require('./src/route/booking');
const searching = require('./src/route/flight');

app.use('/api/v1/', users);
app.use('/api/img/', uploadImage);
app.use('/api/v1/', booking);
app.use('/api/v2/', searching);


function start() {
    app.listen(port, () => {
        const mongooseConnect = mongoose.connect(process.env.mongooseDB)
        if (mongooseConnect) {
            console.log(`Server is running on port ${port}`)
        }
        else {
            console.log('Failed to connect to mongoose database');
        }
    });
}

start();