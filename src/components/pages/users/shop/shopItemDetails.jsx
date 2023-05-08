import * as React from "react";
import { Button, Container, Grid, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function ShopItemDetailsComponent() {
  const { id } = useParams();
  const token = localStorage.getItem("auth-token");
  const [soldOut, setSoldOut] = React.useState(false);
  const [data, setFormData] = React.useState({
    item: "",
    description: "",
    quantity: "",
    category: "",
    price: "",
    image_url: "",
  });

  const addToCart = (event) => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    const index = items.findIndex((i) => i._id === event._id);
    if (index > -1) {
      items[index].quantity += 1;
    } else {
      items.push({ ...event, quantity: 1, type: "shop" });
    }
    localStorage.setItem("cartItems", JSON.stringify(items));
  };

  React.useEffect(() => {
    const fetchShopItemDetails = async () => {
      const res = await axios.get(`https://fyp-project-be.onrender.com/api/shop/${id}`, {
        headers: {
          authorization: "Bearer " + token,
        },
      });
      if (res.status === 200) {
        setFormData(res.data);
        if (res.data.quantity - res.data.sold <= 0) {
          setSoldOut(true);
        }
      }
    };
    if (id) fetchShopItemDetails();
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
          <Link to="/shop ">Go Back</Link>
        </Typography>
        {data.item}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <div className="product_card_img_wrapper">
            <div
              className="product_card_img"
              onClick={() => window.open(data.image_url, "_blank")}
              style={{ backgroundImage: `url(${data.image_url})` }}
            ></div>
          </div>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" component="h3">
            {data.item}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            <b>Description:</b> {data.description}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            <b>Category:</b> {data.category.toUpperCase()}
          </Typography>
          {data.quantity - data.sold > 0 && (
            <Typography variant="body1" sx={{ marginTop: 1 }}>
              <b>Remaining:</b> {data.quantity - data.sold}
            </Typography>
          )}
          <Typography
            variant="h6"
            sx={{
              marginTop: 2,
              marginBottom: 2,
              fontWeight: "bold",
            }}
            className="pm-blue"
          >
            Price: {data.price} $
          </Typography>

          <Button
            variant="contained"
            sx={{
              marginTop: "10px",
            }}
            onClick={() => addToCart(data)}
            disabled={soldOut}
          >
            {soldOut ? "Sold Out" : "Add to Cart"}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
