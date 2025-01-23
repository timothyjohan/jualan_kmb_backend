import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Kasir() {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [paymentType, setPaymentType] = useState('belum');

  const calculateTotal = () => {
    if (!selectedItem) return 0;
    return selectedItem.price * quantity;
  };

  const handleSimpanPesanan = async () => {
    try {
      const orderData = {
        nama: customerName || 'Guest',
        menu: selectedItem?.name,
        jumlah: quantity,
        total: calculateTotal(),
        subtotal: calculateTotal(),
        jenis_pembayaran: paymentType
      };

      const response = await fetch('http://localhost:3069/api/htrans/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();
      
      if (data.success) {
        // Reset form
        setSelectedItem(null);
        setQuantity(1);
        setCustomerName('');
        setPaymentType('belum');
        alert('Pesanan berhasil disimpan');
      } else {
        alert('Gagal menyimpan pesanan');
      }
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Terjadi kesalahan saat menyimpan pesanan');
    }
  };

  return (
    <div>
      <div className="header">
        <h2>Kasir</h2>
        <button onClick={() => navigate('/riwayat')}>Lihat Riwayat</button>
      </div>

      <div className="input-section">
        <input
          type="text"
          placeholder="Nama Customer"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>

      <div className="menu-section">
        {/* Menu items */}
        {/* Contoh item menu */}
        <div 
          className={`menu-item ${selectedItem?.id === 1 ? 'selected' : ''}`}
          onClick={() => setSelectedItem({
            id: 1,
            name: 'Telur Gulung',
            price: 1000
          })}
        >
          <h3>Telur Gulung</h3>
          <p>Rp 1.000</p>
        </div>
        {/* ... menu items lainnya ... */}
      </div>

      <div className="order-section">
        {selectedItem && (
          <>
            <div className="quantity-control">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <input 
                type="number" 
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
            <div className="total">
              Total: Rp {calculateTotal().toLocaleString()}
            </div>
            
            <div className="payment-type">
              <select 
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="payment-select"
              >
                <option value="belum">Belum Bayar</option>
                <option value="tunai">Tunai</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
          </>
        )}
      </div>

      <button 
        className="simpan-pesanan"
        onClick={handleSimpanPesanan}
        disabled={!selectedItem}
      >
        Simpan Pesanan
      </button>
    </div>
  );
}

export default Kasir;