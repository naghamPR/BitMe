const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_ORDERS_START":
      return { ...state, loading: true, error: null };

    case "FETCH_ORDERS_SUCCESS":
      return { ...state, loading: false, orders: action.payload };

    case "FETCH_ORDERS_FAIL":
      return { ...state, loading: false, error: action.error };

    case "CREATE_ORDER_START":
      return { ...state, loading: true, error: null };

    case "CREATE_ORDER_SUCCESS":
      return {
        ...state,
        loading: false,
        orders: [...state.orders, action.payload],
      };

    case "CREATE_ORDER_FAIL":
      return { ...state, loading: false, error: action.error };

    case "DELETE_ORDER_START":
      return { ...state, loading: true, error: null };

    case "DELETE_ORDER_SUCCESS":
      return {
        ...state,
        loading: false,
        orders: state.orders.filter((order) => order.id !== action.payload),
      };

    case "DELETE_ORDER_FAIL":
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
};

export default orderReducer;
