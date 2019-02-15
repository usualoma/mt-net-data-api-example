import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Asset from "./Asset";

function Entries({
  apiUrl,
  perPage,
  limit = 10,
  setBreadcrumb,
  match: {
    params: { page },
    url,
  },
}) {
  const pagination = !!perPage;
  if (!perPage) {
    perPage = limit;
  }

  const baseUrl =
    apiUrl +
    (apiUrl.match(/\?/) ? "&" : "?") +
    `fields=id,title,author,date,excerpt,assets,permalink,categories&limit=${perPage}&offset=`;
  const offset = page ? (page - 1) * perPage : 0;

  const categoryId = (baseUrl.match(/categories\/(\d+)/) || [])[1];
  const [category, setCategory] = useState(null);
  const [data, setData] = useState({ items: [], totalResults: 0 });

  async function fetchData() {
    const result = await axios(baseUrl + offset);
    setData(result.data);
  }

  useEffect(
    () => {
      fetchData();
    },
    [apiUrl, offset]
  );

  async function fetchCategory() {
    const result = await axios(baseUrl.replace(/\/entries.*/, ""));
    setCategory(result.data);
  }

  useEffect(
    () => {
      if (categoryId) {
        fetchCategory();
      } else {
        setCategory(null);
      }
    },
    [categoryId]
  );

  useEffect(
    () => {
      if (category) {
        setBreadcrumb([
          {
            title: category.label,
          },
        ]);
      } else {
        setBreadcrumb([]);
      }
    },
    [category && category.id]
  );

  function getPage(offset) {
    let base = url;
    if (page) {
      base = base.replace(/\/\d+$/, "");
    }
    const i = Math.floor(offset / perPage) + 1;
    if (base === "/") {
      base = "";
    }
    return i > 1 ? `${base}/${i}` : base;
  }

  function getPagelist() {
    const current = Math.ceil(offset / perPage) + 1;
    const last = Math.ceil(data.totalResults / perPage);
    return [...Array(last).keys()].reduce((list, i) => {
      const p = i + 1;
      if (p === 1 || p === last || (p >= current - 2 && p <= current + 2)) {
        list.push(p);
      } else if (list[list.length - 1]) {
        list.push(null);
      }

      return list;
    }, []);
  }

  const hasPrev = offset !== 0;
  const hasNext = offset + perPage < data.totalResults;
  return (
    <>
      <ul className="list-unstyled">
        {data.items.map(item => (
          <li key={item.id} className="media">
            {item.assets.length !== 0 ? <Asset {...item.assets[0]} /> : null}
            <div className="media-body">
              <Link to={`/entries/${item.id}`} className="text-body">
                <h5 className="mt-0 mb-1">{item.title}</h5>
              </Link>
              <div className="text-secondary small">
                <span className="mr-3">
                  {moment(item.date).format("YYYY/MM/DD hh:mm")}
                </span>
                <span className="mr-3">{item.author.displayName}</span>
                {item.categories.map(c => (
                  <Link
                    key={c.id}
                    to={`/categories/${c.id}`}
                    className="mr-3 badge badge-secondary"
                  >
                    {c.label}
                  </Link>
                ))}
              </div>
              <p>{item.excerpt}</p>
            </div>
          </li>
        ))}
      </ul>
      {pagination ? (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${hasPrev ? "" : "disabled"}`}>
              <Link
                className="page-link"
                tabIndex="-1"
                aria-disabled={!hasPrev}
                aria-label="Previous"
                to={getPage(offset - perPage)}
              >
                <span aria-hidden="true">&laquo;</span>
              </Link>
            </li>
            {getPagelist().map((p, i) => {
              if (!p) {
                return (
                  <li key={i + 1} className="page-item">
                    <a class="page-link" disabled>
                      …
                    </a>
                  </li>
                );
              } else {
                const o = (p - 1) * perPage;
                return (
                  <li
                    key={i + 1}
                    className={"page-item" + (offset === o ? " active" : "")}
                  >
                    <Link className="page-link" to={getPage(o)}>
                      {p}
                    </Link>
                  </li>
                );
              }
            })}
            <li className={`page-item ${hasNext ? "" : "disabled"}`}>
              <Link
                className="page-link"
                tabIndex="-1"
                aria-disabled={!hasNext}
                aria-label="Next"
                to={getPage(offset + perPage)}
              >
                <span aria-hidden="true">&raquo;</span>
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </>
  );
}

export default Entries;
