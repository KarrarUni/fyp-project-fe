import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import {
  Button,
  CardMedia,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NewsComponent from "../pages/news/news";
import TestimonialQuotes from "./TestimonialQuotes";
import { useNavigate } from "react-router-dom";
import TicketCard from "./users/tickets/ticketCard";
import axios from "axios";
import ShopItemCard from "./users/shop/shopCard";
import jwtDecode from "jwt-decode";

export default function HomeComponent(props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const headers = {
    authorization: "Bearer " + localStorage.getItem("auth-token"),
  };
  const [tickets, setTickets] = React.useState([]);
  const [shopItems, setShopItems] = React.useState([]);
  const [role, setRole] = React.useState("user");

  const fetchTickets = async () => {
    const res = await axios.get("https://fyp-project-be.onrender.com/api/ticket", {
      headers,
    });
    if (res.status === 200) {
      if (res?.data?.length) {
        setTickets(res?.data?.slice(0, 4));
      }
    }
  };
  const fetchShopItems = async () => {
    const res = await axios.get("https://fyp-project-be.onrender.com/api/shop", {
      headers,
    });
    if (res.status === 200) {
      if (res?.data?.length) {
        setShopItems(res?.data?.slice(0, 4));
      }
    }
  };

  function checkUserSession() {
    const token = localStorage.getItem("auth-token");
    const decodedToken = token ? jwtDecode(token) : "";
    if (decodedToken.role === "admin") {
      setRole("admin");
    }
  }

  const handleView = (event, route) => {
    navigate(`/${route}/${event._id}`);
  };

  const handleBooking = (event) => {
    addToCart(event);
    navigate(`/checkout`);
  };

  const addToCart = (event) => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    const index = items.findIndex((i) => i._id === event._id);
    if (index > -1) {
      items[index].quantity += 1;
    } else {
      items.push({ ...event, quantity: 1, type: "ticket" });
    }
    localStorage.setItem("cartItems", JSON.stringify(items));
    props.onAddToCart(items[index]);
  };

  React.useEffect(() => {
    fetchTickets();
    fetchShopItems();
    checkUserSession();
  }, []);
  const handleNavigation = (path) => {
    navigate(path);
  };
  return (
    <>
      <CssBaseline />

      <Box
        sx={{
          bgcolor: "#1666C0",
          paddingTop: "175px",
          paddingBottom: "75px",
          minHeight: "82vh",
          marginTop: role && role === "user" ? -3 : 0,
        }}
      >
        <Container>
          <Typography
            component="h2"
            variant="h2"
            align="center"
            color="#fff"
            gutterBottom
            style={{ fontFamily: "Anton" }}
            className="animate__animated animate__fadeInLeft "
          >
            Welcome to Beckton FC!
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="#fff"
            paragraph
            className="animate__animated animate__fadeInRight "
          >
            Check out the latest football news or purchase match tickets for our upcoming fixtures!
            
          </Typography>
          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              onClick={() => handleNavigation("/tickets")}
              style={{
                backgroundColor: "#fff",
                color: "#1666C0",
                fontWeight: "bold",
              }}
            >
              Get Latest Tickets
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleNavigation("/shop")}
              style={{
                color: "#fff",
                border: "1.5px solid #fff",
                fontWeight: "bold",
              }}
            >
              View Merchendise
            </Button>
          </Stack>
        </Container>
      </Box>

      <div className="py-5 animate__animated animate__fadeIn">
        <NewsComponent data={"home"} />
      </div>

      <Box
        sx={{
          bgcolor: "#1666C0",
          paddingTop: "105px",
          paddingBottom: "75px",
          minHeight: "40vh",
        }}
      >
        <Container>
          <Typography
            variant="h5"
            align="center"
            color="#fff"
            paragraph
            style={{ fontFamily: "Anton", fontWeight: "normal" }}
            className="animate__animated animate__fadeInRight "
          >
            Register now to become part of the team!
          </Typography>
          <Stack
            sx={{ pt: 4 }}
            direction="row"
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              onClick={() => handleNavigation("/join")}
              style={{
                backgroundColor: "#fff",
                color: "#1666C0",
                fontWeight: "bold",
              }}
            >
              Register
            </Button>
          </Stack>
        </Container>
      </Box>

      <div className="cards py-5">
        {tickets.length ? (
          tickets.map((ticket) => (
            <TicketCard
              ticket={ticket}
              key={ticket._id}
              addToCart={(e) => addToCart(e)}
              handleOnView={(e) => handleView(e, "tickets")}
              handleOnBook={(e) => handleBooking(e)}
            />
          ))
        ) : (
          <div className="text-center mt-5">
            <h3 className="mt-5">No tickets available</h3>
            <h5 className="text-muted">
              Check again in a while to view upcoming tickets.
            </h5>
          </div>
        )}
      </div>

      <Grid
        sx={{
          display: isDesktop ? "flex" : "block",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#1565c0",
          color: "#fff",
          height: "100vh",
          marginY: "24px",
        }}
      >
        <Grid item xs={12} md={6} container>
          <FormatQuoteIcon
            style={{
              fontSize: isDesktop ? "100px" : "50px",
              transform: "rotate(180deg)",
            }}
          />
          <Typography variant="body1" textAlign={"center"}>
          Winning- that's the most important thing to me. It's as simple as that. - Cristiano Ronaldo
          </Typography>
          <FormatQuoteIcon
            style={{
              fontSize: isDesktop ? "100px" : "50px",
              position: "relative",
              left: "78%",
              color: "#fff",
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CardMedia
            style={{
              width: isDesktop ? "375px" : "230px",
              height: "auto",
              margin: isDesktop ? "inherit" : "0px auto",
            }}
            component="img"
            alt="green iguana"
            image="https://www.freepnglogos.com/uploads/football-player-png/football-player-cristiano-ronaldo-png-cristiano-ronaldo-png-image-20.png"
          />
        </Grid>
      </Grid>

      <div className="my-5 cards">
        {shopItems.length ? (
          shopItems?.map((shopItem, i) => (
            <ShopItemCard
              shopItem={shopItem}
              key={i}
              addToCart={(e) => addToCart(e)}
              handleOnView={(e) => handleView(e, "shop")}
              handleOnBook={(e) => handleBooking(e)}
            />
          ))
        ) : (
          <div className="text-center mt-5">
            <h3 className="mt-5">No items are available at the moment.</h3>
            <h5 className="text-muted">Please check back in after a while.</h5>
          </div>
        )}
      </div>

      <TestimonialQuotes />
    </>
  );
}
