import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment";
import './tickets.css'

export default function TicketTableComponent({ tickets, onDelete, onEdit }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
      <Table sx={{ minWidth: 450 }} aria-label="ticket table">
        <TableHead>
          <TableRow>
            <TableCell>Match</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Seat</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Sold</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Image URL</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? tickets.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : tickets
          ).map((ticket) => (
            <TableRow key={ticket._id}>
              <TableCell component="th" scope="row">
                {ticket.match}
              </TableCell>
              <TableCell>{moment(ticket.date).format("MM/DD/YYYY")}</TableCell>
              <TableCell>{ticket.time}</TableCell>
              <TableCell>{ticket.seat}</TableCell>
              <TableCell>{ticket.price}</TableCell>
              <TableCell>{ticket.sold}</TableCell>
              <TableCell>{ticket.total}</TableCell>
              <TableCell><img src={ticket.image_url} alt="404" width={50} /></TableCell>
              <TableCell>
                <IconButton aria-label="edit" onClick={() => onEdit(ticket)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => onDelete(ticket)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={tickets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}
