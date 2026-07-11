import "./DeleteOrder.css";
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const DeleteOrder = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const orderToDelete = location.state?.order || {
    id: orderId || Date.now(),
    customerName: "Sample Customer",
    items: "Sample Items",
    status: "Pending",
  };

  const [orderData, setOrderData] = useState(orderToDelete);

  useEffect(() => {
    if (orderId && !location.state?.order) {
      console.log("Fetching order data for deletion confirmation:", orderId);
      // Placeholder: fetchOrderById(orderId).then(data => setOrderData(data));
    }
  }, [orderId, location.state]);

  const handleDelete = () => {
    console.log("Deleting order:", orderData.id);
    alert(`Order #${orderData.id} deleted successfully! (Placeholder)`);
    navigate("/Stafhom");
  };

  const handleCancel = () => {
    navigate("/Stafhom");
  };

  return (
    <div className="delete-order-page">
      <div className="delete-order-container">
        <div className="input-card-delete-order">
          <div className="card-content-delete-order">
            <div className="card-delete-order-title">Confirm Deletion</div>
            {orderData ? (
              <div className="order-item-details-summary ">
                <p>Are you sure you want to delete the following order?</p>
                <p>
                  <strong>Order ID:</strong> {orderData.id}
                </p>
                <p>
                  <strong>Customer:</strong> {orderData.customerName}
                </p>
                <p>
                  <strong>Items:</strong> {orderData.items}
                </p>
                <p>
                  <strong>Status:</strong> {orderData.status}
                </p>
              </div>
            ) : (
              <p>Loading order details...</p>
            )}
            <div className="delete-order-buttons">
              <button className="delete-button" onClick={handleDelete}>
                Yes, Delete Order
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
        {/* Image on right */}
      </div>
      <div className="delete-order-card-img "></div>
    </div>
  );
};

export default DeleteOrder;
