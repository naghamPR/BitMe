import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./MenuList.css";
import {
  fetchMenus,
  deleteMenu,
  deleteMenuItem,
} from "../../actions/menusActions";

import UpdateMenuModal from "../UpdateMenuModal/UpdateMenuModal";
import AddMenuItemModal from "../AddMenuItemModal/AddMenuItemModal";
import MenuItemsList from "../MenuItemsList/MenuItemsList";
import UpdateMenuItemModal from "../UpdateMenuItemModal/UpdateMenuItemModal";

const MenuList = ({ restaurantId }) => {
  const dispatch = useDispatch();
  const { menus, loading, error } = useSelector((state) => state.menus);
  const role = useSelector((state) => state.authReducer.authData.data.role);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  const [itemToEdit, setItemToEdit] = useState(null);

  useEffect(() => {
    dispatch(fetchMenus(restaurantId));
  }, [dispatch, restaurantId]);

  // Replaced window.confirm with a custom modal/messagebox for better UX
  const handleDelete = async (menuId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this menu?"
    ); // Replace with custom modal later
    if (confirmDelete) {
      await dispatch(deleteMenu(menuId));
      dispatch(fetchMenus(restaurantId));
    }
  };

  const handleUpdateClick = (menu) => {
    setSelectedMenu(menu);
    setShowUpdateModal(true);
  };

  const handleAddItemClick = (menu) => {
    setSelectedMenu(menu);
    setShowAddItemModal(true);
  };

  // Replaced window.confirm with a custom modal/messagebox for better UX
  const handleDeleteItem = async (itemId) => {
    const confirmDelete = window.confirm("Delete this menu item?"); // Replace with custom modal later
    if (confirmDelete) {
      await dispatch(deleteMenuItem(itemId));
      dispatch(fetchMenus(restaurantId));
    }
  };

  const handleEditItem = (item) => {
    setItemToEdit(item);
  };

  if (loading)
    return <div className="ml-loading-message">Loading menus...</div>;
  if (error)
    return <div className="ml-error-message">Error: {error.message}</div>;

  return (
    <div className="ml-container">
      {" "}
      {/* Changed from menu-list-container to ml-container */}
      <h2>Menus</h2>
      {menus.length === 0 ? (
        <p className="ml-no-menus-found">
          No menus found. Create one to get started.
        </p>
      ) : (
        <div className="ml-menus-grid">
          {menus.map((menu) => (
            <div key={menu.id} className="ml-menu-card">
              <div className="ml-menu-header">
                {" "}
                {/* Changed to ml-menu-header */}
                <h3 className="ml-menu-title">{menu.name}</h3>{" "}
                {/* Changed to ml-menu-title */}
                <p className="ml-menu-description">{menu.description}</p>{" "}
                {/* Changed to ml-menu-description */}
              </div>

              <MenuItemsList
                items={menu.items}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
              />

              <div className="ml-menu-actions">
                {/* Conditional rendering for role 2 (Staff) to show Edit and Add Item buttons */}
                {role === 2 ? (
                  <button
                    onClick={() => handleUpdateClick(menu)}
                    className="ml-action-btn ml-update-menu-btn"
                  >
                    Edit Menu
                  </button>
                ) : (
                  ""
                )}

                {role === 2 ? (
                  <button
                    onClick={() => handleAddItemClick(menu)}
                    className="ml-action-btn ml-add-item-to-menu-btn"
                  >
                    Add Item
                  </button>
                ) : (
                  ""
                )}
                {/* Delete button is available to all roles */}
                <button
                  onClick={() => handleDelete(menu.id)}
                  className="ml-action-btn ml-delete-menu-btn"
                >
                  Delete Menu
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showUpdateModal && (
        <UpdateMenuModal
          menu={selectedMenu}
          onClose={() => setShowUpdateModal(false)}
          restaurantId={restaurantId}
        />
      )}
      {showAddItemModal && (
        <AddMenuItemModal
          menu={selectedMenu}
          onClose={() => setShowAddItemModal(false)}
        />
      )}
      {itemToEdit && (
        <UpdateMenuItemModal
          item={itemToEdit}
          onClose={() => setItemToEdit(null)}
        />
      )}
    </div>
  );
};

export default MenuList;
