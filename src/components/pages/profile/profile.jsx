import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Select from "@mui/material/Select";
import { MenuItem, FormControl, InputLabel } from "@mui/material";
import toastr from "toastr";
import { useEffect } from "react";
import moment from "moment";
import jwt_decode from "jwt-decode";
import axios from "axios";

export default function ProfileComponent() {
  toastr.options = { closeButton: true };
  const [userId, setUserId] = React.useState("");
  const [profileForm, setProfileForm] = React.useState({});
  const handleGenderChange = (event) => {
    setProfileForm({ ...profileForm, gender: event.target.value });
  };

  const handleDataChange = (event) => {
    setProfileForm((profileForm) => ({
      ...profileForm,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    const headers = {
      authorization: "Bearer " + localStorage.getItem("auth-token"),
    };
    event.preventDefault();
    const data = {
      _id: profileForm._id,
      first_name: profileForm.first_name,
      last_name: profileForm.last_name,
      email: profileForm.email,
      date_of_birth: profileForm.date_of_birth,
      gender: profileForm.gender,
      phone: profileForm.phone,
    };

    try {
      const res = await axios.put(
        "https://fyp-project-be.onrender.com/api/user/" + userId,
        data,
        { headers }
      );
      if (res.status === 200) {
        toastr.success(res.data.message);
      }
    } catch (error) {
      toastr.error(error.response.data.message);
    }
  };

  const fetchUserData = async (id) => {
    const headers = {
      authorization: "Bearer " + localStorage.getItem("auth-token"),
    };
    try {
      const res = await axios.get("https://fyp-project-be.onrender.com/api/user/" + id, {
        headers,
      });
      if (res.status === 200) {
        const data = res.data;
        setProfileForm(data);
      }
    } catch (error) {
      toastr.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const decodeToken = jwt_decode(localStorage.getItem("auth-token"));
    setUserId(decodeToken.id);
    setTimeout(() => {
      fetchUserData(decodeToken.id);
    }, 100);
  }, []);

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      {profileForm._id && (
        <Box>
          <Typography
            component="h1"
            variant="h5"
            sx={{
              textAlign: "center",
              margin: "80px 0px 30px 0px",
            }}
          >
            Update Profile
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="first_name"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  placeholder="Enter your First Name"
                  onChange={handleDataChange}
                  defaultValue={profileForm.first_name}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  name="last_name"
                  placeholder="Enter your Last Name"
                  onChange={handleDataChange}
                  defaultValue={profileForm.last_name}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  placeholder="Enter Valid Email Address"
                  onChange={handleDataChange}
                  defaultValue={profileForm.email}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    readOnly: true,
                  }}
                  helperText="Can't edit email address"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="phone"
                  label="Phone"
                  name="phone"
                  autoComplete="phone"
                  placeholder="+1 567483234"
                  onChange={handleDataChange}
                  defaultValue={profileForm.phone}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  inputlabelprops={{
                    shrink: true,
                  }}
                  fullWidth
                  required
                >
                  <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Gender"
                    defaultValue={profileForm.gender ?? ""}
                    onChange={handleGenderChange}
                  >
                    <MenuItem value={"male"}>Male</MenuItem>
                    <MenuItem value={"female"}>Female</MenuItem>
                    <MenuItem value={"other"}>Not Specified</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="date_of_birth"
                  label="Date of Birth"
                  type="date"
                  id="date_of_birth"
                  placeholder="Select Your Date Of Birth"
                  onChange={handleDataChange}
                  defaultValue={moment(profileForm.date_of_birth).format(
                    "YYYY-MM-DD"
                  )}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update Info
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}
