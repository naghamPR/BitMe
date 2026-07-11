import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { X, Loader, CheckCircle, AlertCircle } from "lucide-react";
import { updateMenu } from "../../actions/menusActions";
import "./UpdateMenuModal.css"; // Component-specific CSS

const UpdateMenuModal = ({ menu, onClose, restaurantId }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: menu.name,
    description: menu.description || "",
    restaurants_id: restaurantId,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      await dispatch(updateMenu(menu.id, formData));
      setMessage({ type: "success", text: "Menu updated successfully!" });
      setTimeout(onClose, 1500);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to update menu.";
      setMessage({ type: "error", text: msg });
      console.error("Error updating menu:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-menu-modal-content">
      <div
        className="update-menu-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="update-menu-modal-close-button" onClick={onClose}>
          <X size={24} />
        </button>
        <h3 className="update-menu-modal-title">Update Menu: {menu.name}</h3>
        <form onSubmit={handleSubmit} className="update-menu-modal-form">
          <div className="update-menu-form-group">
            <label htmlFor="updateMenuName" className="update-menu-form-label">
              Menu Name
            </label>
            <input
              type="text"
              id="updateMenuName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="update-menu-form-input"
            />
          </div>
          <div className="update-menu-form-group">
            <label
              htmlFor="updateMenuDescription"
              className="update-menu-form-label"
            >
              Description
            </label>
            <textarea
              id="updateMenuDescription"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="update-menu-form-textarea"
            />
          </div>
          {message.text && (
            <p className={`submission-message ${message.type}`}>
              {message.type === "success" ? (
                <CheckCircle size={18} />
              ) : (
                <AlertCircle size={18} />
              )}{" "}
              {message.text}
            </p>
          )}
          <div className="update-menu-modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="update-menu-form-cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="update-menu-form-submit-button"
            >
              {loading ? (
                <>
                  <Loader className="spinner" size={20} /> Updating...
                </>
              ) : (
                "Update Menu"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMenuModal;
