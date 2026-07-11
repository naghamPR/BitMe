import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Loader, AlertCircle, Trash2, Edit } from 'lucide-react'; // Ensure icons are imported
import { getAllDiscountsByRestaurant, deleteDiscount } from "../../actions/discountsActions"; // Import deleteDiscount
import UpdateDiscountModal from "../UpdateDiscountModal/UpdateDiscountModal"; // Import the modal
import './ViewDiscountsModal.css'; // Component-specific CSS

const ViewDiscountsModal = ({ restaurantId, onClose }) => {
  const dispatch = useDispatch();
  const { discounts, loading, error } = useSelector(state => state.discounts || { discounts: [], loading: false, error: null });

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [submissionLoading, setSubmissionLoading] = useState(false); // For delete loading

  useEffect(() => {
    if (restaurantId) {
      dispatch(getAllDiscountsByRestaurant(restaurantId));
    }
  }, [dispatch, restaurantId]);

  const handleUpdateClick = (discount) => {
    setSelectedDiscount(discount);
    setShowUpdateModal(true);
    document.body.style.overflow = 'hidden'; 
  };

  const closeUpdateModal = () => {
    setSelectedDiscount(null);
    setShowUpdateModal(false);
    document.body.style.overflow = 'unset'; 
    dispatch(getAllDiscountsByRestaurant(restaurantId)); 
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this discount?")) {
      return;
    }
    setSubmissionLoading(true); 
    try {
      await dispatch(deleteDiscount(id)); 
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error deleting discount.";
      alert(msg); 
    } finally {
      setSubmissionLoading(false);
      dispatch(getAllDiscountsByRestaurant(restaurantId));
    }
  };


  return (
    <div className="vd-modal-overlay open" onClick={onClose}>
      <div className="vd-modal-content" onClick={e => e.stopPropagation()}>
        <button className="vd-modal-close-button" onClick={onClose}>
          <X size={24} />
        </button>
        <h2 className="vd-modal-title">Available Discounts</h2>

        {loading ? (
          <p className="vd-loading-message"><Loader className="spinner" size={20} /> Loading discounts...</p>
        ) : error ? (
          <p className="vd-error-message"><AlertCircle size={20} /> Error: {error}</p>
        ) : (Array.isArray(discounts) && discounts.length > 0) ? (
          <ul className="vd-discount-list">
            {discounts.map((discount) => (
              <li key={discount.id} className="vd-discount-item-card">
                <div>
                  <p className="vd-discount-code">Code: <strong>{discount.discount_code}</strong></p>
                  <p className="vd-discount-amount">Amount: {parseFloat(discount.discount_amount).toFixed(2)}%</p>
                  <p className="vd-discount-expiry">Expires: {new Date(discount.expiry_date).toLocaleDateString()}</p>
                  {discount.description && <p className="vd-discount-description">{discount.description}</p>}
                </div>
                <div className="vd-item-actions">
                    <button
                        onClick={() => handleUpdateClick(discount)}
                        className="vd-action-btn vd-edit-btn"
                        disabled={submissionLoading}
                    >
                        <Edit size={16} /> Edit
                    </button>
                    <button
                        onClick={() => handleDelete(discount.id)}
                        className="vd-action-btn vd-delete-btn"
                        disabled={submissionLoading}
                    >
                        <Trash2 size={16} /> Delete
                    </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="vd-no-data">No discounts found for this restaurant.</p>
        )}
        <div className="vd-modal-actions">
            <button className="vd-action-button" onClick={onClose}>Close</button>
        </div>
      </div>

      {showUpdateModal && selectedDiscount && (
        <UpdateDiscountModal
          discount={selectedDiscount}
          onClose={closeUpdateModal} // Pass the close function
          restaurantId={restaurantId} // Pass restaurantId if needed for form submission
        />
      )}
    </div>
  );
};

export default ViewDiscountsModal;