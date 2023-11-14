const { default: axios } = require('axios');
const { query } = require('express');
const express = require('express');
const router = express.Router();
const Htrans = require('../models/Htrans');
const { DATEONLY } = require('sequelize');

router.get('/get', async (req, res) => {
    let htrans = await Htrans.findAll()
    return res.status(200).send({
        htrans
    })
})
router.get('/get/:date', async (req, res) => {
    const {date} = req.params
    let htrans = await Htrans.findAll({
        where:{
            tanggal:date
        }
    })
    return res.status(200).send({
        htrans
    })
})
router.get('/total', async (req, res) => {
    let subtotal = await Htrans.sum('subtotal')
    return res.status(200).send({
        subtotal
    })
})
router.post('/:nama/:menu/:jumlah/:subtotal', async (req, res) => {
    const { nama, menu, jumlah, subtotal } = req.params
    let result
    let tempId = await Htrans.count() + 1
    try {
        let year = new Date().getFullYear()
        let month = new Date().getMonth() +1
        let date = new Date().getDate()
        let tanggal = `${year}-${month}-${date}`
        console.log(tanggal);
        result = await Htrans.create({
            id: tempId,
            nama:nama,
            menu:menu,
            jumlah:jumlah,
            subtotal:subtotal,
            tanggal: tanggal

        })
    } catch (error) {
        return res.status(500).send(error)
    }
    return res.status(201).send({
        result
    })
})

module.exports = router