import React, { createContext, useEffect, useState } from "react";

const AuthContext = createContext({});

const AuthProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token") ? true : false
  );

  const login = (payload) => {
    localStorage.setItem("token", payload.token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const authContextValue = { login, isAuthenticated, logout };
  return <AuthContext.Provider value={authContextValue} {...props} />;
};
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
