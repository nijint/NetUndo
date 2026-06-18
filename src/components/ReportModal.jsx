import React, { useState } from 'react';

const ReportModal = ({ isOpen, onClose, onSubmit, selectedNetwork, coordinates }) => {
  const [speed, setSpeed] = useState('Poor (2G/E)');
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Client-side rate limiting (30 seconds cooldown)
    const lastSubmitTime = localStorage.getItem('netundo_last_report_time');
    
    if (lastSubmitTime) {
      const timeSinceLastSubmit = Date.now() - parseInt(lastSubmitTime, 10);
      const cooldownMs = 30 * 1000; // 30 seconds
      if (timeSinceLastSubmit < cooldownMs) {
        const remainingSeconds = Math.ceil((cooldownMs - timeSinceLastSubmit) / 1000);
        setErrorMsg(`Please wait ${remainingSeconds}s before submitting again.`);
        return;
      }
    }

    // Update last submit time on successful attempt
    localStorage.setItem('netundo_last_report_time', Date.now().toString());
    setErrorMsg('');

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

        {errorMsg && (
          <div style={{ color: '#ff4d4d', fontSize: '0.9rem', marginBottom: '15px', fontWeight: 'bold' }}>
            {errorMsg}
          </div>
        )}

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
