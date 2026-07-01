import React from 'react';
import { MapPin } from 'lucide-react';

const LocationPromptModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ textAlign: 'center', padding: '32px 24px', maxWidth: '420px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ 
            background: 'rgba(0, 230, 118, 0.1)', 
            padding: '16px', 
            borderRadius: '50%',
            border: '1px solid rgba(0, 230, 118, 0.3)',
            boxShadow: '0 0 20px rgba(0, 230, 118, 0.2)'
          }}>
            <MapPin size={48} color="var(--accent-primary)" />
          </div>
        </div>
        <h2 style={{ marginBottom: '12px', color: '#fff', fontSize: '1.6rem', fontWeight: 800 }}>
          Enable Auto-Pinning?
        </h2>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '28px', fontSize: '0.95rem' }}>
          Would you like NetUndo to automatically access your location and drop a pin option at your exact spot to report coverage?
        </p>
        <div className="modal-actions" style={{ display: 'flex', gap: '12px', width: '100%' }}>
          <button 
            className="btn-secondary" 
            onClick={onCancel}
            style={{ 
              padding: '14px 20px', 
              borderRadius: '16px', 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: '0.95rem',
              flex: 1
            }}
          >
            No, Pin Manually
          </button>
          <button 
            className="btn-submit" 
            onClick={onConfirm}
            style={{ 
              padding: '14px 20px', 
              borderRadius: '16px', 
              fontWeight: 700, 
              cursor: 'pointer',
              fontSize: '0.95rem',
              background: 'var(--accent-primary)',
              color: '#000',
              border: 'none',
              boxShadow: '0 4px 15px rgba(0, 230, 118, 0.4)',
              flex: 1
            }}
          >
            Yes, Auto-Locate
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPromptModal;
