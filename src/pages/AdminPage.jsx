import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const SPEED_COLORS = {
  'Excellent (5G/4G)': 'var(--coverage-green)',
  'Fair (3G)': 'var(--coverage-orange)',
  'Poor (2G/E)': 'var(--coverage-red)',
  'No Signal': 'var(--coverage-red)'
};

const getSpeedColor = (speed) => SPEED_COLORS[speed] || 'var(--coverage-red)';

const AdminPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [pendingUpdates, setPendingUpdates] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const correctPasscode = import.meta.env.VITE_ADMIN_PASSCODE || 'admin123';
    if (passcode === correctPasscode) {
      setIsAuthenticated(true);
      fetchPendingUpdates();
    } else {
      setError('Incorrect passcode.');
    }
  };

  const fetchPendingUpdates = async () => {
    setLoading(true);
    const { data: updatesData, error: updatesError } = await supabase
      .from('pin_updates')
      .select('*, pins!inner(*)')
      .eq('status', 'pending');

    if (updatesError) {
      console.error('Error fetching updates:', updatesError);
      setError('Failed to load updates. Ensure tables and relations are set up.');
    } else if (updatesData) {
      setPendingUpdates(updatesData);
    }
    setLoading(false);
  };

  const handleApprove = async (update) => {
    const { error: pinError } = await supabase
      .from('pins')
      .update({
        signal_strength: update.proposed_speed,
        reason: update.reason
      })
      .eq('id', update.pin_id);

    if (pinError) {
      alert('Failed to update the original pin.');
      console.error(pinError);
      return;
    }

    const { error: updateError } = await supabase
      .from('pin_updates')
      .update({ status: 'approved' })
      .eq('id', update.id);

    if (updateError) {
      alert('Failed to mark request as approved.');
      console.error(updateError);
      return;
    }

    setPendingUpdates(prev => prev.filter(u => u.id !== update.id));
  };

  const handleReject = async (updateId) => {
    const { error } = await supabase
      .from('pin_updates')
      .update({ status: 'rejected' })
      .eq('id', updateId);

    if (error) {
      alert('Failed to reject the update request.');
      console.error(error);
      return;
    }

    setPendingUpdates(prev => prev.filter(u => u.id !== updateId));
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-dark)' }}>
        <button onClick={() => navigate('/')} style={{ position: 'absolute', top: 20, left: 20, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={18} /> Back Home
        </button>
        <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '20px', color: '#fff' }}>Admin Access</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="password" 
              placeholder="Enter Passcode" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="select-input"
              style={{ width: '100%' }}
            />
            {error && <p style={{ color: 'var(--danger-red)', fontSize: '0.9rem' }}>{error}</p>}
            <button type="submit" className="btn-submit" style={{ width: '100%' }}>Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', minHeight: '100vh', background: 'var(--bg-dark)', color: '#fff' }}>
      <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <ArrowLeft size={18} /> Back Home
      </button>

      <h1>Admin Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Review pending user reports for improved coverage.</p>

      {loading ? (
        <p>Loading updates...</p>
      ) : pendingUpdates.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>No pending updates.</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {pendingUpdates.map((update) => (
            <div key={update.id} className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1.2rem', marginRight: '10px' }}>{update.pins?.provider?.toUpperCase() || 'Unknown Network'}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pin #{update.pin_id} | Location: {update.pins?.lat?.toFixed(4)}, {update.pins?.lng?.toFixed(4)}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '30px', marginBottom: '10px' }}>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Current Speed</p>
                    <p style={{ color: getSpeedColor(update.pins?.signal_strength), fontWeight: 'bold' }}>{update.pins?.signal_strength}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Proposed Speed</p>
                    <p style={{ color: getSpeedColor(update.proposed_speed), fontWeight: 'bold' }}>{update.proposed_speed}</p>
                  </div>
                </div>
                
                {update.reason && (
                  <p style={{ fontSize: '0.9rem', color: '#ddd' }}><strong>Reason:</strong> "{update.reason}"</p>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleReject(update.id)}
                  style={{ background: 'rgba(255,51,102,0.1)', color: 'var(--danger-red)', border: '1px solid var(--danger-red)', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <XCircle size={18} /> Reject
                </button>
                <button 
                  onClick={() => handleApprove(update)}
                  style={{ background: 'var(--accent-primary)', color: '#000', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}
                >
                  <CheckCircle size={18} /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
