import jwtDecode from "jwt-decode";
import React from "react";
import { Link } from "react-router-dom";
import "./news.css";

export default function NewsCard(news) {
  const [role, setRole] = React.useState("user");
  React.useEffect(() => {
    const token = localStorage.getItem("auth-token");
    const decodedToken = token ? jwtDecode(token) : "";
    if (decodedToken.role === "admin") {
      setRole("admin");
    }
  }, []);

  return (
    <div>
      <div className="custom-card">
        <div
          className="article-image"
          style={{
            backgroundImage: `url(${
              news.data?.urlToImage ?? news.data?.image_url
            })`,
          }}
        ></div>
        <div className="article-title">{news.data.title}</div>
        <div className="article-details">
          <span className="text-muted">
            {" "}
            By: {news.data.source.name ?? news.data.source}
          </span>
        </div>
        <div className="article-details">
          {/* <a
            href={news.data.url ?? `/admin/news/${news.data._id}`}
            target={news.data.url ? "_blank" : ''}
            rel="noopener noreferrer"
          >
            {" "}
            Read more{" "}
          </a> */}
          {news.data.url ? (
            <a href={news.data.url} target="_blank" rel="noopener noreferrer">
              {" "}
              Read more{" "}
            </a>
          ) : (
            <Link
              to={
                role === "admin"
                  ? `/admin/news/${news.data._id}`
                  : `/news/${news.data._id}`
              }
            >
              Read More
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
