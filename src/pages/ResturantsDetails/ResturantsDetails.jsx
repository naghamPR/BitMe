import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  X,
  Minus,
  Plus,
  ShoppingCart,
  Loader,
  Calendar,
  Utensils,
  Home,
  Info,
  Tag,
  DollarSign,
  Clock,
} from "lucide-react";
import { useSelector } from "react-redux";
import "./ResturantsDetails.css";
import axiosClient from "../../../axios-client";
import ReservationModal from "../../components/ReservationModal/ReservationModal"; // Correct path
import BookEventForm from "../../components/BookEventForm/BookEventForm";

const ResturantsDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const USER_ID = useSelector(
    (state) => state.authReducer?.authData?.data?.id || null
  );

  const [isTablesModalOpen, setIsTablesModalOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const [isMenusModalOpen, setIsMenusModalOpen] = useState(false);
  const [isDiscountsModalOpen, setIsDiscountsModalOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [isOrderConfirmationModalOpen, setIsOrderConfirmationModalOpen] =
    useState(false);
  const [isOrderErrorModalOpen, setIsOrderErrorModalOpen] = useState(false);
  const [isBookEventModalOpen, setIsBookEventModalOpen] = useState(false);

  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [notification, setNotification] = useState("");

  const handleReserveTable = (table) => {
    setSelectedTable(table);
    setIsReservationModalOpen(true); // <-- This sets the state to true
  };

  const handleBookEventClick = () => {
    if (!USER_ID) {
      alert("Please log in to book an event.");
      return;
    }
    openModal(setIsBookEventModalOpen);
  };

  const closeBookEventModal = () => {
    closeModal(setIsBookEventModalOpen);
  };

  const handleSubmitReservation = async (reservationData) => {
    try {
      const response = await axiosClient.post(
        "/reserve-table",
        reservationData
      );

      if (
        response.data.message ===
        "The table is unavailable at the selected time. You have been added to the waitlist."
      ) {
        setNotification(
          "You have been added to the waitlist. The table is reserved, you can choose another one if you want."
        );
      } else {
        setNotification(response.data.message || "Reservation successful!");
      }
      closeModal(setIsReservationModalOpen); // Close modal on success/waitlist
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Reservation failed, please try again.";
      setNotification(msg);
      console.error("Reservation API error:", error);
    } finally {
      setTimeout(() => setNotification(""), 5000); // Clear notification after a delay
    }
  };

  const [orderCart, setOrderCart] = useState({
    type: "normal",
    items: [],
    offer: null,
    offerCount: 0,
  });
  const [orderResponseMessage, setOrderResponseMessage] = useState("");

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get(`/getRestaurantDetails/${id}`);
        const fetchedRestaurant = response.data.data;

        if (fetchedRestaurant) {
          setRestaurant(fetchedRestaurant);
        } else {
          setError("Restaurant not found.");
        }
      } catch (err) {
        setError(
          err.message || "Failed to load restaurant details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurantDetails();
  }, [id]);

  const openModal = (modalSetter) => {
    modalSetter(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = (modalSetter) => {
    modalSetter(false);
    document.body.style.overflow = "unset";
  };

  const handleAddItemToOrder = (item, menuName) => {
    setOrderCart((prevCart) => {
      if (prevCart.type === "offer" && prevCart.offer !== null) {
        return {
          type: "normal",
          items: [{ ...item, quantity: 1, menuName, menu_items_id: item.id }],
          offer: null,
          offerCount: 0,
        };
      }

      const existingItemIndex = prevCart.items.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex].quantity += 1;
        return { ...prevCart, items: updatedItems };
      } else {
        return {
          ...prevCart,
          type: "normal",
          items: [
            ...prevCart.items,
            { ...item, quantity: 1, menuName, menu_items_id: item.id },
          ],
        };
      }
    });
  };

  const handleApplyOfferToCart = (offer) => {
    setOrderCart((prevCart) => {
      if (
        (prevCart.type === "normal" && prevCart.items.length > 0) ||
        (prevCart.type === "offer" && prevCart.offer?.id !== offer.id)
      ) {
        return {
          type: "offer",
          items: [],
          offer: offer,
          offerCount: 1,
        };
      }
      if (prevCart.type === "offer" && prevCart.offer?.id === offer.id) {
        return { ...prevCart, offerCount: prevCart.offerCount + 1 };
      }
      return { ...prevCart, type: "offer", offer: offer, offerCount: 1 };
    });
    closeModal(setIsOffersModalOpen);
  };

  const handleQuantityChange = (type, id, change) => {
    setOrderCart((prevCart) => {
      if (type === "item") {
        const updatedItems = prevCart.items
          .map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(0, item.quantity + change) }
              : item
          )
          .filter((item) => item.quantity > 0);
        return {
          ...prevCart,
          items: updatedItems,
          type: updatedItems.length > 0 ? "normal" : "empty",
        };
      } else if (type === "offer") {
        const newOfferCount = Math.max(0, prevCart.offerCount + change);
        return {
          ...prevCart,
          offerCount: newOfferCount,
          type: newOfferCount > 0 ? "offer" : "empty",
          offer: newOfferCount === 0 ? null : prevCart.offer,
        };
      }
      return prevCart;
    });
  };

  const handleCancelOrder = () => {
    setOrderCart({
      type: "normal",
      items: [],
      offer: null,
      offerCount: 0,
    });
    setOrderResponseMessage("");
    closeModal(setIsOrderConfirmationModalOpen);
    closeModal(setIsOrderErrorModalOpen);
  };

  const calculateOrderTotal = () => {
    if (orderCart.type === "offer" && orderCart.offer) {
      return orderCart.offer.fixed_price * orderCart.offerCount;
    }
    return orderCart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleConfirmOrder = async () => {
    if (!USER_ID) {
      setOrderResponseMessage("Please log in to place an order.");
      openModal(setIsOrderErrorModalOpen);
      return;
    }
    if (
      orderCart.type === "normal" &&
      orderCart.items.length === 0 &&
      orderCart.type === "offer" &&
      orderCart.offer === null
    ) {
      setOrderResponseMessage(
        "Your cart is empty. Please add items or an offer."
      );
      openModal(setIsOrderErrorModalOpen);
      return;
    }

    setLoading(true);
    setOrderResponseMessage("");
    let payload = {
      user_id: USER_ID,
      restaurants_id: restaurant.id,
      price: calculateOrderTotal(),
    };

    if (orderCart.type === "offer" && orderCart.offer) {
      payload.type = "offer";
      payload.offer_id = orderCart.offer.id;
      payload.offer_count = orderCart.offerCount;
      payload.items = [];
    } else if (orderCart.type === "normal" && orderCart.items.length > 0) {
      payload.type = "normal";
      payload.items = orderCart.items.map((item) => ({
        menu_items_id: item.menu_items_id,
        quantity: item.quantity,
      }));
      payload.offer_id = null;
      payload.offer_count = 0;
    } else {
      setOrderResponseMessage("Invalid order type or empty cart.");
      openModal(setIsOrderErrorModalOpen);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosClient.post("/orders", payload);
      setOrderResponseMessage(
        response.data.message || "Order placed successfully!"
      );
      openModal(setIsOrderConfirmationModalOpen);
      handleCancelOrder(); // Clear cart after successful order
    } catch (apiError) {
      const errorMessage =
        apiError.response?.data?.message ||
        apiError.message ||
        "Failed to place order. Please try again.";
      setOrderResponseMessage(errorMessage);
      openModal(setIsOrderErrorModalOpen);
    } finally {
      setLoading(false);
    }
  };

  const baseURL = "http://localhost:8000";
  const totalCartItems =
    orderCart.type === "normal"
      ? orderCart.items.reduce((sum, item) => sum + item.quantity, 0)
      : orderCart.offer
      ? orderCart.offerCount
      : 0;

  if (loading && !restaurant)
    return <div className="rd-loading-message">Loading details...</div>;
  if (error) return <div className="rd-error-message">Error: {error}</div>;
  if (!restaurant)
    return (
      <div className="rd-error-message">Restaurant details unavailable.</div>
    );

  return (
    <div className="rd-page-container">
      <div className="rd-detail-card">
        <Link to="/" className="rd-back-link">
          &larr; Back to Restaurants
        </Link>
        <h1 className="rd-title">{restaurant.name}</h1>
        <div className="rd-media-container">
          <img
            src={
              restaurant.image_path
                ? `${baseURL}${restaurant.image_path}`
                : "/default-restaurant.jpg"
            }
            alt={restaurant.name}
            className="rd-image"
          />

          {restaurant.video_path && (
            <div className="rd-video-wrapper">
              <video controls className="rd-video">
                <source
                  src={`${baseURL}${restaurant.video_path}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        {/* Restaurant Information */}
        <p className="rd-info-text">
          <span className="rd-info-label">Cuisine:</span>{" "}
          {restaurant.cuisine_type}
        </p>
        <p className="rd-info-text">
          <span className="rd-info-label">Type:</span> {restaurant.type}
        </p>
        <p className="rd-info-text">
          <span className="rd-info-label">Location:</span> {restaurant.location}
        </p>
        <p className="rd-info-text">
          <span className="rd-info-label">Opening Time:</span>{" "}
          {restaurant.startTime}
        </p>
        <p className="rd-info-text">
          <span className="rd-info-label">Closing Time:</span>{" "}
          {restaurant.endTime}
        </p>
        {restaurant.event_calender && (
          <p className="rd-info-text">
            <span className="rd-info-label">Event Calendar:</span>{" "}
            {restaurant.event_calender}
          </p>
        )}
        <button
          className="rd-section-button rd-book-event-button"
          onClick={handleBookEventClick}
        >
          <Calendar size={20} /> Book Event
        </button>

        {/* Overall Rating Section */}
        <div className="rd-rating-section">
          <span className="rd-info-label">Overall Rating:</span>
          <div className="rd-star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                fill="currentColor"
                className={
                  star <=
                  Math.floor(Number(restaurant.user_rates_avg_rate) || 0)
                    ? "rd-star-filled"
                    : ""
                }
              />
            ))}
          </div>
          <span className="rd-rating-value">
            {restaurant.user_rates_avg_rate
              ? Number(restaurant.user_rates_avg_rate).toFixed(1)
              : "N/A"}
          </span>
          {restaurant.user_rating !== undefined &&
            restaurant.user_rating !== null && (
              <span className="rd-user-specific-rating">
                (Your rating: {restaurant.user_rating})
              </span>
            )}
        </div>

        {/* Action Buttons Grid (View Tables, Menus, Discounts, Offers etc.) */}
        <div className="rd-section-buttons-grid">
          {/* Reservation Modal (Conditionally Rendered with Overlay) */}
          {isReservationModalOpen && ( // <-- CRITICAL FIX: Ensure this wrapper is rendered when modal should be open
            <div
              className={`rd-modal-overlay ${
                isReservationModalOpen ? "open" : ""
              }`}
              onClick={() => closeModal(setIsReservationModalOpen)} // Close on overlay click
            >
              <ReservationModal
                isOpen={isReservationModalOpen} // Prop passed
                onClose={() => setIsReservationModalOpen(false)} // Close handler for modal's internal use
                table={selectedTable}
                onSubmit={handleSubmitReservation}
              />
            </div>
          )}

          {restaurant.tables && restaurant.tables.length > 0 && (
            <button
              className="rd-section-button"
              onClick={() => openModal(setIsTablesModalOpen)}
            >
              View Tables
            </button>
          )}
          {restaurant.features && restaurant.features.length > 0 && (
            <button
              className="rd-section-button"
              onClick={() => openModal(setIsFeaturesModalOpen)}
            >
              View Features
            </button>
          )}
          {restaurant.menus && restaurant.menus.length > 0 && (
            <button
              className="rd-section-button"
              onClick={() => openModal(setIsMenusModalOpen)}
            >
              View Menus & Order
            </button>
          )}
          {restaurant.discounts && restaurant.discounts.length > 0 && (
            <button
              className="rd-section-button"
              onClick={() => openModal(setIsDiscountsModalOpen)}
            >
              View Discounts
            </button>
          )}
          {restaurant.offer && restaurant.offer.length > 0 && (
            <button
              className="rd-section-button"
              onClick={() => openModal(setIsOffersModalOpen)}
            >
              View Offers
            </button>
          )}
        </div>

        {/* Global Notification for Reservation / Booking Event */}
        {notification && <div className="notification">{notification}</div>}

        {/* Tables Modal */}
        {isTablesModalOpen && (
          <div
            className={`rd-modal-overlay ${isTablesModalOpen ? "open" : ""}`}
            onClick={() => closeModal(setIsTablesModalOpen)}
          >
            <div
              className="rd-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="rd-modal-close-button"
                onClick={() => closeModal(setIsTablesModalOpen)}
              >
                <X />
              </button>
              <h2 className="rd-modal-title">Available Tables</h2>
              {restaurant.tables.length > 0 ? (
                <ul className="rd-modal-list-grid">
                  {restaurant.tables.map((table) => (
                    <li key={table.id} className="rd-modal-list-item">
                      <p>
                        <span className="rd-modal-list-item-label">Type:</span>{" "}
                        {table.type}
                      </p>
                      <p>
                        <span className="rd-modal-list-item-label">Count:</span>{" "}
                        {table.count}
                      </p>
                      <p>
                        <span className="rd-modal-list-item-label">
                          Persons:
                        </span>{" "}
                        {table.number_of_persons}
                      </p>
                      <p>
                        <span className="rd-modal-list-item-label">
                          Available:
                        </span>{" "}
                        {table.available_count}
                      </p>
                      <button
                        className="rd-action-button rd-reserve-button"
                        onClick={() => handleReserveTable(table)}
                      >
                        Reserve Table
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rd-modal-no-data">No tables available.</p>
              )}
            </div>
          </div>
        )}

        {/* Features Modal */}
        {isFeaturesModalOpen && (
          <div
            className={`rd-modal-overlay ${isFeaturesModalOpen ? "open" : ""}`}
            onClick={() => closeModal(setIsFeaturesModalOpen)}
          >
            <div
              className="rd-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="rd-modal-close-button"
                onClick={() => closeModal(setIsFeaturesModalOpen)}
              >
                <X />
              </button>
              <h2 className="rd-modal-title">Features</h2>
              {restaurant.features.length > 0 ? (
                <ul className="rd-modal-list-grid">
                  {restaurant.features.map((feature) => (
                    <li key={feature.id} className="rd-modal-list-item">
                      <p>
                        <span className="rd-modal-list-item-label">Type:</span>
                        {(() => {
                          try {
                            const parsedType = JSON.parse(feature.type);
                            return Array.isArray(parsedType)
                              ? parsedType.join(", ")
                              : feature.type;
                          } catch (e) {
                            return feature.type;
                          }
                        })()}
                      </p>
                      <p>
                        <span className="rd-modal-list-item-label">
                          Description:
                        </span>{" "}
                        {feature.description}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rd-modal-no-data">No features listed.</p>
              )}
            </div>
          </div>
        )}

        {/* Menus Modal */}
        {isMenusModalOpen && (
          <div
            className={`rd-modal-overlay ${isMenusModalOpen ? "open" : ""}`}
            onClick={() => closeModal(setIsMenusModalOpen)}
          >
            <div
              className="rd-modal-content rd-large-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="rd-modal-close-button"
                onClick={() => closeModal(setIsMenusModalOpen)}
              >
                <X />
              </button>
              <h2 className="rd-modal-title">Restaurant Menus</h2>
              {restaurant.menus.length > 0 ? (
                <div className="rd-modal-menus-container">
                  {restaurant.menus.map((menu) => (
                    <div key={menu.id} className="rd-modal-menu-card">
                      <h3>{menu.name}</h3>
                      {menu.description && (
                        <p className="rd-modal-menu-description">
                          {menu.description}
                        </p>
                      )}
                      {menu.menu_items && menu.menu_items.length > 0 ? (
                        <ul className="rd-modal-menu-items-list">
                          {menu.menu_items.map((item) => (
                            <li key={item.id} className="rd-modal-menu-item">
                              <div>
                                <p className="rd-modal-menu-item-name">
                                  {item.name}
                                </p>
                                {item.description && (
                                  <p className="rd-modal-menu-item-description">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              <div className="rd-modal-menu-item-actions">
                                <span className="rd-modal-menu-item-price">
                                  ${parseFloat(item.price).toFixed(2)}
                                </span>
                                <button
                                  className="rd-action-button rd-add-to-order-button"
                                  onClick={() =>
                                    handleAddItemToOrder(item, menu.name)
                                  }
                                >
                                  Add to Order
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="rd-modal-no-items">
                          No items in this menu.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rd-modal-no-data">No menus available.</p>
              )}
            </div>
          </div>
        )}

        {isDiscountsModalOpen && (
          <div
            className={`rd-modal-overlay ${isDiscountsModalOpen ? "open" : ""}`}
            onClick={() => closeModal(setIsDiscountsModalOpen)}
          >
            <div
              className="rd-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="rd-modal-close-button"
                onClick={() => closeModal(setIsDiscountsModalOpen)}
              >
                <X />
              </button>
              <h2 className="rd-modal-title">Available Discounts</h2>
              {restaurant.discounts.length > 0 ? (
                <ul className="rd-modal-list-grid">
                  {restaurant.discounts.map((discount) => (
                    <li key={discount.id} className="rd-modal-list-item">
                      <p>
                        <span className="rd-modal-list-item-label">Code:</span>{" "}
                        {discount.code}
                      </p>
                      <p>
                        <span className="rd-modal-list-item-label">Value:</span>{" "}
                        {discount.value}%
                      </p>
                      {discount.description && (
                        <p>
                          <span className="rd-modal-list-item-label">
                            Description:
                          </span>{" "}
                          {discount.description}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rd-modal-no-data">No discounts available.</p>
              )}
            </div>
          </div>
        )}

        {isOffersModalOpen && (
          <div
            className={`rd-modal-overlay ${isOffersModalOpen ? "open" : ""}`}
            onClick={() => closeModal(setIsOffersModalOpen)}
          >
            <div
              className="rd-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="rd-modal-close-button"
                onClick={() => closeModal(setIsOffersModalOpen)}
              >
                <X />
              </button>
              <h2 className="rd-modal-title">Special Offers</h2>
              {restaurant.offer.length > 0 ? (
                <ul className="rd-modal-list-grid">
                  {restaurant.offer.map((offer) => (
                    <li key={offer.id} className="rd-modal-list-item">
                      <p>
                        <span className="rd-modal-list-item-label">Title:</span>{" "}
                        {offer.title}
                      </p>
                      {offer.description && (
                        <p>
                          <span className="rd-modal-list-item-label">
                            Description:
                          </span>{" "}
                          {offer.description}
                        </p>
                      )}
                      <p>
                        <span className="rd-modal-list-item-label">Type:</span>{" "}
                        {offer.offer_type}
                      </p>
                      {offer.offer_type === "percentage" && (
                        <p>
                          <span className="rd-modal-list-item-label">
                            Discount:
                          </span>{" "}
                          {parseFloat(offer.discount_percentage).toFixed(2)}%
                        </p>
                      )}
                      {offer.offer_type === "fixed_price" && (
                        <p>
                          <span className="rd-modal-list-item-label">
                            Fixed Price:
                          </span>{" "}
                          ${parseFloat(offer.fixed_price).toFixed(2)}
                        </p>
                      )}
                      <p>
                        <span className="rd-modal-list-item-label">
                          Valid From:
                        </span>{" "}
                        {new Date(offer.valid_from).toLocaleString()}
                      </p>
                      <p>
                        <span className="rd-modal-list-item-label">
                          Valid Until:
                        </span>{" "}
                        {new Date(offer.valid_until).toLocaleString()}
                      </p>
                      <button
                        className="rd-action-button rd-apply-offer-button"
                        onClick={() => handleApplyOfferToCart(offer)}
                      >
                        Apply Offer
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rd-modal-no-data">No special offers available.</p>
              )}
            </div>
          </div>
        )}

        {(orderCart.items.length > 0 || orderCart.offer !== null) && (
          <div className="rd-order-cart-summary">
            {loading && (
              <div className="rd-cart-overlay-loading">
                <span className="spinner" />
              </div>
            )}
            <div className="rd-cart-header">
              <ShoppingCart size={24} />
              <h3>
                Your Order ({totalCartItems}{" "}
                {orderCart.type === "normal" ? "items" : "offer"})
              </h3>
            </div>
            <ul className="rd-cart-items-list">
              {orderCart.type === "normal" &&
                orderCart.items.map((item) => (
                  <li key={item.id} className="rd-cart-item">
                    <div className="rd-cart-item-info">
                      <p className="rd-cart-item-name">{item.name}</p>
                      <p className="rd-cart-item-menu">{item.menuName}</p>
                    </div>
                    <div className="rd-cart-item-quantity-controls">
                      <button
                        onClick={() =>
                          handleQuantityChange("item", item.id, -1)
                        }
                        className="rd-quantity-button"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="rd-quantity-display">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange("item", item.id, 1)}
                        className="rd-quantity-button"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="rd-cart-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              {orderCart.type === "offer" && orderCart.offer && (
                <li
                  key={orderCart.offer.id}
                  className="rd-cart-item rd-offer-item"
                >
                  <div className="rd-cart-item-info">
                    <p className="rd-cart-item-name">
                      Offer: {orderCart.offer.title}
                    </p>
                    <p className="rd-cart-item-menu">
                      {orderCart.offer.description}
                    </p>
                  </div>
                  <div className="rd-cart-item-quantity-controls">
                    <button
                      onClick={() =>
                        handleQuantityChange("offer", orderCart.offer.id, -1)
                      }
                      className="rd-quantity-button"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="rd-quantity-display">
                      {orderCart.offerCount}
                    </span>
                    <button
                      onClick={() =>
                        handleQuantityChange("offer", orderCart.offer.id, 1)
                      }
                      className="rd-quantity-button"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="rd-cart-item-price">
                    $
                    {(
                      orderCart.offer.fixed_price * orderCart.offerCount
                    ).toFixed(2)}
                  </span>
                </li>
              )}
            </ul>
            <div className="rd-cart-total">
              <span>Total:</span>
              <span>${calculateOrderTotal().toFixed(2)}</span>
            </div>
            <div className="rd-cart-actions">
              <button
                className="rd-confirm-order-button"
                onClick={handleConfirmOrder}
                disabled={loading}
              >
                {loading ? (
                  <Loader className="spinner" size={20} />
                ) : (
                  "Confirm Order"
                )}
              </button>
              <button
                className="rd-cancel-order-button"
                onClick={handleCancelOrder}
                disabled={loading}
              >
                Cancel Order
              </button>
            </div>
          </div>
        )}

        {(isOrderConfirmationModalOpen || isOrderErrorModalOpen) && (
          <div
            className={`rd-modal-overlay ${
              isOrderConfirmationModalOpen || isOrderErrorModalOpen
                ? "open"
                : ""
            }`}
            onClick={() => {
              if (isOrderConfirmationModalOpen)
                closeModal(setIsOrderConfirmationModalOpen);
              if (isOrderErrorModalOpen) closeModal(setIsOrderErrorModalOpen);
            }}
          >
            <div
              className="rd-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="rd-modal-close-button"
                onClick={() => {
                  if (isOrderConfirmationModalOpen)
                    closeModal(setIsOrderConfirmationModalOpen);
                  if (isOrderErrorModalOpen)
                    closeModal(setIsOrderErrorModalOpen);
                }}
              >
                <X />
              </button>
              <h2
                className={
                  isOrderErrorModalOpen ? "rd-error-title" : "rd-success-title"
                }
              >
                {isOrderErrorModalOpen ? "Order Failed!" : "Order Confirmed!"}
              </h2>
              <p className="rd-order-message">{orderResponseMessage}</p>
              {isOrderConfirmationModalOpen && (
                <p className="rd-order-summary-message">
                  Your order total was: ${calculateOrderTotal().toFixed(2)}.
                </p>
              )}
              <button
                className="rd-action-button"
                onClick={() => {
                  if (isOrderConfirmationModalOpen)
                    closeModal(setIsOrderConfirmationModalOpen);
                  if (isOrderErrorModalOpen)
                    closeModal(setIsOrderErrorModalOpen);
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {isBookEventModalOpen && restaurant && (
          <BookEventForm
            restaurantId={restaurant.id}
            userId={USER_ID}
            onClose={closeBookEventModal}
          />
        )}
      </div>
    </div>
  );
};

export default ResturantsDetails;
