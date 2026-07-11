import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addOrUpdateReview,
  getUserReview,
  deleteReview,
} from "../../actions/reviewActions/reviewActions";

const ReviewForm = ({ restaurantId }) => {
  const dispatch = useDispatch();
  const { userReview, loading, error } = useSelector((state) => state.review);

  const [text, setText] = useState("");

  useEffect(() => {
    dispatch(getUserReview(restaurantId));
  }, [restaurantId, dispatch]);

  useEffect(() => {
    if (userReview) {
      setText(userReview);
    } else {
      setText("");
    }
  }, [userReview]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;
    dispatch(addOrUpdateReview(restaurantId, { review: text }));
  };

  const handleDelete = () => {
    dispatch(deleteReview(restaurantId));
  };

  return (
    <div className="review-form">
      <h3 className="review-title">Write Your Review</h3>
      {error && <p className="review-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          className="review-textarea"
          rows="4"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Share your experience..."
        />
        <div className="review-actions">
          <button
            type="submit"
            disabled={loading}
            className="review-submit-btn"
          >
            {userReview ? "Update Review" : "Submit Review"}
          </button>
          {userReview && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="review-delete-btn"
            >
              Delete Review
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
