import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../../Contexts/auth-context";

const PrivateRoute = ({ component: Component, ...rest }) => {
  // @ts-ignore
  const { isAuthenticated } = useAuth();
  const [userIsAuthenticated, setUserIsAuthenticated] =
    useState(isAuthenticated);
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    setUserIsAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    setLoadingPage(false);
  }, [userIsAuthenticated]);
  return (
    <Route
      {...rest}
      render={(props) =>
        !loadingPage && !userIsAuthenticated ? (
          <Redirect to="/login" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PrivateRoute;
