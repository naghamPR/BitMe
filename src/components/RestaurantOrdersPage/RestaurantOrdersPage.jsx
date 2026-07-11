import React, { useState, useEffect } from "react";
import { Loader, CheckCircle, AlertCircle, User, Utensils, Tag, DollarSign, Clock, Package, ShoppingBag, Phone, Mail } from "lucide-react"; // Added more icons
import axiosClient from "../../../axios-client";
import { useSelector } from "react-redux";
import "./RestaurantOrdersPage.css";

const RestaurantOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [updateStatusLoading, setUpdateStatusLoading] = useState({}); // { orderId: true/false }
  const [updateStatusMessage, setUpdateStatusMessage] = useState({}); // { orderId: {type: 'success', text: '...'}}
  const role = useSelector((state) => state.authReducer.authData.data);

  useEffect(() => {
    if (role && role.restaurants && role.restaurants[0] && role.restaurants[0].id) {
      fetchRestaurantOrders(role.restaurants[0].id);
    } else {
      setOrdersError("Restaurant ID not found for this user role.");
      setLoadingOrders(false);
    }
  }, [role]); 

  const fetchRestaurantOrders = async (restaurantId) => {
    setLoadingOrders(true);
    setOrdersError(null);
    try {
      const response = await axiosClient.get(
        `/orders/getResOrder/${restaurantId}`
      );
      if (response.data.success || response.data.data) {
        setOrders(response.data.orders || response.data.data);
      } else {
        setOrdersError(
          response.data.message || "Failed to fetch restaurant orders."
        );
      }
    } catch (err) {
      setOrdersError(
        err.message || "Network error fetching restaurant orders."
      );
      console.error("Error fetching restaurant orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdateStatusLoading((prev) => ({ ...prev, [orderId]: true }));
    setUpdateStatusMessage((prev) => ({ ...prev, [orderId]: null })); // Clear previous message

    try {
      const response = await axiosClient.post(
        `/orders/updateOrderStatus/${orderId}`,
        {
          status: newStatus,
        }
      );

      if (response.data.success) {
        setUpdateStatusMessage((prev) => ({
          ...prev,
          [orderId]: { type: "success", text: response.data.message || "Status updated!" },
        }));
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        setUpdateStatusMessage((prev) => ({
          ...prev,
          [orderId]: {
            type: "error",
            text: response.data.message || "Failed to update status.",
          },
        }));
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Error updating status.";
      setUpdateStatusMessage((prev) => ({
        ...prev,
        [orderId]: { type: "error", text: msg },
      }));
      console.error("Error updating order status:", err);
    } finally {
      setUpdateStatusLoading((prev) => ({ ...prev, [orderId]: false }));
      setTimeout(() => {
        setUpdateStatusMessage((prev) => ({ ...prev, [orderId]: null }));
      }, 3000);
    }
  };

  const orderStatuses = ["pending", "confirmed", "completed", "cancelled"];

  if (loadingOrders)
    return <div className="ro-loading-message"><Loader className="spinner" size={28} /> Loading restaurant orders...</div>;
  if (ordersError)
    return <div className="ro-error-message"><AlertCircle className="icon" size={28} /> Error: {ordersError}</div>;

  return (
    <div className="ro-page-container">
      <div className="ro-header">
        <h1>Restaurant Orders</h1>
        <p>Manage incoming and past orders for your restaurant</p>
      </div>

      {orders.length === 0 ? (
        <div className="ro-no-orders-found">
          <h3>No orders found for this restaurant.</h3>
          <p>Once customers place orders, they will appear here.</p>
        </div>
      ) : (
        <div className="ro-orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="ro-order-card">
              <div className="ro-card-header">
                <h3 className="ro-order-id"><Package size={22} /> Order #{order.id}</h3>
                <span className={`ro-order-status ro-status-${order.status}`}>
                  {order.status}
                </span>
              </div>

              <div className="ro-order-summary">
                <p className="ro-info-item">
                  <User size={18} /> <span className="ro-info-label">Customer:</span>
                  <a href={`mailto:${order.user?.email}`} className="ro-customer-link">
                    <strong>{order.user?.name || "N/A"}</strong>
                    {order.user?.email && (
                      <span className="ro-customer-contact">
                        ({order.user?.email})
                      </span>
                    )}
                    {order.user?.phone_number && (
                        <span className="ro-customer-contact">
                            <Phone size={14} /> {order.user?.phone_number}
                        </span>
                    )}
                  </a>
                </p>
                <p className="ro-info-item">
                  <Utensils size={18} /> <span className="ro-info-label">Restaurant:</span> <strong>{order.restaurant?.name || "N/A"}</strong>
                </p>
                
                <p className="ro-info-item ro-total-price">
                  <DollarSign size={18} /> <span className="ro-info-label">Total Price:</span>{" "}
                  <strong>${parseFloat(order.price).toFixed(2)}</strong>
                </p>
                <p className="ro-info-item">
                  <Clock size={18} /> <span className="ro-info-label">Ordered On:</span>{" "}
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>

              {(order.details && order.details.length > 0) ? (
                <div className="ro-order-details-section">
                  <h4><ShoppingBag size={20} /> Items:</h4>
                  <ul className="ro-order-items-list">
                    {order.details.map((detail) => (
                      <li key={detail.id} className="ro-order-item-detail">
                        <div className="ro-item-info">
                          <span className="ro-item-name">{detail.menu_item?.name || "Unknown Item"}</span>
                          <span className="ro-item-quantity"> (x{detail.quantity})</span>
                        </div>
                        <span className="ro-item-price">${parseFloat(detail.price).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : order.type === "offer" && order.offer ? (
                <div className="ro-order-details-section ro-offer-details-section">
                  <h4><Tag size={20} /> Applied Offer:</h4>
                  <p className="ro-offer-summary">
                    <strong>{order.offer.title}</strong> (x{order.offer_count})
                    <span className="ro-offer-price-display">
                        ${parseFloat(order.offer.fixed_price * order.offer_count).toFixed(2)}
                    </span>
                  </p>
                  <p className="ro-offer-description">{order.offer.description}</p>
                </div>
              ) : (
                <div className="ro-no-details-message">No item/offer details available.</div>
              )}

              <div className="ro-order-actions">
                <div className="ro-status-update-section">
                  <label
                    htmlFor={`status-${order.id}`}
                    className="ro-status-label"
                  >
                    Update Status:
                  </label>
                  <select
                    id={`status-${order.id}`}
                    value={order.status}
                    onChange={(e) =>
                      handleUpdateOrderStatus(order.id, e.target.value)
                    }
                    disabled={updateStatusLoading[order.id]}
                    className="ro-status-select"
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                  {updateStatusLoading[order.id] && (
                    <Loader className="spinner ro-status-spinner" size={20} />
                  )}
                </div>
                {updateStatusMessage[order.id] && (
                  <p
                    className={`ro-status-message ro-message-${
                      updateStatusMessage[order.id].type
                    }`}
                  >
                    {updateStatusMessage[order.id].type === "success" ? (
                      <CheckCircle size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}{" "}
                    {updateStatusMessage[order.id].text}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantOrdersPage;