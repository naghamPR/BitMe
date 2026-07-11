import axiosClient from "../../axios-client";

export const makeReservation = (reservationData) => async (dispatch) => {
  dispatch({ type: "MAKE_RESERVATION_START" });
  try {
    const { data } = await axiosClient.post("/reservations", reservationData);
    dispatch({ type: "MAKE_RESERVATION_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "MAKE_RESERVATION_FAIL", error });
  }
};

export const getUserReservations = () => async (dispatch) => {
  dispatch({ type: "GET_RESERVATIONS_START" });
  try {
    const { data } = await axiosClient.get("/userReservations");
    dispatch({ type: "GET_RESERVATIONS_SUCCESS", payload: data });
    return data;
  } catch (error) {
    dispatch({ type: "GET_RESERVATIONS_FAIL", error });
  }
};
export const getReservationsForRestaurant = () => async (dispatch) => {
  dispatch({ type: "GET_RESERVATIONS_START" });
  try {
    const { data } = await axiosClient.get("/userReservations");
    dispatch({ type: "GET_RESERVATIONS_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "GET_RESERVATIONS_FAIL", error });
  }
};

export const finishReservation = (reservationId) => async (dispatch) => {
  dispatch({ type: "FINISH_RESERVATION_START" });
  try {
    await axiosClient.post(`/finish-reservation/${reservationId}`);
    dispatch({ type: "FINISH_RESERVATION_SUCCESS", payload: reservationId });
  } catch (error) {
    dispatch({ type: "FINISH_RESERVATION_FAIL", error });
  }
};
