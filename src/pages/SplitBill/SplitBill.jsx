import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './SplitBill.css';

const SplitBill = () => {
  const location = useLocation();
  const order = location.state?.order || []; // [{ id, name, price, quantity }, ...]

  const [numCustomers, setNumCustomers] = useState(2); // Default to 2 customers
  // assignments: { itemId: { customerIndex: quantity } }
  const [assignments, setAssignments] = useState({});
  // customerBills: [ { items: [{ name, price, quantity }], total: number } ]
  const [customerBills, setCustomerBills] = useState([]);

  // Initialize assignments when order or numCustomers changes
  useEffect(() => {
    const initialAssignments = {};
    order.forEach(item => {
      initialAssignments[item.id] = {};
      // Initialize assignments to 0
       for (let i = 0; i < numCustomers; i++) {
         initialAssignments[item.id][i] = 0;
       }
    });
    setAssignments(initialAssignments);
  }, [order, numCustomers]);

  // Recalculate bills whenever assignments change
  useEffect(() => {
    const bills = Array(numCustomers).fill(null).map(() => ({ items: [], total: 0 }));

    order.forEach(item => {
      const itemAssignments = assignments[item.id] || {};
      for (let i = 0; i < numCustomers; i++) {
        const quantity = itemAssignments[i] || 0;
        if (quantity > 0) {
          bills[i].items.push({ ...item, quantity });
          bills[i].total += item.price * quantity;
        }
      }
    });
    setCustomerBills(bills);
  }, [assignments, order, numCustomers]);

  const handleNumCustomersChange = (change) => {
    setNumCustomers(prev => Math.max(1, prev + change)); // Minimum 1 customer
  };

  const handleAssignmentChange = (itemId, customerIndex, change) => {
    setAssignments(prev => {
      const currentItemAssignments = prev[itemId] || {};
      const currentQuantity = currentItemAssignments[customerIndex] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);

      // Calculate total assigned quantity for this item across all customers
      let totalAssigned = 0;
      for (let i = 0; i < numCustomers; i++) {
        totalAssigned += (i === customerIndex ? newQuantity : (currentItemAssignments[i] || 0));
      }

      // Find the original ordered quantity for this item
      const originalItem = order.find(item => item.id === itemId);
      const maxQuantity = originalItem ? originalItem.quantity : 0;

      // Prevent assigning more than the total ordered quantity
      if (totalAssigned > maxQuantity) {
        return prev; // Change is invalid, return previous state
      }

      return {
        ...prev,
        [itemId]: {
          ...currentItemAssignments,
          [customerIndex]: newQuantity,
        },
      };
    });
  };

  // Get the remaining unassigned quantity for an item
  const getUnassignedQuantity = (itemId) => {
    const originalItem = order.find(item => item.id === itemId);
    const maxQuantity = originalItem ? originalItem.quantity : 0;
    const itemAssignments = assignments[itemId] || {};
    const totalAssigned = Object.values(itemAssignments).reduce((sum, qty) => sum + qty, 0);
    return maxQuantity - totalAssigned;
  };

  // Determine if the order is empty
  const isEmptyOrder = order.length === 0;

  return (
    <div className="split-bill-page">
      {/* Background image div like in Menu/Order/CalculateBill */}
      <div className="split-bill-background-image"></div>
      <div className={`split-bill-card ${isEmptyOrder ? 'bill-empty' : ''}`}> {/* Card container */}
        <h1 className="split-bill-title">Split the Bill</h1>

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
          // Split bill content
          <>
            <div className="customer-controls">
              <label>Number of Customers:</label>
              <div className="customer-count-selector">
                <button onClick={() => handleNumCustomersChange(-1)} disabled={numCustomers <= 1}>-</button>
                <span>{numCustomers}</span>
                <button onClick={() => handleNumCustomersChange(1)}>+</button>
              </div>
            </div>

            <div className="assignment-section">
              <h2>Assign Items to Customers</h2>
              {order.map(item => (
                <div key={item.id} className="assignment-item">
                  <div className="assignment-item-header">
                    <h3>{item.name} (Ordered: {item.quantity})</h3>
                    <span className="unassigned-qty">Unassigned: {getUnassignedQuantity(item.id)}</span>
                  </div>
                  <div className="customer-assignment-inputs">
                    {Array.from({ length: numCustomers }).map((_, index) => (
                      <div key={index} className="customer-input-group">
                        <label>Customer {index + 1}:</label>
                        <div className="quantity-selector">
                          <button
                            onClick={() => handleAssignmentChange(item.id, index, -1)}
                            disabled={(assignments[item.id]?.[index] || 0) === 0}
                          >
                            -
                          </button>
                          <span>{assignments[item.id]?.[index] || 0}</span>
                          <button
                            onClick={() => handleAssignmentChange(item.id, index, 1)}
                            // Disable '+' if all items are assigned
                            disabled={getUnassignedQuantity(item.id) <= 0 && (assignments[item.id]?.[index] || 0) >= 0} 
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="customer-bills-section">
              <h2>Individual Bills</h2>
              <div className="customer-bills-grid">
                {customerBills.map((bill, index) => (
                  <div key={index} className="customer-bill-card">
                    <h3>Customer {index + 1}</h3>
                    {bill.items.length > 0 ? (
                      <table className="customer-bill-table">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bill.items.map(item => (
                            <tr key={item.id}>
                              <td>{item.name}</td>
                              <td>{item.quantity}</td>
                              <td>${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="2">Total:</td>
                            <td>${bill.total.toFixed(2)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    ) : (
                      <p className="no-items-assigned">No items assigned.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="split-bill-actions">
              <Link to="/order">
                <button className="back-button">Back to Order</button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SplitBill;

