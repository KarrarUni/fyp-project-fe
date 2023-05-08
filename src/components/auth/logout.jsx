import { Box, Paper, Typography } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutComponent(props) {
  const navigate = useNavigate();
  const handleLogoutChange = useCallback(
    (event) => {
      props.onDataUpdate(event);
    },
    [props]
  );

  useEffect(() => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("isAuthenticated");
    setTimeout(() => {
      navigate("/login", { replace: true });
      handleLogoutChange('logout')
    }, 2000);
  }, [handleLogoutChange, navigate]);

  return (
    <div className="container">
      <div className="logout-container">
        <Paper
          elevation={8}
          sx={{
            borderRadius: "10px",
          }}
        >
          <Box
            className="elevation8"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 280,
              width: 400,
              backgroundColor: "primary.main",
              borderRadius: "10px",
            }}
          >
            <Typography
              component="h1"
              variant="h5"
              sx={{
                textAlign: "center",
                color: "#fff",
                marginBottom: "20px",
              }}
            >
              Logging Out...
            </Typography>
            <Typography
              component="h1"
              variant="h6"
              sx={{
                textAlign: "center",
                color: "#fff",
              }}
            >
              Thanks for using Soccer FC
            </Typography>
          </Box>
        </Paper>
      </div>
    </div>
  );
}
