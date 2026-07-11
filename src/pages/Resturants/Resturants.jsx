import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Heart, HeartOff, Star, Search, Filter } from "lucide-react";
import RatingModal from "../../components/RatingModal/RatingModal"; // Adjust path if moved
import MapDisplayModal from "../../components/MapDisplayModal/MapDisplayModal"; // NEW: Import MapDisplayModal
import "./Resturants.css"; 
import {
  fetchRestaurants,
  searchRestaurants,
} from "../../actions/resturantsActions";

const Resturants = () => {
  const dispatch = useDispatch();
  const { filteredRestaurants, loading, error } = useSelector(
    (state) => state.restaurants
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    ratings: "",
    type: "",
    cuisine_type: "",
  });

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRestaurantToRate, setSelectedRestaurantToRate] =
    useState(null); 
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedRestaurantForMap, setSelectedRestaurantForMap] =
    useState(null);

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(searchRestaurants({ ...filters, query: searchQuery }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    dispatch(searchRestaurants({ ...filters, query: searchQuery }));
    setShowFilters(false);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({
      ratings: "",
      type: "",
      cuisine_type: "",
    });
    dispatch(fetchRestaurants());
    setShowFilters(false);
  };

  const handleRateClick = (restaurant) => {
    setSelectedRestaurantToRate(restaurant);
    setShowRatingModal(true);
    document.body.style.overflow = "hidden"; 
  };

  const closeRatingModal = () => {
    setSelectedRestaurantToRate(null);
    setShowRatingModal(false);
    document.body.style.overflow = "unset"; 
    dispatch(fetchRestaurants()); 
  };

  const handleViewOnMapClick = (restaurant) => {
    setSelectedRestaurantForMap(restaurant);
    setShowMapModal(true);
    document.body.style.overflow = "hidden"; 
  };

  const closeMapModal = () => {
    setSelectedRestaurantForMap(null);
    setShowMapModal(false);
    document.body.style.overflow = "unset";
  };

  const cuisineOptions = [
    "Italian",
    "Mexican",
    "Chinese",
    "Japanese",
    "Indian",
    "French",
    "Thai",
    "Mediterranean",
    "American",
    "Vegetarian",
  ];

  const baseURL = "http://localhost:8000";

  if (loading)
    return <div className="loading-message">Loading restaurants...</div>;
  if (error) return <div className="error-message">Error: {error.message}</div>;

  return (
    <div className="restaurants-page">
      <div className="restaurants-header">
        <h1>Discover Restaurants</h1>
        <p>Find the perfect dining experience</p>
      </div>

      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for restaurants..."
              className="search-input"
            />
            <button
              type="button"
              className="filter-toggle-button"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} /> Filters
            </button>
            <button type="submit" className="search-button">
              Search
            </button>
          </div>
        </form>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label htmlFor="min-rating">Minimum Rating</label>
              <select
                id="min-rating"
                name="ratings"
                value={filters.ratings}
                onChange={handleFilterChange}
              >
                <option value="">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="restaurant-type">Restaurant Type</label>
              <select
                id="restaurant-type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">Any Type</option>
                <option value="Fine Dining">Fine Dining</option>
                <option value="Casual">Casual</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Cafe">Cafe</option>
                <option value="Buffet">Buffet</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="cuisine-type">Cuisine Type</label>
              <select
                id="cuisine-type"
                name="cuisine_type"
                value={filters.cuisine_type}
                onChange={handleFilterChange}
              >
                <option value="">Any Cuisine</option>
                {cuisineOptions.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-actions">
              <button
                type="button"
                onClick={applyFilters}
                className="apply-filters-button"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="reset-filters-button"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="restaurants-grid">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <div className="restaurant-card" key={restaurant.id}>
              <div className="card-image-container">
                <img
                  src={
                    `${baseURL}${restaurant.image_path.replace(/\\/g, "/")}`}
                  alt={restaurant.name}
                  className="restaurant-image"
                />
               
              </div>

              <div className="card-content">
                <div className="restaurant-info">
                  <h3>{restaurant.name}</h3>
                  <p className="cuisine-type">{restaurant.cuisine_type}</p>
                  <div className="restaurant-meta">
                    <span className="restaurant-type">{restaurant.type}</span>
                    <span className="restaurant-location">
                      {restaurant.location}
                    </span>
                  </div>
                </div>

                <div className="rating-container">
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={
                          star <=
                          Math.floor(
                            Number(restaurant.user_rates_avg_rate) || 0
                          )
                            ? "star filled"
                            : "star"
                        }
                      />
                    ))}
                  </div>
                  <span className="rating-value">
                    {restaurant.user_rates_avg_rate
                      ? Number(restaurant.user_rates_avg_rate).toFixed(1)
                      : restaurant.ratings}
                  </span>
                </div>

                <div className="card-buttons">
                  <div className="card-flex">
                 <button
                    className="rate-button"
                    onClick={() => handleRateClick(restaurant)}
                  >
                    Rate
                  </button>
                  <button
                    className="view-on-map-button"
                    onClick={() => handleViewOnMapClick(restaurant)}
                  >
                    View on Map
                  </button>

                  </div>
                  
                  <Link
                    to={`/restaurants/${restaurant.id}`}
                    className="button-link"
                  >
                    <button className="view-details-button">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <h3>No restaurants found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedRestaurantToRate && (
        <RatingModal
          restaurantId={selectedRestaurantToRate.id}
          restaurantName={selectedRestaurantToRate.name}
          onClose={closeRatingModal}
        />
      )}

      {/* NEW: Map Display Modal */}
      {showMapModal && selectedRestaurantForMap && (
        <MapDisplayModal
          restaurant={selectedRestaurantForMap}
          onClose={closeMapModal}
        />
      )}
    </div>
  );
};

export default Resturants;
