const express = require('express');
const cors = require('cors'); // Add this line to import the cors middleware
const app = express();
const port = 3069;
const htrans = require('./routes/htrans');

app.use(cors()); // Enable CORS for all routes

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', htrans);
