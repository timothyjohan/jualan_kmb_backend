const express = require('express');
const router = express.Router();
const Htrans = require('../models/Htrans');

// Create order
router.post('/order', async (req, res) => {
  try {
    const { nama, menu, jumlah, total, subtotal, jenis_pembayaran } = req.body;

    // Jika jenis_pembayaran 'belum bayar', ubah ke 'pending'
    const payment_status = jenis_pembayaran === 'belum' ? 'pending' : jenis_pembayaran;

    const transaction = {
      nama,
      menu: `${menu} (${jumlah}x @ Rp${total/jumlah})`,
      jumlah,
      total,
      subtotal,
      tanggal: new Date().toISOString().split('T')[0],
      jenis_pembayaran: payment_status,
      delivered: false
    };

    const savedTransaction = await Htrans.create(transaction);
    console.log('Saved transaction:', savedTransaction);

    res.status(201).json({
      success: true,
      message: 'Pesanan berhasil disimpan',
      transaction: savedTransaction
    });

  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menyimpan pesanan',
      error: error.message
    });
  }
});

// Get orders by date
router.get('/get/:date', async (req, res) => {
  try {
    const dateParam = req.params.date;
    console.log('Fetching orders for date:', dateParam);

    const orders = await Htrans.find({ 
      tanggal: dateParam 
    }).sort({ createdAt: -1 });

    console.log(`Found ${orders.length} orders for date ${dateParam}`);

    // Hitung total dari pesanan yang sudah dibayar
    const totalPaid = orders
      .filter(order => order.jenis_pembayaran !== 'pending')
      .reduce((sum, order) => sum + order.subtotal, 0);

    res.json({
      success: true,
      htrans: orders, // Ubah ke htrans untuk match dengan frontend
      totalPaid: totalPaid
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pesanan',
      error: error.message
    });
  }
});

// Get today's orders
router.get('/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log('Fetching today\'s orders:', today);

    const orders = await Htrans.find({ 
      tanggal: today 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching today\'s orders:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pesanan hari ini',
      error: error.message
    });
  }
});

// Get orders by date range
router.get('/range', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    console.log('Fetching orders between:', startDate, 'and', endDate);

    const query = {
      tanggal: {
        $gte: startDate,
        $lte: endDate || startDate
      }
    };

    const orders = await Htrans.find(query)
      .sort({ tanggal: -1, createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders by range:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data pesanan',
      error: error.message
    });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Htrans.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
});

// Get single order
router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Htrans.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
});

// Update delivery status
router.patch('/orders/:id/deliver', async (req, res) => {
  try {
    const order = await Htrans.findByIdAndUpdate(
      req.params.id,
      { delivered: true },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order marked as delivered',
      order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order'
    });
  }
});

// Update payment status
router.put('/bayar/:id', async (req, res) => {
  try {
    const { jenis_pembayaran } = req.body;
    
    // Validasi jenis pembayaran - tambahkan 'pending' sebagai opsi valid
    if (!['pending', 'tunai', 'transfer'].includes(jenis_pembayaran)) {
      return res.status(400).json({
        success: false,
        message: 'Jenis pembayaran tidak valid'
      });
    }

    const order = await Htrans.findByIdAndUpdate(
      req.params.id,
      { 
        jenis_pembayaran,
        // Hanya reset delivered jika status berubah ke pending
        ...(jenis_pembayaran === 'pending' && { delivered: false })
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Status pembayaran berhasil diupdate',
      order
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate status pembayaran',
      error: error.message
    });
  }
});

// Update delivered status
router.put('/delivered/:id', async (req, res) => {
  try {
    const order = await Htrans.findByIdAndUpdate(
      req.params.id,
      { delivered: true },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Status delivered berhasil diupdate',
      order
    });
  } catch (error) {
    console.error('Error updating delivered status:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate status delivered',
      error: error.message
    });
  }
});

// Delete order
router.delete('/delete/:id', async (req, res) => {
  try {
    const order = await Htrans.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Pesanan berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus pesanan',
      error: error.message
    });
  }
});

module.exports = router; 