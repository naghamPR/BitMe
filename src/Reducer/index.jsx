import { combineReducers } from "redux";

import authReducer from "./authReducer";
import restaurantReducer from "./restaurantReducer";
import menusReducers from "./menusReducers";
import addtableReducer from "./addtableReducers";
import { offerReducer } from "./offersReducer";
import discountsReducer from "./discountsReducer";
export const rootReducer = combineReducers({
  authReducer,
  restaurants: restaurantReducer,
  menus: menusReducers,
  tables: addtableReducer,
  offer: offerReducer,
  discounts: discountsReducer,
});
