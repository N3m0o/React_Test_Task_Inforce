import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addProduct, fetchProducts, updateProduct, deleteProduct } from '../store/productSlice';
import { Link } from 'react-router-dom';
import { Modal } from '../components/Modal';
import type { Product } from '../types';

export const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'count'>('name');

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

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

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      dispatch(deleteProduct(productToDelete.id));
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'name') {
      const nameCompare = a.name.localeCompare(b.name);
      if (nameCompare !== 0) return nameCompare;
      return b.count - a.count;
    } else {
      const countCompare = b.count - a.count;
      if (countCompare !== 0) return countCompare;
      return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="product-list-page">
      <h2>Goods list</h2>

      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label htmlFor="sort">Sort by:</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'count')}
          style={{ padding: '5px', borderRadius: '4px', background: '#444', color: 'white' }}
        >
          <option value="name">Alphabetical (A-Z)</option>
          <option value="count">Quantity (Most first)</option>
        </select>
      </div>

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

      <Modal
        isOpen={isDeleteModalOpen}
        title="Confirm Deletion"
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      >
        <p>Are you sure you want to delete product "{productToDelete?.name}"?</p>
      </Modal>

      <div className="products-grid" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {sortedItems.map((product) => (
          <div key={product.id} className="product-card" style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <img src={product.imageUrl} alt={product.name} style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
            <h3>{product.name}</h3>
            <p>Quantity: {product.count}</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', margin: '15px 0' }}>
              <button style={{ borderRadius: '8px', padding: '5px 10px' }} onClick={() => handleEditClick(product)}>Edit</button>
              <button style={{ borderRadius: '8px', background: '#ff4d4d', color: 'white', padding: '5px 10px' }} onClick={() => handleDeleteClick(product)}>Delete</button>
            </div>

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
