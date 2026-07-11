import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Loader, AlertCircle } from "lucide-react";
// import '../Resturants/Resturants.css'; // Use global styles for consistency
import { useSelector } from "react-redux";
import axiosClient from "../../../axios-client";
import "./MyRatedRestaurantsPage.css";

const MyRatedRestaurantsPage = () => {
  const [ratedRestaurants, setRatedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const USER_ID = useSelector((state) => state.authReducer.authData.data.id);
  useEffect(() => {
    const fetchRatedRestaurants = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get(`/user-ratings`);
        if (response.data.success) {
          setRatedRestaurants(response.data.data);
        } else {
          setError(
            response.data.message || "Failed to fetch rated restaurants."
          );
        }
      } catch (err) {
        setError(err.message || "Network error fetching rated restaurants.");
        console.error("Error fetching rated restaurants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRatedRestaurants();
  }, []);

  const baseURL = "http://localhost:8000";
  if (loading)
    return (
      <div className="loading-message">Loading your rated restaurants...</div>
    );
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="my-rated-restaurants-page">
      <div className="my-rated-restaurants-header">
        <h1>My Rated Restaurants</h1>
        <p>Review the restaurants you've rated.</p>
      </div>

      {ratedRestaurants.length === 0 ? (
        <div className="no-ratings-found">
          <h3>No ratings found</h3>
          <p>You haven't rated any restaurants yet.</p>
          <Link to="/" className="action-button">
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <div className="restaurants-grid">
          {ratedRestaurants.map((ratingItem) => (
            <div key={ratingItem.restaurant_id} className="restaurant-card">
              <div className="card-image-container">
                <img
                  src={
                    ratingItem.restaurant_image_path
                      ? `${baseURL}${ratingItem.restaurant_image_path.replace(
                          /\\/g,
                          "/"
                        )}`
                      : "/default-restaurant.jpg"
                  }
                  alt={ratingItem.restaurant_name}
                  className="restaurant-image"
                />
              </div>

              <div className="card-content">
                <div className="restaurant-info">
                  <h3>{ratingItem.restaurant_name}</h3>
                  <p className="cuisine-type">
                    {ratingItem.restaurant_cuisine_type}
                  </p>
                  <div className="restaurant-meta">
                    <span className="restaurant-location">
                      {ratingItem.restaurant_location}
                    </span>
                  </div>
                </div>

                <div className="rating-container">
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={
                          star <= (Number(ratingItem.rating) || 0)
                            ? "star filled"
                            : "star"
                        }
                      />
                    ))}
                  </div>
                  <span className="rating-value">
                    {ratingItem.rating !== null &&
                    ratingItem.rating !== undefined
                      ? Number(ratingItem.rating).toFixed(1) // Ensure it's a number before toFixed
                      : "N/A"}
                  </span>
                </div>

                <div className="card-buttons">
                  <Link
                    to={`/restaurants/${ratingItem.restaurant_id}`}
                    className="button-link"
                  >
                    <button className="view-details-button">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRatedRestaurantsPage;
