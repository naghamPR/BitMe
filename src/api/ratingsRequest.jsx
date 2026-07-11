import axiosClient from "../../axios-client";

export const rateRestaurant = (id, rating) =>
  axiosClient.post(`/rate-restaurant/${id}`, { rating });

export const getUserRating = (id) =>
  axiosClient.get(`/restaurant/${id}/user-rating`);

export const unrateRestaurant = (id) =>
  axiosClient.delete(`/restaurant/${id}/unrate`);

export const addReview = (id, data) =>
  axiosClient.post(`/review-restaurant/${id}`, data);

export const getUserReview = (id) =>
  axiosClient.get(`/restaurant/${id}/user-review`);

export const deleteReview = (id) =>
  axiosClient.delete(`/restaurant/${id}/delete-review`);
