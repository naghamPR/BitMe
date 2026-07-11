import { useSelector } from "react-redux";
import axiosClient from "../../../axios-client";
import React, { useEffect, useState } from "react";
import {
  Loader,
  AlertCircle,
  Edit,
  Save,
  X,
  Utensils,
  MapPin,
  Clock,
  Calendar,
  Star,
  Image,
  Video,
  Tag,
  ClipboardList,
  Table,
  User,
  Plus,
  CheckCircle ,
} from "lucide-react";

import "./RestaurantProfile.css";

const RestaurantProfile = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  const restaurantId = useSelector(state => state.authReducer.authData.data.restaurants[0].id);
  const baseURL = "http://localhost:8000";

  useEffect(() => {
    if (!restaurantId) {
      setFetchError("Restaurant ID not found. Please ensure your account is linked to a restaurant.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError(null);
    axiosClient.get(`getRestaurantDetails/${restaurantId}`)
      .then((res) => {
        setRestaurant(res.data.data);
        // Initialize formData with fetched data, but filter out complex objects
        const initialFormData = { ...res.data.data };
        // Ensure features and tables are arrays, even if null/empty
        initialFormData.features = initialFormData.features || [];
        initialFormData.tables = initialFormData.tables || [];

        // Exclude properties that are relationships or computed values and shouldn't be directly sent back
        // These typically include nested arrays/objects or aggregated data from the backend
        delete initialFormData.menus;
        delete initialFormData.discounts;
        delete initialFormData.offer;
        delete initialFormData.user_rates_avg_rate; // Computed
        delete initialFormData.user_rating;       // Computed/relationship
        delete initialFormData.user;              // Relationship (restaurant owner)
        delete initialFormData.created_at;        // Not updated via form
        delete initialFormData.updated_at;        // Not updated via form
        delete initialFormData.image_path;        // Handled by file upload
        delete initialFormData.video_path;        // Handled by file upload
        delete initialFormData.ratings;           // Typically aggregated, not set directly via form

        setFormData(initialFormData);
      })
      .catch((err) => {
        const msg = err.response?.data?.message || err.message || "Failed to fetch restaurant profile.";
        setFetchError(msg);
        console.error("Error fetching restaurant profile:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [restaurantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index][field] = value;
    setFormData((prev) => ({ ...prev, features: updatedFeatures }));
  };

  const handleTableChange = (index, field, value) => {
    const updatedTables = [...formData.tables];
    updatedTables[index][field] = value;
    setFormData((prev) => ({ ...prev, tables: updatedTables }));
  };

  const handleAddFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), { type: "", description: "" }]
    }));
  };

  const handleAddTable = () => {
    setFormData(prev => ({
      ...prev,
      tables: [...(prev.tables || []), { type: "", number_of_persons: "", count: "" }]
    }));
  };

  const handleRemoveFeature = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleRemoveTable = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      tables: prev.tables.filter((_, index) => index !== indexToRemove)
    }));
  };


  const handleSubmit = async () => {
    setSubmitLoading(true);
    setSubmitMessage({ type: "", text: "" });

    const data = new FormData();

    // Iterate over formData and append only the direct primitive fields
    // This loop now assumes `formData` *already* excludes complex objects
    Object.entries(formData).forEach(([key, value]) => {
      // Stringify features and tables explicitly (they are now correctly structured arrays)
      if (key === "features" || key === "tables") {
        data.append(key, JSON.stringify(value));
      } else if (value !== null && typeof value !== 'undefined') {
        // Append all other primitive values
        data.append(key, value);
      }
    });

    // Append file inputs
    if (imageFile) data.append("image", imageFile);
    if (videoFile) data.append("video", videoFile);

    // If you need to tell backend to remove an image/video if input is cleared
    // This logic depends on your backend API's expected flags
    // Example: if (imageFile === null && restaurant.image_path) data.append('image_path_removed', 'true');


    try {
      const res = await axiosClient.post(`restaurantsUpdate/${restaurantId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSubmitMessage({ type: "success", text: "Profile updated successfully!" });
      setRestaurant(res.data.data);
      // Re-initialize formData from the fresh data returned by the backend
      const updatedFormData = { ...res.data.data };
      delete updatedFormData.menus;
      delete updatedFormData.discounts;
      delete updatedFormData.offer;
      delete updatedFormData.user_rates_avg_rate;
      delete updatedFormData.user_rating;
      delete updatedFormData.user;
      delete updatedFormData.created_at;
      delete updatedFormData.updated_at;
      delete updatedFormData.image_path;
      delete updatedFormData.video_path;
      delete updatedFormData.ratings; // Remove ratings
      updatedFormData.features = updatedFormData.features || [];
      updatedFormData.tables = updatedFormData.tables || [];
      setFormData(updatedFormData);

      setImageFile(null); // Clear file inputs after successful submission
      setVideoFile(null);
      setEditMode(false); // Exit edit mode
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update profile.";
      setSubmitMessage({ type: "error", text: msg });
      console.error("Profile update error:", err);
    } finally {
      setSubmitLoading(false);
      setTimeout(() => setSubmitMessage({ type: "", text: "" }), 3000); // Clear message
    }
  };

  if (loading) return <div className="rp-loading-message"><Loader size={28} className="spinner" /> Loading restaurant profile...</div>;
  if (fetchError) return <div className="rp-error-message"><AlertCircle size={28} /> Error: {fetchError}</div>;
  if (!restaurant) return <div className="rp-error-message"><AlertCircle size={28} /> Restaurant profile not found.</div>;

  return (
    <div className="rp-page-container">
      <div className="rp-profile-card">
        <h2 className="rp-profile-title">Restaurant Profile</h2>

        {/* Media Section */}
        <div className="rp-media-section">
          <div className="rp-image-wrapper">
            {editMode ? (
              <>
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : (restaurant.image_path ? `${baseURL}${restaurant.image_path}` : '/default-restaurant.jpg')}
                  alt="Restaurant Preview"
                  className="rp-image-preview"
                />
                <label htmlFor="image-upload" className="rp-file-upload-label">
                  <Image size={20} /> Change Image
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="rp-file-input"
                  />
                </label>
              </>
            ) : (
              <img
                src={restaurant.image_path ? `${baseURL}${restaurant.image_path}` : '/default-restaurant.jpg'}
                alt="Restaurant"
                className="rp-restaurant-image"
              />
            )}
          </div>

          {restaurant.video_path || editMode ? (
            <div className="rp-video-wrapper">
              {editMode ? (
                <>
                  <video controls className="rp-video-preview" key={videoFile ? URL.createObjectURL(videoFile) : (restaurant.video_path || 'no-video-key')}> {/* Key added to force re-render video on file change */}
                    {videoFile ? (
                      <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
                    ) : restaurant.video_path ? (
                      <source src={`${baseURL}${restaurant.video_path}`} type="video/mp4" />
                    ) : null}
                    Your browser does not support the video tag.
                  </video>
                  <label htmlFor="video-upload" className="rp-file-upload-label">
                    <Video size={20} /> Change Video
                    <input
                      type="file"
                      id="video-upload"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files[0])}
                      className="rp-file-input"
                    />
                  </label>
                </>
              ) : (
                restaurant.video_path && (
                  <video controls className="rp-restaurant-video">
                    <source src={`${baseURL}${restaurant.video_path}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )
              )}
            </div>
          ) : null}
        </div>

        {/* Main Info Fields */}
        <div className="rp-info-section">
          {[
            { key: "name", label: "Restaurant Name" },
            { key: "location", label: "Location", icon: <MapPin size={20} /> },
            { key: "type", label: "Restaurant Type", icon: <Tag size={20} /> },
            { key: "cuisine_type", label: "Cuisine Type", icon: <Utensils size={20} /> },
            { key: "startTime", label: "Opening Time", icon: <Clock size={20} /> },
            { key: "endTime", label: "Closing Time", icon: <Clock size={20} /> },
            { key: "event_calender", label: "Event Calendar", icon: <Calendar size={20} /> },
          ].map((field) => (
            <div key={field.key} className="rp-form-group">
              <label className="rp-form-label">
                {field.icon && <span className="rp-label-icon">{field.icon}</span>}
                {field.label}
              </label>
              {editMode ? (
                <input
                  type="text"
                  name={field.key}
                  value={formData[field.key] || ""}
                  onChange={handleChange}
                  className="rp-form-input"
                />
              ) : (
                <div className="rp-display-value">{restaurant[field.key]}</div>
              )}
            </div>
          ))}

          {/* Ratings Display (Read-only) */}
          <div className="rp-form-group">
            <label className="rp-form-label">
              <Star size={20} /> Overall Rating
            </label>
            <div className="rp-display-value rp-rating-display">
              <div className="rp-star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    fill="currentColor"
                    className={
                      star <= Math.floor(Number(restaurant.user_rates_avg_rate) || 0)
                        ? "rp-star-filled"
                        : "rp-star-empty"
                    }
                  />
                ))}
              </div>
              <span className="rp-rating-value">
                {restaurant.user_rates_avg_rate ? Number(restaurant.user_rates_avg_rate).toFixed(1) : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="rp-section-separator">
          <h3 className="rp-section-title"><ClipboardList size={22} /> Features</h3>
          {formData.features && formData.features.length > 0 ? (
            <div className="rp-features-grid">
              {formData.features.map((feature, idx) => (
                <div key={idx} className="rp-feature-item">
                  {editMode ? (
                    <div className="rp-feature-edit-group">
                      <input
                        type="text"
                        placeholder="Feature Type (e.g., WiFi)"
                        value={feature.type || ""}
                        onChange={(e) => handleFeatureChange(idx, "type", e.target.value)}
                        className="rp-form-input rp-feature-input"
                      />
                      <textarea
                        placeholder="Description"
                        value={feature.description || ""}
                        onChange={(e) => handleFeatureChange(idx, "description", e.target.value)}
                        className="rp-form-textarea rp-feature-textarea"
                        rows="2"
                      />
                      <button type="button" onClick={() => handleRemoveFeature(idx)} className="rp-remove-button">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <strong className="rp-feature-type">{feature.type}</strong>
                      <span className="rp-feature-description">: {feature.description}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="rp-no-data-message">No features listed.</p>
          )}
          {editMode && (
            <button type="button" onClick={handleAddFeature} className="rp-add-button">
              <Plus size={18} /> Add Feature
            </button>
          )}
        </div>

        {/* Tables Section */}
        <div className="rp-section-separator">
          <h3 className="rp-section-title"><Table size={22} /> Tables</h3>
          {formData.tables && formData.tables.length > 0 ? (
            <div className="rp-tables-grid">
              {formData.tables.map((table, idx) => (
                <div key={idx} className="rp-table-item">
                  {editMode ? (
                    <div className="rp-table-edit-group">
                      <input
                        type="text"
                        placeholder="Table Type (e.g., Dining)"
                        value={table.type || ""}
                        onChange={(e) => handleTableChange(idx, "type", e.target.value)}
                        className="rp-form-input rp-table-input"
                      />
                      <input
                        type="number"
                        placeholder="Seats"
                        value={table.number_of_persons || ""}
                        onChange={(e) => handleTableChange(idx, "number_of_persons", e.target.value)}
                        className="rp-form-input rp-table-input"
                        min="1"
                      />
                      <input
                        type="number"
                        placeholder="Count"
                        value={table.count || ""}
                        onChange={(e) => handleTableChange(idx, "count", e.target.value)}
                        className="rp-form-input rp-table-input"
                        min="0"
                      />
                      <button type="button" onClick={() => handleRemoveTable(idx)} className="rp-remove-button">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <strong className="rp-table-type">{table.type}</strong>
                      <span className="rp-table-details-display">: Seats {table.number_of_persons}, Count: {table.count}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="rp-no-data-message">No tables configured.</p>
          )}
          {editMode && (
            <button type="button" onClick={handleAddTable} className="rp-add-button">
              <Plus size={18} /> Add Table
            </button>
          )}
        </div>

        {/* Form Actions (Save/Edit/Cancel) */}
        <div className="rp-actions-section">
          {submitMessage.text && (
            <p className={`rp-submission-message rp-message-${submitMessage.type}`}>
              {submitMessage.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />} {submitMessage.text}
            </p>
          )}
          {editMode ? (
            <>
              <button
                onClick={handleSubmit}
                className="rp-action-button rp-save-button"
                disabled={submitLoading}
              >
                {submitLoading ? <><Loader className="spinner" size={20} /> Saving...</> : <><Save size={18} /> Save Changes</>}
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setFormData(restaurant); // Reset form data to original restaurant data
                  setImageFile(null); // Clear file inputs
                  setVideoFile(null);
                  setSubmitMessage({ type: "", text: "" }); // Clear messages
                }}
                className="rp-action-button rp-cancel-button"
                disabled={submitLoading}
              >
                <X size={18} /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="rp-action-button rp-edit-button"
            >
              <Edit size={18} /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantProfile;