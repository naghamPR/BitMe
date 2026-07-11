import React from "react";
import DiscountManager from "../DiscountManager/DiscountManager"; // Adjust path as needed
import "./DiscountModal.css"; // Optional: for modal styling

const DiscountModal = ({ restaurantId, onClose }) => {
  return (
    <div className="rt-modal-overlay open">
      <div className="rt-modal-box">
        <button onClick={onClose} className="close-btn">
          ✖
        </button>
        <DiscountManager
          restaurantId={restaurantId}
          onClose={onClose}
          isModal={true}
        />
      </div>
    </div>
  );
};

export default DiscountModal;
