import React, { Component, useState, useEffect } from "react";
import { HashRouter, BrowserRouter, Route, Switch, Link } from "react-router-dom";
import Entries from "./Entries";
import Entry from "./Entry";

function App({ apiUrl, path, baseTitle, routerType = "browser" }) {
  const Router = routerType === "browser" ? BrowserRouter : HashRouter;
  const [title, setTitle] = useState(null);

  useEffect(
    () => {
      if (title) {
        document.title = `${title} | ${baseTitle}`;
      } else {
        document.title = baseTitle;
      }
    },
    [title]
  );

  return (
    <Router basename={path}>
      <>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            {title ? (
              <>
                <li className="breadcrumb-item">
                  <Link to="/">Blog</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {title}
                </li>
              </>
            ) : (
              <li className="breadcrumb-item active" aria-current="page">
                Blog
              </li>
            )}
          </ol>
        </nav>
        <Switch>
          <Route
            exact
            path="/:page(\d+)?"
            render={props => (
              <Entries
                apiUrl={apiUrl + "/entries"}
                perPage={10}
                path={path}
                setTitle={setTitle}
                {...props}
              />
            )}
          />
          <Route
            path="/entries/:id(\d+)"
            render={props => (
              <Entry
                apiUrl={apiUrl + "/entries"}
                path={path}
                setTitle={setTitle}
                {...props}
              />
            )}
          />
        </Switch>
      </>
    </Router>
  );
}

export default App;
