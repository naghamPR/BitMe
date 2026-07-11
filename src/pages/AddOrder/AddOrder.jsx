import "./AddOrder.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
const AddOrder = () => {
  const [orderData, setOrderData] = useState({
    customerName: "",
    items: "",
    status: "Pending",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Adding new order:", orderData);
    alert("Order added successfully! (Placeholder)");
    setOrderData({ customerName: "", items: "", status: "Pending" });
    navigate("/Stafhom");
  };

  return (
    <div className="add-order-page">
      {" "}
      <div className="add-order-container">
        <div className="input-card-add-order">
          {" "}
          <div className="card-content-add-order">
            {" "}
            <div className="card-add-order-title">Add New Order</div>{" "}
            <input
              className="input-field5"
              type="text"
              name="customerName"
              placeholder="Customer Name"
              value={orderData.customerName}
              onChange={handleChange}
            />
            <textarea
              className="input-field5 textarea-field"
              name="items"
              placeholder="Order Items (e.g., 2x Pizza, 1x Coke)"
              value={orderData.items}
              onChange={handleChange}
            />
            <select
              className="input-field5"
              name="status"
              value={orderData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button className="submit-add-order-button" onClick={handleSubmit}>
              Add Order
            </button>{" "}
          </div>
        </div>
        <div className="add-order-card-img"></div>{" "}
      </div>
    </div>
  );
};

export default AddOrder;
