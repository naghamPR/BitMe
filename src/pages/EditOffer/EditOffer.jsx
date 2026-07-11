import "./EditOffer.css";
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const EditOffer = () => {
  const { offerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialOfferData = location.state?.offer || {
    id: offerId || Date.now(),
    offerName: "Sample Offer",
    description: "Sample Description",
    discountPercentage: "10",
    validUntil: "2025-12-31",
  };

  const [offerData, setOfferData] = useState(initialOfferData);

  useEffect(() => {
    if (offerId && !location.state?.offer) {
      console.log("Fetching offer data for ID:", offerId);
    }
  }, [offerId, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfferData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Updating offer:", offerData.id, offerData);
    alert("Offer updated successfully! (Placeholder)");
    navigate("/Stafhom");
  };

  return (
    <div className="edite-offer-page">
      <div className="input-card-editeoffer">
        <div className="card-content-editeoffer">
          <div className="card-editeoffer-title">
            Edit Offer #{offerData.id}
          </div>
          <input
            className="input-field7"
            type="text"
            name="offerName"
            placeholder="Offer Name"
            value={offerData.offerName}
            onChange={handleChange}
          />
          <textarea
            className="input-field7 textarea-field"
            name="description"
            placeholder="Offer Description"
            value={offerData.description}
            onChange={handleChange}
          />
          <input
            className="input-field7"
            type="number"
            name="discountPercentage"
            placeholder="Discount Percentage"
            value={offerData.discountPercentage}
            onChange={handleChange}
          />
          <input
            className="input-field7"
            type="date"
            name="validUntil"
            placeholder="Valid Until"
            value={offerData.validUntil}
            onChange={handleChange}
          />
          <button className="submit-editeoffer-button" onClick={handleSubmit}>
            Update Offer
          </button>
        </div>
      </div>

      {/* Image moved outside the card */}
      <div className="editeoffer-floating-img"></div>
    </div>
  );
};

export default EditOffer;
