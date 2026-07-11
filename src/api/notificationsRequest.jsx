import axiosClient from "../../axios-client";
export const getNotifications = () => axiosClient.get("/getNotifications");
export const deleteNotification = (id) =>
  axiosClient.get(`/deleteNotification/${id}`);
