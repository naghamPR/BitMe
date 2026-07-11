import axiosClient from "../../axios-client";



// Action Types
export const FETCH_RESTAURANTS_START = 'FETCH_RESTAURANTS_START';
export const FETCH_RESTAURANTS_SUCCESS = 'FETCH_RESTAURANTS_SUCCESS';
export const FETCH_RESTAURANTS_FAIL = 'FETCH_RESTAURANTS_FAIL';
export const SEARCH_RESTAURANTS_SUCCESS = 'SEARCH_RESTAURANTS_SUCCESS';
export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';


export const fetchRestaurants = () => async (dispatch) => {
  dispatch({ type: "FETCH_RESTAURANTS_START" });
  try {
    const { data } = await axiosClient.get("/getRestaurant");
    dispatch({ type: "FETCH_RESTAURANTS_SUCCESS", payload: data.data });
  } catch (error) {
    dispatch({ type: "FETCH_RESTAURANTS_FAIL", error });
  }
};

export const searchRestaurants = (filters) => (dispatch, getState) => {
  const { allRestaurants } = getState().restaurants; // Get all restaurants from state
  const { query, ratings, type, cuisine_type } = filters;

  let filtered = [...allRestaurants]; // Start with all restaurants

  if (query) {
    const lowerCaseQuery = query.toLowerCase();
    filtered = filtered.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(lowerCaseQuery) ||
        (restaurant.cuisine_type && restaurant.cuisine_type.toLowerCase().includes(lowerCaseQuery)) ||
        (restaurant.location && restaurant.location.toLowerCase().includes(lowerCaseQuery))
    );
  }

  if (ratings) {
    filtered = filtered.filter((restaurant) => restaurant.ratings >= parseFloat(ratings));
  }

  if (type) {
    filtered = filtered.filter((restaurant) => restaurant.type === type);
  }

  if (cuisine_type) {
    filtered = filtered.filter((restaurant) => restaurant.cuisine_type === cuisine_type);
  }

  dispatch({
    type: SEARCH_RESTAURANTS_SUCCESS,
    payload: filtered,
  });
};

export const toggleFavorite = (restaurantId) => ({
  type: TOGGLE_FAVORITE,
  payload: restaurantId,
});
export const addRestaurant = (restaurantData) => async (dispatch) => {
  dispatch({ type: "ADD_RESTAURANT_START" });
  try {
    const { data } = await axiosClient.post("/AddRes", restaurantData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch({ type: "ADD_RESTAURANT_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "ADD_RESTAURANT_FAIL", error });
  }
};

export const updateRestaurant =
  (restaurantId, updateData) => async (dispatch) => {
    dispatch({ type: "UPDATE_RESTAURANT_START" });
    try {
      const { data } = await axiosClient.post(
        `/restaurantsUpdate/${restaurantId}`,
        updateData
      );
      dispatch({ type: "UPDATE_RESTAURANT_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "UPDATE_RESTAURANT_FAIL", error });
    }
  };

export const deleteRestaurant = (restaurantId) => async (dispatch) => {
  dispatch({ type: "DELETE_RESTAURANT_START" });
  try {
    await axiosClient.post(`/restaurants/${restaurantId}`);
    dispatch({ type: "DELETE_RESTAURANT_SUCCESS", payload: restaurantId });
  } catch (error) {
    dispatch({ type: "DELETE_RESTAURANT_FAIL", error });
  }
};
