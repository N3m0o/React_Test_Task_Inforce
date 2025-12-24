import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../store/productSlice';
import { Link } from 'react-router-dom';

export const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const { items, status, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (status === 'loading') return <div>Loading goods...</div>;
  if (status === 'failed') return <div>Error loading goods: {error}</div>;

  return (
    <div className="product-list-page">
      <h2>Goods list</h2>
      
      <button style={{ marginBottom: '20px' }}>Add good</button>

      <div className="products-grid" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {items.map((product) => (
          <div key={product.id} className="product-card" style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <img src={product.imageUrl} alt={product.name} style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
            <h3>{product.name}</h3>
            <p>Quantity: {product.count}</p>
            
            <Link to={`/product/${product.id}`}>
              <button>View details</button>
            </Link>
          </div>
        ))}
      </div>

      {items.length === 0 && status === 'succeeded' && <p>No goods yet.</p>}
    </div>
  );
};
