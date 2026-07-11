import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './AddOffer.css';
import { createOffer } from '../../actions/offersActions';

const AddOffer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.offers);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    offer_type: 'percentage',
    discount_percentage: '',
    fixed_price: '',
    valid_from: '',
    valid_until: '',
    menu_items: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMenuItemChange = (index, field, value) => {
    const updatedItems = [...formData.menu_items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData(prev => ({ ...prev, menu_items: updatedItems }));
  };

  const addMenuItem = () => {
    setFormData(prev => ({
      ...prev,
      menu_items: [...prev.menu_items, { id: '', quantity: 1 }]
    }));
  };

  const removeMenuItem = (index) => {
    const updatedItems = formData.menu_items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, menu_items: updatedItems }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createOffer(formData));
      navigate('/offers');
    } catch (err) {
      console.error('Error creating offer:', err);
    }
  };

  return (
    <div className="add-offer-container">
      <h2>Create New Offer</h2>
      {error && <div className="error-message">{error.message}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <label>Offer Type</label>
          <select
            name="offer_type"
            value={formData.offer_type}
            onChange={handleChange}
            required
          >
            <option value="percentage">Percentage Discount</option>
            <option value="fixed_price">Fixed Price Menu</option>
          </select>
        </div>
        
        {formData.offer_type === 'percentage' ? (
          <div className="form-group">
            <label>Discount Percentage</label>
            <input
              type="number"
              name="discount_percentage"
              value={formData.discount_percentage}
              onChange={handleChange}
              min="1"
              max="100"
              required={formData.offer_type === 'percentage'}
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Fixed Price</label>
            <input
              type="number"
              name="fixed_price"
              value={formData.fixed_price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required={formData.offer_type === 'fixed_price'}
            />
          </div>
        )}
        
        <div className="form-row">
          <div className="form-group">
            <label>Valid From</label>
            <input
              type="datetime-local"
              name="valid_from"
              value={formData.valid_from}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Valid Until</label>
            <input
              type="datetime-local"
              name="valid_until"
              value={formData.valid_until}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        {formData.offer_type === 'fixed_price' && (
          <div className="menu-items-section">
            <h3>Menu Items</h3>
            <button type="button" onClick={addMenuItem} className="add-item-btn">
              Add Menu Item
            </button>
            
            {formData.menu_items.map((item, index) => (
              <div key={index} className="menu-item-row">
                <div className="form-group">
                  <label>Menu Item ID</label>
                  <input
                    type="text"
                    value={item.id}
                    onChange={(e) => handleMenuItemChange(index, 'id', e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleMenuItemChange(index, 'quantity', parseInt(e.target.value))}
                    min="1"
                    required
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => removeMenuItem(index)}
                  className="remove-item-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/offers')}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? 'Creating...' : 'Create Offer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOffer;