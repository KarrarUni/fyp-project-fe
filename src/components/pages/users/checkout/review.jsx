import * as React from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toastr from "toastr";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
const stripePromise = loadStripe(
  "pk_test_51My8EeK1wTZ2urZSice9wpbyHGj80BOb1RDLeyaURz8TCoAgbHgVbwv3z34kBkaWI90Gt2DpXk8vn60UXBizuIC3007IWNzkzW"
);

function ReviewDetails({ data, onSubmit }) {
  const stripe = useStripe();
  const elements = useElements();
  const token = localStorage.getItem("auth-token");
  const decoded = jwt_decode(token);
  const [total, setTotal] = React.useState(0);
  const [cartItems, setCartItems] = React.useState([]);
  const [shippingDetails, setShippingDetails] = React.useState({});
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const headers = {
    authorization: "Bearer " + localStorage.getItem("auth-token"),
  };

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });
    if (error) {
      console.log("[error]", error);
      toastr.error(error.message);
    } else {
      const response = await fetch(
        "http://localhost:4000/api/stripe/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total * 100 }),
        }
      );
      const { clientSecret } = await response.json();
      const { error: confirmError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );
      if (confirmError) {
        console.log("[error]", confirmError);
      } else {
        toastr.success("Payment succeeded!");
        localStorage.removeItem("cartItems");
        // navigate("/");
        onSubmit(true);
        setTotal(0);
      }
    }
  };

  const handleCardChange = (event) => {
    setButtonDisabled(!event.complete);
  };

  const handleOrderSubmit = async () => {
    const {first_name, last_name, ...shippingDetail} = shippingDetails;
    const res = await axios.post(
      "http://localhost:4000/api/book",
      { cartItems, userId: decoded.id, shippingDetail },
      {
        headers,
      }
    );
    if (res.status === 200) {
      handleSubmit();
    } else {
      toastr.error("Unable to process order, please try again");
    }
  };

  React.useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems"));
    setCartItems(cartItems);
    const total = cartItems.reduce(
      (accumulator, item) => accumulator + item.price * item.quantity,
      0
    );
    setTotal(total);
    if (data) {
      setShippingDetails(data);
    }
  }, [data]);

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        {cartItems.map((cart) => (
          <ListItem key={cart._id} sx={{ py: 1, px: 0 }}>
            <Box sx={{ height: "45px", width: "45px", mr: 3 }}>
              <img
                src={cart?.image_url}
                alt={cart?.match}
                width="100%"
                height="100%"
              />
            </Box>
            <ListItemText
              primary={cart?.match ?? cart.item}
              className="two-line-ellipsis"
              sx={{
                maxWidth: "290px",
              }}
              secondary={cart?.description}
            />
            <Typography variant="body2" sx={{ mx: 2 }}>
              Quantity ({cart?.quantity})
            </Typography>
            <Typography variant="body2">
              {cart?.price * cart?.quantity} $
            </Typography>
          </ListItem>
        ))}

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            ${total}
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Shipping
          </Typography>
          <Typography gutterBottom>
            {shippingDetails?.first_name} {shippingDetails?.last_name}
          </Typography>
          <Typography gutterBottom>
            {shippingDetails?.address1}, {shippingDetails?.address2}
            {shippingDetails.city}, {shippingDetails?.state}{" "}
            {shippingDetails?.zip} {shippingDetails?.country}
          </Typography>
        </Grid>
        <Grid
          item
          container
          direction="column"
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Payment details (Pay with Stripe)
          </Typography>

          <div className="d-flex flex-column w-100">
            <div className="card-element-container w-100">
              <CardElement onChange={handleCardChange} />
            </div>
            <button className="stripe-connect" onClick={handleOrderSubmit} disabled={buttonDisabled}>
              <span>Payment with</span>
            </button>
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
function Review({ data }) {
  return (
    <div className="App">
      <Elements stripe={stripePromise}>
        <ReviewDetails data={data} />
      </Elements>
    </div>
  );
}

export default Review;
