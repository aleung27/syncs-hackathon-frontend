import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Landing from "./Views/Landing";
import Main from "./Views/Main";

const App = () => {
  const [username, setUsername] = useState(null);
  const [background, setBackground] = useState("Hackathon");
  const ADDRESS = "http://localhost:3030";

  const modifyUsername = (val) => {
    setUsername(val);
  };

  const modifyBackground = (val) => {
    setBackground(val);
  };

  return (
    <main>
      <Switch>
        <Route
          path="/"
          render={(props) => (
            <Landing
              {...props}
              modifyUsername={modifyUsername}
              username={username}
              ADDRESS={ADDRESS}
              modifyBackground={modifyBackground}
            />
          )}
          exact
        />
        <Route
          path="/chat"
          render={(props) => (
            <Main
              {...props}
              username={username}
              ADDRESS={ADDRESS}
              background={background}
            />
          )}
        />
      </Switch>
    </main>
  );
};

export default App;
