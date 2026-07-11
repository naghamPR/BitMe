import React, { useState } from "react"; // Keep useState for viewingDiscountsFor, if still needed
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // To access restaurant ID
import ViewDiscountsModal from "../../components/ViewDiscountsModal/ViewDiscountsModal"; // For staff to view their restaurant's discounts

import order from "../../assets/order.jpg";
import offersstaf from "../../assets/offersstaf.jpg";
import menus from "../../assets/menus.jpg";

import "./Stafhom.css";
import DiscountModal from "../../components/DiscountModal/DiscountModal";
import Reservation from './../Reservation/Reservation';

const Stafhom = () => {
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const navigate = useNavigate();
  const role = useSelector((state) => state.authReducer.authData.data);
  const staffRestaurantId = useSelector(
    (state) => state.authReducer?.authData?.data?.restaurants?.[0]?.id || null
  );
  console.log(role.restaurants[0].id);
  const handleAddDiscountClick = () => {
    setShowDiscountModal(true);
  };

  const [viewingDiscountsFor, setViewingDiscountsFor] = useState(null);

  const openViewDiscountsModal = (restaurantId) => {
    setViewingDiscountsFor(restaurantId);
    document.body.style.overflow = "hidden";
  };

  const closeViewDiscountsModal = () => {
    setViewingDiscountsFor(null);
    document.body.style.overflow = "unset";
  };

  return (
    <div className="stafhom-page">
      <h1 className="stafhom-title">Welcome back staff! 😃</h1>
      <div className="stafhom-cards-wrapper">
        <div className="stafhom-card">
          <div className="stafhom-card-content">
            <h2>Manage Orders</h2>
            <img src={order} alt="Manage Orders" className="stafhom-card-img" />
            <div className="stafhom-actions">
              <button
                className="stafhom-action-button stafhom-view-btn"
                onClick={() => navigate("/restaurant-orders")}
              >
                📋 View All
              </button>

             
            </div>
          </div>
        </div>

        <div className="stafhom-card">
          <div className="stafhom-card-content">
            <h2>Manage Offer</h2>
            <img src={menus} alt="Manage Menus" className="stafhom-card-img" />
            <div className="stafhom-actions">
              <button
                className="stafhom-action-button stafhom-view-btn"
                onClick={() => {
                  if (staffRestaurantId) {
                    navigate("/offers");
                  } else {
                    alert(
                      "Restaurant ID not found for staff. Cannot manage menus."
                    );
                  }
                }}
              >
                📋 View All
              </button>

               
            </div>
          </div>
        </div>
        <div className="stafhom-card">
          <div className="stafhom-card-content">
            <h2>Manage Menus</h2>
            <img src={menus} alt="Manage Menus" className="stafhom-card-img" />
            <div className="stafhom-actions">
              <button
                className="stafhom-action-button stafhom-view-btn"
                onClick={() => {
                  if (staffRestaurantId) {
                    navigate("/manager-menus");
                  } else {
                    alert(
                      "Restaurant ID not found for staff. Cannot manage menus."
                    );
                  }
                }}
              >
                📋 View All
              </button>
            </div>
          </div>
        </div>


                  {/* ssssssssssssssssssssssssss */}
        <div className="stafhom-card">
          <div className="stafhom-card-content">
            <h2>Manage Tables</h2>
            <img src={menus} alt="Manage Menus" className="stafhom-card-img" />
            <div className="stafhom-actions">
              
              <button
                className="stafhom-action-button stafhom-view-btn"
                onClick={() => navigate("/RestaurantTables")}
              >
                📋Restaurant Tables
              </button>
            </div>
          </div>
        </div>


        <div className="stafhom-card">
          <div className="stafhom-card-content">
            <h2>Manage Reservation</h2>
            <img src={menus} alt="Manage Menus" className="stafhom-card-img" />
            <div className="stafhom-actions">
              <button
                className="stafhom-action-button stafhom-view-btn"
                onClick={() => {
                  if (staffRestaurantId) {
                    navigate("/RestaurantReservations");
                  } else {
                    alert(
                      "Restaurant ID not found for staff. Cannot manage menus."
                    );
                  }
                }}
              >
                📅 Reservation
              </button>
            </div >
          </div>
        </div>
        <div className="stafhom-card">
          <div className="stafhom-card-content">
            <h2>Manage Discount</h2>
            <img src={menus} alt="Manage Menus" className="stafhom-card-img" />
            <div className="stafhom-actions">
              {staffRestaurantId && (
                <button
                  className="stafhom-action-button stafhom-view-discounts-btn"
                  onClick={() => openViewDiscountsModal(staffRestaurantId)}
                >
                  🏷️ View Discounts
                </button>
              )}

              <button
                onClick={handleAddDiscountClick}
                className="action-btn global-discount-btn"
              >
                Add Discount
              </button>
            </div >
          </div>
        </div>



      </div>

      {viewingDiscountsFor && (
        <ViewDiscountsModal
          restaurantId={viewingDiscountsFor}
          onClose={closeViewDiscountsModal}
        />
      )}

      {showDiscountModal && (
        <DiscountModal
          restaurantId={role.restaurants[0].id}
          onClose={() => setShowDiscountModal(false)}
        />
      )}
    </div>
  );
};

export default Stafhom;
