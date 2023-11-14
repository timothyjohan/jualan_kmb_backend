const { default: axios } = require('axios');
const { query } = require('express');
const express = require('express');
const router = express.Router();
// const User = require('../models/User');

router.get('/get', async (req, res) => {
    return res.status(200).send({
        message:"Masuk get"
    })
})

module.exports = router