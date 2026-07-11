const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_NOTIFICATIONS_START":
      return { ...state, loading: true, error: null };

    case "FETCH_NOTIFICATIONS_SUCCESS":
      return { ...state, loading: false, notifications: action.payload };

    case "FETCH_NOTIFICATIONS_FAIL":
      return { ...state, loading: false, error: action.error };

    case "DELETE_NOTIFICATION_START":
      return { ...state, loading: true, error: null };

    case "DELETE_NOTIFICATION_SUCCESS":
      return {
        ...state,
        loading: false,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };

    case "DELETE_NOTIFICATION_FAIL":
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
};

export default notificationReducer;
