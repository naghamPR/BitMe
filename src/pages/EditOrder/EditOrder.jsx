import "./EditOrder.css";
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const EditOrder = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialOrderData = location.state?.order || {
    id: orderId || Date.now(),
    customerName: "Sample Customer",
    items: "Sample Items",
    status: "Pending",
  };

  const [orderData, setOrderData] = useState(initialOrderData);

  useEffect(() => {
    if (orderId && !location.state?.order) {
      console.log("Fetching order data for ID:", orderId);
    }
  }, [orderId, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Updating order:", orderData.id, orderData);
    alert("Order updated successfully! (Placeholder)");
    navigate("/Stafhom");
  };

  return (
    <div className="edite-order-page">
      <div className="input-card-editeorder">
        <div className="card-content-editeorder">
          <div className="card-editeorder-title">
            Edit Order #{orderData.id}
          </div>
          <input
            className="input-field7"
            type="text"
            name="customerName"
            placeholder="Customer Name"
            value={orderData.customerName}
            onChange={handleChange}
          />
          <textarea
            className="input-field7 textarea-field"
            name="items"
            placeholder="Order Items (e.g., 2x Pizza, 1x Coke)"
            value={orderData.items}
            onChange={handleChange}
          />
          <select
            className="input-field7"
            name="status"
            value={orderData.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button className="submit-editeorder-button" onClick={handleSubmit}>
            Update Order
          </button>
        </div>
      </div>

      {/* Image moved outside the card */}
      <div className="editeorder-floating-img"></div>
    </div>
  );
};

export default EditOrder;
