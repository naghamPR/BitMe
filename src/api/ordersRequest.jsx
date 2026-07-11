import axiosClient from "../../axios-client";

export const createOrder = (data) => axiosClient.post("/orders", data);

export const getUserOrders = (userId) =>
  axiosClient.get(`/orders/user/${userId}`);

export const getRestaurantOrders = () => axiosClient.get("/orders/getResOrder");

export const deleteOrder = (orderId) =>
  axiosClient.delete(`/orders/${orderId}`);
