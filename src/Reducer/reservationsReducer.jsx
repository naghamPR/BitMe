const initialState = {
  reservations: [],
  loading: false,
  error: null,
};

const reservationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_RESERVATIONS_START":
      return { ...state, loading: true, error: null };

    case "FETCH_RESERVATIONS_SUCCESS":
      return { ...state, loading: false, reservations: action.payload };

    case "FETCH_RESERVATIONS_FAIL":
      return { ...state, loading: false, error: action.error };

    case "MAKE_RESERVATION_START":
      return { ...state, loading: true, error: null };

    case "MAKE_RESERVATION_SUCCESS":
      return {
        ...state,
        loading: false,
        reservations: [...state.reservations, action.payload],
      };

    case "MAKE_RESERVATION_FAIL":
      return { ...state, loading: false, error: action.error };

    case "FINISH_RESERVATION_START":
      return { ...state, loading: true, error: null };

    case "FINISH_RESERVATION_SUCCESS":
      return {
        ...state,
        loading: false,
        reservations: state.reservations.filter(
          (res) => res.id !== action.payload
        ),
      };

    case "FINISH_RESERVATION_FAIL":
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
};

export default reservationReducer;
