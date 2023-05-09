import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  ButtonGroup,
  Button,
} from "@mui/material";
import axios from "axios";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";

const ViewNewsPage = () => {
  const [news, setNews] = useState([]);
  const { id } = useParams();
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      const result = await axios.get("https://fyp-project-be.onrender.com/api/news/" + id);
      setNews(result.data);
    };
    fetchNews();
    const token = localStorage.getItem("auth-token");
    const decodedToken = token ? jwtDecode(token) : "";
    if (decodedToken.role === "admin") {
      setRole("admin");
    }
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/news/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://fyp-project-be.onrender.com/api/news/${id}`);
      navigate("/admin/news/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Button
        style={{ display: "flex", margin: "20px" }}
        variant="contained"
        onClick={() => navigate(role === "admin" ? "/admin/news" : "/news")}
      >
        Go Back
      </Button>
      <Card key={news._id} style={{ display: "flex", margin: "20px" }}>
        {news.image_url && (
          <CardMedia style={{ minWidth: "200px" }} image={news.image_url} />
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <CardContent>
            <Typography variant="h5" component="h2" style={{
              marginBottom: "10px"
            }}>
              {news.title}
            </Typography>
            <Typography variant="body2" component="p">
              {news.description}
            </Typography>
          </CardContent>
          {role === "admin" && (
            <div style={{ margin: "5px" }}>
              <ButtonGroup variant="contained">
                <Button
                  color="primary"
                  startIcon={<Edit />}
                  onClick={() => handleEdit(news._id)}
                >
                  Edit
                </Button>
                <Button
                  color="secondary"
                  startIcon={<Delete />}
                  onClick={() => handleDelete(news._id)}
                >
                  Delete
                </Button>
              </ButtonGroup>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ViewNewsPage;
