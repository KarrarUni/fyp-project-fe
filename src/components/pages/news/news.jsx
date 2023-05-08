import { useState, useEffect } from "react";
import axios from "axios";
import NewsCard from "./newsCard";
import "./news.css";
import { TextField, Typography } from "@mui/material";

export default function NewsComponent(props) {
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const baseUrl = "https://fyp-project-be.onrender.com/api/news";

  const getNews = () => {
    const url = search ? `${baseUrl}?${search}` : baseUrl;
    axios
      .get(url)
      .then((response) => {
        response.data.articles =
          props.data === "home"
            ? response.data.articles.slice(0, 10)
            : response.data.articles;
        setNews(response.data.articles);
      })
      .catch((error) => console.error(error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getNews();
  };

  useEffect(() => {
    getNews();
  }, []);

  return (
    <>
      <div className={!props.data ? "container" : "container-fluid"}>
        {!props.data && (
          <div className="d-flex justify-content-between align-items-center mb-5">
            <Typography variant="h5" className="mt-3" gutterBottom>
              News
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                id="search-news"
                label="Search News"
                variant="outlined"
                sx={{
                  width: 300,
                  height: 40,
                }}
                placeholder="Search News"
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
          </div>
        )}
        <div className="cards">
          {news.length ? (
            news.map((news, i) => <NewsCard data={news} key={i} />)
          ) : (
            <h5 className="text-muted">Loading...</h5>
          )}
        </div>
      </div>
    </>
  );
}
