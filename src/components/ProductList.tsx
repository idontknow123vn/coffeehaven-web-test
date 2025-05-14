import React from 'react';
import Product from './Product';

interface ProductListProps {
  products: Array<{ id: number; name: string; price: number; img?: string }>;
  loading: boolean;
  error: string | null;
  onAddToOrder: (product: { id: number; name: string; price: number; img: string }) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, loading, error, onAddToOrder }) => {
  if (loading) return <div>Đang tải thực đơn...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!products.length) return <div>Không có sản phẩm nào.</div>;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 220px)',
      gap: '30px',
      padding: '20px',
      height: 'fit-content',
      flex: 1,
      justifyContent: 'center'
    }}>
      {products.map(product => (
        <Product
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          img={product.img || ''}
          onAddToOrder={onAddToOrder}
        />
      ))}
    </div>
  );
};

export default ProductList;
