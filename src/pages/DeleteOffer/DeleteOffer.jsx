import "./DeleteOffer.css";
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const DeleteOffer = () => {
  const { offerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const offerToDelete = location.state?.offer || {
    id: offerId || Date.now(),
    offerName: "Sample Offer",
    description: "Sample Description",
    discountPercentage: "10",
    validUntil: "2025-12-31",
  };

  const [offerData, setOfferData] = useState(offerToDelete);

  useEffect(() => {
    if (offerId && !location.state?.offer) {
      console.log("Fetching offer data for deletion confirmation:", offerId);
      // Placeholder: fetchOfferById(offerId).then(data => setOfferData(data));
    }
  }, [offerId, location.state]);

  const handleDelete = () => {
    console.log("Deleting offer:", offerData.id);
    alert(`Offer #${offerData.id} deleted successfully! (Placeholder)`);
    navigate("/Stafhom");
  };

  const handleCancel = () => {
    navigate("/Stafhom");
  };

  return (
    <div className="delete-offer-page">
      <div className="delete-offer-container">
        <div className="input-card-delete-offer">
          <div className="card-content-delete-offer">
            <div className="card-delete-offer-title">
              Confirm Offer Deletion
            </div>
            {offerData ? (
              <div className="offer-item-details-summary">
                <p>Are you sure you want to delete the following offer?</p>
                <p>
                  <strong>Offer ID:</strong> {offerData.id}
                </p>
                <p>
                  <strong>Name:</strong> {offerData.offerName}
                </p>
                <p>
                  <strong>Description:</strong> {offerData.description}
                </p>
                <p>
                  <strong>Discount:</strong> {offerData.discountPercentage}%
                </p>
                <p>
                  <strong>Valid Until:</strong> {offerData.validUntil}
                </p>
              </div>
            ) : (
              <p>Loading offer details...</p>
            )}
            <div className="confirmation-buttons">
              <button className="delete-button" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
        <div className="delete-offer-card-img"></div>
      </div>
    </div>
  );
};

export default DeleteOffer;
