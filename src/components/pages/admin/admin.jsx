import { Box, Grid, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import jwtDecode from "jwt-decode";
import toastr from "toastr";
import { Card, CardContent, Typography } from "@mui/material";
import * as React from "react";
import axios from "axios";

export default function AdminLayout({ children }) {
  return (
    <Grid container>
      <Grid item xs={2}>
        <Sidebar />
      </Grid>
      <Grid item xs={10}>
        <Content>
         {children}
        </Content>
      </Grid>
    </Grid>
  );
}

function Sidebar() {
  const navigate = useNavigate();
  const adminNavItems = [
    { title: "ADMIN", path: "/admin", icon: <DashboardIcon /> },
    { title: "NEWS", path: "/admin/news", icon: <LocalOfferIcon /> },
    { title: "USERS", path: "/admin/users", icon: <PeopleIcon /> },
    { title: "TICKET", path: "/admin/tickets", icon: <EventSeatIcon /> },
    { title: "BOOKINGS", path: "/admin/bookings", icon: <ShoppingCartIcon /> },
    { title: "SHOP", path: "/admin/shop", icon: <ShoppingCartIcon /> },
    { title: "PROFILE", path: "/admin/profile", icon: <AccountCircleIcon /> },
    { title: "LOGOUT", path: "/logout", icon: <ExitToAppIcon /> },
  ];

  function handleNavigation(item) {
    const token = localStorage.getItem("auth-token");
    const decodedToken = token ? jwtDecode(token) : "";
    switch (item.title) {
      case "PROFILE":
        navigate(`${item.path}/${decodedToken.id}`, { replace: true });
        break;
      default:
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          toastr.warning("Session expired, please login again");
          localStorage.removeItem("auth-token");
          navigate("/logout");
          return;
        }
        navigate(item.path, { replace: true });
        break;
    }
  }

  return (
    <Box sx={{ height: "calc(100vh - 130px)", backgroundColor: "grey.200" }}>
      <List>
        {adminNavItems.map((item) => (
          <ListItem
            button
            onClick={() => handleNavigation(item)}
            key={item.title}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

function Content({ children }) {
  return (
    <Box
      sx={{
        maxHeight: "calc(100vh - 162px)",
        marginTop: 4,
        backgroundColor: "white",
        overflow: "auto",
      }}
    >
      {children}
    </Box>
  );
}
