import React, { useState, useEffect } from "react";

function Asset({ url }) {
  const thumbnailUrl = url.replace(
    /(\/\.assets\/)([^/]+)\.(\w+)$/,
    "$1thumbnail/$2-240x240i.$3"
  );
  return <img src={thumbnailUrl} className="mr-3" alt="" width="100" />;
}

export default Asset;
