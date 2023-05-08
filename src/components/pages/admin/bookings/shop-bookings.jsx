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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
  Tooltip,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

import moment from "moment";
import axios from "axios";
import toastr from "toastr";

export default function AdminShowBookingsComponent() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [orders, setOrders] = React.useState({ items: [] });
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const headers = {
    authorization: "Bearer " + localStorage.getItem("auth-token"),
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetailsClick = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
    setOpenDialog(false);
  };

  const fetchOrderDetails = async () => {
    const res = await axios.get("http://localhost:4000/api/book/all", {
      headers,
    });
    if (res.status === 200) {
      const updatedOrders = res.data.map((data) => {
        const customerName = data.user.first_name;
        const items = data.products.concat(data.tickets);
        return { ...data, customerName, items };
      });
      setOrders({ items: updatedOrders });
      console.log("setOrders: ", orders);
    }
  };

  const cancelOrder = async (order) => {
    const res = await axios.post(
      "http://localhost:4000/api/book/cancel",
      order,
      {
        headers,
      }
    );
    if (res.status === 200) {
      toastr.success("Order Declined");
      fetchOrderDetails();
    } else {
      toastr.error("Something went wrong");
    }
  };

  const completeOrder = async (order) => {
    const res = await axios.post(
      "http://localhost:4000/api/book/dispatch",
      order,
      {
        headers,
      }
    );
    if (res.status === 200) {
      toastr.success("Order dispatched");
      fetchOrderDetails();
    } else {
      toastr.error("Something went wrong");
    }
  };

  const deleteOrder = async (order) => {
    const res = await axios.delete(
      "http://localhost:4000/api/book/" + order._id,
      {
        headers,
      }
    );
    if (res.status === 200) {
      toastr.success("Order deleted");
      fetchOrderDetails();
    } else {
      toastr.error("Something went wrong");
    }
  };

  React.useEffect(() => {
    fetchOrderDetails();
  }, []);

  const displayedOrders =
    rowsPerPage > 0
      ? orders.items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : orders.items;

  return (
    <div>
      <TableContainer component={Paper} sx={{ maxWidth: "100%" }}>
        <Table sx={{ minWidth: 450 }} aria-label="ticket table">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>
                  {moment(order.createdAt).format("MM/DD/YYYY hh:mm a")}
                </TableCell>
                <TableCell>{order.items.length}</TableCell>
                <TableCell>{order.total_amount}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>
                  <Tooltip title="View Order Details" placement="top">
                    <IconButton
                      aria-label="View"
                      onClick={() => handleViewDetailsClick(order)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Dispatch Order" placement="top">
                    <IconButton
                      aria-label="edit"
                      onClick={() => completeOrder(order)}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Cancel Order" placement="top">
                    <IconButton
                      aria-label="delete"
                      onClick={() => cancelOrder(order)}
                    >
                      <CancelIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Order" placement="top">
                    <IconButton
                      aria-label="delete"
                      onClick={() => deleteOrder(order)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            minWidth: 300, // Your custom width value here
            maxWidth: 700,
            width: "100%", // Your custom width value here
          },
        }}
      >
        <DialogTitle>Order Details</DialogTitle>
        {selectedOrder && (
          <>
            <DialogContent>
              <DialogContentText>
                <Typography gutterBottom>
                  <strong>Order ID:</strong> {selectedOrder._id}
                </Typography>
                <Typography gutterBottom>
                  <strong>Customer Name:</strong> {selectedOrder.customerName}
                </Typography>
                <Typography gutterBottom>
                  <strong>Order Date:</strong>{" "}
                  {moment(selectedOrder.createdAt).format("MM/DD/YYYY hh:mm a")}
                </Typography>
                <Typography gutterBottom>
                  <strong>Total Amount:</strong> {selectedOrder.total_amount}
                </Typography>
                <Typography gutterBottom>
                  <strong>Payment Method:</strong> Stripe
                </Typography>
                <Typography gutterBottom>
                  <strong>Shipping Details:</strong>
                  {selectedOrder.shipping_details.address1}{" "}
                  {selectedOrder.shipping_details.address2}{" "}
                  {selectedOrder.shipping_details.city}{" "}
                  {selectedOrder.shipping_details.state}{" "}
                  {selectedOrder.shipping_details.zip}
                  {selectedOrder.shipping_details.country}
                </Typography>
                <Typography gutterBottom>
                  <strong>Order Items:</strong>
                </Typography>
                {selectedOrder.tickets.length ? (
                  <div className="col-12">
                    <Typography variant="h6" className="mt-1" gutterBottom>
                      Tickets
                    </Typography>
                    <div className="row">
                      {selectedOrder.tickets.map((ticket) => (
                        <div className="col-12 mb-3" key={ticket.ticket._id}>
                          <Paper className="p-3">
                            <Typography variant="body1" gutterBottom>
                              Match: {ticket.ticket.match}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              Match Date:{" "}
                              {moment(ticket.ticket.date).format(
                                "MM/DD/YYYY hh:mm a"
                              )}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              Ticket Amount: {ticket.ticket.price}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              Ticket Quantity: {ticket.quantity}
                            </Typography>
                          </Paper>
                          <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                            Total : {ticket.quantity} x {ticket.ticket.price} ={" "}
                            ${ticket.quantity * ticket.ticket.price}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {selectedOrder.products.length ? (
                  <div className="col-12">
                    <Typography variant="h6" className="mt-1" gutterBottom>
                      Orders
                    </Typography>
                    <div className="row">
                      {selectedOrder.products.map((product) => (
                        <div className="col-12 mb-3" key={product.product._id}>
                          <Paper className="p-3">
                            <Typography variant="body1" gutterBottom>
                              Item: {product.product.item}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              Ordered On:{" "}
                              {moment(selectedOrder.createdAt).format(
                                "MM/DD/YYYY hh:mm a"
                              )}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              Price: {product.product.price}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              Quantity: {product.quantity}
                            </Typography>
                          </Paper>
                          <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                            Total : {product.quantity} x {product.product.price}{" "}
                            = ${product.quantity * product.product.price}
                          </Typography>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}
