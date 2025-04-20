import * as AuthApi from "../api/authRequest";

export const logIn = (formData) => async (dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.logIn(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
  } catch (err) {
    console.log(err);
    dispatch({ type: "AUTH_FAIL", erorr: err });
  }
};

export const logout = () => async (dispatch) => {
  await AuthApi.logout();
  dispatch({ type: "LOGOUT_SUCCESS" });
};

export const signUp = (formData) => async (dispatch) => {
  dispatch({ type: "AUTH_START" });
  try {
    const { data } = await AuthApi.signUp(formData);
    dispatch({ type: "AUTH_SUCCESS", data: data });
  } catch (err) {
    console.log(err);
    dispatch({ type: "AUTH_FAIL" });
  }
};
