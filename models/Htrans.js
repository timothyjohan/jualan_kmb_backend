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
    menu: [{
        nama_menu: {
            type: String,
            required: true
        },
        jumlah: {
            type: Number,
            required: true
        },
        harga: {
            type: Number,
            required: true
        },
        subtotal: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    tanggal: {
        type: Date,
        default: Date.now,
        required: true,
    },
    jenis_pembayaran: {
        type: String,
        enum: ['Tunai', 'Transfer', 'Belom Bayar'],
        default: 'Belom Bayar',
        required: true,
    },
    delivered: {
        type: Boolean,
        default: false,
        required: true,
    }
}, {
    collection: 'htrans',
    timestamps: true,
});

const Htrans = mongoose.model('Htrans', htransSchema);

module.exports = Htrans;
