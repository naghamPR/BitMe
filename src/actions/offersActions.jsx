import axiosClient from "../../axios-client";

export const createOffer = (formData) => async (dispatch) => {
  dispatch({ type: "CREATE_OFFER_START" });
  try {
    const { data } = await axiosClient.post("/offers/store", formData);
    dispatch({ type: "CREATE_OFFER_SUCCESS", payload: data.data });
    return data;
  } catch (error) {
    dispatch({ type: "CREATE_OFFER_FAIL", error });
    throw error;
  }
};



export const fetchOffers = () => async (dispatch) => {
  dispatch({ type: "FETCH_OFFERS_START" });
  try {
    const { data } = await axiosClient.get("/offers");
    dispatch({ type: "FETCH_OFFERS_SUCCESS", payload: data.data });
  } catch (error) {
    dispatch({ type: "FETCH_OFFERS_FAIL", error });
  }
};

export const fetchHigherOffers = () => async (dispatch) => {
  dispatch({ type: "FETCH_HIGHER_OFFERS_START" });
  try {
    const { data } = await axiosClient.get("/offers/getHigherOffers");
    dispatch({ type: "FETCH_HIGHER_OFFERS_SUCCESS", payload: data.data });
  } catch (error) {
    dispatch({ type: "FETCH_HIGHER_OFFERS_FAIL", error });
  }
};


export const fetchRestaurantOffers = (restaurantId) => async (dispatch) => {
  dispatch({ type: "FETCH_RESTAURANT_OFFERS_START" });
  try {
    const { data } = await axiosClient.get(`/offers/showOfferRestaurants/${restaurantId}`);
    dispatch({ type: "FETCH_RESTAURANT_OFFERS_SUCCESS", payload: data.data });
  } catch (error) {
    dispatch({ type: "FETCH_RESTAURANT_OFFERS_FAIL", error });
  }
};

export const deleteOffer = (offerId) => async (dispatch) => {
  dispatch({ type: "DELETE_OFFER_START" });
  try {
    await axiosClient.post(`/offers/delete/${offerId}`);
    dispatch({ type: "DELETE_OFFER_SUCCESS", payload: offerId });
  } catch (error) {
    dispatch({ type: "DELETE_OFFER_FAIL", error });
    throw error;
  }
};


export const fetchOfferDetails = (offerId) => async (dispatch) => {
  dispatch({ type: "FETCH_OFFER_DETAILS_START" });
  try {
    const { data } = await axiosClient.get(`/offers/showOfferItem/${offerId}`);
    dispatch({ type: "FETCH_OFFER_DETAILS_SUCCESS", payload: data.data });
    return data;
  } catch (error) {
    dispatch({ type: "FETCH_OFFER_DETAILS_FAIL", error });
    throw error;
  }
};

