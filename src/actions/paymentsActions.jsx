import axiosClient from "../../axios-client";

export const makePayment = (paymentData) => async (dispatch) => {
  dispatch({ type: "MAKE_PAYMENT_START" });
  try {
    const { data } = await axiosClient.post("/payments", paymentData);
    dispatch({ type: "MAKE_PAYMENT_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "MAKE_PAYMENT_FAIL", error });
  }
};

export const getPaymentDetails = (paymentId) => async (dispatch) => {
  dispatch({ type: "GET_PAYMENT_DETAILS_START" });
  try {
    const { data } = await axiosClient.get(`/payments/${paymentId}`);
    dispatch({ type: "GET_PAYMENT_DETAILS_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "GET_PAYMENT_DETAILS_FAIL", error });
  }
};
