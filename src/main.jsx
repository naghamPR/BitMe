import "./index.css";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
// import { DarkModeContextProvider } from "./context/darkModeContext";
// import { PusherProvider } from './context/PusherContext';
import store from "./store/ReduxStore";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {/* <PusherProvider>
      <DarkModeContextProvider> */}
    <App />
    {/* </DarkModeContextProvider>
    </PusherProvider> */}
  </Provider>
);
