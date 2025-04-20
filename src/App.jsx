import { useState } from "react";

import "./App.css";
import { RouterProvider } from "react-router-dom";
import { createRoutes } from "./router";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const user = useSelector((state) => state.authReducer.authData);
  const router = createRoutes(user);
  const [darkMode, setDarkMode] = useState(0);

  return (
    <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
