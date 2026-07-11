import axiosClient from "../../axios-client";

export const addOrUpdateReview =
  (restaurantId, reviewData) => async (dispatch) => {
    dispatch({ type: "ADD_REVIEW_START" });
    try {
      const { data } = await axiosClient.post(
        `/review-restaurant/${restaurantId}`,
        reviewData
      );
      dispatch({ type: "ADD_REVIEW_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "ADD_REVIEW_FAIL", error });
    }
  };
export const getRestaurantRatings = (restaurantId) => async (dispatch) => {
    dispatch({ type: 'FETCH_RESTAURANT_RATINGS_START' });
    try {
        const response = await axiosClient.get(`/restaurant/${restaurantId}/ratings`);
        if (response.data.success) {
            dispatch({ type: 'FETCH_RESTAURANT_RATINGS_SUCCESS', payload: response.data.data });
        } else {
            throw new Error(response.data.message || 'Failed to fetch restaurant ratings.');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch restaurant ratings.';
        dispatch({ type: 'FETCH_RESTAURANT_RATINGS_FAIL', error: errorMessage });
        console.error("Error fetching restaurant ratings:", error.response?.data || error.message);
    }
};

export const FETCH_USER_RATING_START = 'FETCH_USER_RATING_START';
export const FETCH_USER_RATING_SUCCESS = 'FETCH_USER_RATING_SUCCESS';
export const FETCH_USER_RATING_FAIL = 'FETCH_USER_RATING_FAIL';

export const RATE_RESTAURANT_START = 'RATE_RESTAURANT_START';
export const RATE_RESTAURANT_SUCCESS = 'RATE_RESTAURANT_SUCCESS';
export const RATE_RESTAURANT_FAIL = 'RATE_RESTAURANT_FAIL';

export const UNRATE_RESTAURANT_START = 'UNRATE_RESTAURANT_START';
export const UNRATE_RESTAURANT_SUCCESS = 'UNRATE_RESTAURANT_SUCCESS';
export const UNRATE_RESTAURANT_FAIL = 'UNRATE_RESTAURANT_FAIL';

// Action Creators (these functions will be called from components)

export const getUserRatingForRestaurant = async (restaurantId) => {
    try {
        const response = await axiosClient.get(`/restaurant/${restaurantId}/user-rating`);
        // return response.data.rating;
        return { rating: response.data.rate, review: response.data.review || "" };
    } catch (error) {
        console.error(`Error fetching user rating for restaurant ${restaurantId}:`, error);
        throw error;
    }
};

export const rateRestaurant = async (restaurantId, ratingValue,reviewText) => {
    try {
        const response = await axiosClient.post(`/rate-restaurant/${restaurantId}`, { rate: ratingValue,review:reviewText });
        return response.data; // Returns success message and rating
    } catch (error) {
        console.error(`Error rating restaurant ${restaurantId}:`, error.response?.data || error.message);
        throw error;
    }
};

export const unrateRestaurant = async (restaurantId) => {
    try {
        const response = await axiosClient.delete(`/restaurant/${restaurantId}/unrate`);
        return response.data; 
    } catch (error) {
        console.error(`Error unrating restaurant ${restaurantId}:`, error.response?.data || error.message);
        throw error;
    }
};

