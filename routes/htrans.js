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
    try {
        console.log('Received order data:', req.body);
        const newOrder = new Htrans(req.body);
        const savedOrder = await newOrder.save();
        console.log('Order saved:', savedOrder);
        res.status(201).json(savedOrder);
        console.log("Berhasil");
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(400).json({ message: error.message });
    }
});

//Change status bayar to true
router.put('/bayar/:id', async (req, res) => {
    const { id } = req.params;
    const {jenis_pembayaran} = req.body;
    try {
        let htrans = await Htrans.findByIdAndUpdate(id, { bayar: true, jenis_pembayaran: jenis_pembayaran }, { new: true });
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