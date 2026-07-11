import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Loader, AlertCircle } from "lucide-react";
import { AddResMenu } from "../../pages"; // Assuming AddResMenu is a component directly
import MenuList from "../MenuList/MenuList";
import "./ManageRestaurantMenus.css";
const ManageRestaurantMenus = () => {
  const managerRestaurantId = useSelector(
    (state) => state.authReducer?.authData?.data?.restaurants?.[0]?.id || null
  );

  if (!managerRestaurantId) {
    return (
      <div className="loading-message">
        <AlertCircle className="icon" size={28} /> Restaurant ID not found.
        Please log in as a restaurant manager.
      </div>
    );
  }

  return (
    <div className="page-container manager-menus-page">
      <h1 className="page-title">Manage Menus for Your Restaurant</h1>
      <p className="page-description">
        Here you can add new menus, edit existing ones, and manage the items
        within each menu.
      </p>

      <div className="menu-list-container">
        <h2>Your Restaurant Menus</h2>
        <MenuList restaurantId={managerRestaurantId} />
      </div>

      <div className="add-res-menu-container">
        <h2>Add New Menu</h2>
        <AddResMenu restaurantId={managerRestaurantId} />
      </div>
    </div>
  );
};

export default ManageRestaurantMenus;
