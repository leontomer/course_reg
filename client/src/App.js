import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage/HomePage";
import MailConfirmation from "./components/MailConfirmation/MailConfirmation";
import LoginPage from "./components/LoginPage/LoginPage";
import PrivateRoute from "./components/Routes/PrivateRoute";
import { mainContext } from "./Contexts/main-context";
import getRegistrations from "./components/GetRegistrations/getRegistrations";
import setAuthToken from "./utilities/setAuthToken";
import { useAuth } from "./Contexts/auth-context";
function App() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
  }, [isAuthenticated]);

  return (
    <mainContext>
      <Router>
        <Switch>
          <Route exact path="/" exact component={HomePage} />
          <Route path="/confirmation/:token" component={MailConfirmation} />
          <Route exact path="/login" component={LoginPage} />
          <PrivateRoute
            exact
            path="/getRegistrations"
            component={getRegistrations}
          />
        </Switch>
      </Router>
    </mainContext>
  );
}

export default App;
