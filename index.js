require('dotenv').config({ debug: true });
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");

const app = express();
const htrans = require('./routes/htrans');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/htrans', htrans);
app.get('/', (req, res) => res.send('Hello World!'));

// MongoDB Connection
const MONGODB_URI = 'mongodb://localhost:27017/db_kmb';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Berhasil terhubung ke MongoDB Atlas');
    // Start server setelah database terkoneksi
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server berjalan di port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error('Error koneksi MongoDB:', error);
    process.exit(1);
  });

// Error handling
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
