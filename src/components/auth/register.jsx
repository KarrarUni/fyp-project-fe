import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Select from "@mui/material/Select";
import { MenuItem, FormControl, InputLabel } from "@mui/material";
import httpService from "../../shared/services/http-service";
import { useNavigate } from "react-router-dom";

export default function RegisterComponent() {
  const navigate = useNavigate();
  const [gender, setGender] = React.useState("male");

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const email = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    const isValidEmail = email.test(data.email);
    if (!isValidEmail) {
      alert("Please enter valid email");
      return;
    }

    const res = await httpService.axiosInstance.post("/user/register", data);
    switch (res.status) {
      case 201:
        navigate("/login", { replace: true });
        break;
      case 200:
        alert(res.data.message);
        break;
      default:
        alert("Something went wrong, please try again later");
        break;
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box>
        <Typography
          component="h1"
          variant="h5"
          sx={{
            textAlign: "center",
            margin: "30px 0px",
          }}
        >
          Join Us
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="first_name"
                required
                fullWidth
                id="firstName"
                label="First Name"
                placeholder="Enter your First Name"
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
                InputLabelProps={{ shrink: true }}
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
                  name="gender"
                  value={gender}
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
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  height: "90px",
                  backgroundColor: "#ccc",
                }}
              >
                <Typography
                  sx={{
                    color: "#000",
                    fontSize: "12px",
                    padding: "20px 10px",
                  }}
                >
                  * Password must be at least 6 characters long <br />
                  * You can include letters, numbers, and the following <br />*
                  Do not share your password with anyone
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                placeholder="Enter your password"
                autoComplete="new-password"
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
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
