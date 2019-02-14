import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import domready from "domready";

domready(() => {
  const elm = document.getElementById("mt-entries");
  ReactDOM.render(
    <App
      url={elm.dataset.url}
      perPage={parseInt(elm.dataset.perPage)}
      limit={parseInt(elm.dataset.limit)}
    />,
    elm
  );
});
