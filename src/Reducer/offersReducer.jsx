const initialState = {
  offers: [],
  restaurantOffers: [],
  higherOffers: [],
  currentOffer: null,
  loading: false,
  error: null,
};

export const offerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_OFFER_START":
    case "FETCH_OFFERS_START":
    case "FETCH_HIGHER_OFFERS_START":
    case "FETCH_OFFER_DETAILS_START":
    case "FETCH_RESTAURANT_OFFERS_START":
    case "DELETE_OFFER_START":
      return { ...state, loading: true, error: null };

    case "CREATE_OFFER_SUCCESS":
      return {
        ...state,
        loading: false,
        offers: [...state.offers, action.payload],
      };

    case "FETCH_OFFERS_SUCCESS":
      return { ...state, loading: false, offers: action.payload };

    case "FETCH_HIGHER_OFFERS_SUCCESS":
      return { ...state, loading: false, higherOffers: action.payload };

    case "FETCH_OFFER_DETAILS_SUCCESS":
      return { ...state, loading: false, currentOffer: action.payload };

    case "FETCH_RESTAURANT_OFFERS_SUCCESS":
      return { ...state, loading: false, restaurantOffers: action.payload };

    case "DELETE_OFFER_SUCCESS":
      return {
        ...state,
        loading: false,
        offers: state.offers.filter(offer => offer.id !== action.payload),
        restaurantOffers: state.restaurantOffers.filter(offer => offer.id !== action.payload),
      };

    case "CREATE_OFFER_FAIL":
    case "FETCH_OFFERS_FAIL":
    case "FETCH_HIGHER_OFFERS_FAIL":
    case "FETCH_OFFER_DETAILS_FAIL":
    case "FETCH_RESTAURANT_OFFERS_FAIL":
    case "DELETE_OFFER_FAIL":
      return { ...state, loading: false, error: action.error };

    default:
      return state;
  }
};