import "./DeleteMenu.css";
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const DeleteMenu = () => {
  const { itemId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const itemToDelete = location.state?.menuItem || {
    id: itemId || Date.now(),
    name: "Sample Item",
    description: "Sample Description",
    price: "9.99",
    category: "Main Course",
  };

  const [menuItemData, setMenuItemData] = useState(itemToDelete);

  useEffect(() => {
    if (itemId && !location.state?.menuItem) {
      console.log("Fetching menu item data for deletion confirmation:", itemId);
      // Placeholder: fetchMenuItemById(itemId).then(data => setMenuItemData(data));
    }
  }, [itemId, location.state]);

  const handleDelete = () => {
    console.log("Deleting menu item:", menuItemData.id);
    alert(`Menu item #${menuItemData.id} deleted successfully! (Placeholder)`);
    navigate("/Stafhom");
  };

  const handleCancel = () => {
    navigate("/Stafhom");
  };

  return (
    <div className="delete-menu-page">
      <div className="delete-menu-container">
        <div className="input-card-delete-menu">
          <div className="card-content-delete-menu">
            <div className="card-delete-menu-title">Confirm Deletion</div>
            {menuItemData ? (
              <div className="menu-item-details-summary">
                <p>Are you sure you want to delete the following menu item?</p>
                <p>
                  <strong>Item ID:</strong> {menuItemData.id}
                </p>
                <p>
                  <strong>Name:</strong> {menuItemData.name}
                </p>
                <p>
                  <strong>Description:</strong> {menuItemData.description}
                </p>
                <p>
                  <strong>Price:</strong> ${menuItemData.price}
                </p>
                <p>
                  <strong>Category:</strong> {menuItemData.category}
                </p>
              </div>
            ) : (
              <p>Loading menu item details...</p>
            )}
            <div className="confirmation-buttons">
              <button className="delete-button" onClick={handleDelete}>
                Yes, Delete Item
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
        <div className="delete-menu-card-img"></div>
      </div>
    </div>
  );
};

export default DeleteMenu;
