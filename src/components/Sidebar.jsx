import React from 'react';
import { MapPin, WifiOff, Activity } from 'lucide-react';

const SPEED_COLORS = {
  'Excellent (5G/4G)': 'var(--coverage-green)',
  'Fair (3G)': 'var(--coverage-orange)',
  'Poor (2G/E)': 'var(--coverage-red)',
  'No Signal': 'var(--coverage-red)'
};

const getSpeedColor = (speed) => SPEED_COLORS[speed] || 'var(--coverage-red)';

const Sidebar = ({ selectedNetwork, setSelectedNetwork, isReportingMode, setIsReportingMode, reports }) => {
  
  const networks = [
    { id: 'jio', label: 'Jio' },
    { id: 'airtel', label: 'Airtel' },
    { id: 'vi', label: 'Vi (Vodafone Idea)' },
    { id: 'bsnl', label: 'BSNL' }
  ];

  return (
    <div className="sidebar glass-panel">
      <div className="brand" style={{ display: 'none' }}>
        {/* Brand moved to Hero section */}
      </div>

      <div className="control-group">
        <label htmlFor="network-select">Select Network</label>
        <select 
          id="network-select" 
          className="select-input"
          value={selectedNetwork}
          onChange={(e) => setSelectedNetwork(e.target.value)}
        >
          {networks.map(net => (
            <option key={net.id} value={net.id}>{net.label}</option>
          ))}
        </select>
      </div>

      <button 
        className={`sidebar-btn-primary ${isReportingMode ? 'active' : ''}`}
        onClick={() => setIsReportingMode(!isReportingMode)}
      >
        <WifiOff size={22} />
        {isReportingMode ? 'Cancel Reporting' : 'Report Low Coverage'}
      </button>

      {isReportingMode && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
          Click anywhere on the map to drop a pin.
        </p>
      )}

      <div className="control-group" style={{ flex: 1, marginTop: '12px' }}>
        <label>Recent Reports ({selectedNetwork})</label>
        <div className="reports-list">
          {reports.filter(r => r.network === selectedNetwork).length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', marginTop: '20px' }}>
              No reports yet for this network in the current session.
            </p>
          ) : (
            reports
              .filter(r => r.network === selectedNetwork)
              .sort((a, b) => b.id - a.id)
              .map((report, idx) => (
                <div key={idx} className="report-card">
                  <div className="report-card-header">
                    <span className="network-badge">{report.network}</span>
                    <span className="report-coords">
                      {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="report-reason">{report.reason || 'No description provided'}</div>
                  <div className="report-speed" style={{ color: getSpeedColor(report.speed), fontSize: '0.85rem', marginTop: '4px', fontWeight: 600 }}>
                    {report.speed}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
