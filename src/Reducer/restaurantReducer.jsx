const initialState = {
  allRestaurants: [],
  filteredRestaurants: [],
  favorites: [],
  loading: false, // Initial state should be false, set to true on START
  error: null,
};

import {   FETCH_RESTAURANTS_START,
  FETCH_RESTAURANTS_SUCCESS,
  FETCH_RESTAURANTS_FAIL,
  SEARCH_RESTAURANTS_SUCCESS,
  TOGGLE_FAVORITE, } from '../actions/resturantsActions';

const restaurantReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_RESTAURANTS_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_RESTAURANTS_SUCCESS:
      return {
        ...state,
        allRestaurants: action.payload,
        filteredRestaurants: action.payload, // Initially, filtered is all
        loading: false,
        error: null,
      };
    case FETCH_RESTAURANTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case SEARCH_RESTAURANTS_SUCCESS:
      return {
        ...state,
        filteredRestaurants: action.payload,
      };
    case TOGGLE_FAVORITE:
      const idToToggle = action.payload;
      const isFavorited = state.favorites.includes(idToToggle);
      return {
        ...state,
        favorites: isFavorited
          ? state.favorites.filter((id) => id !== idToToggle)
          : [...state.favorites, idToToggle],
      };
    default:
      return state;
  }
};

export default restaurantReducer;
