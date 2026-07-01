import React from 'react';
import { MapPin } from 'lucide-react';

const LocationPromptModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ background: 'rgba(0, 0, 0, 0.15)', backdropFilter: 'none' }}>
      <div 
        className="glass-panel" 
        style={{ 
          textAlign: 'center', 
          padding: '20px 24px', 
          maxWidth: '340px',
          width: '90%',
          background: 'rgba(6, 20, 14, 0.95)',
          border: '1px solid rgba(0, 230, 118, 0.3)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 230, 118, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          pointerEvents: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
          <MapPin size={20} color="var(--accent-primary)" />
          <h3 style={{ margin: 0, color: '#fff', fontSize: '1.15rem', fontWeight: 700 }}>
            Auto-Detect Location?
          </h3>
        </div>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: '1.4' }}>
          NetUndo will locate you to drop a pin option at your exact spot.
        </p>

        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button 
            onClick={onCancel}
            style={{ 
              padding: '10px 16px', 
              borderRadius: '12px', 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: '0.85rem',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-light)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              flex: 1,
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            No, Manually
          </button>
          <button 
            onClick={onConfirm}
            style={{ 
              padding: '10px 16px', 
              borderRadius: '12px', 
              fontWeight: 700, 
              cursor: 'pointer',
              fontSize: '0.85rem',
              background: 'var(--accent-primary)',
              color: '#000',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0, 230, 118, 0.3)',
              flex: 1,
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--accent-primary-hover)';
              e.target.style.boxShadow = '0 6px 16px rgba(0, 230, 118, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--accent-primary)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 230, 118, 0.3)';
            }}
          >
            Yes, Locate
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPromptModal;
