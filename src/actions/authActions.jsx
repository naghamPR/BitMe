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

// export const logout = () => async (dispatch) => {
//   await AuthApi.logout();
//   dispatch({ type: "LOGOUT_SUCCESS" });
// };

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
export const LOGOUT_START = 'LOGOUT_START';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'; 
export const LOGOUT_FAIL = 'LOGOUT_FAIL';


export const logout = () => async (dispatch) => {
    dispatch({ type: LOGOUT_START });
    try {
        localStorage.clear();

        dispatch({ type: LOGOUT_SUCCESS });
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Logout failed on server-side.';
        dispatch({ type: LOGOUT_FAIL, payload: errorMessage });
        localStorage.clear();
        dispatch({ type: LOGOUT_SUCCESS }); 
        console.error("Server-side logout error:", error);
    }
};