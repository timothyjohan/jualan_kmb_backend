const mongoose = require('mongoose');

const htransSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
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
    jenis_pembayaran: {
        type: String,
        required: true,
    },
    bayar: {
        type: Boolean,
        required: true,
    },
    delivered: {
        type: Boolean,
        required: true,
    }
}, {
    collection: 'htrans',
    timestamps: false,
});

const Htrans = mongoose.model('Htrans', htransSchema);

module.exports = Htrans;
