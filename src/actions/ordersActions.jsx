import axiosClient from "../../axios-client";

export const fetchUserOrders = (userId) => async (dispatch) => {
  dispatch({ type: "FETCH_ORDERS_START" });
  try {
    const { data } = await axiosClient.get(`/orders/user/${userId}`);
    dispatch({ type: "FETCH_ORDERS_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "FETCH_ORDERS_FAIL", error });
  }
};

export const createOrder = (orderData) => async (dispatch) => {
  dispatch({ type: "CREATE_ORDER_START" });
  try {
    const { data } = await axiosClient.post("/orders", orderData);
    dispatch({ type: "CREATE_ORDER_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "CREATE_ORDER_FAIL", error });
  }
};

export const deleteOrder = (orderId) => async (dispatch) => {
  dispatch({ type: "DELETE_ORDER_START" });
  try {
    await axiosClient.delete(`/orders/${orderId}`);
    dispatch({ type: "DELETE_ORDER_SUCCESS", payload: orderId });
  } catch (error) {
    dispatch({ type: "DELETE_ORDER_FAIL", error });
  }
};
