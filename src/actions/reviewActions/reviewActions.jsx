import axiosClient from "../../../axios-client";

// ADD OR UPDATE REVIEW
export const addOrUpdateReview =
  (restaurantId, reviewData) => async (dispatch) => {
    dispatch({ type: "ADD_REVIEW_START" });
    try {
      const { data } = await axiosClient.post(
        `/review-restaurant/${restaurantId}`,
        reviewData
      );
      dispatch({ type: "ADD_REVIEW_SUCCESS", payload: data.review });
    } catch (error) {
      dispatch({
        type: "ADD_REVIEW_FAIL",
        error: error.response?.data?.message || error.message,
      });
    }
  };

// GET USER REVIEW
export const getUserReview = (restaurantId) => async (dispatch) => {
  dispatch({ type: "GET_REVIEW_START" });
  try {
    const { data } = await axiosClient.get(
      `/restaurant/${restaurantId}/user-review`
    );
    dispatch({ type: "GET_REVIEW_SUCCESS", payload: data.review });
  } catch (error) {
    dispatch({
      type: "GET_REVIEW_FAIL",
      error: error.response?.data?.message || error.message,
    });
  }
};

// DELETE REVIEW
export const deleteReview = (restaurantId) => async (dispatch) => {
  dispatch({ type: "DELETE_REVIEW_START" });
  try {
    await axiosClient.delete(`/restaurant/${restaurantId}/delete-review`);
    dispatch({ type: "DELETE_REVIEW_SUCCESS" });
  } catch (error) {
    dispatch({
      type: "DELETE_REVIEW_FAIL",
      error: error.response?.data?.message || error.message,
    });
  }
};
