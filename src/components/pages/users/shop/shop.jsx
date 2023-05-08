import * as React from "react";
import axios from "axios";
import ShopItemCard from "./shopCard";
import { useNavigate } from "react-router-dom";
import "./shop.css";
import { Typography } from "@mui/material";

export default function ShopComponent(props) {
  const navigate = useNavigate();
  const headers = {
    authorization: "Bearer " + localStorage.getItem("auth-token"),
  };
  const [shopItems, setShopItems] = React.useState([]);

  const fetchShopItems = async () => {
    const res = await axios.get("https://fyp-project-be.onrender.com/api/shop", {
      headers,
    });
    if (res.status === 200) {
      setShopItems(res.data);
    }
  };

  const handleView = (event) => {
    navigate(`/shop/${event._id}`);
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
      items.push({ ...event, quantity: 1, type: 'shop' });
    }
    localStorage.setItem("cartItems", JSON.stringify(items));
    props.onAddToCart(items[index]);
  };

  React.useEffect(() => {
    fetchShopItems();
  }, []);

  return (
    <div className="container mt-5">
       <Typography
          variant="h5"
          component="h4"
          gutterBottom
          className="d-flex w-100"
        >
          Shop Items
        </Typography>
      <div className="cards">
        {
          shopItems.length ? (
            shopItems?.map((shopItem, i) => (
              <ShopItemCard
                shopItem={shopItem}
                key={i}
                addToCart={(e) => addToCart(e)}
                handleOnView={(e) => handleView(e)}
                handleOnBook={(e) => handleBooking(e)}
              />
            ))
          ) : (
            <div className="text-center mt-5">
                <h3 className="mt-5">No items are available at the moment.</h3>
                <h5 className="text-muted">
                  Please check back in after a while.
                </h5>
              </div>
          )
        }
      </div>
    </div>
  );
}
