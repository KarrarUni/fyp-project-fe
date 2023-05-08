import * as React from "react";
import axios from "axios";
import TicketCard from "./ticketCard";
import "./tickets.css";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";

export default function TicketsComponent(props) {
  const navigate = useNavigate();
  const headers = {
    authorization: "Bearer " + localStorage.getItem("auth-token"),
  };
  const [tickets, setTickets] = React.useState([]);

  const fetchTickets = async () => {
    const res = await axios.get("http://localhost:4000/api/ticket", {
      headers,
    });
    if (res.status === 200) {
      const data = res.data.length ? res.data : [];
      setTickets(data);
    }
  };

  const handleView = (event) => {
    navigate(`/ticket/${event._id}`);
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
  }, []);

  return (
    <div className="container mt-5">
       <Typography
          variant="h5"
          component="h4"
          gutterBottom
          className="d-flex w-100"
        >
         Tickets
        </Typography>
      <div className="cards">
        {tickets.length ? (
          tickets.map((ticket) => (
            <TicketCard
              ticket={ticket}
              key={ticket._id}
              addToCart={(e) => addToCart(e)}
              handleOnView={(e) => handleView(e)}
              handleOnBook={(e) => handleBooking(e)}
            />
          ))
        ) : (
          <div className="text-center mt-5">
            <h3 className="mt-5">No tickets available</h3>
            <h5 className="text-muted">Check again in a while to view upcoming tickets.</h5>
          </div>
        )}
      </div>
    </div>
  );
}
