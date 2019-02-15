import React, { Component, useState, useEffect } from "react";
import {
  HashRouter as Router,
  //BrowserRouter as Router,
  Route, Link
} from "react-router-dom";
import Entries from "./Entries";
import Entry from "./Entry";

function App({ apiUrl, path }) {
  const [title, setTitle] = useState(null);

  useEffect(
    () => {
      if (title) {
        document.title = title + ' | Blog';
      }
      else {
        document.title = 'Blog';
      }
    },
    [title]
  );

  return (
    <Router basename={path}>
      <>
        <Route
          render={({ history }) => (
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                {title ? (
                  <>
                    <li className="breadcrumb-item">
                      <Link to="/">
                        Blog
                      </Link>
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
          )}
        />
        <div>
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
        </div>
      </>
    </Router>
  );
}

export default App;
