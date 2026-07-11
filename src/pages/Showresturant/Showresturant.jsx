import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurants } from "../../actions/resturantsActions";
import ViewDiscountsModal from "../../components/ViewDiscountsModal/ViewDiscountsModal";
import { useNavigate } from "react-router-dom";
import MenuList from "../../components/MenuList/MenuList";
import './ShowRestaurant.css'

const ShowRestaurant = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expandedRestaurant, setExpandedRestaurant] = useState(null);
  const [viewingDiscountsFor, setViewingDiscountsFor] = useState(null);

  const { allRestaurants, loading, error } = useSelector(
    (state) => state.restaurants
  );

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const handleDelete = (restaurant) => {
    navigate("/Deleteresturant", { state: { restaurant } });
  };


  const toggleMenuView = (restaurantId) => {
    setExpandedRestaurant(expandedRestaurant === restaurantId ? null : restaurantId);
  };

  const baseURL = "http://localhost:8000";

  if (loading) return <p className="loading-message">Loading restaurants...</p>;
  if (error) return <p className="error-message">Error loading restaurants: {error.message || error}</p>;

  return (
    <div className="page-container">
      <h1 className="page-title">All Restaurants</h1>
      <div className="card-grid">
        {allRestaurants && allRestaurants.length > 0 ? (
          allRestaurants.map((restaurant) => (
            <div className="restaurant-card show-restaurant-card" key={restaurant.id}>
              <img
                src={
                  restaurant.image_path
                    ? `${baseURL}${restaurant.image_path.replace(/\\/g, '/')}`
                    : "/default-restaurant.jpg"
                }
                alt={restaurant.name}
                className="restaurant-image"
              />
              <div className="card-content-show-restaurant">
                <h2>{restaurant.name}</h2>
                <p className="restaurant-description">
                  {restaurant.description ||
                    restaurant.type ||
                    "No description available"}
                </p>
                <div className="card-actions-show-restaurant">
                  <button
                    className="action-button delete-btn"
                    onClick={() => handleDelete(restaurant)}
                  >
                    Delete
                  </button>
                </div>

                  <button
                    className="view-discounts-btn"
                    style={{ marginTop: "0.5rem" }}
                    onClick={() => setViewingDiscountsFor(restaurant.id)}
                  >
                  View Discounts
                </button>
                <button
                  className="view-menus-toggle-btn"
                  onClick={() => toggleMenuView(restaurant.id)}
                >
                  {expandedRestaurant === restaurant.id ? "Hide Menus" : "View Menus"}
                </button>
                {expandedRestaurant === restaurant.id && (
                  <div >
                    <MenuList restaurantId={restaurant.id} />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-restaurants-found">No restaurants found.</p>
        )}
      </div>
      {viewingDiscountsFor && (
        <ViewDiscountsModal
          restaurantId={viewingDiscountsFor}
          onClose={() => setViewingDiscountsFor(null)}
        />
      )}
    </div>
  );
};
export default ShowRestaurant;