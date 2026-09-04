import React, { useEffect, useState, useRef } from 'react';
import { MapContainer as LeafletMap, TileLayer, Popup, CircleMarker, Circle, useMapEvents, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';

const SPEED_COLORS = {
  'Excellent (5G)': 'var(--coverage-violet)',
  '5G Speed': 'var(--coverage-violet)',
  '5G': 'var(--coverage-violet)',
  'Good (4G)': 'var(--coverage-green)',
  '4G Speed': 'var(--coverage-green)',
  '4G': 'var(--coverage-green)',
  'Excellent (5G/4G)': 'var(--coverage-green)',
  'Fair (3G)': 'var(--coverage-orange)',
  'Poor (2G/E)': 'var(--coverage-red)',
  'No Signal': 'var(--coverage-red)'
};

const getSpeedColor = (speed) => SPEED_COLORS[speed] || 'var(--coverage-red)';

const MOCK_COVERAGE = {};
const MOCK_REPORTS = [];

const getMarkerRadius = (zoom) => {
  if (zoom <= 7) return 4;
  if (zoom <= 9) return 5;
  if (zoom <= 11) return 7;
  if (zoom <= 13) return 9;
  return 11;
};

const getMarkerWeight = (zoom) => {
  if (zoom <= 8) return 1;
  if (zoom <= 11) return 1.5;
  return 2;
};

const getMarkerOpacity = (zoom) => {
  if (zoom <= 8) return 0.8;
  return 0.5;
};

const MapController = ({ isReportingMode, onMapClick, searchedLocation, keralaGeoJson, onZoomChange }) => {
  const map = useMap();

  useMapEvents({
    click(e) {
      if (isReportingMode) {
        onMapClick(e.latlng);
      }
    },
    zoomend() {
      if (onZoomChange) onZoomChange(map.getZoom());
    }
  });

  useEffect(() => {
    if (map && onZoomChange) {
      onZoomChange(map.getZoom());
    }
  }, [map, onZoomChange]);

  useEffect(() => {
    if (searchedLocation && map) {
      map.setView([searchedLocation.lat, searchedLocation.lng], 14);
      if (onZoomChange) onZoomChange(14);
    }
  }, [searchedLocation, map, onZoomChange]);

  useEffect(() => {
    if (keralaGeoJson) {
      const bounds = L.geoJSON(keralaGeoJson).getBounds();
      map.setMaxBounds(bounds.pad(0.1));
    }
  }, [keralaGeoJson, map]);

  return null;
};

const MapContainer = ({ selectedNetwork, isReportingMode, onMapClick, onConfirmPin, lockedReportCoords, reports, searchedLocation, onUpdatePinClick }) => {
  const [keralaGeoJson, setKeralaGeoJson] = useState(null);
  const initialZoom = searchedLocation ? 14 : 7;
  const [currentZoom, setCurrentZoom] = useState(initialZoom);
  const lockedPinRef = useRef(null);
  const keralaCenter = [10.8505, 76.2711];

  useEffect(() => {
    fetch('/kerala.json')
      .then(res => res.json())
      .then(data => setKeralaGeoJson(data))
      .catch(err => console.error("Error loading Kerala GeoJSON:", err));
  }, []);

  useEffect(() => {
    if (lockedReportCoords && lockedPinRef.current) {
      setTimeout(() => {
        if (lockedPinRef.current) lockedPinRef.current.openPopup();
      }, 10);
    }
  }, [lockedReportCoords]);

  const allReports = [...MOCK_REPORTS, ...reports];

  const geoJsonStyle = {
    color: 'var(--accent-primary)',
    weight: 2,
    fillColor: 'transparent',
    fillOpacity: 0
  };

  const initialCenter = searchedLocation ? [searchedLocation.lat, searchedLocation.lng] : keralaCenter;

  const currentRadius = getMarkerRadius(currentZoom);
  const currentWeight = getMarkerWeight(currentZoom);
  const currentOpacity = getMarkerOpacity(currentZoom);

  return (
    <div className={`map-wrapper ${isReportingMode ? 'reporting-active' : ''}`}>
      <LeafletMap
        center={initialCenter}
        zoom={initialZoom}
        minZoom={7}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          className="dark-tiles"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          isReportingMode={isReportingMode}
          onMapClick={onMapClick}
          searchedLocation={searchedLocation}
          keralaGeoJson={keralaGeoJson}
          onZoomChange={setCurrentZoom}
        />

        {keralaGeoJson && (
          <GeoJSON data={keralaGeoJson} style={geoJsonStyle} interactive={false} />
        )}


        {MOCK_COVERAGE[selectedNetwork]?.map((zone, index) => (
          <Circle
            key={`sim-${index}`}
            center={zone.center}
            radius={zone.radius}
            pathOptions={{
              color: zone.color,
              fillColor: zone.color,
              fillOpacity: 0.4,
              weight: 0
            }}
          />
        ))}


        {allReports
          .filter(report => report.network === selectedNetwork)
          .map(report => (
            <CircleMarker
              key={report.id}
              center={[report.lat, report.lng]}
              radius={currentRadius}
              pathOptions={{
                color: getSpeedColor(report.speed),
                fillColor: getSpeedColor(report.speed),
                fillOpacity: currentOpacity,
                weight: currentWeight
              }}
            >
              <Popup className="custom-popup">
                <div style={{ padding: '4px' }}>
                  <h4 style={{ margin: '0 0 4px 0', textTransform: 'uppercase', fontSize: '12px', color: '#1a0b2e' }}>
                    {report.network}
                  </h4>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: getSpeedColor(report.speed) }}>{report.speed}</p>
                  <p style={{ margin: '0 0 8px 0', color: '#1a0b2e', fontSize: '0.9rem' }}>"{report.reason}"</p>
                  {onUpdatePinClick && (
                    <button
                      onClick={() => onUpdatePinClick(report)}
                      style={{
                        background: 'none',
                        border: '1px solid var(--accent-primary)',
                        color: 'var(--accent-primary)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      Update Status
                    </button>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* Locked Report Pin */}
        {lockedReportCoords && (
          <CircleMarker
            center={[lockedReportCoords.lat, lockedReportCoords.lng]}
            radius={20}
            pathOptions={{
              color: 'var(--accent-primary)',
              fillColor: 'var(--accent-primary)',
              fillOpacity: 0.15,
              weight: 2,
              dashArray: '4, 4'
            }}
            ref={lockedPinRef}
          >
            <Popup className="custom-popup" closeButton={false} autoClose={false} closeOnClick={false}>
              <div style={{ padding: '8px', textAlign: 'center' }}>
                <p style={{ margin: '0 0 12px 0', color: '#1a0b2e', fontWeight: 'bold' }}>Pin Locked</p>
                <button
                  onClick={onConfirmPin}
                  style={{
                    background: 'var(--accent-primary)',
                    color: '#000',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    width: '100%',
                    fontFamily: 'inherit'
                  }}
                >
                  Report this point
                </button>
              </div>
            </Popup>
          </CircleMarker>
        )}
      </LeafletMap>
    </div>
  );
};

export default MapContainer;
