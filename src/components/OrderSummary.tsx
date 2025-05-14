import React from 'react';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  img: string;
  qty: number;
}

interface OrderSummaryProps {
  order: OrderItem[];
  total: number;
  removeItem: (id: number) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order, total, removeItem }) => (
  <div style={{
    width: '450px',
    background: '#FFFFFF',
    padding: 20,
    boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
    position: 'fixed',
    right: 0,
    top: 0,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  }}>
    <h3 style={{
      marginBottom: 20,
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#2c3e50',
      padding: '0 10px'
    }}>Đơn hàng hiện tại</h3>
    {/* Scrollable table container */}
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '0 10px',
      maxHeight: 'calc(100vh - 180px)'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px'
      }}>
        <thead style={{
          position: 'sticky',
          top: 0,
          background: '#FFFFFF',
          zIndex: 1
        }}>
          <tr style={{ borderBottom: '2px solid #dee2e6' }}>
            <th style={{ textAlign: 'left', padding: '8px', width: '40%' }}>Tên</th>
            <th style={{ textAlign: 'center', padding: '8px', width: '15%' }}>SL</th>
            <th style={{ textAlign: 'right', padding: '8px', width: '15%' }}>Giá</th>
            <th style={{ textAlign: 'right', padding: '8px', width: '30%' }}>Thành tiền</th>
            <th style={{ padding: '8px', width: '80%' }}></th>
          </tr>
        </thead>
        <tbody>
          {order.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid #dee2e6' }}>
              <td style={{ padding: '8px', width: '40%' }}>{item.name}</td>
              <td style={{ textAlign: 'center', padding: '8px', width: '15%' }}>{item.qty}</td>
              <td style={{ textAlign: 'right', padding: '8px', width: '15%' }}>{item.price.toLocaleString()}</td>
              <td style={{ textAlign: 'right', padding: '8px', width: '30%' }}>{(item.qty * item.price).toLocaleString()}</td>
              <td style={{ padding: '8px', width: '80%' }}>
                <button
                  onClick={() => removeItem(item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#dc3545',
                    outline: 'none'
                  }}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {/* Fixed bottom section */}
    <div style={{
      padding: '20px 10px',
      borderTop: '2px solid #dee2e6',
      background: '#FFFFFF',
      position: 'sticky',
      bottom: 0
    }}>
      <h4 style={{ marginBottom: 10, color: '#2c3e50', fontSize: '20px', fontWeight: 'bold' }}>
        Tổng tiền: {total.toLocaleString()} VND
      </h4>
      <button
        style={{
          width: '100%',
          padding: '12px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          outline: 'none'
        }}
      >
        In hóa đơn
      </button>
    </div>
  </div>
);

export default OrderSummary;
