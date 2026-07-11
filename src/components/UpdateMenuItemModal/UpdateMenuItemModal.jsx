import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateMenuItem } from "../../actions/menusActions";

const UpdateMenuItemModal = ({ item, onClose }) => {
  const [formData, setFormData] = useState({
    name: item.name,
    price: item.price,
    description: item.description,
    type: item.type,
  });

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateMenuItem(item.id, formData));
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Update Menu Item</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Item Name"
          />
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            placeholder="Price"
          />
          <input
            type="text"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            placeholder="Type (food, drink, dessert)"
          />
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Description"
          />
          <div className="modal-actions">
            <button type="submit" className="action-btn update-btn">
              Save
            </button>
            <button onClick={onClose} className="action-btn delete-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMenuItemModal;
