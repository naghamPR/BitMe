import axiosClient from "../../axios-client";



export const getDiscountById = async (id) => {
  try {
    const response = await axiosClient.get(`/discounts/show/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching discount:", error);
    throw error;
  }
};


export const FETCH_DISCOUNTS_START = 'FETCH_DISCOUNTS_START';
export const FETCH_DISCOUNTS_SUCCESS = 'FETCH_DISCOUNTS_SUCCESS';
export const FETCH_DISCOUNTS_FAIL = 'FETCH_DISCOUNTS_FAIL';
export const CREATE_DISCOUNT_START = 'CREATE_DISCOUNT_START'; // New action type
export const CREATE_DISCOUNT_SUCCESS = 'CREATE_DISCOUNT_SUCCESS';
export const CREATE_DISCOUNT_FAIL = 'CREATE_DISCOUNT_FAIL';
export const UPDATE_DISCOUNT_START = 'UPDATE_DISCOUNT_START'; // New action type
export const UPDATE_DISCOUNT_SUCCESS = 'UPDATE_DISCOUNT_SUCCESS';
export const UPDATE_DISCOUNT_FAIL = 'UPDATE_DISCOUNT_FAIL';
export const DELETE_DISCOUNT_START = 'DELETE_DISCOUNT_START'; // New action type
export const DELETE_DISCOUNT_SUCCESS = 'DELETE_DISCOUNT_SUCCESS';
export const DELETE_DISCOUNT_FAIL = 'DELETE_DISCOUNT_FAIL';

// // Action creators now return a function (thunk) that receives dispatch
export const getAllDiscountsByRestaurant = (restaurantId) => async (dispatch) => {
    dispatch({ type: FETCH_DISCOUNTS_START });
    try {
        const response = await axiosClient.get(`/discounts/restaurant/${restaurantId}`);
        // console.log(response.data.data)
        dispatch({ type: FETCH_DISCOUNTS_SUCCESS, data: response.data.data });
       
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch discounts.';
        dispatch({ type: FETCH_DISCOUNTS_FAIL, error: errorMessage });
        console.error("Error fetching discounts:", error.response?.data || error.message);
    }
};

export const createDiscount = (formData) => async (dispatch) => {
    dispatch({ type: CREATE_DISCOUNT_START });
    try {
        const response = await axiosClient.post('/discounts/create', formData);
        console.log(response.success)
        if (response.data.success) {
            dispatch({ type: CREATE_DISCOUNT_SUCCESS, data: response.data });
            dispatch(getAllDiscountsByRestaurant(formData.restaurants_id));
            return { success: true, message: response.data.message };
        } else {
            throw new Error(response.data.message || 'Failed to create discount.');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create discount.';
        dispatch({ type: CREATE_DISCOUNT_FAIL, error: errorMessage });
        console.error("Error creating discount:", error.response?.data || error.message);
        throw error;
    }
};

export const updateDiscount = (discountId, formData) => async (dispatch) => {
    dispatch({ type: UPDATE_DISCOUNT_START });
    try {
        const response = await axiosClient.post(`/discounts/${discountId}`, formData);
        if (response.data.success) {
            dispatch({ type: UPDATE_DISCOUNT_SUCCESS, payload: response.data.data });
            dispatch(getAllDiscountsByRestaurant(formData.restaurants_id)); // Assuming restaurants_id is in formData
            return { success: true, message: response.data.message };
        } else {
            throw new Error(response.data.message || 'Failed to update discount.');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update discount.';
        dispatch({ type: UPDATE_DISCOUNT_FAIL, error: errorMessage });
        console.error("Error updating discount:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteDiscount = (discountId) => async (dispatch) => {
    dispatch({ type: DELETE_DISCOUNT_START });
    try {
        const response = await axiosClient.post(`/discounts/delete/${discountId}`);
        if (response.data.success) {
            dispatch({ type: DELETE_DISCOUNT_SUCCESS, payload: discountId });
            return { success: true, message: response.data.message };
        } else {
            throw new Error(response.data.message || 'Failed to delete discount.');
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to delete discount.';
        dispatch({ type: DELETE_DISCOUNT_FAIL, error: errorMessage });
        console.error("Error deleting discount:", error.response?.data || error.message);
        throw error;
    }
};