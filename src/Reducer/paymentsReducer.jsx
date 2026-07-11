const initialState = {
  paymentInfo: null,
  loading: false,
  error: null,
};

const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case "MAKE_PAYMENT_START":
    case "GET_PAYMENT_DETAILS_START":
      return { ...state, loading: true, error: null };

    case "MAKE_PAYMENT_SUCCESS":
      return {
        ...state,
        loading: false,
        paymentInfo: action.payload,
        error: null,
      };

    case "GET_PAYMENT_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        paymentInfo: action.payload,
        error: null,
      };

    case "MAKE_PAYMENT_FAIL":
    case "GET_PAYMENT_DETAILS_FAIL":
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
};

export default paymentReducer;
