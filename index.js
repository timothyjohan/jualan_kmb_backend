require('dotenv').config({ debug: true });
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");

const app = express();
const htrans = require('./server/routes/htrans');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/htrans', htrans);
app.get('/', (req, res) => res.send('Hello World!'));

// MongoDB Connection
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