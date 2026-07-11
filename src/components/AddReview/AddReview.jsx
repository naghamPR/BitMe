import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import {
//   addOrUpdateReview,
//   deleteReview,
//   getUserReview,
// } from "../../actions/ratingsActions";

const AddReview = ({ restaurantId }) => {
  // const dispatch = useDispatch();
  // const { userReview } = useSelector((state) => state.rating);
  // const [text, setText] = useState("");

  // useEffect(() => {
  //   dispatch(getUserReview(restaurantId));
  // }, [restaurantId, dispatch]);

  // useEffect(() => {
  //   if (userReview) setText(userReview);
  // }, [userReview]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   dispatch(addOrUpdateReview(restaurantId, { review: text }));
  // };

  // const handleDelete = () => {
  //   dispatch(deleteReview(restaurantId));
  //   setText("");
  // };

  return (
    <div>
      {/* <h3>Your Review</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="4"
        cols="50"
        placeholder="Write your review here..."
      />
      <div>
        <button onClick={handleSubmit}>Submit Review</button>
        {userReview && <button onClick={handleDelete}>Delete Review</button>}
      </div> */}
    </div>
  );
};

export default AddReview;
