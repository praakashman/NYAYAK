"use client";
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Court, courtsData } from './courtData';

// Fix typical Leaflet icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const defaultIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2953/2953982.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const highlightIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/14090/14090313.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3011/3011270.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35]
});

interface MapProps {
  userLocation: [number, number] | null;
  escalationPath: Court[];
  onCourtSelect: (court: Court) => void;
}

// Helper to center map
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const CourtMap = ({ userLocation, escalationPath, onCourtSelect }: MapProps) => {
  const mapCenter: [number, number] = userLocation || [27.7, 85.3]; // Default to Kathmandu
  const zoom = userLocation ? 10 : 7;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const pathCoordinates = escalationPath.map(c => c.coordinates);

  return (
    <div className="h-full w-full relative z-0" key="map-wrapper">
      <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={mapCenter} zoom={zoom} />
        
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>
              <strong>Your Location</strong>
            </Popup>
          </Marker>
        )}

        {courtsData.map((court, idx) => {
          const isHighlighted = escalationPath.some(c => c.name === court.name);
          return (
            <Marker 
              key={idx} 
              position={court.coordinates}
              icon={isHighlighted ? highlightIcon : defaultIcon}
              eventHandlers={{
                click: () => onCourtSelect(court)
              }}
            >
              <Popup>
                <div className="font-sans">
                  <h3 className="font-bold text-[#111111]">{court.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{court.type}</p>
                  <button 
                    onClick={() => onCourtSelect(court)}
                    className="mt-2 w-full py-1.5 bg-[#111111] text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
                  >
                    View Details & Route
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Draw escalation path polyline */}
        {pathCoordinates.length > 1 && (
          <Polyline 
            positions={pathCoordinates} 
            color="#FF4B4B" 
            weight={4}
            dashArray="10, 10"
            opacity={0.8}
            className="animate-pulse"
          />
        )}
      </MapContainer>
    </div>
  );
};

export default CourtMap;
