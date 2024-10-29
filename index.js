const express = require('express');
const cors = require('cors'); // Add this line to import the cors middleware
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = express();
const htrans = require('./routes/htrans');

app.use(cors()); // Enable CORS for all routes

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(process.env.PORT, async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.klxoze2.mongodb.net/${process.env.DB_NAME}`
        );
        console.log("hehehhehee");
    } catch (error) {
        console.log(error);
    }
    console.log(`Server is running on port ${process.env.PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', htrans);
