import React, { useState, useEffect } from "react";
import { X, Star, Loader, CheckCircle, AlertCircle } from "lucide-react";
import {
  getUserRatingForRestaurant,
  rateRestaurant,
  unrateRestaurant,
} from "../../actions/ratingsActions";
import "./RatingModal.css"; // Component-specific CSS

const RatingModal = ({ restaurantId, restaurantName, onClose }) => {
  const [currentRating, setCurrentRating] = useState(0); // User's selected rating
  const [userExistingRating, setUserExistingRating] = useState(null); // Rating fetched from backend
  const [userExistingReview, setUserExistingReview] = useState(""); // State to store existing review from backend
  const [loading, setLoading] = useState(true);
  console.log(userExistingReview)
  const [error, setError] = useState(null);
  const [submissionMessage, setSubmissionMessage] = useState({
    type: "",
    text: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const [reviewText, setReviewText] = useState(""); 

  useEffect(() => {
    const fetchRatingAndReview = async () => { 
      setLoading(true);
      setError(null);
      try {
        // Assuming getUserRatingForRestaurant now returns an object like { rating: 4, review: "Great food!" }
        const data = await getUserRatingForRestaurant(restaurantId);

        // Update states based on fetched data
        setUserExistingRating(data?.rating || null);
        setUserExistingReview(data?.review || ""); // Set existing review
        setCurrentRating(data?.rating || 0); // Set current rating to existing or 0 if none
        setReviewText(data?.review || ""); // Initialize reviewText with existing review
      } catch (err) {
        setError(err.message || "Failed to fetch your current rating and review.");
        console.error("Error fetching user rating and review:", err);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchRatingAndReview();
    }
  }, [restaurantId]);

  const handleStarClick = (ratingValue) => {
    setCurrentRating(ratingValue);
    // Optionally clear review text if rating is set to 0, or keep it if they're editing
    if (ratingValue === 0) {
      setReviewText("");
    }
  };

  const handleReviewChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleSubmitRating = async () => {
    setSubmitting(true);
    setSubmissionMessage({ type: "", text: "" });
    setError(null);

    if (currentRating === 0) {
      setSubmissionMessage({
        type: "error",
        text: "Please select a star rating.",
      });
      setSubmitting(false);
      return;
    }

    try {
      const response = await rateRestaurant(restaurantId, currentRating, reviewText);
      setSubmissionMessage({
        type: "success",
        text: response.message || "Rating submitted!",
      });
      setUserExistingRating(currentRating); // Update existing rating state
      setUserExistingReview(reviewText); // Update existing review state
      setTimeout(onClose, 1500); // Close after showing success message
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit rating.";
      setSubmissionMessage({ type: "error", text: msg });
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnrate = async () => {
    setSubmitting(true);
    setSubmissionMessage({ type: "", text: "" });
    setError(null);
    try {
      const response = await unrateRestaurant(restaurantId);
      setSubmissionMessage({
        type: "success",
        text: response.message || "Rating removed!",
      });
      setUserExistingRating(null); // Clear existing rating
      setCurrentRating(0); // Reset stars
      setReviewText(""); // Clear review text
      setUserExistingReview(""); // Clear existing review
      setTimeout(onClose, 3000); // Close after showing success message
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to remove rating.";
      setSubmissionMessage({ type: "error", text: msg });
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="rating-modal-overlay open">
        <div className="rating-modal-content">
          <Loader className="spinner" size={32} />
          <p>Loading your rating...</p>
        </div>
      </div>
    );
  if (error && !submissionMessage.text)
    return (
      // Only show if general fetch error and no submission error
      <div className="rating-modal-overlay open" onClick={onClose}>
        <div className="rating-modal-content">
          <button className="rating-modal-close-button" onClick={onClose}>
            <X size={24} />
          </button>
          <p className="rating-modal-error-message">
            <AlertCircle size={20} /> {error}
          </p>
          <button
            className="rating-modal-action-btn rating-modal-cancel-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );

  return (
    <div className="rating-modal-overlay open" onClick={onClose}>
      <div
        className="rating-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="rating-modal-close-button" onClick={onClose}>
          <X size={24} />
        </button>
        <h3 className="rating-modal-title">Rate {restaurantName}</h3>

        <div className="rating-stars-container">
          {[1, 2, 3, 4, 5].map((starValue) => (
            <Star
              key={starValue}
              size={40}
              className={`rating-star ${
                starValue <= currentRating ? "filled" : ""
              }`}
              onClick={() => handleStarClick(starValue)}
            />
          ))}
        </div>

        {currentRating > 0 && (
          <p className="selected-rating-text">
            You selected: {currentRating} Stars
          </p>
        )}

        {/* Review Textarea Field - conditionally displayed */}
        {currentRating > 0 && (
          <div className="review-input-container">
            <label htmlFor="review-text">Your Review (Optional):</label>
            <textarea
              id="review-text"
              className="review-textarea"
              value={reviewText}
              onChange={handleReviewChange}
              placeholder="Share your experience (e.g., 'Delicious food and great service!')..."
              rows="4" // You can adjust the number of rows
            ></textarea>
          </div>
        )}

        {submissionMessage.text && (
          <p className={`rating-modal-message ${submissionMessage.type}`}>
            {submissionMessage.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}{" "}
            {submissionMessage.text}
          </p>
        )}

        <div className="rating-modal-actions">
          <button
            className="rating-modal-action-btn rating-modal-submit-btn"
            onClick={handleSubmitRating}
            disabled={submitting || currentRating === 0}
          >
            {submitting ? (
              <>
                <Loader className="spinner" size={20} /> Submitting...
              </>
            ) : userExistingReview ? (
              "Update Rating"
            ) : (
              "Submit Rating"
            )}
          </button>

          {userExistingRating !== null && (
            <button
              className="rating-modal-action-btn rating-modal-unrate-btn"
              onClick={handleUnrate}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader className="spinner" size={20} /> Removing...
                </>
              ) : (
                "Remove Rating"
              )}
            </button>
          )}

          <button
            className="rating-modal-action-btn rating-modal-cancel-btn"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;