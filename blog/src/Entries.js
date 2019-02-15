import Path from "path";
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Asset from "./Asset";

function Entries({ apiUrl, perPage, path, limit = 10, history }) {
  const pagination = !!perPage;
  if (!perPage) {
    perPage = limit;
  }

  const baseUrl =
    apiUrl +
    (apiUrl.match(/\?/) ? "&" : "?") +
    `fields=id,title,author,date,excerpt,assets,permalink&limit=${perPage}&offset=`;

  const [data, setData] = useState({ items: [], totalResults: 0 });
  const [offset, setOffset] = useState(0);

  async function fetchData() {
    const result = await axios(baseUrl + offset);
    setData(result.data);
  }

  useEffect(
    () => {
      fetchData();
    },
    [offset]
  );

  const hasPrev = offset !== 0;
  const hasNext = offset + perPage < data.totalResults;
  return (
    <>
      <ul className="list-unstyled">
        {data.items.map(item => (
          <li key={item.id} className="media">
            {item.assets.length !== 0 ? <Asset {...item.assets[0]} /> : null}
            <div className="media-body">
              <a
                href={Path.join(path, "/entries/", String(item.id))}
                className="text-body"
                onClick={ev => {
                  ev.preventDefault();
                  history.push(Path.join(path, "/entries/", String(item.id)));
                }}
              >
                <h5 className="mt-0 mb-1">{item.title}</h5>
              </a>
              <div className="text-secondary small">
                <span className="mr-3">
                  {moment(item.date).format("YYYY/MM/DD hh:mm")}
                </span>
                <span>{item.author.displayName}</span>
              </div>
              <p>{item.excerpt}</p>
            </div>
          </li>
        ))}
      </ul>
      {pagination ? (
        <nav aria-label="Page navigation">
          <ul className="pagination">
            <li className={`page-item ${hasPrev ? "" : "disabled"}`}>
              <a
                className="page-link"
                tabIndex="-1"
                aria-disabled={!hasPrev}
                aria-label="Previous"
                href="javascript:void(0)"
                onClick={() => setOffset(offset - perPage)}
              >
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            {[...Array(Math.ceil(data.totalResults / perPage)).keys()].map(
              p => {
                const o = p * perPage;
                return (
                  <li
                    key={p + 1}
                    className={"page-item" + (offset === o ? " active" : "")}
                  >
                    <a
                      className="page-link"
                      href="javascript:void(0)"
                      onClick={() => setOffset(o)}
                    >
                      {p + 1}
                    </a>
                  </li>
                );
              }
            )}
            <li className={`page-item ${hasNext ? "" : "disabled"}`}>
              <a
                className="page-link"
                tabIndex="-1"
                aria-disabled={!hasNext}
                aria-label="Next"
                href="javascript:void(0)"
                onClick={() => setOffset(offset + perPage)}
              >
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </>
  );
}

export default Entries;
