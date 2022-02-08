import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";

import Watchlists from "./pages/Watchlists";

import Navbar from "./components/Navbar";

import * as API from "./utils/API";
import AuthService from "./utils/auth";
import UserInfoContext from "./utils/UserInfoContext";

function App() {
  const [userInfo, setUserInfo] = useState({
    savedShows: [],
    username: "",
    email: "",

    getUserData: () => {
      // if user's logged in get the token or return null
      const token = AuthService.loggedIn() ? AuthService.getToken() : null;

      if (!token) {
        return false;
      }
      API.getMe(token)
        .then(({ data: { username, email, savedShows } }) =>
          setUserInfo({ ...userInfo, username, email, savedShows })
        )
        .catch((err) => console.log(err));
    },
  });

  // on load, get user data if a token exists
  useEffect(() => {
    userInfo.getUserData();
  }, []);

  return (
    <Router>
      <>
        <UserInfoContext.Provider value={userInfo}>
          <Navbar />
          <Switch>
            <Route
              exact
              path='/'
              render={() => (userInfo.username ? <Watchlists /> : <Welcome />)}
            />

            <Route
              exact
              path='/checklist'
              render={() => (userInfo.username ? <Watchlists /> : <Welcome />)}
            />
            <Route
              render={() => (
                <h1> This is not the page you're looking for... </h1>
              )}
            />
          </Switch>
        </UserInfoContext.Provider>
      </>
    </Router>
  );
}

export default App;
