import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../store/productSlice';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.products);

  const product = items.find((item) => String(item.id) === id);

  React.useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <div>Loading product details...</div>;

  if (!product) return <div>Good not found
    <button onClick={() => navigate('/')}>Return to list</button></div>;

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate('/')}>← Return to list</button>

      <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
        <img src={product.imageUrl} alt={product.name} style={{ width: '300px' }} />

        <div>
          <h2>{product.name}</h2>
          <p><strong>Quantity:</strong> {product.count}</p>
          <p><strong>Weight:</strong> {product.weight}</p>
          <p><strong>Size:</strong> {product.size.width} x {product.size.height}</p>
          <button>Edit</button>
        </div>
      </div>

      <hr />
      <h3>Comments</h3>
      <p>Comments are not available yet.</p>
    </div>
  );
};