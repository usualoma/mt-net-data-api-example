import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";

function Entry({
  apiUrl,
  setBreadcrumb,
  match: {
    params: { id },
  },
}) {
  const [prev, setPrev] = useState(null);
  const [next, setNext] = useState(null);
  const [item, setItem] = useState(null);

  useEffect(
    () => {
      axios(
        `${apiUrl}/${id}?fields=id,title,author,date,body,more,categories`
      ).then(({ data }) => {
        setItem(data);

        axios(
          `${apiUrl}?fields=id,title&limit=1&dateField=authored_on&dateFrom=${moment(
            data.date
          )
            .add(1, "day")
            .format("YYYY-MM-DD")}`
        ).then(({ data }) => {
          setNext(data.items[0]);
        });

        axios(
          `${apiUrl}?fields=id,title&limit=1&sortOrder=descend&dateTo=${moment(
            data.date
          )
            .subtract(1, "day")
            .format("YYYY-MM-DD")}`
        ).then(({ data }) => {
          setPrev(data.items[0]);
        });
      });
    },
    [id]
  );

  useEffect(
    () => {
      if (!item) {
        return;
      }

      const breadcrumb = [];

      //if (item.categories.length !== 0) {
      //  breadcrumb.push({
      //    url: `/categories/${item.categories[0].id}`,
      //    title: item.categories[0].label,
      //  });
      //}

      setBreadcrumb(breadcrumb.concat([{ title: item.title }]));
    },
    [item && item.title]
  );

  return (
    <>
      {item ? (
        <>
          <h2>{item.title}</h2>
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
          <div dangerouslySetInnerHTML={{ __html: item.body }} />
          <div dangerouslySetInnerHTML={{ __html: item.more }} />

          {prev ? (
            <Link to={`/entries/${prev.id}`}>
              <button type="button" className="btn btn-link">
                &laquo; ${prev.title}
              </button>
            </Link>
          ) : null}
          {next ? (
            <Link to={`/entries/${next.id}`}>
              <button type="button" className="btn btn-link">
                ${next.title} &raquo;
              </button>
            </Link>
          ) : null}
        </>
      ) : null}
    </>
  );
}

export default Entry;
