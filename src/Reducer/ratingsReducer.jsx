const initialState = {
  userRating: null,
  userReview: null,
  loading: false,
  error: null,
};

const ratingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RATE_RESTAURANT_START":
    case "ADD_REVIEW_START":
    case "UNRATE_RESTAURANT_START":
    case "DELETE_REVIEW_START":
      return { ...state, loading: true, error: null };

    case "RATE_RESTAURANT_SUCCESS":
      return { ...state, loading: false, userRating: action.payload };

    case "ADD_REVIEW_SUCCESS":
      return { ...state, loading: false, userReview: action.payload };

    case "UNRATE_RESTAURANT_SUCCESS":
      return { ...state, loading: false, userRating: null };

    case "DELETE_REVIEW_SUCCESS":
      return { ...state, loading: false, userReview: null };

    case "RATE_RESTAURANT_FAIL":
    case "ADD_REVIEW_FAIL":
    case "UNRATE_RESTAURANT_FAIL":
    case "DELETE_REVIEW_FAIL":
      return { ...state, loading: false, error: action.error };

    case "GET_USER_RATING_SUCCESS":
      return { ...state, userRating: action.payload };

    case "GET_USER_REVIEW_SUCCESS":
      return { ...state, userReview: action.payload };

    default:
      return state;
  }
};

export default ratingReducer;
