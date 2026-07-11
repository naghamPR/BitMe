import axiosClient from "../../axios-client";

export const getRestaurants = (query) =>
  axiosClient.get(`/restaurants/search`, { params: { q: query } });

export const getRestaurantDetails = (id) =>
  axiosClient.post("/getRestaurant", { id });

export const reserveTable = (data) => axiosClient.post("/reserve-table", data);

export const getMyReservations = () => axiosClient.get("/userReservations");

export const finishReservation = (id) =>
  axiosClient.post(`/finish-reservation/${id}`);
