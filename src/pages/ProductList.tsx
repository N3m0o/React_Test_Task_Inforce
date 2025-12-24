import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addProduct, fetchProducts, updateProduct } from '../store/productSlice';
import { Link } from 'react-router-dom';
import { Modal } from '../components/Modal';
import type { Product } from '../types';

export const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    count: 0,
    imageUrl: '',
    weight: '',
    width: 0,
    height: 0
  });

  const { items, status, error } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (status === 'loading') return <div>Loading goods...</div>;
  if (status === 'failed') return <div>Error loading goods: {error}</div>;

  const handleSaveProduct = () => {
    if (!formData.name || !formData.imageUrl) {
      alert("Please fill in the required fields");
      return;
    }

    if (editingProduct) {
      const updated = {
        ...editingProduct,
        name: formData.name,
        count: Number(formData.count),
        imageUrl: formData.imageUrl,
        weight: formData.weight,
        size: { width: Number(formData.width), height: Number(formData.height) },
      };
      dispatch(updateProduct(updated));
    } else {
      const newProduct = {
        name: formData.name,
        count: Number(formData.count),
        imageUrl: formData.imageUrl,
        weight: formData.weight,
        size: { width: Number(formData.width), height: Number(formData.height) },
        comments: []
      };
      dispatch(addProduct(newProduct));
    }

    closeAndReset();
  };

  const closeAndReset = () => {
    setAddModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', count: 0, imageUrl: '', weight: '', width: 0, height: 0 });
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      count: product.count,
      imageUrl: product.imageUrl,
      weight: product.weight,
      width: product.size.width,
      height: product.size.height
    });
    setAddModalOpen(true);
  };

  return (
    <div className="product-list-page">
      <h2>Goods list</h2>

      <button style={{ marginBottom: '20px' }} onClick={() => setAddModalOpen(true)}>Add good</button>

      <Modal
        isOpen={isAddModalOpen}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        onClose={() => setAddModalOpen(false)}
        onConfirm={handleSaveProduct}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
          <input
            type="number"
            placeholder="Count"
            value={formData.count}
            onChange={(e) => setFormData({ ...formData, count: Number(e.target.value) })}
          />
          <input
            placeholder="Weight"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="number"
              placeholder="Width"
              value={formData.width}
              onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })}
            />
            <input
              type="number"
              placeholder="Height"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
            />
          </div>
        </div>
      </Modal>

      <div className="products-grid" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {items.map((product) => (
          <div key={product.id} className="product-card" style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <img src={product.imageUrl} alt={product.name} style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
            <h3>{product.name}</h3>
            <p>Quantity: {product.count}</p>
            <button style={{ margin: '15px', borderRadius: '8px' }} onClick={() => handleEditClick(product)}>Edit</button>

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
