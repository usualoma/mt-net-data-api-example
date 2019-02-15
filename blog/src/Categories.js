import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

function Categories({ apiUrl }) {
  const [data, setData] = useState({ items: [], totalResults: 0 });

  async function fetchData() {
    const result = await axios(apiUrl);
    setData(result.data);
  }

  useEffect(
    () => {
      fetchData();
    },
    [apiUrl]
  );

  return (
    <>
      <ul className="nav nav-pills flex-column">
        {data.items.map(item => (
          <li key={item.id} className="nav-item">
            <NavLink className="nav-link" to={`/categories/${item.id}`}>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Categories;
