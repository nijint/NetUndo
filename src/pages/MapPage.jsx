import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MapContainer from '../components/MapContainer';
import Sidebar from '../components/Sidebar';
import ReportModal from '../components/ReportModal';
import { supabase } from '../supabaseClient';

const MapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [selectedNetwork, setSelectedNetwork] = useState('jio');
  const [isReportingMode, setIsReportingMode] = useState(false);
  const [reports, setReports] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [lockedReportCoords, setLockedReportCoords] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingReportCoords, setPendingReportCoords] = useState(null);

  // Read initial state from router navigation (e.g. from LandingPage)
  useEffect(() => {
    if (location.state?.openReportingMode) {
      setIsReportingMode(true);
    }
    if (location.state?.searchedLocation) {
      setSearchedLocation(location.state.searchedLocation);
    }
  }, [location.state]);

  // Fetch initial pins from Supabase
  useEffect(() => {
    const fetchPins = async () => {
      const { data, error } = await supabase.from('pins').select('*');
      if (error) {
        console.error('Error fetching pins:', error);
      } else if (data) {
        const mapped = data.map(pin => ({
          id: pin.id,
          lat: pin.lat,
          lng: pin.lng,
          network: pin.provider,
          speed: pin.signal_strength,
          reason: pin.reason || ''
        }));
        setReports(mapped);
      }
    };
    fetchPins();
  }, []);

  const handleMapClick = (latlng) => {
    if (isReportingMode) {
      setLockedReportCoords(latlng);
    }
  };

  const handleConfirmPin = () => {
    if (lockedReportCoords) {
      setPendingReportCoords(lockedReportCoords);
      setIsModalOpen(true);
    }
  };

  // When toggling reporting mode off, clear any locked pin
  const toggleReportingMode = () => {
    const nextMode = !isReportingMode;
    setIsReportingMode(nextMode);
    if (!nextMode) {
      setLockedReportCoords(null);
    }
  };

  const handleModalSubmit = async (reportData) => {
    const newDbReport = {
      id: Date.now(),
      lat: reportData.lat,
      lng: reportData.lng,
      network_type: 'Cellular',
      provider: reportData.network,
      signal_strength: reportData.speed,
      reason: reportData.reason
    };

    const { data, error } = await supabase
      .from('pins')
      .insert([newDbReport])
      .select();

    if (error) {
      console.error('Error saving pin to database:', error);
      alert('Failed to save pin to the database. Make sure you added the columns exactly as requested!');
      return;
    }

    if (data && data[0]) {
      const savedPin = data[0];
      const mappedReport = {
        id: savedPin.id,
        lat: savedPin.lat,
        lng: savedPin.lng,
        network: savedPin.provider,
        speed: savedPin.signal_strength,
        reason: savedPin.reason || ''
      };
      setReports(prev => [mappedReport, ...prev]);
    }

    setIsModalOpen(false);
    setPendingReportCoords(null);
    setLockedReportCoords(null);
    setIsReportingMode(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setPendingReportCoords(null);
    setLockedReportCoords(null);
    setIsReportingMode(false);
  };

  return (
    <div className="map-page-container" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          zIndex: 1000,
          background: 'rgba(6, 20, 14, 0.8)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontWeight: 600,
          fontFamily: 'inherit',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}
      >
        <ArrowLeft size={18} /> Home
      </button>

      <MapContainer 
        selectedNetwork={selectedNetwork}
        isReportingMode={isReportingMode}
        onMapClick={handleMapClick}
        lockedReportCoords={lockedReportCoords}
        onConfirmPin={handleConfirmPin}
        reports={reports}
        searchedLocation={searchedLocation}
      />
      
      <div className="overlay-ui">
        {/* Sidebar pushed down slightly to make room for Home button */}
        <div style={{ marginTop: '60px' }}>
          <Sidebar 
            selectedNetwork={selectedNetwork}
            setSelectedNetwork={setSelectedNetwork}
            isReportingMode={isReportingMode}
            setIsReportingMode={setIsReportingMode}
            reports={reports}
          />
        </div>

        {/* Permanent Floating Report Widget */}
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(6, 20, 14, 0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 230, 118, 0.3)',
          borderRadius: '30px',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(0, 230, 118, 0.1)',
          zIndex: 1000,
          pointerEvents: 'auto'
        }}>
          {searchedLocation && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Area
                </span>
                <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>
                  {searchedLocation.name.split(',')[0]}
                </span>
              </div>
              <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' }}></div>
            </>
          )}

          <button 
            onClick={toggleReportingMode}
            style={{
              background: isReportingMode ? 'transparent' : 'var(--accent-primary)',
              color: isReportingMode ? 'var(--accent-primary)' : '#000',
              border: isReportingMode ? '1px solid var(--accent-primary)' : 'none',
              padding: '12px 24px',
              borderRadius: '30px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
              boxShadow: isReportingMode ? 'none' : '0 4px 15px rgba(0, 230, 118, 0.4)',
              whiteSpace: 'nowrap'
            }}
          >
            {isReportingMode ? 'Cancel Pinning' : 'Drop a Pin Here'}
          </button>
        </div>
      </div>

      <ReportModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        selectedNetwork={selectedNetwork}
        coordinates={pendingReportCoords}
      />
    </div>
  );
};

export default MapPage;
