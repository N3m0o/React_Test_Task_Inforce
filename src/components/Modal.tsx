import React from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, title, onClose, onConfirm, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-x" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          {children}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};