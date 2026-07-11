import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addMenus } from "../../actions/menusActions";
import { Loader, Plus } from "lucide-react";
import "./AddResMenu.css";

const AddResMenu = ({ restaurantId }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    restaurants_id: restaurantId,
    name: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(addMenus(formData));
      setFormData({
        restaurants_id: restaurantId,
        name: "",
        description: "",
      });
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding menu", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-menu-container">
      {!isFormOpen ? (
        <button onClick={() => setIsFormOpen(true)} className="add-menu-button">
          <Plus size={18} /> Add New Menu
        </button>
      ) : (
        <div className="menu-form-container">
          <h3 className="form-title">Create New Menu</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="menuName" className="form-label">
                Menu Name
              </label>
              <input
                type="text"
                id="menuName"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="form-input"
                placeholder="e.g., Main Course, Desserts"
              />
            </div>
            <div className="form-group">
              <label htmlFor="menuDescription" className="form-label">
                Description
              </label>
              <textarea
                id="menuDescription"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="e.g., A selection of our finest dishes."
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="cancel-button"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner">
                    <Loader className="spinner" size={20} /> Creating...
                  </span>
                ) : (
                  "Create Menu"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddResMenu;
