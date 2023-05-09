import "./news.css";
const moment = require("moment");

export default function NewsCard(news) {
  function timeSinceLastUpdated(date) {
    const lastUpdated = new Date(date);
    const now = new Date();
    let diffMs = 0;
    diffMs = now - lastUpdated;

    if (diffMs < 1000) {
      return "Just now";
    } else if (diffMs < 60 * 1000) {
      const diffSec = Math.floor(diffMs / 1000);
      return `${diffSec} sec${diffSec === 1 ? "" : "s"} ago`;
    } else if (diffMs < 60 * 60 * 1000) {
      const diffMin = Math.floor(diffMs / (60 * 1000));
      return `${diffMin} min${diffMin === 1 ? "" : "s"} ago`;
    } else if (diffMs < 24 * 60 * 60 * 1000) {
      const diffHrs = Math.floor(diffMs / (60 * 60 * 1000));
      return `${diffHrs} hour${diffHrs === 1 ? "" : "s"} ago`;
    } else {
      const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    }
  }

  return (
    <div>
      <div className="custom-card">
        <div
          className="article-image"
          style={{ backgroundImage: `url(${news.data?.urlToImage})` }}
        ></div>
        <div className="article-title">{news.data.title}</div>
        <div className="article-details">
          
          <span className="text-muted"> By: {news.data.source.name}</span>
        </div>
        <div className="article-details">
          <a href={news.data.url} target="_blank" rel="noopener noreferrer"> Read more </a>
        </div>
      </div>
    </div>
  );
}
