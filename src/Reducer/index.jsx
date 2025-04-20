import { combineReducers } from "redux";

import authReducer from "./authReducer";
// import groupReducer from "./groupReducer";
// import FileReducer from "./FileReducer";

export const rootReducer = combineReducers({
  authReducer,
  //   groupReducer,
  //   FileReducer,
});
