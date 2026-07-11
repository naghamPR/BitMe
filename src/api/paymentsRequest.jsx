import axiosClient from "../../axios-client";

export const makePayment = (data) => axiosClient.post("/payments", data);

export const getPaymentDetails = (paymentId) =>
  axiosClient.get(`/payments/${paymentId}`);
