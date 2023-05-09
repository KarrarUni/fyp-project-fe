import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import toastr from "toastr";
import jwt_decode from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";

export default function AddNewsComponent() {
  const navigate = useNavigate();
  const token = localStorage.getItem("auth-token");
  const decoded = jwt_decode(token);
  const { id } = useParams();
  const [uploading, setUploading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    source: "",
    image_url: "",
  });
  const [errors, setErrors] = React.useState({});

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFileUpload = async (event) => {
    setUploading(true);
    const fileData = new FormData();
    fileData.append("file", event.target.files[0]);
    const res = await axios.post("https://fyp-project-be.onrender.com/api/upload", fileData, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    if (res.status === 200) {
      toastr.success("Image uploaded successfully");
      setUploading(false);
      handleChange({ target: { name: "image_url", value: res.data.imageUrl } });
    } else {
      setUploading(false);
      toastr.error("Unable to upload image, try passing url instead");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
        if (formData[key] === "") {
            newErrors[key] = "This field is required";
        }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (id) {
      const res = await axios.put(
        `https://fyp-project-be.onrender.com/api/news/${id}`,
        formData,
        {
          headers: {
            authorization: "Bearer " + token,
          },
        }
      );

      if (res.status === 200) {
        toastr.success("News Article Updated Successfully");
        navigate("/admin/news");
      } else {
        toastr.error("Unable to update News Article");
      }
    } else {
      const res = await axios.post(
        "https://fyp-project-be.onrender.com/api/news",
        formData,
        {
          headers: {
            authorization: "Bearer " + token,
          },
        }
      );
      if (res.status === 201) {
        toastr.success("News Article added successfully");
        setFormData({
          title: "",
          description: "",
          url: "",
          source: "",
          created_by: decoded.id,
        });
        navigate("/admin/news");
      } else {
        toastr.error(res?.data?.message ?? "Unable to add News Article");
      }
    }
  };

  const fetchNewsArticles = async () => {
    const res = await axios.get(`https://fyp-project-be.onrender.com/api/news/${id}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    if (res.status === 200) {
      setFormData(res.data);
    }
  };

  React.useEffect(() => {
    if (id) fetchNewsArticles();
  }, []);

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box>
        <Typography
          component="h1"
          variant="h5"
          sx={{
            textAlign: "center",
            margin: "30px 0px",
          }}
        >
          {id ? "Update Item" : "Add new News Article"}
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="title"
                required
                fullWidth={true}
                id="title"
                label="Title"
                value={formData.title}
                error={errors.item !== undefined}
                helperText={errors.item}
                onChange={handleChange}
                placeholder="Enter News title"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextareaAutosize
                name="description"
                fullWidth={true}
                id="description"
                label="Description"
                value={formData.description ?? ''}
                error={errors.match !== undefined}
                helperText={errors.match}
                onChange={handleChange}
                minRows={10}
                placeholder="Enter News Description"
                style={{ width: "100%" }}
              />
            </Grid>

            <Grid item xs={12} >
              <TextField
                name="source"
                fullWidth={true}
                id="source"
                label="Source"
                type="text"
                value={formData.source}
                error={errors.source !== undefined}
                helperText={errors.source}
                onChange={handleChange}
                placeholder="Enter news source"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth={true}
                name="image_url"
                label="Image URL"
                id="image_url"
                value={formData.image_url}
                error={errors.image_url !== undefined}
                helperText={errors.image_url}
                onChange={handleChange}
                placeholder="Enter Image Url"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth={true}
                id="upload-file"
                type="file"
                name="file"
                onChange={handleFileUpload}
                className="align-self-end"
                inputprops={{ accept: "image/*" }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {formData.image_url && (
              <Grid item sm={12}>
                <img
                  src={formData.image_url}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Grid>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth={true}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={uploading}
          >
            {id ? "Upoate News Article" : "Add News Article"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
