import axiosClient from "../../axios-client";
export const getAllOffers = () => axiosClient.get("/offers");
export const getHigherOffers = () => axiosClient.get("/offers/getHigherOffers");
export const getRestaurantOffers = (restaurantId) =>
  axiosClient.get(`/restaurant/${restaurantId}/offers`);
