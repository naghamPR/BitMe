import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import './Order.css';

// Use the same placeholder menu items as Menu.jsx for consistency
// We'll add IDs and categories here for ordering logic
const menuItemsFromMenuPage = [
  { id: 'hd001', name: "Espresso", price: 3.00, category: 'Hot Drinks' },
  { id: 'hd002', name: "Cappuccino", price: 4.00, category: 'Hot Drinks' },
  { id: 'hd003', name: "Latte", price: 4.50, category: 'Hot Drinks' },
  { id: 'hd004', name: "Americano", price: 3.50, category: 'Hot Drinks' },
  { id: 'hd005', name: "Mocha", price: 5.00, category: 'Hot Drinks' },
  // Add other categories/items from Menu.jsx if they exist
];

const Order = () => {
  const [selectedItems, setSelectedItems] = useState({}); // Use an object to store quantities { itemId: quantity }
  const navigate = useNavigate();
  const location = useLocation(); // Get location to potentially receive restaurantId

  // Extract restaurantId if passed from RestaurantDetails (optional)
  const restaurantId = location.state?.restaurantId;
  // In a real app, you might fetch menu items based on restaurantId here

  // Handle checkbox change - Increment/decrement quantity
  const handleSelectItem = (itemId, change) => {
    setSelectedItems(prev => {
      const currentQuantity = prev[itemId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change); // Ensure quantity doesn't go below 0

      // If quantity becomes 0, remove the item from the selection
      if (newQuantity === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [itemId]: newQuantity,
      };
    });
  };

  // Calculate total items selected
  const totalSelectedCount = Object.values(selectedItems).reduce((sum, quantity) => sum + quantity, 0);

  // Group items by category for display using only items from Menu page
  const groupedItems = menuItemsFromMenuPage.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Prepare order data for bill calculation
  const prepareOrderData = () => {
    return Object.entries(selectedItems).map(([itemId, quantity]) => {
      const itemDetails = menuItemsFromMenuPage.find(item => item.id === itemId);
      // Include restaurantId if available
      return { ...itemDetails, quantity, restaurantId }; 
    });
  };

  // Navigate to bill calculation page
  const handleCalculateBill = () => {
    const orderData = prepareOrderData();
    if (orderData.length > 0) {
      // Pass order data via state to the next route
      navigate('/calculate-bill', { state: { order: orderData } }); // Corrected route
    } else {
      alert('Please select items to order.');
    }
  };

  // Navigate to split bill page
  const handleSplitBill = () => {
    const orderData = prepareOrderData();
    if (orderData.length > 0) {
      // Pass order data via state to the next route
      navigate("/split-bill", { state: { order: orderData } }); // Corrected route
    } else {
      alert('Please select items to order.');
    }
  };

  return (
    <div className="order-page">
      {/* Background image div like in Menu.jsx */}
      <div className="order-background-image"></div> 
      <div className="order-card"> {/* Card container like Menu.jsx */}
        <h1 className="order-title">Place Your Order</h1>
        {/* <p className="order-subtitle">Select items and quantities</p> Removed subtitle for cleaner look */}

        <div className="order-menu-container">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="order-category">
              <h2>{category}</h2>
              <ul className="order-list">
                {items.map((item) => (
                  <li key={item.id} className="order-item">
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">${item.price.toFixed(2)}</span>
                    </div>
                    <div className="item-selector">
                      <button
                        className="quantity-button minus"
                        onClick={() => handleSelectItem(item.id, -1)}
                        disabled={(selectedItems[item.id] || 0) === 0}
                      >
                        -
                      </button>
                      <span className="item-quantity">{selectedItems[item.id] || 0}</span>
                      <button
                        className="quantity-button plus"
                        onClick={() => handleSelectItem(item.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <p>Total Items Selected: {totalSelectedCount}</p>
          <div className="order-actions">
            <button
              className="action-button calculate-button"
              onClick={handleCalculateBill}
              disabled={totalSelectedCount === 0}
            >
              Calculate Bill
            </button>
            <button
              className="action-button split-button"
              onClick={handleSplitBill}
              disabled={totalSelectedCount === 0}
            >
              Split the Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;

