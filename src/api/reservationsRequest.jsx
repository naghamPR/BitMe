import axiosClient from "../../axios-client";

export const reserveTable = (data) => axiosClient.post("/reserve-table", data);

export const finishReservation = (id) =>
  axiosClient.post(`/finish-reservation/${id}`);

export const getMyReservations = () => axiosClient.get("/userReservations");

export const getRestaurantReservations = () =>
  axiosClient.get("/getReservationRes");

export const getMyWaitlist = () => axiosClient.get("/my-waitlist");
