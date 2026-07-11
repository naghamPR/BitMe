import { createContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { setAuthToken } from "../../axios-client";

export const PusherContext = createContext();

export const PusherProvider = ({ children }) => {
  const authData = useSelector((state) => state?.authReducer?.authData);
  const test = localStorage.getItem('user')
  const userObject = JSON.parse(test);
  const token = authData?.access_token;
  console.log(userObject?.access_token)
  useEffect(() => {
    if (token) {
      setAuthToken(token); 
    }
  }, [token]);

  return (
    <PusherContext.Provider value={null}>{children}</PusherContext.Provider>
  );
};
