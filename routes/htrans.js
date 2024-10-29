const { default: axios } = require('axios');
const { query } = require('express');
const express = require('express');
const router = express.Router();
const Htrans = require('../models/Htrans');

router.get('/get', async (req, res) => {
    try {
        let htrans = await Htrans.find();
        return res.status(200).send({ htrans });
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.get('/get/:date', async (req, res) => {
    const { date } = req.params;
    try {
        let htrans = await Htrans.find({ tanggal: date });
        return res.status(200).send({ htrans });
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.get('/total', async (req, res) => {
    try {
        let htrans = await Htrans.aggregate([
            { $group: { _id: null, total: { $sum: "$subtotal" } } }
        ]);
        let subtotal = htrans.length > 0 ? htrans[0].total : 0;
        return res.status(200).send({ subtotal });
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.get('/total/:date', async (req, res) => {
    const { date } = req.params;
    try {
        let htrans = await Htrans.aggregate([
            { $match: { tanggal: date } },
            { $group: { _id: null, total: { $sum: "$subtotal" } } }
        ]);
        let subtotal = htrans.length > 0 ? htrans[0].total : 0;
        return res.status(200).send({ subtotal });
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.post('/order', async (req, res) => {
    const { nama, menu, jumlah, subtotal, jenis_pembayaran, bayar} = req.body;
    try {
        let delivered = false;
        let year = new Date().getFullYear();
        let month = new Date().getMonth() + 1;
        let date = new Date().getDate();
        let tanggal = `${year}-${month}-${date}`;
        console.log(tanggal);
        let result = await Htrans.create({
            nama: nama,
            menu: menu,
            jumlah: jumlah,
            subtotal: subtotal,
            tanggal: tanggal,
            jenis_pembayaran: jenis_pembayaran,
            bayar: bayar,
            delivered: delivered
        });
        return res.status(201).send({ result });
    } catch (error) {
        return res.status(500).send(error);
    }
});

//Change status bayar to true
router.put('/bayar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let htrans = await Htrans.findByIdAndUpdate(id, { bayar: true }, { new: true });
        if (!htrans) {
            return res.status(404).send({ message: 'Transaction not found' });
        }
        return res.status(200).send({ htrans });
    } catch (error) {
        return res.status(500).send(error);
    }
});

//Change status delivered to true
router.put('/delivered/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let htrans = await Htrans.findByIdAndUpdate(id, { delivered: true }, { new: true });
        if (!htrans) {
            return res.status(404).send({ message: 'Transaction not found' });
        }
        return res.status(200).send({ htrans });
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let htrans = await Htrans.findByIdAndDelete(id);
        if (!htrans) {
            return res.status(404).send({ message: 'Transaction not found' });
        }
        return res.status(200).send({ message: 'Transaction deleted successfully' });
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router