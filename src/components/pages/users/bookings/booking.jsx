import * as React from "react";
import {
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import moment from "moment";

export default function ViewBookingComponent() {
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const headers = {
    authorization: "Bearer " + localStorage.getItem("auth-token"),
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
    const res = await axios.get("https://fyp-project-be.onrender.com/api/book", { headers });
    if (res.status === 200) {
      res.data.forEach((data) => {
        data["customerName"] = data.user.first_name + " " + data.user.last_name;
        data["items"] = data.products.concat(data.tickets);
      });
      setOrders(res.data);
    }
  };

  React.useEffect(() => {
    fetchOrderDetails();
  }, []);

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-12">
          <Typography variant="h5" className="mt-3" gutterBottom>
            Your Orders & Bookings
          </Typography>
          <div className="row">
            {orders.length ? (
              orders.map((order) => (
                <div className="col-12 col-md-6 col-lg-4 mb-3" key={order._id}>
                  <Paper
                    className="p-3"
                    onClick={() => handleViewDetailsClick(order)}
                  >
                    <Typography variant="body1" gutterBottom>
                      Order ID: {order._id}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Order Date:{" "}
                      {moment(order.createdAt).format("MM/DD/YYYY hh:mm a")}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Total Amount: {order.total_amount}
                    </Typography>
                  </Paper>
                </div>
              ))
            ) : (
              <div className="text-center mt-5">
                <h3 className="mt-5">You haven't placed any orders.</h3>
                <h5 className="text-muted">
                  Explore tickets and exclusive items.
                </h5>
              </div>
            )}
          </div>
        </div>
      </div>

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
                  <strong>Order Items:</strong>
                </Typography>
                {selectedOrder.tickets.length ? (
                  <div className="col-12">
                    <Typography variant="h6" className="mt-1" gutterBottom>
                      Tickets
                    </Typography>
                    <div className="row">
                      {selectedOrder.tickets.map((ticket) => (
                        <div className="col-12 mb-3" key={ticket._id}>
                          <Paper className="p-3">
                            <Typography variant="body1" gutterBottom>
                              Match: {ticket.ticket.match}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              Match Date:{" "}
                              {moment(ticket.ticket.date).format("MM/DD/YYYY hh:mm a")}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              Ticket Amount: {ticket.ticket.price}
                            </Typography>
                          </Paper>
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
                              Ticket Amount: {product.product.price}
                            </Typography>
                          </Paper>
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
