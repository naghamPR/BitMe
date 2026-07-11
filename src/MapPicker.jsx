// src/components/MapPicker.jsx
import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const MapPicker = ({ onSelect }) => {
  const [position, setPosition] = useState(null);
  const mapRef = useRef();

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onSelect(e.latlng);
      },
    });

    return position ? <Marker position={position} /> : null;
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("المتصفح لا يدعم تحديد الموقع الجغرافي.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const latlng = { lat: latitude, lng: longitude };
        setPosition(latlng);
        onSelect(latlng);

        if (mapRef.current) {
          mapRef.current.setView(latlng, 16);
        }
      },
      () => {
        alert("تعذر الحصول على الموقع. تأكد من تفعيل الـ GPS.");
      }
    );
  };

  return (
    <div>
      <MapContainer
        center={[33.5138, 36.2765]}
        zoom={13}
        style={{ height: '300px', width: '100%' }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
        {position && <Marker position={position} />}
      </MapContainer>

      <button
        onClick={handleUseMyLocation}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          backgroundColor: "green",
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
       Get My Location Via GPS
      </button>
    </div>
  );
};

export default MapPicker;
