import { useNavigate } from "react-router-dom";
import "./news.css";

export default function NewsCard(news) {
  const navigate = useNavigate();
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
          <a
            href={news.data.url ?? `/news/${news.data._id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Read more{" "}
          </a>
        </div>
      </div>
    </div>
  );
}
