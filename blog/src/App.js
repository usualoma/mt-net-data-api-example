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
import Categories from "./Categories";

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
    <div className="container">
      <Router basename={path}>
        <>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              {breadcrumb.length !== 0 ? (
                <>
                  <li className="breadcrumb-item">
                    <Link to="/">Blog</Link>
                  </li>
                  {breadcrumb.map(b =>
                    b.url ? (
                      <li key={b.url} className="breadcrumb-item">
                        <Link to={b.url}>{b.title}</Link>
                      </li>
                    ) : (
                      <li
                        key="last"
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        {b.title}
                      </li>
                    )
                  )}
                </>
              ) : (
                <li className="breadcrumb-item active" aria-current="page">
                  Blog
                </li>
              )}
            </ol>
          </nav>
          <div className="row">
            <div className="col-md-9">
              <Switch>
                <Route
                  exact
                  path="/:page(\d+)?"
                  render={props => (
                    <Entries
                      apiUrl={apiUrl + "/entries"}
                      perPage={10}
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
                      setBreadcrumb={setBreadcrumb}
                      {...props}
                    />
                  )}
                />
                <Route
                  path="/categories/:id(\d+)/:page(\d+)?"
                  render={props => (
                    <Entries
                      apiUrl={
                        apiUrl + `/categories/${props.match.params.id}/entries`
                      }
                      perPage={10}
                      setBreadcrumb={setBreadcrumb}
                      {...props}
                    />
                  )}
                />
              </Switch>
            </div>
            <div className="col-md-3">
              <div className="card">
                <Categories apiUrl={apiUrl + `/categories`} />
              </div>
            </div>
          </div>
        </>
      </Router>
    </div>
  );
}

export default App;
