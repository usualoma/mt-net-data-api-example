import React, { useState, useEffect } from "react";
import {
  HashRouter,
  BrowserRouter,
  Route,
  Switch,
  Link,
} from "react-router-dom";
import Entries from "./Entries";
import Entry from "./Entry";

function App({ apiUrl, path, baseTitle, routerType = "browser" }) {
  const Router = routerType === "browser" ? BrowserRouter : HashRouter;
  const [breadcrumb, setBreadcrumb] = useState([]);

  useEffect(
    () => {
      if (breadcrumb.length !== 0) {
        document.title = `${
          breadcrumb[breadcrumb.length - 1].title
        } | ${baseTitle}`;
      } else {
        document.title = baseTitle;
      }
    },
    [breadcrumb]
  );

  return (
    <Router basename={path}>
      <>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            {breadcrumb.length !== 0 ? (
              <>
                <li className="breadcrumb-item">
                  <Link to="/">Blog</Link>
                </li>
                {breadcrumb.map(b => (
                  <li key={b.url || "last"} className="breadcrumb-item active">
                    {b.url ? <Link to={b.url}>{b.title}</Link> : b.title}
                  </li>
                ))}
              </>
            ) : (
              <li className="breadcrumb-item active">Blog</li>
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
                setBreadcrumb={setBreadcrumb}
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
                setBreadcrumb={setBreadcrumb}
                {...props}
              />
            )}
          />
          <Route
            path="/categories/:id(\d+)"
            render={props => (
              <Entries
                apiUrl={apiUrl + `/categories/${props.match.params.id}/entries`}
                perPage={10}
                path={path}
                setBreadcrumb={setBreadcrumb}
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
