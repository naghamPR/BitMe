import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './CalculateBill.css';

const CalculateBill = () => {
  const location = useLocation();
  const order = location.state?.order || []; // Get order data from route state

  // Calculate total bill
  const totalBill = order.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Determine if the order is empty
  const isEmptyOrder = order.length === 0;

  return (
    <div className="bill-page">
      {/* Background image div like in Menu/Order */}
      <div className="bill-background-image"></div>
      <div className={`bill-card ${isEmptyOrder ? 'bill-empty' : ''}`}> {/* Add bill-empty class to card if needed */}
        <h1 className="bill-title">Order Bill</h1>

        {isEmptyOrder ? (
          // Empty state content
          <div className="bill-empty-content"> {/* Wrap empty content */} 
            <h2>No Order Data</h2>
            <p>No items were selected. Please go back and place an order.</p>
            <Link to="/order">
              <button className="back-button">Back to Order</button>
            </Link>
          </div>
        ) : (
          // Bill details content
          <div className="bill-summary">
            <h2>Order Details</h2>
            <table className="bill-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="total-label">Total Bill:</td>
                  <td className="total-amount">${totalBill.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <div className="bill-actions">
              <Link to="/order">
                <button className="back-button">Back to Order</button>
              </Link>
              {/* Optional Print Button */}
              {/* <button className="print-button" onClick={() => window.print()}>Print Bill</button> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalculateBill;

