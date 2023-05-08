import TicketTableComponent from "./ticketsTable";
import * as React from "react";
import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toastr from "toastr";

export default function AdminTicketsComponent() {
  const navigate = useNavigate();
  const headers = {
    authorization: "Bearer " + localStorage.getItem("auth-token"),
  };
  const [tickets, setTickets] = React.useState([]);

  const fetchTickets = async () => {
    const res = await axios.get("https://fyp-project-be.onrender.com/api/ticket", {
      headers,
    });
    if (res.status === 200) {
      setTickets(res.data);
    }
  };

  const handleDelete = async (ticket) => {
    const updatedTickets = tickets.filter((t) => t._id !== ticket._id);
    const res = await axios.delete(
      `https://fyp-project-be.onrender.com/api/ticket/${ticket._id}`,
      {
        headers,
      }
    );
    if (res.status === 200) {
      toastr.success("Ticket deleted successfully");
    } else {
      toastr.error("Unable to delete ticket");
    }
    setTickets(updatedTickets);
  };

  const handleEdit = (ticket) => {
    navigate(`/admin/tickets/edit/${ticket._id}`);
  };

  React.useEffect(() => {
    fetchTickets();
  }, []);

  const addNewTicket = () => {
    navigate("/admin/tickets/add");
  };

  return (
    <div className="container mb-4">
      <div className="d-flex flex-column justify-content-center align-items-center ">
        <Typography variant="h5" component="h4" className="d-flex w-100" gutterBottom>
          Tickets
        </Typography>
        <Button
          variant="contained"
          className="align-self-end mb-3"
          onClick={addNewTicket}
        >
          Create New Ticket
        </Button>
        <TicketTableComponent
          tickets={tickets.length ? tickets : []}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
