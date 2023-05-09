import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import toastr from "toastr";

function Header(props) {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const userNavItems = [
    { title: "HOME", path: "/", icon: "" },
    { title: "NEWS", path: "/news", icon: "" },
    { title: "TICKET", path: "/tickets", icon: "" },
    { title: "MY BOOKINGS", path: "/bookings", icon: "" },
    { title: "SHOP", path: "/shop", icon: "" },
    { title: "JOIN", path: "/join", icon: "fa fa-user" },
    { title: "PROFILE", path: "/profile", icon: "fa fa-user" },
    { title: "CART", path: "/cart", icon: "fa fa-shopping-cart" },
    { title: "LOGIN", path: "/login", icon: "" },
    { title: "LOGOUT", path: "/logout", icon: "" },
  ];


  let setNavigation = userNavItems;

  function checkUserSession() {
    const data = JSON.parse(localStorage.getItem("isAuthenticated"));
    const token = localStorage.getItem("auth-token");
    const decodedToken = token ? jwtDecode(token) : "";
    if (decodedToken.role === "admin") {
      setRole("admin");
    }
    if (data) {
      setIsLoggedIn(data);
    }
  }

  function handleNavigation(item) {
    const token = localStorage.getItem("auth-token");
    const decodedToken = token ? jwtDecode(token) : "";
    switch (item.title) {
      case "PROFILE":
        navigate(`${item.path}/${decodedToken.id}`, { replace: true });
        break;
      case "CART":
        handleOpenCart();
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

  function handleOpenCart() {
    props.onOpenCart(true);
  }

  useEffect(() => {
    checkUserSession();
    if (props.data) {
      setRole(props.data);
      checkUserSession();
    }
  }, [props.data]);

  return (
    <div>
      <Box
        sx={{
          width: "100%",
          height: 30,
          backgroundColor: "primary.dark",
        }}
      />
      <Box
        className="header-container"
        sx={{
          width: "100%",
          height: 100,
          backgroundColor: "#ffffff",
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px;",
          marginBottom: (role && role === 'user') ? 3 : 0 
        }}
        
      >
        <div className="d-flex justify-content-between align-items-center h-100 px-5 header">
          <div
            className="logo"
            style={{ height: "70px", width: "70px" }}
            onClick={() => navigate("/")}
          >
            <img
              src="https://firebasestorage.googleapis.com/v0/b/kayrarr-14eac.appspot.com/o/uploads%2FBecktonFC.png?alt=media&token=f24d8efa-847a-4c3c-a322-9b5371c28434"
              alt=""
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
          <div className="main_navigation">
            {role==="user"&& setNavigation.map((item, i) => {
              // check if the current item is the login link and the user is logged in
              if (
                (item.title === "LOGIN" || item.title === "JOIN") &&
                isLoggedIn
              ) {
                return null; // hide the login link
              } else if (
                (item.title === "LOGOUT" ||
                  item.title === "PROFILE") &&
                !isLoggedIn
              ) {
                return null; // hide the logout link
              }

              return (
                <Button
                  key={i}
                  sx={{ color: "#000", paddingInline: "15px" }}
                  onClick={() => handleNavigation(item)}
                >
                  {item.title}
                  {item.icon && (
                    <i
                      className={item.icon}
                      style={{
                        marginLeft: 10,
                        color: "#1565c0",
                      }}
                    ></i>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </Box>
    </div>
  );
}
export default Header;
