import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MapContainer from '../components/MapContainer';
import Sidebar from '../components/Sidebar';
import ReportModal from '../components/ReportModal';
import UpdateModal from '../components/UpdateModal';
import SuccessModal from '../components/SuccessModal';
import LocationPromptModal from '../components/LocationPromptModal';
import { supabase } from '../supabaseClient';

const MapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [selectedNetwork, setSelectedNetwork] = useState('jio');
  const [isReportingMode, setIsReportingMode] = useState(false);
  const [reports, setReports] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [lockedReportCoords, setLockedReportCoords] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingReportCoords, setPendingReportCoords] = useState(null);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [reportToUpdate, setReportToUpdate] = useState(null);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLocationPromptOpen, setIsLocationPromptOpen] = useState(!location.state?.searchedLocation);
  const [toastMsg, setToastMsg] = useState('');

  const handleOutsideBoundaryClick = () => {
    setToastMsg('⚠️ Pinning is only allowed inside Kerala boundary!');
    setTimeout(() => setToastMsg(''), 3500);
  };

  useEffect(() => {
    if (location.state?.openReportingMode) {
      setIsReportingMode(true);
    }
    if (location.state?.searchedLocation) {
      setSearchedLocation(location.state.searchedLocation);
    }
  }, [location.state]);

  const handleLocationConfirm = () => {
    setIsLocationPromptOpen(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userLoc = { lat: latitude, lng: longitude };
          setLockedReportCoords(userLoc);
          setIsReportingMode(true);

          if (!location.state?.searchedLocation) {
            setSearchedLocation({
              lat: latitude,
              lng: longitude,
              name: 'Current Location'
            });
          }
        },
        (error) => {
          console.warn("Geolocation permission denied or error:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const handleLocationCancel = () => {
    setIsLocationPromptOpen(false);
  };

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

  const toggleReportingMode = () => {
    const nextMode = !isReportingMode;
    setIsReportingMode(nextMode);
    if (!nextMode) {
      setLockedReportCoords(null);
    }
  };

  const handleModalSubmit = async (reportData) => {
    let networkType = 'Cellular';
    if (reportData.speed?.includes('5G')) networkType = '5G';
    else if (reportData.speed?.includes('4G')) networkType = '4G';
    else if (reportData.speed?.includes('3G')) networkType = '3G';
    else if (reportData.speed?.includes('2G')) networkType = '2G';

    const newDbReport = {
      id: Date.now(),
      lat: reportData.lat,
      lng: reportData.lng,
      network_type: networkType,
      provider: reportData.network,
      signal_strength: reportData.speed,
      reason: reportData.reason
    };

    let mappedReport = {
      id: newDbReport.id,
      lat: newDbReport.lat,
      lng: newDbReport.lng,
      network: newDbReport.provider,
      speed: newDbReport.signal_strength,
      reason: newDbReport.reason || ''
    };

    try {
      const { data, error } = await supabase
        .from('pins')
        .insert([newDbReport])
        .select();

      if (error) {
        console.error('Error saving pin to database:', error);
      } else if (data && data[0]) {
        mappedReport.id = data[0].id;
      }
    } catch (err) {
      console.error('Database error:', err);
    }

    setReports(prev => [mappedReport, ...prev]);

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

  const handleUpdatePinClick = (report) => {
    setReportToUpdate(report);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateModalSubmit = async (updateData) => {
    const { error } = await supabase
      .from('pin_updates')
      .insert([updateData]);

    if (error) {
      console.error('Error submitting update request:', error);
      alert('Failed to submit update. Ensure the pin_updates table is created in Supabase!');
    } else {
      setIsSuccessModalOpen(true);
    }
    
    setIsUpdateModalOpen(false);
    setReportToUpdate(null);
  };

  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
    setReportToUpdate(null);
  };

  return (
    <div className="map-page-container">
      
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
        onUpdatePinClick={handleUpdatePinClick}
        onOutsideBoundaryClick={handleOutsideBoundaryClick}
      />
      
      <div className="overlay-ui">
        {/* Sidebar pushed down slightly to make room for Home button */}
        <div className="sidebar-wrapper">
          <Sidebar 
            selectedNetwork={selectedNetwork}
            setSelectedNetwork={setSelectedNetwork}
            isReportingMode={isReportingMode}
            setIsReportingMode={setIsReportingMode}
            reports={reports}
          />
        </div>
      </div>

      {/* Permanent Floating Report Widget */}
      <div className={`floating-widget ${searchedLocation ? 'has-searched-location' : ''}`}>
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
            boxShadow: isReportingMode ? 'none' : '0 4px 15px rgba(0, 230, 118, 0.4)'
          }}
        >
          {isReportingMode ? 'Cancel Pinning' : 'Drop a Pin Here'}
        </button>
      </div>

      <ReportModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        selectedNetwork={selectedNetwork}
        coordinates={pendingReportCoords}
      />

      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={handleUpdateModalClose}
        onSubmit={handleUpdateModalSubmit}
        report={reportToUpdate}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Update Submitted"
        message="Your request has been successfully submitted and will be reflected on the map after an official review."
      />

      <LocationPromptModal 
        isOpen={isLocationPromptOpen}
        onConfirm={handleLocationConfirm}
        onCancel={handleLocationCancel}
      />

      {/* Global Toast Notification Banner */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: '85px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          background: 'rgba(255, 51, 102, 0.95)',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '30px',
          fontWeight: 700,
          boxShadow: '0 10px 30px rgba(255, 51, 102, 0.5), 0 4px 20px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          fontSize: '0.88rem',
          pointerEvents: 'none',
          textAlign: 'center',
          animation: 'fadeInUp 0.3s ease-out',
          maxWidth: '90%',
          width: 'max-content',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {toastMsg}
        </div>
      )}
    </div>
  );
};

export default MapPage;
