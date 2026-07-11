import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Loader, Plus, X, CheckCircle, AlertCircle } from 'lucide-react'; // Icons

import "./Addresturant.css"; // Component-specific CSS
import { addRestaurant } from "../../actions/resturantsActions";
import MapPicker from "../../MapPicker";

const Addresturant = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    owner_name: "", // Renamed for clarity
    email: "",
    phone: "",
    password: "",
    name: "", // Restaurant name
    location: "", // Text location
    type: "", // Restaurant type (e.g., Fine Dining, Casual)
    cuisine_type: "",
    startTime: "",
    endTime: "",
    ratings: 0, // Default rating
    event_calender: "",
    features: [], // Array of { type, description }
    tables: [], // Array of { type, number_of_persons, count }
    latitude: null, // New: from MapPicker
    longitude: null, // New: from MapPicker
  });

  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [newFeature, setNewFeature] = useState({ type: "", description: "" });
  const [newTable, setNewTable] = useState({
    type: "",
    number_of_persons: "",
    count: "",
  });
  const [loading, setLoading] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState({ type: '', text: '' });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      latitude: location.lat,
      longitude: location.lng,
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.type && newFeature.description) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature],
      });
      setNewFeature({ type: "", description: "" });
    } else {
      alert("Please fill both feature type and description."); // Consider a better UI feedback
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleAddTable = () => {
    if (newTable.type && newTable.number_of_persons && newTable.count) {
      setFormData({
        ...formData,
        tables: [...formData.tables, newTable],
      });
      setNewTable({ type: "", number_of_persons: "", count: "" });
    } else {
      alert("Please fill all table fields."); // Consider a better UI feedback
    }
  };

  const handleRemoveTable = (index) => {
    setFormData((prev) => ({
      ...prev,
      tables: prev.tables.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionMessage({ type: '', text: '' });

    const finalData = new FormData();

    // Append owner/user data
    finalData.append("na", formData.owner_name); // Backend expects 'na' for owner name
    finalData.append("email", formData.email);
    finalData.append("password", formData.password);

    // Append restaurant data
    finalData.append("name", formData.name);
    finalData.append("phone", formData.phone);
    finalData.append("location", formData.location);
    finalData.append("type", formData.type);
    finalData.append("cuisine_type", formData.cuisine_type);
    finalData.append("startTime", formData.startTime);
    finalData.append("endTime", formData.endTime);
    finalData.append("ratings", formData.ratings || 0);
    finalData.append("event_calender", formData.event_calender);
    finalData.append("latitude", formData.latitude || ''); // Append latitude
    finalData.append("longitude", formData.longitude || ''); // Append longitude

    // Append image and video as File objects
    if (image && image instanceof File) {
      finalData.append("image", image);
    } else {
      setSubmissionMessage({ type: 'error', text: "Image file is missing or invalid." });
      setLoading(false);
      return;
    }

    if (video && video instanceof File) {
      finalData.append("video", video);
    }

    // Append features as indexed arrays (Laravel's expected format for nested arrays)
    formData.features.forEach((feature, i) => {
      finalData.append(`features[${i}][type]`, feature.type);
      finalData.append(`features[${i}][description]`, feature.description);
    });

    // Append tables as indexed arrays
    formData.tables.forEach((table, i) => {
      finalData.append(`tables[${i}][type]`, table.type);
      finalData.append(`tables[${i}][number_of_persons]`, table.number_of_persons);
      finalData.append(`tables[${i}][count]`, table.count);
    });

    try {
      // Dispatch FormData
      const response = await dispatch(addRestaurant(finalData));
      if (response.success) { // Assuming addRestaurant action returns success/error flag
        setSubmissionMessage({ type: 'success', text: response.message || 'Restaurant added successfully!' });
        // Reset form for new entry, clear file inputs
        setFormData({
            owner_name: "", email: "", password: "", name: "", location: "", type: "",
            cuisine_type: "", startTime: "", endTime: "", ratings: 0, event_calender: "",
            features: [], tables: [], latitude: null, longitude: null,
        });
        setImage(null);
        setVideo(null);
        // Clear file input elements visually (requires refs or direct DOM manipulation)
        // e.target.reset(); // This might work if files are directly on form
      } else {
        setSubmissionMessage({ type: 'error', text: response.message || 'Failed to add restaurant.' });
      }
    } catch (apiError) {
      // Error handling from Redux action
      const msg = apiError.response?.data?.message || apiError.message || 'An error occurred during submission.';
      const errors = apiError.response?.data?.errors; // Laravel validation errors
      let fullMessage = msg;
      if (errors) {
        Object.keys(errors).forEach(key => {
          fullMessage += `\n${key}: ${errors[key].join(', ')}`;
        });
      }
      setSubmissionMessage({ type: 'error', text: fullMessage });
      console.error("Error adding restaurant:", apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ar-page-container">
      <h2 className="ar-page-title">Add New Restaurant</h2>
      <form onSubmit={handleSubmit} className="ar-form">
        <div className="ar-form-section">
          <h3 className="ar-section-title">Owner Information</h3>
          <input
            type="text"
            name="owner_name"
            placeholder="Owner Name"
            onChange={handleChange}
            value={formData.owner_name}
            className="ar-form-input"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Owner Email"
            onChange={handleChange}
            value={formData.email}
            className="ar-form-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Owner Password"
            onChange={handleChange}
            value={formData.password}
            className="ar-form-input"
            required
          />
        </div>

        <div className="ar-form-section">
          <h3 className="ar-section-title">Restaurant Details</h3>
          <input
            type="text"
            name="name"
            placeholder="Restaurant Name"
            onChange={handleChange}
            value={formData.name}
            className="ar-form-input"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location (e.g., street address)"
            onChange={handleChange}
            value={formData.location}
            className="ar-form-input"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="phone (e.g., 0959...)"
            onChange={handleChange}
            value={formData.phone}
            className="ar-form-input"
            required
          />
          <input
            type="text"
            name="type"
            placeholder="Type (e.g., Fine Dining, Casual)"
            onChange={handleChange}
            value={formData.type}
            className="ar-form-input"
            required
          />
          <input
            type="text"
            name="cuisine_type"
            placeholder="Cuisine Type (e.g., Italian, Mexican)"
            onChange={handleChange}
            value={formData.cuisine_type}
            className="ar-form-input"
            required
          />
          <label className="ar-form-label">Opening Time:</label>
          <input
            type="time"
            name="startTime"
            onChange={handleChange}
            value={formData.startTime}
            className="ar-form-input"
            required
          />
          <label className="ar-form-label">Closing Time:</label>
          <input
            type="time"
            name="endTime"
            onChange={handleChange}
            value={formData.endTime}
            className="ar-form-input"
            required
          />
          <input
            type="number"
            name="ratings"
            placeholder="Default Ratings (1-5)"
            onChange={handleChange}
            value={formData.ratings}
            className="ar-form-input"
            min="0"
            max="5"
            step="0.1"
          />
          <input
            type="text"
            name="event_calender"
            placeholder="Event Calendar URL (optional)"
            onChange={handleChange}
            value={formData.event_calender}
            className="ar-form-input"
          />

          <label className="ar-form-label ar-file-label">Upload Image (Required)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="ar-form-input ar-file-input"
            required
          />
          {image && <p className="ar-file-preview-name">Selected: {image.name}</p>}

          <label className="ar-form-label ar-file-label">Upload Video (Optional)</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
            className="ar-form-input ar-file-input"
          />
          {video && <p className="ar-file-preview-name">Selected: {video.name}</p>}
        </div>

        <div className="ar-form-section">
          <h3 className="ar-section-title">Features</h3>
          <div className="ar-dynamic-input-group">
            <input
              type="text"
              placeholder="Feature Type (e.g., WiFi, Parking)"
              value={newFeature.type}
              onChange={(e) => setNewFeature({ ...newFeature, type: e.target.value })}
              className="ar-form-input"
            />
            <input
              type="text"
              placeholder="Description"
              value={newFeature.description}
              onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
              className="ar-form-input"
            />
            <button type="button" onClick={handleAddFeature} className="ar-add-button">
              <Plus size={18} /> Add Feature
            </button>
          </div>
          <ul className="ar-dynamic-list">
            {formData.features.map((feature, index) => (
              <li key={index} className="ar-dynamic-list-item">
                <span>{feature.type}: {feature.description}</span>
                <button type="button" onClick={() => handleRemoveFeature(index)} className="ar-remove-button">
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="ar-form-section">
          <h3 className="ar-section-title">Tables</h3>
          <div className="ar-dynamic-input-group">
            <input
              type="text"
              placeholder="Table Type (e.g., Standard, VIP)"
              value={newTable.type}
              onChange={(e) => setNewTable({ ...newTable, type: e.target.value })}
              className="ar-form-input"
            />
            <input
              type="number"
              placeholder="Capacity (Persons)"
              value={newTable.number_of_persons}
              onChange={(e) => setNewTable({ ...newTable, number_of_persons: e.target.value })}
              className="ar-form-input"
            />
            <input
              type="number"
              placeholder="Count (Number of tables)"
              value={newTable.count}
              onChange={(e) => setNewTable({ ...newTable, count: e.target.value })}
              className="ar-form-input"
            />
            <button type="button" onClick={handleAddTable} className="ar-add-button">
              <Plus size={18} /> Add Table
            </button>
          </div>
          <ul className="ar-dynamic-list">
            {formData.tables.map((table, index) => (
              <li key={index} className="ar-dynamic-list-item">
                <span>{table.type} - {table.number_of_persons} persons, {table.count} tables</span>
                <button type="button" onClick={() => handleRemoveTable(index)} className="ar-remove-button">
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="ar-form-section">
          <h3 className="ar-section-title">Location on Map</h3>
          <p className="ar-map-instruction">Click on the map to select Latitude and Longitude.</p>
          <div className="ar-map-picker-container">
            <MapPicker onSelect={handleLocationSelect} />
            {(formData.latitude && formData.longitude) && (
              <div className="ar-coordinates-display">
                <p>
                  Selected Coordinates:
                  <span> Lat: {formData.latitude.toFixed(5)}, Lng: {formData.longitude.toFixed(5)}</span>
                </p>
              </div>
            )}
          </div>
        </div>
        
        {submissionMessage.text && (
            <p className={`ar-submission-message ${submissionMessage.type}`}>
                {submissionMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />} {submissionMessage.text}
            </p>
        )}

        <button type="submit" className="ar-submit-button" disabled={loading}>
          {loading ? <><Loader className="spinner" size={20} /> Submitting...</> : "Add Restaurant"}
        </button>
      </form>
    </div>
  );
};

export default Addresturant;