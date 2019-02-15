import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Entries from "./Entries";
import Entry from "./Entry";

function App({ apiUrl, path }) {
  return (
    <BrowserRouter>
      <div>
        <Route
          exact
          path={path}
          render={props => (
            <Entries apiUrl={apiUrl + "/entries"} perPage={10} path={path} {...props} />
          )}
        />
        <Route
          path={path + "entries/:id"}
          render={props => <Entry apiUrl={apiUrl + "/entries"} {...props} />}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
