import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Favorite.css"; // Import the CSS file

// Function to get favorites from localStorage
const getFavoritesFromStorage = () => {
  const favorites = localStorage.getItem("favoriteRestaurants");
  return favorites ? JSON.parse(favorites) : [];
};

// Function to save favorites to localStorage
const saveFavoritesToStorage = (favorites) => {
  localStorage.setItem("favoriteRestaurants", JSON.stringify(favorites));
};

const Favorite = () => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites on component mount
  useEffect(() => {
    const storedFavorites = getFavoritesFromStorage();
    setFavorites(storedFavorites);
  }, []);

  // Function to remove a restaurant from favorites
  const handleRemoveFavorite = (id) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(updatedFavorites);
    saveFavoritesToStorage(updatedFavorites);
  };

  return (
    <div className="favorite-page">
      <h1 className="favorite-title">Favorite Restaurants</h1>
      <p className="favorite-subtitle">Your list of favorite restaurants</p>

      {favorites.length === 0 ? (
        <div className="favorite-empty">
          <h2>You haven't added any restaurants to your favorites yet!</h2>
          <p>Start browsing restaurants and add your favorites for easy access later.</p>
          <Link to="/Resturants">
            <button className="browse-button">Browse Restaurants</button>
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((restaurant) => (
            <div key={restaurant.id} className="favorite-card">
              {/* This button removes from the favorite page itself */}
              <button 
                className="favorite-button" 
                onClick={() => handleRemoveFavorite(restaurant.id)}
                title="Remove from Favorites"
              >
                ❤️
              </button>
              <img
                src={restaurant.image || '/src/assets/resturant_placeholder.jpg'} 
                alt={restaurant.name}
                className="favorite-image"
              />
              <h2>{restaurant.name}</h2>
              <p>{restaurant.title || restaurant.cuisine}</p>
              <div className="card-buttons">
                 <Link to={`/Resturants/${restaurant.id}`}>
                    <button className="view-button">View Details</button>
                 </Link>
                 <button 
                   className="remove-button" 
                   onClick={(e) => {
                     e.preventDefault();
                     handleRemoveFavorite(restaurant.id);
                   }}
                 >
                   Remove
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorite;
