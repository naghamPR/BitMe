import axiosClient from "../../axios-client";

export const fetchNotifications = () => async (dispatch) => {
  dispatch({ type: "FETCH_NOTIFICATIONS_START" });
  try {
    const { data } = await axiosClient.get("/getNotifications");
    dispatch({ type: "FETCH_NOTIFICATIONS_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "FETCH_NOTIFICATIONS_FAIL", error });
  }
};

export const deleteNotification = (id) => async (dispatch) => {
  dispatch({ type: "DELETE_NOTIFICATION_START" });
  try {
    await axiosClient.get(`/deleteNotification/${id}`);
    dispatch({ type: "DELETE_NOTIFICATION_SUCCESS", payload: id });
  } catch (error) {
    dispatch({ type: "DELETE_NOTIFICATION_FAIL", error });
  }
};
