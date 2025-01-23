const mongoose = require('mongoose');

const htransSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true
  },
  menu: {
    type: String,
    required: true
  },
  jumlah: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  tanggal: {
    type: String,
    required: true,
    default: () => new Date().toISOString().split('T')[0]
  },
  jenis_pembayaran: {
    type: String,
    enum: ['pending', 'tunai', 'transfer'],
    default: 'pending'
  },
  delivered: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Htrans = mongoose.model('Htrans', htransSchema);

module.exports = Htrans; 