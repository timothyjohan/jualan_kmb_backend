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
    required: true
  },
  jenis_pembayaran: {
    type: String,
    enum: ['belum', 'tunai', 'transfer'],
    default: 'belum'
  },
  delivered: {
    type: Boolean,
    default: false
  }
}, {
  strict: true,
  timestamps: true
});

htransSchema.pre('save', function(next) {
  if (typeof this.menu !== 'string') {
    next(new Error('Menu harus berupa string'));
  }
  next();
});

const Htrans = mongoose.model('Htrans', htransSchema);

module.exports = Htrans; 