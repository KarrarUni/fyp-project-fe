import * as React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CloseIcon from "@mui/icons-material/Close";
import "./cart.css";
import { useNavigate } from "react-router-dom";

function CartComponent(props) {
  const [cartItems, setCartItems] = React.useState([]);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    const index = items.findIndex((i) => i._id === item._id);
    if (index > -1) {
      items[index].quantity += 1;
    } else {
      items.push({ ...item, quantity: 1 });
    }
    setCartItems(items);
    localStorage.setItem("cartItems", JSON.stringify(items));
    const total = items.reduce(
      (accumulator, item) => accumulator + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const handleRemoveFromCart = (item) => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    const index = items.findIndex((i) => i._id === item._id);
    if (index > -1) {
      items[index].quantity -= 1;
      if (items[index].quantity === 0) {
        items.splice(index, 1);
      }
    }
    setCartItems(items);
    localStorage.setItem("cartItems", JSON.stringify(items));
    const total = items.reduce(
      (accumulator, item) => accumulator + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  };

  const handleCloseCart = () => {
    props.onCloseCart(false);
  };

  const handleCheckout = () => {
    navigate("/checkout");
    handleCloseCart();
  };

  React.useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (cartItems.length > 0) {
      setCartItems(cartItems);
    }
    const total = cartItems.reduce(
      (accumulator, item) => accumulator + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, []);

  return (
    <Box sx={{ mt: 4 }} className="cart">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          fontWeight: "bold",
        }}
      >
        <Typography variant="h5" component="div">
          Your Cart
        </Typography>
        <IconButton onClick={handleCloseCart}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          fontWeight: "bold",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }} component="div">
          Total Price: ${totalPrice}
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => handleCheckout()}
          disabled={cartItems.length === 0}
        >
          Checkout
        </Button>
      </Box>

      {cartItems.length > 0 ? (
        cartItems.map((item, i) => (
          <Card key={i} sx={{ mb: 2 }}>
            <CardMedia
              component="img"
              height="140"
              image={item.image_url}
              alt={item.match}
            />
            <CardContent>
              <Typography variant="h5" component="div">
                {item.match ?? item.item}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Quantity: {item.quantity ? item.quantity : 1}
              </Typography>
              <IconButton onClick={() => handleRemoveFromCart(item)}>
                <RemoveCircleIcon />
              </IconButton>
              <IconButton onClick={() => handleAddToCart(item)}>
                <AddCircleIcon />
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                Total: ${item.price * item.quantity}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="h6" component="div" sx={{ mb: 2 }}>
          Your cart is empty. Add some items to your cart.
        </Typography>
      )}
    </Box>
  );
}

export default CartComponent;
