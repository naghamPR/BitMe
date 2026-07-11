import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { X, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { updateDiscount } from "../../actions/discountsActions"; // Action for updating discount
import './UpdateDiscountModal.css'; // Component-specific CSS

const UpdateDiscountModal = ({ discount, onClose, restaurantId }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    discount_code: discount.discount_code || "",
    discount_amount: discount.discount_amount || "",
    expiry_date: discount.expiry_date ? new Date(discount.expiry_date).toISOString().split('T')[0] : "", // Format date for input type="date"
    restaurants_id: restaurantId, // Ensure restaurantId is part of data for API
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' }); 
    try {
      const result = await dispatch(updateDiscount(discount.id, formData));
      setMessage({ type: 'success', text: result.message || 'Discount updated successfully!' });
      // Auto-close after a short delay on success
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Failed to update discount.";
      setMessage({ type: 'error', text: msg });
      console.error("Error updating discount:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="udm-modal-overlay open" onClick={onClose}>
      <div className="udm-modal-content" onClick={e => e.stopPropagation()}>
        <button className="udm-modal-close-button" onClick={onClose}><X size={24} /></button>
        <h3 className="udm-modal-title">Update Discount: {discount.discount_code}</h3>
        <form onSubmit={handleSubmit} className="udm-modal-form">
          <div className="udm-form-group">
            <label htmlFor="updateDiscountCode" className="udm-form-label">Discount Code</label>
            <input
              type="text"
              id="updateDiscountCode"
              name="discount_code"
              value={formData.discount_code}
              onChange={handleChange}
              required
              className="udm-form-input"
            />
          </div>
          <div className="udm-form-group">
            <label htmlFor="updateDiscountAmount" className="udm-form-label">Amount (%)</label>
            <input
              type="number"
              id="updateDiscountAmount"
              name="discount_amount"
              value={formData.discount_amount}
              onChange={handleChange}
              required
              min="0"
              max="100"
              step="0.01" // Allow decimal amounts for percentages
              className="udm-form-input"
            />
          </div>
          <div className="udm-form-group">
            <label htmlFor="updateExpiryDate" className="udm-form-label">Expiry Date</label>
            <input
              type="date"
              id="updateExpiryDate"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              required
              className="udm-form-input"
            />
          </div>
          <input type="hidden" name="restaurants_id" value={formData.restaurants_id} />

          {message.text && (
              <p className={`udm-submission-message ${message.type}`}>
                  {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />} {message.text}
              </p>
          )}

          <div className="udm-modal-actions">
            <button type="button" onClick={onClose} disabled={loading} className="udm-form-cancel-button">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="udm-form-submit-button">
              {loading ? <><Loader className="spinner" size={20} /> Updating...</> : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDiscountModal;