import "./index.css";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import { PusherProvider } from "./context/PusherContext";
import store from "./store/ReduxStore";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PusherProvider>
      <App />
    </PusherProvider>
  </Provider>
);
