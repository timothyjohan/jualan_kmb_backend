const mongoose = require('mongoose');

const htransSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    nama: {
        type: String,
        required: true,
    },
    menu: {
        type: String,
        required: true,
    },
    jumlah: {
        type: Number,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    tanggal: {
        type: Date,
        required: true,
    },
}, {
    collection: 'htrans',
    timestamps: false,
});

const Htrans = mongoose.model('Htrans', htransSchema);

module.exports = Htrans;
