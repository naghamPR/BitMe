import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { X } from "lucide-react";
import "./MapDisplayModal.css";

const MapDisplayModal = ({ restaurant, onClose }) => {
  // Use restaurant's latitude and longitude, fallback to a default if null
  const position = [
    parseFloat(restaurant.latitude || 0), // Convert to number, default to 0 if null
    parseFloat(restaurant.longitude || 0), // Convert to number, default to 0 if null
  ];

  // If coordinates are missing or invalid, show a message
  if (
    !restaurant.latitude ||
    !restaurant.longitude ||
    isNaN(position[0]) ||
    isNaN(position[1])
  ) {
    return (
      <div className="mdm-modal-overlay open" onClick={onClose}>
        <div
          className="mdm-modal-content mdm-small-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="mdm-modal-close-button" onClick={onClose}>
            <X size={24} />
          </button>
          <h2 className="mdm-modal-title">Location for {restaurant.name}</h2>
          <p className="mdm-error-message">
            Location coordinates not available or invalid for this restaurant.
          </p>
          <button className="mdm-action-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mdm-modal-overlay open" onClick={onClose}>
      <div
        className="mdm-modal-content mdm-large-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="mdm-modal-close-button" onClick={onClose}>
          <X size={24} />
        </button>
        <h2 className="mdm-modal-title">Location of {restaurant.name}</h2>

        <div className="mdm-map-container">
          <MapContainer
            center={position}
            zoom={15} // Closer zoom for single restaurant
            scrollWheelZoom={true}
            className="mdm-map-instance" // Apply specific map styling
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                <strong>{restaurant.name}</strong>
                <br />
                {restaurant.location}
                <br />
                Rating:{" "}
                {restaurant.user_rates_avg_rate
                  ? parseFloat(restaurant.user_rates_avg_rate).toFixed(1)
                  : "N/A"}
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <p className="mdm-coordinates-display">
          Coordinates: {position[0].toFixed(5)}, {position[1].toFixed(5)}
        </p>

        <div className="mdm-modal-actions">
          <button className="mdm-action-button" onClick={onClose}>
            Close Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapDisplayModal;
