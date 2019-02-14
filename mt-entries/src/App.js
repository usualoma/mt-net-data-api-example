import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

function Asset({url}) {
  const thumbnailUrl = 
    url.replace(/(\/\.assets\/)([^/]+)\.(\w+)$/, "$1thumbnail/$2-240x240i.$3");
  return (
    <img src={thumbnailUrl} className="mr-3" alt="" width="100" />
  );
}

function App({ url, perPage, limit = 10 }) {
  const pagination = !!perPage;
  if (!perPage) {
    perPage = limit;
  }

  const baseUrl =
    url + (url.match(/\?/) ? "&" : "?") + `limit=${perPage}&offset=`;

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
            {item.assets.length !== 0 ? (
              <Asset {...item.assets[0]} />
            ) : null}
            <div className="media-body">
              <h5 className="mt-0 mb-1">{item.title}</h5>
              <div className="text-secondary small">
                <span className="mr-3">{moment(item.date).format("YYYY/MM/DD hh:mm")}</span>
                <span>{item.author.displayName}</span>
              </div>
              <p>
              {item.excerpt}
            </p>
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

export default App;
