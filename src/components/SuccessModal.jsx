import React from 'react';
import { CheckCircle } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="modal-content glass-panel" style={{ textAlign: 'center', padding: '40px 24px', maxWidth: '400px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <CheckCircle size={64} color="var(--accent-primary)" />
        </div>
        <h2 style={{ marginBottom: '12px', color: '#fff', fontSize: '1.5rem' }}>{title || 'Success'}</h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '30px' }}>
          {message}
        </p>
        <button 
          onClick={onClose}
          style={{
            background: 'var(--accent-primary)',
            color: '#000',
            border: 'none',
            padding: '12px 32px',
            borderRadius: '30px',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s',
            boxShadow: '0 4px 15px rgba(0, 230, 118, 0.4)'
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
