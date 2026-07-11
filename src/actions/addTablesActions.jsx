import axiosClient from "../../axios-client";

// ✅ Add new table
export const addTable = (tableData) => async (dispatch) => {
  dispatch({ type: "ADD_TABLE_START" });
  try {
    const { data } = await axiosClient.post("/tables", tableData);
    dispatch({ type: "ADD_TABLE_SUCCESS", payload: data.data });
  } catch (error) {
    dispatch({
      type: "ADD_TABLE_FAIL",
      error: error.response?.data?.message || error.message,
    });
  }
};

// ✅ Update existing table by ID
export const updateTable = (tableId, updatedData) => async (dispatch) => {
  dispatch({ type: "UPDATE_TABLE_START" });
  try {
    const { data } = await axiosClient.post(`/tables/${tableId}`, updatedData);
    dispatch({ type: "UPDATE_TABLE_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "UPDATE_TABLE_FAIL", error });
  }
};
