import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts, updateProduct, addComment, deleteComment } from '../store/productSlice';
import { Modal } from '../components/Modal';

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items, status } = useAppSelector((state) => state.products);

  const product = items.find((item) => String(item.id) === id);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    count: 0,
    imageUrl: '',
    weight: '',
    width: 0,
    height: 0
  });

  const [commentText, setCommentText] = useState('');

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      productId: Number(id),
      description: commentText,
      date: new Date().toLocaleString()
    };

    dispatch(addComment({ productId: Number(id), comment: newComment }));
    setCommentText('');
  };

  const handleDeleteComment = (commentId: number) => {
    dispatch(deleteComment({ productId: Number(id), commentId }));
  };

  const handleEditClick = () => {
    if (product) {
      setFormData({
        name: product.name,
        count: product.count,
        imageUrl: product.imageUrl,
        weight: product.weight,
        width: product.size.width,
        height: product.size.height
      });
      setEditModalOpen(true);
    }
  };

  const handleSave = () => {
    if (product) {
      const updated = {
        ...product,
        name: formData.name,
        count: Number(formData.count),
        imageUrl: formData.imageUrl,
        weight: formData.weight,
        size: { width: Number(formData.width), height: Number(formData.height) },
      };
      dispatch(updateProduct(updated));
      setEditModalOpen(false);
    }
  };

  React.useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <div>Loading product details...</div>;
  if (!product) return <div>Good not found <button onClick={() => navigate('/')}>Return to list</button></div>;

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

          <button onClick={handleEditClick}>Edit</button>
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        title="Edit Product"
        onClose={() => setEditModalOpen(false)}
        onConfirm={handleSave}
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

      <hr />
      <h3>Comments</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {product.comments && product.comments.length > 0 ? (
          product.comments.map((comment) => (
            <div key={comment.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p>{comment.description}</p>
                <small style={{ color: '#888' }}>{comment.date}</small>
              </div>
              <button
                style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                onClick={() => handleDeleteComment(comment.id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          style={{ flex: 1, padding: '10px' }}
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
  );
};