import React from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import toastr from "toastr";
import jwt_decode from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";

export default function AddShopFormComponent() {
  const navigate = useNavigate();
  const token = localStorage.getItem("auth-token");
  const decoded = jwt_decode(token);
  const { id } = useParams();
  const [uploading, setUploading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    item: "",
    description: "",
    quantity: "",
    category: "",
    price: "",
    image_url: "",
    created_by: decoded.id,
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
    const res = await axios.post("http://localhost:4000/api/upload", fileData, {
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
        `http://localhost:4000/api/shop/${id}`,
        formData,
        {
          headers: {
            authorization: "Bearer " + token,
          },
        }
      );

      if (res.status === 200) {
        toastr.success("Shop Item Updated Successfully");
        navigate("/admin/shop");
      } else {
        toastr.error("Unable to update Shop Item");
      }
    } else {
      const res = await axios.post(
        "http://localhost:4000/api/shop/create",
        formData,
        {
          headers: {
            authorization: "Bearer " + token,
          },
        }
      );
      if (res.status === 201) {
        toastr.success("Shop Item added successfully");
        setFormData({
          item: "",
          description: "",
          quantity: "",
          category: "",
          price: "",
          total: "",
          image_url: "",
          created_by: decoded.id,
        });
        navigate("/admin/shop");
      } else {
        toastr.error(res?.data?.message ?? "Unable to add Shop Item");
      }
    }
  };

  const fetchProductDetails = async () => {
    const res = await axios.get(`http://localhost:4000/api/shop/${id}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    if (res.status === 200) {
      setFormData(res.data);
    }
  };

  React.useEffect(() => {
    if (id) fetchProductDetails();
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
          {id ? "Update Item" : "Add new Shop Item"}
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="item"
                required
                fullWidth={true}
                id="item"
                label="Item"
                value={formData.item}
                error={errors.item !== undefined}
                helperText={errors.item}
                onChange={handleChange}
                placeholder="Enter item Name"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                fullWidth={true}
                id="description"
                label="Description"
                value={formData.description}
                error={errors.match !== undefined}
                helperText={errors.match}
                onChange={handleChange}
                placeholder="Enter Match Description"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl
                inputlabelprops={{
                  shrink: true,
                }}
                fullWidth
                required
              >
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Categpry"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <MenuItem value={"men"}>Men</MenuItem>
                  <MenuItem value={"women"}>Women</MenuItem>
                  <MenuItem value={"kid"}>Kids</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="quantity"
                required
                fullWidth={true}
                id="quantity"
                label="Quantity"
                type="number"
                value={formData.quantity}
                error={errors.quantity !== undefined}
                helperText={errors.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                fullWidth={true}
                id="price"
                label="Price"
                type="number"
                value={formData.price}
                error={errors.match !== undefined}
                helperText={errors.match}
                onChange={handleChange}
                placeholder="Enter price $"
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
            {id ? "Save Item" : "Add Item"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
