const { urlencoded } = require('body-parser');
const express = require('express')
const app = express()
const port = 3069
const htrans = require('./routes/htrans');
// const associations = require('./models/associations');


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use('/api', htrans)