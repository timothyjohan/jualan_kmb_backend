const { default: axios } = require('axios');
const { query } = require('express');
const express = require('express');
const router = express.Router();
const Htrans = require('../models/Htrans');

router.get('/get', async (req, res) => {
    let htrans = await Htrans.findAll()
    return res.status(200).send({
        htrans
    })
})
router.post('/:nama/:menu/:jumlah/:subtotal', async (req, res) => {
    const { nama, menu, jumlah, subtotal } = req.params
    let result
    let tempId = await Htrans.count() + 1
    try {
        result = await Htrans.create({
            id: tempId,
            nama:nama,
            menu:menu,
            jumlah:jumlah,
            subtotal:subtotal
        })
    } catch (error) {
        return res.status(500).send(error)
    }
    return res.status(201).send({
        result
    })
})

module.exports = router