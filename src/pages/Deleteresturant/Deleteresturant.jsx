import "./Deleteresturant.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteRestaurant } from "../../actions/resturantsActions";

const Deleteresturant = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const restaurant = state?.restaurant;

  if (!restaurant) {
    return (
      <div className="deleteresturant-page">
        <div className="deleteresturant-input-card">
          <div className="deleteresturant-card-content">
            <p>Error: No restaurant data provided.</p>
            <button onClick={() => navigate("/ShowRestaurant")}>
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteRestaurant(restaurant.id));
      alert("Restaurant deleted successfully.");
      navigate("/Show");
    } catch (error) {
      alert("Failed to delete the restaurant.");
    }
  };

  return (
    <div className="deleteresturant-page">
      <div className="deleteresturant-input-card">
        <div className="deleteresturant-card-content">
          <div className="deleteresturant-card-title">Delete Restaurant</div>
          <p>
            Are you sure you want to delete <strong>{restaurant.name}</strong>?
          </p>

          <div className="deleteresturant-buttons">
            <button
              className="deleteresturant-submit-button"
              onClick={handleConfirmDelete}
            >
              Confirm Delete
            </button>
            <button
              className="deleteresturant-cancel-button"
              onClick={() => navigate("/Show")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deleteresturant;
