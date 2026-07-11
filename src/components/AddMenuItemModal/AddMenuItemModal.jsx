import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { addMenuItem } from '../../actions/menusActions';
import './AddMenuItemModal.css';

const AddMenuItemModal = ({ menu, onClose, restaurantId }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    menu_id: menu.id,
    name: '',
    type: 'food',
    price: '',
    description: '',
    restaurantId: restaurantId
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await dispatch(addMenuItem(formData));
      setMessage({ type: 'success', text: 'Menu item added successfully!' });
      setTimeout(onClose, 1500);
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to add menu item.';
      setMessage({ type: 'error', text: msg });
      console.error('Error adding menu item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-menu-item-modal-overlay open" onClick={onClose}>
      <div className="add-menu-item-modal-content" onClick={e => e.stopPropagation()}>
        <button className="add-menu-item-modal-close-button" onClick={onClose}><X size={24} /></button>
        <h3 className="add-menu-item-modal-title">Add Item to {menu.name}</h3>
        <form onSubmit={handleSubmit} className="add-menu-item-modal-form">
          <div className="add-menu-item-form-group">
            <label htmlFor="addItemName" className="add-menu-item-form-label">Item Name</label>
            <input
              type="text"
              id="addItemName"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="add-menu-item-form-input"
              placeholder="e.g., Pizza Margherita"
            />
          </div>
          <div className="add-menu-item-form-group">
            <label htmlFor="addItemType" className="add-menu-item-form-label">Type</label>
            <select
              id="addItemType"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="add-menu-item-form-input"
            >
              <option value="food">Food</option>
              <option value="drink">Drink</option>
              <option value="dessert">Dessert</option>
              <option value="hookah">Hookah</option>
            </select>
          </div>
          <div className="add-menu-item-form-group">
            <label htmlFor="addItemPrice" className="add-menu-item-form-label">Price</label>
            <input
              type="number"
              id="addItemPrice"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="add-menu-item-form-input"
              placeholder="e.g., 15.99"
            />
          </div>
          <div className="add-menu-item-form-group">
            <label htmlFor="addItemDescription" className="add-menu-item-form-label">Description</label>
            <textarea
              id="addItemDescription"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="add-menu-item-form-textarea"
              placeholder="e.g., Classic Italian pizza with fresh basil."
            />
          </div>
          {message.text && (
              <p className={`submission-message ${message.type}`}>
                  {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />} {message.text}
              </p>
          )}
          <div className="add-menu-item-modal-actions">
            <button type="button" onClick={onClose} disabled={loading} className="add-menu-item-form-cancel-button">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="add-menu-item-form-submit-button">
              {loading ? <><Loader className="spinner" size={20} /> Adding...</> : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItemModal;