import Path from "path";
import React, { Component, useState } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Entries from "./Entries";
import Entry from "./Entry";

function App({ apiUrl, path }) {
  const [title, setTitle] = useState(null);

  return (
    <BrowserRouter>
      <>
        <Route
          render={({ history }) => (
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                {title ? (
                  <>
                    <li className="breadcrumb-item">
                      <a
                        href={path}
                        onClick={ev => {
                          ev.preventDefault();
                          history.push(path);
                        }}
                      >
                        Blog
                      </a>
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
            path={Path.join(path, ":page(\\d+)?")}
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
            path={Path.join(path, "entries/:id(\\d+)")}
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
    </BrowserRouter>
  );
}

export default App;
