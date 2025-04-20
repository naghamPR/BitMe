// ResturantsDetails.jsx
import "./ResturantsDetails.css";

const ResturantsDetails = () => {
  return (
    <div className="restaurant-details-page">
      <div className="details-content">
        <h1 className="details-title">Restaurant Details</h1>
        <p className="details-description">
          Here you can view all the information about the selected restaurant.
        </p>
        <button className="back-button">Go Back</button>
      </div>
    </div>
  );
};

export default ResturantsDetails;
