import React, { useState } from 'react';

const UpdateModal = ({ isOpen, onClose, onSubmit, report }) => {
  const [speed, setSpeed] = useState('Excellent (5G/4G)');
  const [reason, setReason] = useState('');

  if (!isOpen || !report) return null;

  const handleSubmit = () => {
    onSubmit({
      pin_id: report.id,
      proposed_speed: speed,
      reason
    });
    setSpeed('Excellent (5G/4G)');
    setReason('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <h2>Report Improved Coverage</h2>
        <p>
          You are submitting an update for the <strong>{report.network?.toUpperCase()}</strong> pin at location:<br/>
          <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
          </span>
        </p>

        <div className="control-group">
          <label htmlFor="speed-select">New Signal Speed / Quality</label>
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
          <label htmlFor="issue-reason">Reason for Update</label>
          <input 
            type="text"
            id="issue-reason" 
            className="select-input"
            placeholder="e.g., New tower built, 5G upgrade, Network improved"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-submit" onClick={handleSubmit}>
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
