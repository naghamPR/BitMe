import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOffer } from "../../actions/offersActions";
import { Loader, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';

import "./AddOffer.css";
import axiosClient from "../../../axios-client";

const AddOffer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const managerRestaurantId = useSelector(state =>
    state.authReducer?.authData?.data?.restaurants?.[0]?.id || null
  );

  const [availableMenus, setAvailableMenus] = useState([]);
  const [fetchingMenus, setFetchingMenus] = useState(true);
  const [menusError, setMenusError] = useState(null);

  const [formData, setFormData] = useState({
    restaurants_id: managerRestaurantId,
    title: '',
    description: '',
    offer_type: 'percentage',
    discount_percentage: '',
    fixed_price: '',
    valid_from: '',
    valid_until: '',
    // FIX: Use 'id' directly for the menu item ID in formData
    menu_items: [] // Array of { menu_id, id, quantity }
  });

  const [submissionMessage, setSubmissionMessage] = useState({ type: '', text: '' });


  // Fetch menus for the manager's restaurant
  useEffect(() => {
    if (managerRestaurantId) {
      const fetchMenusForOffer = async () => {
        setFetchingMenus(true);
        setMenusError(null);
        try {
          const response = await axiosClient.get(`menus/restaurant/${managerRestaurantId}/`);
          if (response.data.success && Array.isArray(response.data.data)) {
            setAvailableMenus(response.data.data);
          } else {
            setMenusError(response.data.message || "Failed to load menus.");
          }
        } catch (err) {
          setMenusError(err.message || "Network error fetching menus.");
          console.error("Error fetching menus for offer:", err);
        } finally {
          setFetchingMenus(false);
        }
      };
      fetchMenusForOffer();
    } else {
      setMenusError("Restaurant ID not available. Cannot fetch menus.");
    }
  }, [managerRestaurantId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMenuItemChange = (index, field, value) => {
    const updatedItems = [...formData.menu_items];
    if (field === 'menu_id') {
      // When menu changes, reset menu_item_id (now 'id')
      updatedItems[index] = { ...updatedItems[index], menu_id: value, id: '' };
    } else if (field === 'menu_item_id') { // This field name is from the <select> element
      // FIX: Map the value from menu_item_id select to the 'id' property in formData
      updatedItems[index] = { ...updatedItems[index], id: value };
    } else {
      updatedItems[index] = { ...updatedItems[index], [field]: value };
    }
    setFormData(prev => ({ ...prev, menu_items: updatedItems }));
  };

  const addMenuItemRow = () => {
    setFormData(prev => ({
      ...prev,
      // FIX: Initialize new item with 'id' key for the menu item ID
      menu_items: [...prev.menu_items, { menu_id: '', id: '', quantity: 1 }]
    }));
  };

  const removeMenuItemRow = (index) => {
    const updatedItems = formData.menu_items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, menu_items: updatedItems }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionMessage({ type: '', text: '' }); // Clear previous messages

    if (!managerRestaurantId) {
        setSubmissionMessage({ type: 'error', text: 'Restaurant not associated with your account.' });
        return;
    }
    // Basic validation for fixed_price offers requiring menu items
    if (formData.offer_type === 'fixed_price' && formData.menu_items.length === 0) {
        setSubmissionMessage({ type: 'error', text: 'Fixed price offers must include at least one menu item.' });
        return;
    }

    try {
      const payload = {
        ...formData,
        restaurants_id: managerRestaurantId,
        // FIX: Ensure menu_items are mapped to have 'id' and 'quantity' keys for backend
        menu_items: formData.menu_items.map(item => ({
          id: item.id, // Ensure this maps correctly to backend's 'menu_items.*.id'
          quantity: item.quantity
        }))
      };
      const result = await dispatch(createOffer(payload));

      if (result.success) {
        setSubmissionMessage({ type: 'success', text: result.message || 'Offer created successfully!' });
        // Reset form after success
        setFormData({
          restaurants_id: managerRestaurantId,
          title: '', description: '', offer_type: 'percentage',
          discount_percentage: '', fixed_price: '',
          valid_from: '', valid_until: '', menu_items: []
        });
        navigate('/offers'); // Navigate after successful creation
      } else {
        setSubmissionMessage({ type: 'error', text: result.message || 'Failed to create offer.' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error creating offer.';
      const errors = err.response?.data?.errors; // Laravel validation errors
      let fullMessage = msg;
      if (errors) {
        Object.keys(errors).forEach(key => {
          fullMessage += `\n${key}: ${Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key]}`;
        });
      }
      setSubmissionMessage({ type: 'error', text: fullMessage });
      console.error('Error creating offer:', err);
    }
  };

  if (fetchingMenus) return <div className="ao-loading-message"><Loader className="spinner" size={24} /> Loading menus for offer creation...</div>;
  if (menusError) return <div className="ao-error-message"><AlertCircle className="icon" size={24} /> Error: {menusError}</div>;
  if (!managerRestaurantId) return <div className="ao-error-message"><AlertCircle className="icon" size={24} /> Restaurant ID not found for manager.</div>;


  return (
    <div className="ao-page-container">
      <h2 className="ao-page-title">Create New Offer</h2>
      
      <form onSubmit={handleSubmit} className="ao-form">
        <div className="ao-form-section">
          <h3 className="ao-section-title">Offer Details</h3>
          <div className="ao-form-group">
            <label htmlFor="title" className="ao-form-label">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="ao-form-input"
              required
            />
          </div>
          
          <div className="ao-form-group">
            <label htmlFor="description" className="ao-form-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="ao-form-textarea"
            />
          </div>
          
          <div className="ao-form-group">
            <label htmlFor="offer_type" className="ao-form-label">Offer Type</label>
            <select
              id="offer_type"
              name="offer_type"
              value={formData.offer_type}
              onChange={handleChange}
              className="ao-form-input"
              required
            >
              <option value="percentage">Percentage Discount</option>
              <option value="fixed_price">Fixed Price Menu</option>
            </select>
          </div>
          
          {formData.offer_type === 'percentage' ? (
            <div className="ao-form-group">
              <label htmlFor="discount_percentage" className="ao-form-label">Discount Percentage (%)</label>
              <input
                type="number"
                id="discount_percentage"
                name="discount_percentage"
                value={formData.discount_percentage}
                onChange={handleChange}
                min="1"
                max="100"
                step="0.01"
                className="ao-form-input"
                required
              />
            </div>
          ) : (
            <div className="ao-form-group">
              <label htmlFor="fixed_price" className="ao-form-label">Fixed Price ($)</label>
              <input
                type="number"
                id="fixed_price"
                name="fixed_price"
                value={formData.fixed_price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="ao-form-input"
                required
              />
            </div>
          )}
          
          <div className="ao-form-group ao-form-row">
            <div className="ao-form-sub-group">
              <label htmlFor="valid_from" className="ao-form-label">Valid From</label>
              <input
                type="datetime-local"
                id="valid_from"
                name="valid_from"
                value={formData.valid_from}
                onChange={handleChange}
                className="ao-form-input"
                required
              />
            </div>
            
            <div className="ao-form-sub-group">
              <label htmlFor="valid_until" className="ao-form-label">Valid Until</label>
              <input
                type="datetime-local"
                id="valid_until"
                name="valid_until"
                value={formData.valid_until}
                onChange={handleChange}
                className="ao-form-input"
                required
              />
            </div>
          </div>
        </div>
        
        {formData.offer_type === 'fixed_price' && (
          <div className="ao-form-section ao-menu-items-section">
            <h3 className="ao-section-title">Included Menu Items</h3>
            <button type="button" onClick={addMenuItemRow} className="ao-add-item-row-button">
              <Plus size={18} /> Add Menu Item
            </button>
            
            {formData.menu_items.map((item, index) => {
                const selectedMenu = availableMenus.find(menu => menu.id === parseInt(item.menu_id));
                const currentMenuItems = Array.isArray(selectedMenu?.items) ? selectedMenu.items : [];

                return (
                    <div key={index} className="ao-menu-item-row">
                        <div className="ao-form-group">
                            <label htmlFor={`menu_id-${index}`} className="ao-form-label">Menu</label>
                            <select
                                id={`menu_id-${index}`}
                                name="menu_id"
                                value={item.menu_id}
                                onChange={(e) => handleMenuItemChange(index, 'menu_id', e.target.value)}
                                className="ao-form-input"
                                required
                            >
                                <option value="">Select Menu</option>
                                {availableMenus.map(menu => (
                                    <option key={menu.id} value={menu.id}>{menu.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="ao-form-group">
                            <label htmlFor={`menu_item_id-${index}`} className="ao-form-label">Menu Item</label>
                            <select
                                id={`menu_item_id-${index}`}
                                // FIX: Change name to 'id' to match backend validation rule
                                name="menu_item_id" // Still use 'menu_item_id' here for select element name
                                value={item.id} // FIX: Bind value to item.id
                                onChange={(e) => handleMenuItemChange(index, 'menu_item_id', e.target.value)} // Pass 'menu_item_id' field name
                                className="ao-form-input"
                                required
                                disabled={!item.menu_id} // Disable until a menu is selected
                            >
                                <option value="">Select Item</option>
                                {currentMenuItems.map(menuItem => (
                                    <option key={menuItem.id} value={menuItem.id}>{menuItem.name} (${parseFloat(menuItem.price).toFixed(2)})</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="ao-form-group">
                            <label htmlFor={`quantity-${index}`} className="ao-form-label">Quantity</label>
                            <input
                                type="number"
                                id={`quantity-${index}`}
                                name="quantity"
                                value={item.quantity}
                                onChange={(e) => handleMenuItemChange(index, 'quantity', parseInt(e.target.value))}
                                min="1"
                                className="ao-form-input"
                                required
                            />
                        </div>
                        
                        <button
                            type="button"
                            onClick={() => removeMenuItemRow(index)}
                            className="ao-remove-item-button"
                        >
                            <X size={16} /> Remove
                        </button>
                    </div>
                );
            })}
          </div>
        )}
        
        {submissionMessage.text && (
            <p className={`ao-submission-message ${submissionMessage.type}`}>
                {submissionMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />} {submissionMessage.text}
            </p>
        )}

        <div className="ao-form-actions">
          <button
            type="button"
            onClick={() => navigate('/offers')} // Navigate back to offers list
            className="ao-cancel-button"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="ao-submit-button"
          >
            { 'Create Offer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOffer;