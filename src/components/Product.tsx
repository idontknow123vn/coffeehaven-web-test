import React from 'react';

interface ProductProps {
  id: number;
  name: string;
  price: number;
  img: string;
  category?: string;
  available: boolean;
  onAddToOrder: (product: { id: number; name: string; price: number; img: string }) => void;
  originalPrice?: number; // Thêm prop này
}

const Product: React.FC<ProductProps> = ({ id, name, price, img, category, onAddToOrder, originalPrice, available }) => {
  return (
    <div style={{ 
      background: '#FFFFFF',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative',
      width: '220px',
      height: '280px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px'
    }}>
      <div style={{
        width: '180px',
        height: '180px',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <img 
          src={img} 
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
      </div>
      <div style={{
        width: '100%',
        textAlign: 'left',
        paddingBottom: '45px'
      }}>
        <h3 style={{
          margin: '0 0 5px 0',
          fontSize: '16px',
          color: '#8B4513',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 'bold'
        }}>
          {name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: '14px',
            color: '#FFA07A',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 'bold'
          }}>
            {price.toLocaleString()} VND
          </span>
          {originalPrice && originalPrice > price && (
            <span style={{
              textDecoration: 'line-through',
              color: '#b0b0b0',
              fontSize: '13px',
              marginRight: 6
            }}>
              {originalPrice.toLocaleString()} VND
            </span>
          )}
        </div>
      </div>
      {/* Nút thêm hoặc chữ hết hàng */}
      {available ? (
        <button
          onClick={() => onAddToOrder({ id, name, price, img })}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            width: '35px',
            height: '35px',
            borderRadius: '10px',
            background: '#FFA07A',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            outline: 'none'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#FF8C69';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#FFA07A';
          }}
        >
          +
        </button>
      ) : (
        <span
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            color: '#FF6347',
            fontWeight: 700,
            fontSize: '16px',
            background: 'none',
            padding: 0,
            border: 'none',
            borderRadius: 0,
            cursor: 'default',
            userSelect: 'none',
          }}
        >
          Hết hàng
        </span>
      )}
    </div>
  );
};

export default Product;