import * as React from "react";
import { Button, Container, Grid, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";

export default function TicketCardDerailsComponent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("auth-token");
  const [soldOut, setSoldOut] = React.useState(false);

  const [data, setFormData] = React.useState({
    match: "",
    description: "",
    date: "",
    time: "",
    seat: "",
    price: "",
    total: "",
    image_url: "",
  });

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
  };

  React.useEffect(() => {
    const fetchTicketDetails = async () => {
      const res = await axios.get(`https://fyp-project-be.onrender.com/api/ticket/${id}`, {
        headers: {
          authorization: "Bearer " + token,
        },
      });
      if (res.status === 200) {
        if (res.data.total - res.data.sold === 0) {
          setSoldOut(true);
        }
        setFormData(res.data);
      }
    };
    if (id) fetchTicketDetails();
  }, [id, token]);
  return (
    <Container component="main" maxWidth="md">
      <Typography
        variant="h5"
        component="h3"
        sx={{
          marginTop: 5,
          marginBottom: 5,
        }}
      >
        <Typography variant="body1">
          {" "}
          <Link to="/tickets">Go Back</Link>
        </Typography>
        Ticket Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <img
            src={data.image_url}
            alt={data.match}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" component="h3">
            {data.match}
          </Typography>
          <Typography variant="body1">
            Description: {data.description}
          </Typography>
          <Typography variant="body1">
            Date and Time: {moment(data.date).format("MM-DD-YYYY")} -{" "}
            {data.time}
          </Typography>
          <Typography variant="body1">
            Seat Type: {data.seat.toUpperCase()}
          </Typography>
          {data.total - data.sold === 0 ? (
            <Typography variant="body1">
              Sold Out
            </Typography>
          ) : (
            <Typography variant="body1">
              Remaining tickets: {data.total - data.sold}
            </Typography>
          )}
          <Typography
            variant="h6"
            style={{
              marginTop: 2,
              marginBottom: 2,
              fontWeight: "bold",
            }}
          >
            Price: {data.price} $
          </Typography>

          <Button
            variant="contained"
            sx={{
              marginTop: "40px",
            }}
            onClick={() => addToCart(data)}
            disabled={soldOut}
          >
            Add to Cart
          </Button>

          <Button
            variant="contained"
            sx={{
              marginTop: "40px",
              marginLeft: "20px",
            }}
            onClick={() => handleBooking(data)}
            disabled={soldOut}
          >
            Book Now
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
