import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import httpService from "../../shared/services/http-service";
import { useNavigate } from "react-router-dom";
import toastr from "toastr";

export default function LoginComponent(props) {
  toastr.options = { closeButton: true };
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const email = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    const isValidEmail = email.test(data.email);
    if (!isValidEmail) {
      toastr.warning("Please enter valid email");
      return;
    }

    try {
      const res = await httpService.axiosInstance.post("/user/login", data);
      if (res.status === 200) {
        toastr.success(res.data.message);
        localStorage.setItem("auth-token", res.data.token);
        localStorage.setItem("isAuthenticated", true);
        if (res.data.filteredUser.role === "admin")
          navigate("/admin", { replace: true });
        else {
          navigate("/", { replace: true });
        }
        handleLoginChange(res.data.filteredUser.role);
      }
    } catch (error) {
      toastr.error(error.response.data.message);
    }
  };

  const handleLoginChange = (event) => {
    props.onDataUpdate(event);
  };

  return (
    <Container component="main" maxWidth="xs">
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
          Login
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
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
            Login
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/join" variant="body2">
                Not a user? Join now
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
