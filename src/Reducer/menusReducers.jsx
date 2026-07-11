const initialState = {
  menus: [],
  loading: false,
  error: null,
};
import {
  FETCH_MENUS_START,
  FETCH_MENUS_SUCCESS,
  FETCH_MENUS_FAIL,
  ADD_MENU_SUCCESS,
  DELETE_MENU_SUCCESS,
  UPDATE_MENU_SUCCESS,
  ADD_MENU_ITEM_SUCCESS,
} from '../actions/menusActions';

const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MENUS_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_MENUS_SUCCESS:
      return {
        ...state,
        menus: action.payload,
        loading: false,
      };
    case FETCH_MENUS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case ADD_MENU_SUCCESS:
      console.log("hihi " + action.data)
      return {
        ...state,
        menus :[...state.menus,action.data],
        loading: false,
      };
    case DELETE_MENU_SUCCESS:
      return {
        ...state,
        menus: state.menus.filter(menu => menu.id !== action.payload),
      };
    case UPDATE_MENU_SUCCESS:
      return {
        ...state,
        menus: state.menus.map(menu =>
          menu.id === action.payload.id ? action.payload : menu
        ),
      };
    case ADD_MENU_ITEM_SUCCESS:
        return {
            ...state,
        };

         case "ADD_MENU_ITEM_START":
      return { ...state, loading: true };

    case "ADD_MENU_ITEM_SUCCESS": {
      const newItem = action.payload.data;
      const updatedMenus = state.menus.map((menu) => {
        if (menu.id === newItem.menu_id) {
          return {
            ...menu,
            items: [...menu.items, newItem],
          };
        }
        return menu;
      });

      return {
        ...state,
        loading: false,
        menus: updatedMenus,
      };
    }

    case "ADD_MENU_ITEM_FAIL":
      return { ...state, loading: false, error: action.error };

    default:
      return state;

    case "UPDATE_MENU_ITEM_SUCCESS":
      return {
        ...state,
        menus: state.menus.map((menu) => ({
          ...menu,
          items: menu.items.map((item) =>
            item.id === action.payload.id ? action.payload : item
          ),
        })),
      };

    case "DELETE_MENU_ITEM_SUCCESS":
      return {
        ...state,
        menus: state.menus.map((menu) => ({
          ...menu,
          items: menu.items.filter((item) => item.id !== action.payload),
        })),
      };

    // default:
    //   return state;
  }
};

export default menuReducer;
