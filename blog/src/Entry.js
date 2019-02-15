import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

function Entry({
  apiUrl,
  setTitle,
  match: {
    params: { id },
  },
}) {
  const [item, setItem] = useState(null);

  async function fetchItem() {
    const result = await axios(
      `${apiUrl}/${id}?fields=id,title,author,date,body,more`
    );
    setItem(result.data);
  }

  useEffect(() => {
    fetchItem();
  }, []);

  if (item) {
    setTitle(item.title);
  }

  return (
    <>
      {item ? (
        <>
          <h2>{item.title}</h2>
          <div className="text-secondary small">
            <span className="mr-3">
              {moment(item.date).format("YYYY/MM/DD hh:mm")}
            </span>
            <span>{item.author.displayName}</span>
          </div>
          <div dangerouslySetInnerHTML={{ __html: item.body }} />
          <div dangerouslySetInnerHTML={{ __html: item.more }} />
        </>
      ) : null}
    </>
  );
}

export default Entry;
