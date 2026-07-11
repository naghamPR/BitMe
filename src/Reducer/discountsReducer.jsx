// import {
//     FETCH_DISCOUNTS_START,
//     FETCH_DISCOUNTS_SUCCESS,
//     FETCH_DISCOUNTS_FAIL,
//     CREATE_DISCOUNT_SUCCESS,
//     CREATE_DISCOUNT_FAIL,
//     UPDATE_DISCOUNT_SUCCESS,
//     UPDATE_DISCOUNT_FAIL,
//     DELETE_DISCOUNT_SUCCESS,
//     DELETE_DISCOUNT_FAIL,
// } from '../actions/discountsActions';

// const initialState = {
//     discounts: [],
//     loading: false,
//     error: null,
// };

// const discountsReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case FETCH_DISCOUNTS_START:
//             return { ...state, loading: true, error: null };
//         case FETCH_DISCOUNTS_SUCCESS:
//             return { ...state, discounts: action.payload, loading: false, error: null };
//         case FETCH_DISCOUNTS_FAIL:
//             return { ...state, loading: false, error: action.error };
        
//         case CREATE_DISCOUNT_SUCCESS:
//             // Assuming payload contains the new discount object.
//             // You might want to re-fetch the list or add it to the existing array.
//             // For simplicity, we'll let the parent component re-fetch.
//             return { ...state, loading: false, error: null };
//         case CREATE_DISCOUNT_FAIL:
//             return { ...state, loading: false, error: action.error };
        
//         case UPDATE_DISCOUNT_SUCCESS:
//             // Update the specific discount in the array
//             return {
//                 ...state,
//                 discounts: state.discounts.map(discount =>
//                     discount.id === action.payload.id ? action.payload : discount
//                 ),
//                 loading: false,
//                 error: null,
//             };
//         case UPDATE_DISCOUNT_FAIL:
//             return { ...state, loading: false, error: action.error };

//         case DELETE_DISCOUNT_SUCCESS:
//             // Remove the deleted discount from the array
//             return {
//                 ...state,
//                 discounts: state.discounts.filter(discount => discount.id !== action.payload),
//                 loading: false,
//                 error: null,
//             };
//         case DELETE_DISCOUNT_FAIL:
//             return { ...state, loading: false, error: action.error };

//         default:
//             return state;
//     }
// };

// export default discountsReducer;



import {
    FETCH_DISCOUNTS_START,
    FETCH_DISCOUNTS_SUCCESS,
    FETCH_DISCOUNTS_FAIL,
    CREATE_DISCOUNT_START, // New
    CREATE_DISCOUNT_SUCCESS,
    CREATE_DISCOUNT_FAIL,  // New
    UPDATE_DISCOUNT_START, // New
    UPDATE_DISCOUNT_SUCCESS,
    UPDATE_DISCOUNT_FAIL,  // New
    DELETE_DISCOUNT_START, // New
    DELETE_DISCOUNT_SUCCESS,
    DELETE_DISCOUNT_FAIL,  // New
} from '../actions/discountsActions';

const initialState = {
    discounts: [],
    loading: false,
    error: null,
};

const discountsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_DISCOUNTS_START:
        case CREATE_DISCOUNT_START:
        case UPDATE_DISCOUNT_START:
        case DELETE_DISCOUNT_START:
            return { ...state, loading: true, error: null };
        
        case FETCH_DISCOUNTS_SUCCESS:
            console.log(action.data)
            return { ...state, discounts: action.data, loading: false, error: null };
        
        case CREATE_DISCOUNT_SUCCESS:
            return { ...state, loading: false, error: null };
        
        case UPDATE_DISCOUNT_SUCCESS:
            return {
                ...state,
                discounts: state.discounts.map(discount =>
                    discount.id === action.payload.id ? action.payload : discount
                ),
                loading: false,
                error: null,
            };
        
        case DELETE_DISCOUNT_SUCCESS:
            return {
                ...state,
                discounts: state.discounts.filter(discount => discount.id !== action.payload),
                loading: false,
                error: null,
            };
        
        case FETCH_DISCOUNTS_FAIL:
        case CREATE_DISCOUNT_FAIL:
        case UPDATE_DISCOUNT_FAIL:
        case DELETE_DISCOUNT_FAIL:
            return { ...state, loading: false, error: action.error };

        default:
            return state;
    }
};

export default discountsReducer;