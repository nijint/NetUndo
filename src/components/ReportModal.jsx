import React, { useState } from 'react';

const ReportModal = ({ isOpen, onClose, onSubmit, selectedNetwork, coordinates }) => {
  const [speed, setSpeed] = useState('Poor (2G/E)');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({
      network: selectedNetwork,
      lat: coordinates.lat,
      lng: coordinates.lng,
      speed,
      reason
    });
    setSpeed('Poor (2G/E)');
    setReason('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <h2>Pin a Spot</h2>
        <p>
          You are reporting for <strong>{selectedNetwork.toUpperCase()}</strong> at location:<br/>
          <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            {coordinates?.lat.toFixed(4)}, {coordinates?.lng.toFixed(4)}
          </span>
        </p>

        <div className="control-group">
          <label htmlFor="speed-select">Signal Speed / Quality</label>
          <select 
            id="speed-select" 
            className="select-input"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          >
            <option value="Excellent (5G/4G)">Excellent (5G/4G) - Green</option>
            <option value="Fair (3G)">Fair (3G) - Orange</option>
            <option value="Poor (2G/E)">Poor (2G/E) - Red</option>
            <option value="No Signal">No Signal - Red</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="issue-reason">Brief Description / Vibe</label>
          <input 
            type="text"
            id="issue-reason" 
            className="select-input"
            placeholder="e.g., Fast enough for Netflix, Call Drops, Crowded cafe..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-submit" onClick={handleSubmit}>
            Drop Pin
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
