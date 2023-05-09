import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import toastr from "toastr";
import jwt_decode from "jwt-decode";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";

export default function AddTicketFormComponent() {
  const navigate = useNavigate();
  const token = localStorage.getItem("auth-token");
  const decoded = jwt_decode(token);
  const { id } = useParams();
  const [uploading, setUploading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    match: "",
    description: "",
    date: "",
    time: "",
    seat: "",
    price: "",
    total: "",
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
      if (formData[key] === "" && (formData[key] === "description" || formData[key] === "image_url")) {
        newErrors[key] = "This field is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (id) {
      const res = await axios.put(
        "https://fyp-project-be.onrender.com/api/ticket/" + id,
        formData,
        {
          headers: {
            authorization: "Bearer " + token,
          },
        }
      );
      if (res.status === 200) {
        toastr.success("Ticket updated successfully");
        navigate("/admin/tickets");
      } else {
        toastr.error(res?.data?.message ?? "Unable to add ticket");
      }
    } else {
      const res = await axios.post(
        "https://fyp-project-be.onrender.com/api/ticket/create",
        formData,
        {
          headers: {
            authorization: "Bearer " + token,
          },
        }
      );
      if (res.status === 201) {
        toastr.success("Ticket added successfully");
        setFormData({
          match: "",
          date: "",
          time: "",
          seat: "",
          price: "",
          remaining_tickets: "",
          sold_out: "",
          total: "",
          image_url: "",
        });
        navigate("/admin/tickets");
      } else {
        toastr.error(res?.data?.message ?? "Unable to add ticket");
      }
    }
  };

  const fetchTicketDetails = async () => {
    const res = await axios.get(`https://fyp-project-be.onrender.com/api/ticket/${id}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
    if (res.status === 200) {
      setFormData(res.data);
    }
  };

  React.useEffect(() => {
    if (id) fetchTicketDetails();
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
          {id ? "Update Ticket Information" : "Add Ticket Information"}
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="match"
                required
                fullWidth={true}
                id="match"
                label="Match"
                value={formData.match}
                error={errors.match !== undefined}
                helperText={errors.match}
                onChange={handleChange}
                placeholder="Enter Match Name"
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
                error={errors.description !== undefined}
                helperText={errors.description}
                onChange={handleChange}
                placeholder="Enter Match Description"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth={true}
                name="date"
                label="Date"
                type="date"
                id="date"
                value={moment(formData.date).format("yyyy-MM-DD")}
                error={errors.date !== undefined}
                helperText={errors.date}
                onChange={handleChange}
                placeholder="Enter Match Date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth={true}
                name="time"
                label="Time"
                type="time"
                id="time"
                value={formData.time}
                error={errors.time !== undefined}
                helperText={errors.time}
                onChange={handleChange}
                placeholder="Select Match Time"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth={true}
                name="seat"
                label="Seat"
                id="seat"
                value={formData.seat}
                error={errors.seat !== undefined}
                helperText={errors.seat ?? "Economy, Vip, Luxury"}
                onChange={handleChange}
                placeholder="Enter Seat Type"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth={true}
                name="price"
                label="Price"
                id="price"
                value={formData.price}
                error={errors.price !== undefined}
                helperText={errors.price}
                onChange={handleChange}
                placeholder="Enter Ticket Price"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth={true}
                name="total"
                label="Total"
                id="total"
                value={formData.total}
                error={errors.total !== undefined}
                helperText={errors.total}
                onChange={handleChange}
                placeholder="Total Seats"
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
            onClick={handleSubmit}
          >
            {id ? "Save Ticket" : "Add Ticket"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
