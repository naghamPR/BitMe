import React from "react";
import "./MenuItemsList.css";
import { useSelector } from "react-redux";

const MenuItemsList = ({ items, onEditItem, onDeleteItem }) => {
  if (!items || items.length === 0) {
    return <div className="no-items">No items in this menu yet</div>;
  }
  const role = useSelector((state) => state.authReducer.authData.data.role)

  return (
    <div className="menu-items-container">
      <h4>Menu Items</h4>
      <ul className="items-list">
        {items.map((item) => (
          <li key={item.id} className="menu-item">
            <div className="item-content">
              <div className="item-header">
                <span className="item-name">{item.name}</span>
                <span className="item-price">
                  ${parseFloat(item.price || 0).toFixed(2)}
                </span>
              </div>
              <div className="item-details">
                <span className="item-type">{item.type}</span>
                {item.description && (
                  <p className="item-description">{item.description}</p>
                )}
              </div>
            </div>

            <div className="item-actions">
              {
                role == 1 ?
              <button
                className="item-btn edit-btn"
                onClick={() => onEditItem(item)}
              >
                Edit
              </button> :''

              }
              <button
                className="item-btn delete-btn"
                onClick={() => onDeleteItem(item.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuItemsList;
