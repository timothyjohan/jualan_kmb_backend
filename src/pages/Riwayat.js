import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Riwayat() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (date) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3069/api/htrans/get/${date}`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="riwayat-container">
      <div className="header">
        <h2>Riwayat Pesanan</h2>
        <button onClick={() => navigate('/kasir')}>Kembali ke Kasir</button>
      </div>
      
      <div className="date-picker">
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>

      {loading ? (
        <div className="loading">Memuat data...</div>
      ) : orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-item">
              <div className="order-header">
                <span className="customer-name">{order.nama}</span>
                <span className="order-time">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="order-details">
                <div className="menu-info">{order.menu}</div>
                <div className="quantity">Jumlah: {order.jumlah}</div>
                <div className="total">Total: {formatCurrency(order.total)}</div>
              </div>
              <div className="order-status">
                Status: {order.delivered ? 'Selesai' : 'Belum Selesai'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-orders">
          Tidak ada pesanan pada tanggal {selectedDate}
        </div>
      )}
    </div>
  );
}

export default Riwayat; 