import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import NotificationBell from "../fetchNotifications/NotificationBell";
import { Menu, X } from "lucide-react"; 

import "./NavBar.css";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  const userAuthData = useSelector(
    (state) => state?.authReducer?.authData?.data || null
  );
  const role = userAuthData?.role;

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" onClick={handleLinkClick}>BiteBook</Link> 
      </div>

      <div className="menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
      </div>

      <div className="navbar-links desktop-links">
        <NotificationBell />
        {role === 1 && <Link to="/">Home</Link>}
        {role === 1 && <Link to="/MyWaitlist">Wait list</Link>}
        {role === 1 && <Link to="/my-ratings">My Ratings</Link>}
        <Link to="/Resturants">Restaurants</Link>
        {role === 1 && <Link to="/MyEventBookings">My Event</Link>}
        {role === 1 && <Link to="/my-orders">My Orders</Link>}
        {role === 0 && <Link to="/Managerhom">Manager Home</Link>}
        {role === 2 && <Link to="/Stafhom">Staff Home</Link>}
        {role === 2 && <Link to="/RestaurantProfile">Profile</Link>}
        {role === 2 && <Link to="/RestaurantEvents">My Events</Link>}
        {userAuthData === null ? (
          <Link to="/login">Login</Link>
        ) : (
          <Link to="/logout" className="logout-link">
            Logout
          </Link>
        )}
      </div>

      {isMobileMenuOpen && (
        <div className="navbar-mobile-overlay">
          <div className="navbar-mobile-links">
            <button className="mobile-menu-close-button" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={32} />
            </button>
            <NotificationBell onClick={handleLinkClick} /> {/* Close menu after notification click */}
            {role === 1 && <Link to="/" onClick={handleLinkClick}>Home</Link>}
            {role === 1 && <Link to="/MyWaitlist" onClick={handleLinkClick}>Wait list</Link>}
            {role === 1 && <Link to="/my-ratings" onClick={handleLinkClick}>My Ratings</Link>}
            <Link to="/Resturants" onClick={handleLinkClick}>Restaurants</Link>
            {role === 1 && <Link to="/MyEventBookings" onClick={handleLinkClick}>My Event</Link>}
            {role === 1 && <Link to="/my-orders" onClick={handleLinkClick}>My Orders</Link>}
            {role === 0 && <Link to="/Managerhom" onClick={handleLinkClick}>Manager Home</Link>}
            {role === 2 && <Link to="/Stafhom" onClick={handleLinkClick}>Staff Home</Link>}
            {role === 2 && <Link to="/RestaurantProfile" onClick={handleLinkClick}>Profile</Link>}
            {role === 2 && <Link to="/RestaurantEvents" onClick={handleLinkClick}>My Events</Link>}
            {userAuthData === null ? (
              <Link to="/login" onClick={handleLinkClick}>Login</Link>
            ) : (
              <Link to="/logout" className="logout-link" onClick={handleLinkClick}>
                Logout
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;