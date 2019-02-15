import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const elm = document.getElementById("app");
ReactDOM.render(
  <App
    apiUrl={elm.dataset.apiUrl}
    path={elm.dataset.path}
    routerType={elm.dataset.routerType}
    baseTitle={document.title}
  />,
  elm
);
