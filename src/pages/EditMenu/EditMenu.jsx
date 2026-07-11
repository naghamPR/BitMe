import "./EditMenu.css";
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const EditMenu = () => {
  const { itemId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialMenuItemData = location.state?.menuItem || {
    id: itemId || Date.now(),
    name: "Sample Item",
    description: "Sample Description",
    price: "9.99",
    category: "Main Course",
  };

  const [menuItemData, setMenuItemData] = useState(initialMenuItemData);

  useEffect(() => {
    if (itemId && !location.state?.menuItem) {
      console.log("Fetching menu item data for ID:", itemId);
    }
  }, [itemId, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuItemData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Updating menu item:", menuItemData.id, menuItemData);
    alert("Menu item updated successfully! (Placeholder)");
    navigate("/Stafhom");
  };

  return (
    <div className="edite-menu-page">
      <div className="input-card-editemenu">
        <div className="card-content-editemenu">
          <div className="card-editemenu-title">
            Edit Menu Item #{menuItemData.id}
          </div>
          <input
            className="input-field6"
            type="text"
            name="name"
            placeholder="Item Name"
            value={menuItemData.name}
            onChange={handleChange}
          />
          <textarea
            className="input-field6 textarea-field"
            name="description"
            placeholder="Item Description"
            value={menuItemData.description}
            onChange={handleChange}
          />
          <input
            className="input-field6"
            type="number"
            name="price"
            placeholder="Price"
            value={menuItemData.price}
            onChange={handleChange}
            step="0.01"
          />
          <select
            className="input-field6"
            name="category"
            value={menuItemData.category}
            onChange={handleChange}
          >
            <option value="Appetizer">Appetizer</option>
            <option value="Main Course">Main Course</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverage">Beverage</option>
            <option value="Side Dish">Side Dish</option>
          </select>
          <button className="submit-editemenu-button" onClick={handleSubmit}>
            Update Menu Item
          </button>
        </div>
      </div>

      {/* Moved image outside the card */}
      <div className="editemenu-card-img"></div>
    </div>
  );
};

export default EditMenu;
